import type { FastifyInstance, FastifySchema } from 'fastify';

import {
  flightsController,
  type GetByIdParams,
  type UpdateStatusBody,
  type UpdateStatusParams,
} from '../controller/flights.controller.ts';
import { verifyToken } from '../../../app/server.ts';
import type { CreateFlightDto } from '../types/flight.types.ts';

const FlightSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    flightNumber: { type: 'string' },
    origin: { type: 'string' },
    destination: { type: 'string' },
    departureTime: { type: 'string' },
    arrivalTime: { type: 'string' },
    status: { type: 'string', enum: ['scheduled', 'departed', 'arrived', 'cancelled'] },
    createdAt: { type: 'string' },
  },
} as const;

const listSchema: FastifySchema = {
  querystring: {
    type: 'object',
    properties: {
      status: { type: 'string', enum: ['scheduled', 'departed', 'arrived', 'cancelled'] },
      origin: { type: 'string', minLength: 3, maxLength: 3 },
      destination: { type: 'string', minLength: 3, maxLength: 3 },
      search: { type: 'string', maxLength: 20 },
      dateFrom: { type: 'string', format: 'date-time' },
      dateTo: { type: 'string', format: 'date-time' },
      limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
      offset: { type: 'integer', minimum: 0, default: 0 },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: FlightSchema,
        },
        total: { type: 'integer' },
        limit: { type: 'integer' },
        offset: { type: 'integer' },
      },
    },
  },
};

const createSchema: FastifySchema = {
  body: {
    type: 'object',
    required: ['flightNumber', 'origin', 'destination', 'departureTime', 'arrivalTime'],
    properties: {
      flightNumber: { type: 'string', minLength: 2, maxLength: 10 },
      origin: { type: 'string', minLength: 3, maxLength: 3 },
      destination: { type: 'string', minLength: 3, maxLength: 3 },
      departureTime: { type: 'string', format: 'date-time' },
      arrivalTime: { type: 'string', format: 'date-time' },
    },
  },
  response: {
    201: {
      type: 'object',
      properties: {
        data: FlightSchema,
      },
    },
  },
};

const updateStatusSchema: FastifySchema = {
  params: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
    },
  },
  body: {
    type: 'object',
    required: ['status'],
    properties: {
      status: { type: 'string', enum: ['scheduled', 'departed', 'arrived', 'cancelled'] },
    },
  },
};

export async function flightsPlugin(app: FastifyInstance) {
  app.get('/flights', { schema: listSchema }, flightsController.getAll);

  app.get('/flights/stats', flightsController.getStats);

  app.get('/flights/:id', flightsController.getById);

  app.post<{
    Body: CreateFlightDto;
  }>('/flights', { schema: createSchema, preHandler: [verifyToken] }, flightsController.create);

  app.patch<{
    Params: UpdateStatusParams;
    Body: UpdateStatusBody;
  }>('/flights/:id/status', { schema: updateStatusSchema, preHandler: [verifyToken] }, flightsController.updateStatus);

  app.delete<{ Params: GetByIdParams }>('/flights/:id', { preHandler: [verifyToken] }, flightsController.remove);
}

