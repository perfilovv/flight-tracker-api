import { Injectable, Logger, Module, OnModuleDestroy } from '@nestjs/common';
import { config } from 'src/config/env.config';
import Redis from 'ioredis';

@Injectable()
export class RedisClientProvider implements OnModuleDestroy {
  private readonly logger = new Logger(RedisClientProvider.name);
  public readonly client: Redis;

  constructor() {
    this.client = new Redis(config.redisUrl);
  }

  async onModuleDestroy() {
    this.logger.log('Closing Redis connection');
    await this.client.quit();
  }
}
@Module({
  providers: [
    RedisClientProvider,
    {
      provide: 'REDIS_CLIENT',
      inject: [RedisClientProvider],

      useFactory: (provider: RedisClientProvider) => provider.client,
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
