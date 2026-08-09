import { Inject, Injectable } from '@nestjs/common';
import { FlightsRepository } from './flights.repository';
import { FindAllResult, Flight, FlightFilters } from './entities/flight.entity';
import { CreateFlightDto } from './dto/create-flight.dto';
import { AppError } from 'src/shared/errors/app-error';
import Redis from 'ioredis';
import { FlightsGateway } from './flights.gateway';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { PinoLogger } from 'nestjs-pino/PinoLogger';

@Injectable()
export class FlightsService {
  constructor(
    private readonly flightsRepository: FlightsRepository,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    private readonly gateway: FlightsGateway,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(FlightsService.name);
  }

  private async getCacheVersion(): Promise<number> {
    const version = await this.redis.get('flights:cache_version');

    return version ? parseInt(version, 10) : 1;
  }

  private async bumpCacheVersion() {
    await this.redis.incr('flights:cache_version');
  }

  async findAll(filters: FlightFilters): Promise<FindAllResult> {
    const version = await this.getCacheVersion();
    const cacheKey = `flights:v${version}${JSON.stringify(filters)}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached) as FindAllResult;
    }

    this.logger.info({ filters }, 'fetching flights from db');
    const [data, total] = await Promise.all([
      this.flightsRepository.findAll(filters),
      this.flightsRepository.count(filters),
    ]);
    this.logger.info({ total }, 'flights fetched from db');
    const result = {
      data,
      total,
      limit: filters.limit ?? 20,
      offset: filters.offset ?? 0,
    };

    await this.redis.set(cacheKey, JSON.stringify(result), 'EX', 30);
    return result;
  }

  async getById(id: string) {
    this.logger.info({ flightId: id }, 'fetching flight from db');
    const flight = await this.flightsRepository.getById(id);
    this.logger.info({ flightId: id }, 'flight fetched from db');

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
    this.logger.info({ dto }, 'creating flight');
    const flight = await this.flightsRepository.create(dto);
    this.logger.info({ flightId: flight.id }, 'flight created');
    await this.bumpCacheVersion();
    return flight;
  }

  async updateStatus(id: string, status: Flight['status']) {
    this.logger.info({ flightId: id, status }, 'updating flight status');
    const flight = await this.flightsRepository.updateStatus(id, status);
    this.logger.info({ flightId: id }, 'flight status updated');

    if (!flight) {
      throw new AppError(404, `Flight ${id} not found`);
    }

    await this.bumpCacheVersion();
    return flight;
  }

  async delete(id: string) {
    this.logger.info({ flightId: id }, 'deleting flight');
    const flight = await this.flightsRepository.delete(id);
    this.logger.info({ flightId: id }, 'flight deleted');

    if (!flight) {
      throw new AppError(404, `Flight ${id} not found`);
    }

    await this.bumpCacheVersion();
    return flight;
  }

  async getStats() {
    this.logger.info('fetching stats from db');
    const stats = await this.flightsRepository.getStats();
    this.logger.info('stats fetched from db');
    if (!stats) {
      throw new AppError(404, 'No flights found');
    }

    return stats;
  }

  async update(id: string, dto: UpdateFlightDto) {
    this.logger.info({ flightId: id, dto }, 'updating flight');
    const flight = await this.flightsRepository.update(id, dto);
    this.logger.info({ flightId: id }, 'flight updated');
    await this.bumpCacheVersion();

    this.gateway.server.to(`flight:${id}`).emit('flight:updated', flight);
    return flight;
  }
}
