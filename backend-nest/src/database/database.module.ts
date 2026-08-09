import { Injectable, Logger, Module, OnModuleDestroy } from '@nestjs/common';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import 'dotenv/config';
import * as schema from './schema';
import { config } from '../config/env.config';

@Injectable()
export class PgPoolProvider implements OnModuleDestroy {
  private readonly logger = new Logger(PgPoolProvider.name);
  public readonly pool: Pool;

  constructor() {
    this.pool = new Pool({ connectionString: config.databaseUrl });
  }

  async onModuleDestroy() {
    this.logger.log('Closing Postgres pool');
    await this.pool.end();
  }
}

@Module({
  providers: [
    PgPoolProvider,
    {
      provide: Pool,
      inject: [PgPoolProvider],
      useFactory: (provider: PgPoolProvider) => provider.pool,
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
