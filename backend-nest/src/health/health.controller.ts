import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  health() {
    return {
      status: 'ok',
      uptime: process.uptime(),
    };
  }

  @Get('ready')
  async ready() {
    return this.healthService.checkReady();
  }
}
