import { createServer } from 'node:http';
import { runMiddlewares } from './middleware/runner.ts';
import { config } from './config/index.ts';
import { handleRoute } from './router/index.ts';
import { errorHandler } from './error/globalErrorHandler.ts';

export function startServer() {
  return createServer((req, res) => {
    runMiddlewares(req, res, async () => {
      try {
        await handleRoute(req, res);
      } catch (error) {
        errorHandler(error, res);
      }
    });
  }).listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
}

