export interface Flight {
  id: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  status: 'scheduled' | 'departed' | 'arrived' | 'cancelled';
  createdAt: string;
}
