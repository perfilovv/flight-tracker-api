import type { CreateFlightDto, Flight, FlightFilters } from '../types/flight.types.ts';
import { flightsRepository } from '../repository/flights.repository.ts';
import { AppError } from '../../../shared/errors/AppError.ts';

export const flightsService = {
  async getFlights(filters: FlightFilters) {
    const [data, total] = await Promise.all([flightsRepository.findAll(filters), flightsRepository.count(filters)]);

    return { data, total, limit: filters.limit ?? 20, offset: filters.offset ?? 0 };
  },

  async getFlightById(id: string) {
    const flight = await flightsRepository.findById(id);

    if (!flight) {
      throw new AppError(404, `Flight ${id} not found`);
    }

    return flight;
  },

  async createFlight(dto: CreateFlightDto) {
    const dep = new Date(dto.departureTime);
    const arr = new Date(dto.arrivalTime);
    if (dep >= arr) {
      throw new AppError(400, 'departureTime must be before arrivalTime');
    }
    return flightsRepository.create(dto);
  },

  async updateStatus(id: string, status: Flight['status']) {
    const flight = await flightsRepository.updateStatus(id, status);

    if (!flight) {
      throw new AppError(404, `Flight ${id} not found`);
    }

    return flight;
  },

  async deleteFlight(id: string) {
    const flight = await flightsRepository.delete(id);

    if (!flight) {
      throw new AppError(404, `Flight ${id} not found`);
    }

    return flight;
  },
};

