import { z } from 'zod';

export const flightSchema = z
  .object({
    flightNumber: z.string().min(2, 'Минимум 2 символа'),
    origin: z.string().min(3, 'Код аэропорта — минимум 3 символа'),
    destination: z.string().min(3, 'Код аэропорта — минимум 3 символа'),
    departureTime: z.string().min(1, 'Укажите время вылета'),
    arrivalTime: z.string().min(1, 'Укажите время прилёта'),
  })
  .refine((data) => new Date(data.departureTime) < new Date(data.arrivalTime), {
    message: 'Время вылета должно быть раньше времени прилёта',
    path: ['arrivalTime'],
  });

export type FlightFormData = z.infer<typeof flightSchema>;

