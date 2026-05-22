import { flights } from '../data/flights.memory.ts';
import type { Flight } from '../types/flight.types.ts';

export function findAllFlights() {
  return flights;
}

export function findFlightById(id: string) {
  return flights.find((flight) => flight.id === id);
}

export function createFlight(flight: Flight) {
  flights.push(flight);

  return flight;
}
