import {
  index,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const flightStatusEnum = pgEnum('flight_status', [
  'scheduled',
  'departed',
  'arrived',
  'cancelled',
]);

export const flightsTable = pgTable(
  'flights',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    flightNumber: varchar('flight_number', { length: 10 }).notNull(),

    origin: varchar('origin', { length: 3 }).notNull(),

    destination: varchar('destination', { length: 3 }).notNull(),

    departureTime: timestamp('departure_time', {
      withTimezone: true,
    }).notNull(),

    arrivalTime: timestamp('arrival_time', {
      withTimezone: true,
    }).notNull(),

    status: flightStatusEnum('status').default('scheduled').notNull(),

    aircraftType: varchar('aircraft_type', {
      length: 10,
    }),

    updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),

    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('flights_departure_time_idx').on(table.departureTime),

    index('flights_origin_idx').on(table.origin),
    index('flights_destination_idx').on(table.destination),

    index('flights_origin_departure_idx').on(table.origin, table.departureTime),

    index('flights_status_departure_idx').on(table.status, table.departureTime),
  ],
);
