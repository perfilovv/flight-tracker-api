import * as service from '../service/flights.service.ts';

import { parseBody } from '../../../shared/utils/parseBody.ts';

import { createFlightSchema } from '../validation/createFlight.schema.ts';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { AppError } from '../../../shared/errors/AppError.ts';

export async function getFlightsController(_req: IncomingMessage, res: ServerResponse) {
  const flights = service.getFlights();

  res.writeHead(200);

  res.end(JSON.stringify(flights));
}

export async function getFlightController(_req: IncomingMessage, res: ServerResponse, params?: Record<string, string>) {
  const id = params?.id;

  const flight = service.getFlight(id!);

  if (!flight) {
    throw new AppError(404, 'Flight not found');
  }

  res.writeHead(200);

  res.end(JSON.stringify(flight));
}

export async function createFlightController(req: IncomingMessage, res: ServerResponse) {
  const body = await parseBody(req);

  const data = createFlightSchema.parse(body);

  const flight = service.createFlight(data);

  res.writeHead(201);

  res.end(JSON.stringify(flight));
}

