import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { buildServer } from '../../../app/server.ts';
import type { Flight } from '../types/flight.types.ts';

let app: FastifyInstance;

beforeAll(async () => {
  app = await buildServer();
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe('GET /api/flights', () => {
  it('returns paginated list', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/flights',
    });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body).toHaveProperty('data');
    expect(body).toHaveProperty('total');
    expect(Array.isArray(body.data)).toBe(true);
  });

  it('filters by status', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/flights?status=scheduled',
    });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    body.data.forEach((flight: Flight) => expect(flight.status).toBe('scheduled'));
  });

  it('returns 400 for invalid status', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/flights?status=flying',
    });
    expect(res.statusCode).toBe(400);
  });

  describe('POST /api/flights', () => {
    it('returns 401 without token', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/flights',
        payload: {
          flightNumber: 'XX999',
          origin: 'SVO',
          destination: 'JFK',
          departureTime: '2025-07-01T10:00:00Z',
          arrivalTime: '2025-07-01T18:00:00Z',
        },
      });
      expect(res.statusCode).toBe(401);
    });
  });
});

