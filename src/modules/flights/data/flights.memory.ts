import { randomUUID } from 'crypto';
import type { Flight } from '../types/flight.types.ts';

export const flights: Flight[] = [
  {
    id: randomUUID(),
    flightNumber: 'SU1234',
    origin: 'SVO',
    destination: 'JFK',
    departureTime: '2025-06-01T10:00:00Z',
    arrivalTime: '2025-06-01T18:30:00Z',
    status: 'scheduled',
    createdAt: new Date().toISOString(),
  },
  {
    id: randomUUID(),
    flightNumber: 'TK456',
    origin: 'IST',
    destination: 'LED',
    departureTime: '2025-06-02T08:00:00Z',
    arrivalTime: '2025-06-02T11:00:00Z',
    status: 'departed',
    createdAt: new Date().toISOString(),
  },
];
