import { index, pgEnum, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const flightStatusEnum = pgEnum('flight_status', ['scheduled', 'departed', 'arrived', 'cancelled']);

export const flightsTable = pgTable(
  'flights',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    flightNumber: varchar('flight_number', { length: 10 }).notNull(),

    origin: varchar('origin', { length: 3 }).notNull(),

    destination: varchar('destination', { length: 3 }).notNull(),

    departureTime: timestamp('departure_time', { withTimezone: true }).notNull(),

    arrivalTime: timestamp('arrival_time', {
      withTimezone: true,
    }).notNull(),

    status: flightStatusEnum('status').default('scheduled').notNull(),

    aircraftType: varchar('aircraft_type', {
      length: 10,
    }),

    updatedAt: timestamp('updated_at', { withTimezone: true }),

    createdAt: timestamp('created at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('flights_status_idx').on(table.status), index('flights_origin_idx').on(table.origin)],
);

