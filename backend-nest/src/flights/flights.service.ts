import { Inject, Injectable } from '@nestjs/common';
import { FlightsRepository } from './flights.repository';
import { Flight, FlightFilters } from './entities/flight.entity';
import { CreateFlightDto } from './dto/create-flight.dto';
import { AppError } from 'src/shared/errors/AppError';
import Redis from 'ioredis';
import { FlightsGateway } from './flights.gateway';
import { UpdateFlightDto } from './dto/update-flight.dto';

@Injectable()
export class FlightsService {
  constructor(
    private readonly flightsRepository: FlightsRepository,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    private readonly gateway: FlightsGateway,
  ) {}

  private async getCacheVersion(): Promise<number> {
    const version = await this.redis.get('flights:cache_version');

    return version ? parseInt(version, 10) : 1;
  }

  private async bumpCacheVersion() {
    await this.redis.incr('flights:cache_version');
  }

  async getFlights(filters: FlightFilters) {
    const version = await this.getCacheVersion();
    const cacheKey = `flights:v${version}${JSON.stringify(filters)}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const [data, total] = await Promise.all([
      this.flightsRepository.findAll(filters),
      this.flightsRepository.count(filters),
    ]);
    const result = {
      data,
      total,
      limit: filters.limit ?? 20,
      offset: filters.offset ?? 0,
    };

    await this.redis.set(cacheKey, JSON.stringify(result), 'EX', 30);
    return result;
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
    const flight = await this.flightsRepository.create(dto);
    await this.bumpCacheVersion();
    return flight;
  }

  async updateStatus(id: string, status: Flight['status']) {
    const flight = await this.flightsRepository.updateStatus(id, status);

    if (!flight) {
      throw new AppError(404, `Flight ${id} not found`);
    }

    await this.bumpCacheVersion();
    return flight;
  }

  async deleteFlight(id: string) {
    const flight = await this.flightsRepository.delete(id);

    if (!flight) {
      throw new AppError(404, `Flight ${id} not found`);
    }

    await this.bumpCacheVersion();
    return flight;
  }

  async getStats() {
    const stats = await this.flightsRepository.getStats();

    if (!stats) {
      throw new AppError(404, 'No flights found');
    }

    return stats;
  }

  async update(id: string, dto: UpdateFlightDto) {
    const flight = await this.flightsRepository.update(id, dto);
    await this.redis.del('flights:all');

    this.gateway.server.to(`flight:${id}`).emit('flight:updated', flight);
    return flight;
  }
}
