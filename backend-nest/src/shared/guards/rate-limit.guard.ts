import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Inject,
  Injectable,
} from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const key = `ratelimit:${req.ip}`;

    const count = await this.redis.incr(key);

    if (count === 1) {
      await this.redis.expire(key, 60);
    }

    if (count > 10) {
      throw new HttpException('Too many requests', 429);
    }

    return true;
  }
}
