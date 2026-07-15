import './modules/flights/routes/flights.routes.ts';
import './app/routes/health.routes.ts';
import { buildServer } from './app/server.ts';

const app = await buildServer();
await app.listen({ port: Number(process.env.PORT) || 3000, host: '0.0.0.0' });
console.log('fastify server started');

