import type { IncomingMessage, ServerResponse } from 'node:http';
import { AppError } from '../../../shared/errors/AppError.ts';
import type { CreateFlightDto, Flight } from '../types/flight.types.ts';
import { flightStatusEnum } from '../data/flights.schema.ts';
import { flightsService } from '../service/flights.service.ts';
import { parseFlightFilters } from '../../../shared/utils/parseQueryParams.ts';

function send(res: ServerResponse, status: number, data: unknown) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
  });
  res.end(JSON.stringify(data));
}

export const flightsController = {
  async getAll({ req, res }: { req: IncomingMessage; res: ServerResponse }) {
    const url = new URL(req.url!, 'http://localhost');

    const filters = parseFlightFilters(url);

    if (filters.status && !flightStatusEnum.enumValues.includes(filters.status)) {
      throw new AppError(400, `Invalid status. Valid values: ${flightStatusEnum.enumValues.join(', ')}`);
    }

    const result = await flightsService.getFlights(filters);
    send(res, 200, result);
  },

  async getById({ req, res }: { req: IncomingMessage; res: ServerResponse }) {
    const id = req.url!.split('/').at(-1)!;

    const flight = await flightsService.getFlightById(id);
    send(res, 200, { data: flight });
  },

  async create({ req, res, body }: { req: IncomingMessage; res: ServerResponse; body: unknown }) {
    const flight = await flightsService.createFlight(body as CreateFlightDto);
    send(res, 201, { data: flight });
  },

  async updateStatus({
    req,
    res,
    params,
    body,
  }: {
    req: IncomingMessage;
    res: ServerResponse;
    params: Record<string, string>;
    body: unknown;
  }) {
    const parts = req.url!.split('/');

    const id = parts.at(-2)!;

    const { status } = body as { status?: Flight['status'] };

    if (!status || !flightStatusEnum.enumValues.includes(status)) {
      throw new AppError(400, `Invalid status. Valid values: ${flightStatusEnum.enumValues.join(', ')}`);
    }

    const flight = await flightsService.updateStatus(id, status);
    send(res, 200, { data: flight });
  },

  async remove({ req, res }: { req: IncomingMessage; res: ServerResponse }) {
    const id = req.url!.split('/').at(-1)!;

    await flightsService.deleteFlight(id);
    res.writeHead(204);
    res.end();
  },

  async getStats({ req, res }: { req: IncomingMessage; res: ServerResponse }) {
    const stats = await flightsService.getStats();
    send(res, 200, { data: stats });
  },
};

