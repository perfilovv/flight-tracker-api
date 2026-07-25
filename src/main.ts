import './modules/flights/routes/flights.routes.ts';
import './app/routes/health.routes.ts';
import { buildServer } from './app/server.ts';
import { config } from './app/config/index.ts';

const app = await buildServer();
await app.listen({ port: Number(config.port) || 3000, host: '0.0.0.0' });
console.log('fastify server started');

