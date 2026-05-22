import { cors } from './app/middleware/cors.ts';
import { logger } from './app/middleware/logger.ts';
import { use } from './app/middleware/runner.ts';
import { registerProcessHandlers } from './app/process/registerProcessHandlers.ts';
import { startServer } from './app/server.ts';
import './modules/flights/routes/flights.routes.ts';
import './app/routes/health.routes.ts';

registerProcessHandlers();
use(logger);
use(cors);
startServer();

