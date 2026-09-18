import { apiClient } from '@/shared/api/client';

export interface Flight {
  id: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  status: string;
  aircraftType: string | null;
  updatedAt: string | null;
  createdAt: string;
}

interface FlightsResponse {
  data: Flight[];
  total: number;
  limit: number;
  offset: number;
}

export type CreateFlightData = Pick<
  Flight,
  'flightNumber' | 'origin' | 'destination' | 'departureTime' | 'arrivalTime'
>;

export const getFlights = (page = 1, limit = 20) => {
  const offset = (page - 1) * limit;
  return apiClient<FlightsResponse>(`/flights?limit=${limit}&offset=${offset}`);
};

export const createFlight = (flight: CreateFlightData) =>
  apiClient<Flight>('/flights', {
    method: 'POST',
    body: JSON.stringify(flight),
  });

