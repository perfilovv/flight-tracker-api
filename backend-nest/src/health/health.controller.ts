import { Controller, Get } from '@nestjs/common';
import { PostgresHealthService } from './postgres-health.service';
import { RedisHealthService } from './redis-health.service';
import {
  HealthCheck,
  HealthCheckService,
  HealthIndicatorService,
} from '@nestjs/terminus';
import { getErrorMessage } from 'src/shared/utils/get-error-message';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly healthIndicatorService: HealthIndicatorService,
    private readonly postgresHealth: PostgresHealthService,
    private readonly redisHealth: RedisHealthService,
  ) {}

  @Get('live')
  live() {
    return { status: 'ok', uptime: process.uptime() };
  }

  @Get('ready')
  @HealthCheck()
  ready() {
    return this.health.check([
      async () => {
        const indicator = this.healthIndicatorService.check('postgres');
        try {
          await this.postgresHealth.check();
          return indicator.up();
        } catch (error) {
          return indicator.down({ message: getErrorMessage(error) });
        }
      },
      async () => {
        const indicator = this.healthIndicatorService.check('redis');
        try {
          await this.redisHealth.check();
          return indicator.up();
        } catch (error) {
          return indicator.down({ message: getErrorMessage(error) });
        }
      },
    ]);
  }
}
