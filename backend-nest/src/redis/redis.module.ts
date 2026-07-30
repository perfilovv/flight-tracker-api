import { Module } from '@nestjs/common';
import { config } from 'src/config/env.config';
import Redis from 'ioredis';

@Module({
  providers: [
    { provide: 'REDIS_CLIENT', useFactory: () => new Redis(config.redisUrl) },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
