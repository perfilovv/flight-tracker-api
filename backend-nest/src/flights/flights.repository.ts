import {
  and,
  between,
  count,
  desc,
  eq,
  gte,
  ilike,
  lte,
  SQL,
} from 'drizzle-orm';
import { Flight, FlightFilters } from './entities/flight.entity';
import { flightsTable } from 'src/database/schema';
import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';

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

  if (filters.dateFrom && filters.dateTo) {
    conditions.push(
      between(
        flightsTable.departureTime,
        new Date(filters.dateFrom),
        new Date(filters.dateTo),
      ),
    );
  } else if (filters.dateFrom) {
    conditions.push(
      gte(flightsTable.departureTime, new Date(filters.dateFrom)),
    );
  } else if (filters.dateTo) {
    conditions.push(lte(flightsTable.departureTime, new Date(filters.dateTo)));
  }

  return conditions;
}

@Injectable()
export class FlightsRepository {
  constructor(@Inject('DRIZZLE') private readonly db: NodePgDatabase) {}

  async findAll(filters: FlightFilters = {}) {
    const conditions = buildConditions(filters);
    const whereClause = conditions.length ? and(...conditions) : undefined;

    return this.db
      .select()
      .from(flightsTable)
      .where(whereClause)
      .orderBy(desc(flightsTable.departureTime))
      .limit(filters.limit ?? 20)
      .offset(filters.offset ?? 0);
  }

  async count(filters: FlightFilters = {}) {
    const conditions = buildConditions(filters);
    const whereClause = conditions.length ? and(...conditions) : undefined;

    const [result] = await this.db
      .select({ value: count() })
      .from(flightsTable)
      .where(whereClause);

    return Number(result.value);
  }

  async findById(id: string) {
    const [flight] = await this.db
      .select()
      .from(flightsTable)
      .where(eq(flightsTable.id, id));

    return flight ?? null;
  }

  async create(dto: CreateFlightDto) {
    const [flight] = await this.db
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
  }

  async updateStatus(id: string, status: Flight['status']) {
    const [flight] = await this.db
      .update(flightsTable)
      .set({ status })
      .where(eq(flightsTable.id, id))
      .returning();

    return flight ?? null;
  }

  async delete(id: string) {
    const [deleted] = await this.db
      .delete(flightsTable)
      .where(eq(flightsTable.id, id))
      .returning({ id: flightsTable.id });

    return !!deleted;
  }

  async getStats() {
    return this.db
      .select({ status: flightsTable.status, count: count() })
      .from(flightsTable)
      .groupBy(flightsTable.status);
  }

  async update(id: string, dto: UpdateFlightDto) {
    const [flight] = await this.db
      .update(flightsTable)
      .set({
        flightNumber: dto.flightNumber,
        origin: dto.origin,
        destination: dto.destination,
      })
      .where(eq(flightsTable.id, id))
      .returning();

    return flight ?? null;
  }
}
