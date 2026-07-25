import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../../modules/flights/data/flights.schema.ts';
import 'dotenv/config';
import { config } from './index.ts';

if (!config.databaseUrl) {
  throw new Error('DATABASE_URL environment variable is required');
}

export const client = postgres(config.databaseUrl, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema, logger: config.nodeEnv === 'development' });

export type Database = typeof db;

process.on('SIGTERM', async () => {
  console.log('Closing DB connections...');
  await db.$client.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await db.$client.end();
  process.exit(0);
});

