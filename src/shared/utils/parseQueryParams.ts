import { flightStatusEnum } from '../../modules/flights/data/flights.schema.ts';
import type { Flight } from '../../modules/flights/types/flight.types.ts';
import { AppError } from '../errors/AppError.js';

const MAX_LIMIT = 100;

export function parseFlightFilters(url: URL) {
  const rawLimit = url.searchParams.get('limit');
  const rawOffset = url.searchParams.get('offset');
  const rawStatus = url.searchParams.get('status');

  const limit = rawLimit ? Number(rawLimit) : 20;
  const offset = rawOffset ? Number(rawOffset) : 0;

  if (rawLimit && (isNaN(limit) || limit < 1 || limit > MAX_LIMIT)) {
    throw new AppError(400, `limit must be a number between 1 and ${MAX_LIMIT}`);
  }
  if (rawOffset && (isNaN(offset) || offset < 0)) {
    throw new AppError(400, 'offset must be a non-negative number');
  }
  if (rawStatus && !flightStatusEnum.enumValues.includes(rawStatus as Flight['status'])) {
    throw new AppError(400, `status must be one of: ${flightStatusEnum.enumValues.join(', ')}`);
  }

  return {
    status: (rawStatus as Flight['status']) ?? undefined,
    origin: url.searchParams.get('origin') ?? undefined,
    destination: url.searchParams.get('destination') ?? undefined,
    search: url.searchParams.get('search') ?? undefined,
    limit,
    offset,
  };
}

