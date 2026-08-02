import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FlightsModule } from './flights/flights.module';
import { HealthController } from './health/health.controller';
import { HealthService } from './health/health.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LoggerModule } from 'nestjs-pino';
import { config } from './config/env.config';
import { CorrelationIdMiddleware } from './shared/middleware/correlation-id.middleware';
import { randomUUID } from 'crypto';

@Module({
  imports: [
    FlightsModule,
    DatabaseModule,
    AuthModule,
    UsersModule,
    LoggerModule.forRoot({
      pinoHttp: {
        genReqId: (req) => req.headers['x-correlation-id'] || randomUUID(),
        level: config.nodeEnv === 'production' ? 'info' : 'debug',
        transport:
          config.nodeEnv === 'production'
            ? undefined
            : { target: 'pino-pretty' },
        redact: ['req.headers.authorization'],
      },
    }),
  ],
  controllers: [AppController, HealthController],
  providers: [AppService, HealthService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
