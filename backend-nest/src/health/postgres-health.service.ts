import { Injectable, Logger } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class PostgresHealthService {
  private readonly logger = new Logger(PostgresHealthService.name);
  constructor(private readonly pool: Pool) {}

  async check() {
    try {
      await this.pool.query('SELECT 1');
    } catch (error) {
      this.logger.error('Postgres health check failed', error);
      throw error;
    }
  }
}
