import { pgTable, varchar, text } from 'drizzle-orm/pg-core';

export const airports = pgTable('airports', {
  code: varchar({ length: 3 }).primaryKey().notNull(),
  name: text().notNull(),
  city: text().notNull(),
  country: varchar({ length: 2 }).notNull(),
});
