import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import Redis from 'ioredis';
import {
  RATE_LIMIT_KEY,
  RateLimitOptions,
} from '../decorators/rate-limit.decorator';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const options = this.reflector.get<RateLimitOptions>(
      RATE_LIMIT_KEY,
      context.getHandler(),
    ) ?? { points: 10, duration: 60 };

    const req = context.switchToHttp().getRequest<Request>();
    const routeKey = context.getHandler().name;
    const key = `ratelimit:${routeKey}:${req.ip}`;

    const count = await this.redis.incr(key);

    if (count === 1) {
      await this.redis.expire(key, options.duration);
    }

    if (count > options.points) {
      throw new HttpException('Too many requests', 429);
    }

    return true;
  }
}
