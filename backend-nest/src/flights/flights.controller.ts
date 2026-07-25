import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { type CreateFlightDto } from './dto/create-flight.dto';
import { FlightsService } from './flights.service';

@Controller('flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateFlightDto) {
    return this.flightsService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getAll() {
    return this.flightsService.getFlights({});
  }
}
