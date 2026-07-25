import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);
  constructor(private readonly pool: Pool) {}

  async checkReady() {
    try {
      await this.pool.query('SELECT 1');

      return {
        status: 'ready',
        postgres: 'connected',
      };
    } catch (error) {
      this.logger.error('Database health check failed', error);

      throw new ServiceUnavailableException({
        status: 'not_ready',
        postgres: 'disconnected',
      });
    }
  }
}
