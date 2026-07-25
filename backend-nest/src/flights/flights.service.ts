import { Injectable } from '@nestjs/common';
import { FlightsRepository } from './flights.repository';
import { Flight, FlightFilters } from './entities/flight.entity';
import { CreateFlightDto } from './dto/create-flight.dto';
import { AppError } from 'src/shared/errors/AppError';

@Injectable()
export class FlightsService {
  constructor(private readonly flightsRepository: FlightsRepository) {}

  async getFlights(filters: FlightFilters) {
    const [data, total] = await Promise.all([
      this.flightsRepository.findAll(filters),
      this.flightsRepository.count(filters),
    ]);

    return {
      data,
      total,
      limit: filters.limit ?? 20,
      offset: filters.offset ?? 0,
    };
  }

  async getFlightById(id: string) {
    const flight = await this.flightsRepository.findById(id);

    if (!flight) {
      throw new AppError(404, `Flight ${id} not found`);
    }

    return flight;
  }

  async create(dto: CreateFlightDto) {
    const dep = new Date(dto.departureTime);
    const arr = new Date(dto.arrivalTime);
    if (dep >= arr) {
      throw new AppError(400, 'departureTime must be before arrivalTime');
    }
    return this.flightsRepository.create(dto);
  }

  async updateStatus(id: string, status: Flight['status']) {
    const flight = await this.flightsRepository.updateStatus(id, status);

    if (!flight) {
      throw new AppError(404, `Flight ${id} not found`);
    }

    return flight;
  }

  async deleteFlight(id: string) {
    const flight = await this.flightsRepository.delete(id);

    if (!flight) {
      throw new AppError(404, `Flight ${id} not found`);
    }

    return flight;
  }

  async getStats() {
    const stats = await this.flightsRepository.getStats();

    if (!stats) {
      throw new AppError(404, 'No flights found');
    }

    return stats;
  }
}
