import { Module } from '@nestjs/common';
import { FlightsController } from './flights.controller';
import { FlightsService } from './flights.service';
import { FlightsRepository } from './flights.repository';
import { DatabaseModule } from 'src/database/database.module';
import { RedisModule } from 'src/redis/redis.module';
import { FlightsGateway } from './flights.gateway';

@Module({
  imports: [DatabaseModule, RedisModule],
  controllers: [FlightsController],
  providers: [FlightsService, FlightsRepository, FlightsGateway],
})
export class FlightsModule {}
