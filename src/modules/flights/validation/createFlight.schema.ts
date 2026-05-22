import { z } from 'zod';

export const createFlightSchema = z.object({
  flightNumber: z.string(),
  origin: z.string(),
  destination: z.string(),
  departureTime: z.iso.datetime().optional(),
  arrivalTime: z.iso.datetime().optional(),
});

export type CreateFlightDto = z.infer<typeof createFlightSchema>;
