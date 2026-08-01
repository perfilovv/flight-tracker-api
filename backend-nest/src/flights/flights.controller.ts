import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateFlightDto } from './dto/create-flight.dto';
import { FlightsService } from './flights.service';
import { RateLimitGuard } from 'src/auth/rate-limit.guard';
import { UpdateFlightDto } from './dto/update-flight.dto';

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
  findAll() {
    return this.flightsService.findAll({});
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFlightDto) {
    return this.flightsService.update(id, dto);
  }
}
