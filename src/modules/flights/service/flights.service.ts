import crypto from 'node:crypto';

import * as repository from '../repository/flights.repository.ts';

export function getFlights() {
  return repository.findAllFlights();
}

export function getFlight(id: string) {
  return repository.findFlightById(id);
}

export function createFlight(data: { origin: string; destination: string }) {
  return repository.createFlight({
    id: crypto.randomUUID(),
    origin: data.origin,
    destination: data.destination,
    flightNumber: `FL-${Math.floor(Math.random() * 10000)}`,
    departureTime: new Date().toDateString(),
    arrivalTime: new Date().toDateString(),
    status: 'scheduled',
    createdAt: new Date().toDateString(),
  });
}

