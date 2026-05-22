import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Middleware } from './types.ts';

export const logger: Middleware = (req: IncomingMessage, _res: ServerResponse, next: () => void) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

