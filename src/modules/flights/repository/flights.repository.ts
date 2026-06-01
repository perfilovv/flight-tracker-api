import { and, count, desc, eq, ilike, type SQL } from 'drizzle-orm';
import type { CreateFlightDto, Flight, FlightFilters } from '../types/flight.types.ts';
import { flightsTable } from '../data/flights.schema.ts';
import { db } from '../../../app/config/database.ts';

function buildConditions(filters: FlightFilters): SQL[] {
  const conditions: SQL[] = [];

  if (filters.status) {
    conditions.push(eq(flightsTable.status, filters.status));
  }

  if (filters.origin) {
    conditions.push(eq(flightsTable.origin, filters.origin));
  }

  if (filters.destination) {
    conditions.push(eq(flightsTable.destination, filters.destination));
  }

  if (filters.search) {
    conditions.push(ilike(flightsTable.flightNumber, `%${filters.search}%`));
  }
  return conditions;
}

export const flightsRepository = {
  async findAll(filters: FlightFilters = {}) {
    const conditions = buildConditions(filters);
    const whereClause = conditions.length ? and(...conditions) : undefined;

    return db
      .select()
      .from(flightsTable)
      .where(whereClause)
      .orderBy(desc(flightsTable.departureTime))
      .limit(filters.limit ?? 20)
      .offset(filters.offset ?? 0);
  },

  async count(filters: FlightFilters = {}) {
    const conditions = buildConditions(filters);
    const whereClause = conditions.length ? and(...conditions) : undefined;

    const [result] = await db.select({ value: count() }).from(flightsTable).where(whereClause);

    return Number(result.value);
  },

  async findById(id: string) {
    const [flight] = await db.select().from(flightsTable).where(eq(flightsTable.id, id));

    return flight ?? null;
  },

  async create(dto: CreateFlightDto) {
    const [flight] = await db
      .insert(flightsTable)
      .values({
        flightNumber: dto.flightNumber,
        origin: dto.origin,
        destination: dto.destination,
        departureTime: new Date(dto.departureTime),
        arrivalTime: new Date(dto.arrivalTime),
      })
      .returning();

    return flight;
  },

  async updateStatus(id: string, status: Flight['status']) {
    const [flight] = await db.update(flightsTable).set({ status }).where(eq(flightsTable.id, id)).returning();

    return flight ?? null;
  },

  async delete(id: string) {
    const [deleted] = await db.delete(flightsTable).where(eq(flightsTable.id, id)).returning({ id: flightsTable.id });

    return !!deleted;
  },
};

