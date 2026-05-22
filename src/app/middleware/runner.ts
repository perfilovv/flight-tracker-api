import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Middleware } from './types.ts';

const middlewares: Middleware[] = [];

export const use = (middleware: Middleware) => {
  middlewares.push(middleware);
};

export function runMiddlewares(req: IncomingMessage, res: ServerResponse, finalHandler: () => void) {
  let index = 0;

  const next = () => {
    const middleware = middlewares[index++];

    if (middleware) {
      middleware(req, res, next);
      return;
    }

    finalHandler();
  };

  next();
}
