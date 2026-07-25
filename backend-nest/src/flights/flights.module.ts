import { Module } from '@nestjs/common';
import { FlightsController } from './flights.controller';
import { FlightsService } from './flights.service';
import { FlightsRepository } from './flights.repository';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [FlightsController],
  providers: [FlightsService, FlightsRepository],
})
export class FlightsModule {}
