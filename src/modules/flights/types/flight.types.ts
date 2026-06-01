import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { flightsTable } from '../data/flights.schema.ts';

export type Flight = InferSelectModel<typeof flightsTable>;

export type NewFlight = InferInsertModel<typeof flightsTable>;

export interface CreateFlightDto {
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
}

export interface FlightFilters {
  status?: Flight['status'];
  origin?: string;
  destination?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

