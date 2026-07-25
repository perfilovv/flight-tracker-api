import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { flightsTable } from 'src/database/schema';

export type Flight = InferSelectModel<typeof flightsTable>;

export type NewFlight = InferInsertModel<typeof flightsTable>;

export interface FlightFilters {
  status?: Flight['status'];
  origin?: string;
  destination?: string;
  search?: string;
  limit?: number;
  offset?: number;
  dateFrom?: string;
  dateTo?: string;
}
