import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateFlightDto } from './dto/create-flight.dto';
import { FlightsService } from './flights.service';
import { RateLimitGuard } from 'src/auth/rate-limit.guard';

@Controller('flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}
  @UseGuards(JwtAuthGuard, RateLimitGuard)
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
