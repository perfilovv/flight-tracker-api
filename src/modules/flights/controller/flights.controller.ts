import type { ServerResponse } from 'node:http';
import type { CreateFlightDto, Flight, FlightFilters } from '../types/flight.types.ts';
import { flightsService } from '../service/flights.service.ts';
import type { FastifyReply, FastifyRequest } from 'fastify';

type GetAllQuery = FlightFilters;
export type GetByIdParams = {
  id: string;
};
export type UpdateStatusParams = {
  id: string;
};
export type UpdateStatusBody = {
  status: Flight['status'];
};

function send(res: ServerResponse, status: number, data: unknown) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
  });
  res.end(JSON.stringify(data));
}

export const flightsController = {
  getAll: async (request: FastifyRequest<{ Querystring: GetAllQuery }>, reply: FastifyReply) => {
    request.log.info({ filters: request.query }, 'fetching flights');
    const result = await flightsService.getFlights(request.query);
    request.log.info({ total: result.total }, 'flights fetched');
    return result;
  },

  getById: async (request: FastifyRequest<{ Params: GetByIdParams }>, reply: FastifyReply) => {
    const flight = await flightsService.getFlightById(request.params.id);
    return { data: flight };
  },

  create: async (request: FastifyRequest<{ Body: CreateFlightDto }>, reply: FastifyReply) => {
    const flight = await flightsService.createFlight(request.body);
    reply.code(201);
    return { data: flight };
  },

  updateStatus: async (
    request: FastifyRequest<{ Params: UpdateStatusParams; Body: UpdateStatusBody }>,
    reply: FastifyReply,
  ) => {
    const flight = await flightsService.updateStatus(request.params.id, request.body.status);
    return { data: flight };
  },

  remove: async (request: FastifyRequest<{ Params: GetByIdParams }>, reply: FastifyReply) => {
    await flightsService.deleteFlight(request.params.id);
    reply.code(204);
  },

  getStats: async () => {
    const stats = await flightsService.getStats();
    return { data: stats };
  },
};

