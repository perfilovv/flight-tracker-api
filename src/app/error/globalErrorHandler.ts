import type { ServerResponse } from 'node:http';
import { AppError } from '../../shared/errors/AppError.ts';
import { ZodError } from 'zod';

export const errorHandler = (err: unknown, res: ServerResponse) => {
  if (err instanceof ZodError) {
    res.writeHead(400);
    res.end(
      JSON.stringify({
        error: err.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
      }),
    );
    return;
  }

  if (err instanceof AppError) {
    if (!err.isOperational) {
      console.error(err);
    }

    res.writeHead(err.statusCode);
    res.end(JSON.stringify({ error: err.message }));
    return;
  }
  console.error(err);

  res.writeHead(500);
  res.end(JSON.stringify({ error: 'Internal server error' }));
};

