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
import { RateLimitGuard } from 'src/shared/guards/rate-limit.guard';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { Flight } from './entities/flight.entity';

@Controller('flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @Get()
  findAll() {
    return this.flightsService.findAll({});
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.flightsService.getById(id);
  }

  @Get('stats')
  getStats() {
    return this.flightsService.getStats();
  }

  @UseGuards(JwtAuthGuard, RateLimitGuard)
  @Post()
  create(@Body() dto: CreateFlightDto) {
    return this.flightsService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFlightDto) {
    return this.flightsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status/:status')
  updateStatus(
    @Param('id') id: string,
    @Param('status') status: Flight['status'],
  ) {
    return this.flightsService.updateStatus(id, status);
  }
}
