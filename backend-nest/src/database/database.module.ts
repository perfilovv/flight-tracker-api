import { Module } from '@nestjs/common';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import 'dotenv/config';
import * as schema from './schema';
import { config } from '../config/env.config';

@Module({
  providers: [
    {
      provide: Pool,
      useFactory: () =>
        new Pool({
          connectionString: config.databaseUrl,
        }),
    },
    {
      provide: 'DRIZZLE',
      inject: [Pool],
      useFactory: (pool: Pool) => drizzle(pool, { schema }),
    },
  ],
  exports: [Pool, 'DRIZZLE'],
})
export class DatabaseModule {}
