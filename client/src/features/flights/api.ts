import { apiClient } from '@/shared/api/client';

export interface Flight {
  id: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  status: string;
}

export const getFlights = () => apiClient<Flight[]>('/flights');

export const createFlight = (flight: Omit<Flight, 'id' | 'status'>) =>
  apiClient<Flight>('/flights', {
    method: 'POST',
    body: JSON.stringify(flight),
  });
