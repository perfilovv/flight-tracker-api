import { Inject, Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisHealthService {
  private readonly logger = new Logger(RedisHealthService.name);
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async check() {
    try {
      await Promise.race([
        this.redis.ping(),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error('Redis health check timed out')),
            2000,
          ),
        ),
      ]);
    } catch (error) {
      this.logger.error('Redis health check failed', error);
      throw error;
    }
  }
}
