import fastify, { type FastifyError, type FastifyReply, type FastifyRequest } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { healthPlugin } from './routes/health.routes.ts';
import { flightsPlugin } from '../modules/flights/routes/flights.routes.ts';
import { AppError } from '../shared/errors/AppError.ts';
import jwt from '@fastify/jwt';
import { authPlugin } from '../modules/auth/routes/auth.routes.ts';
import { config } from './config/index.ts';

export async function buildServer() {
  const app = fastify({
    logger: {
      level: config.nodeEnv === 'production' ? 'info' : 'debug',
      transport: config.nodeEnv !== 'production' ? { target: 'pino-pretty' } : undefined,
    },
  });

  app.setErrorHandler((error: FastifyError, request, reply) => {
    if (error instanceof AppError) {
      reply.code(error.statusCode).send({ error: error.message });
      return;
    }

    if (error.validation) {
      reply.code(400).send({ error: error.message });
      return;
    }

    request.log.error(error);
    reply.code(500).send({ error: 'Internal server error' });
  });

  await app.register(cors, {
    origin: true,
  });
  await app.register(helmet, { contentSecurityPolicy: false });
  await app.register(jwt, {
    secret: config.jwtSecret,
  });

  await app.register(healthPlugin, { prefix: '/api/' });
  await app.register(flightsPlugin, { prefix: '/api/' });
  await app.register(authPlugin, { prefix: '/api/' });

  return app;
}

export async function verifyToken(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch {
    reply.code(401).send({ message: 'Unauthorized' });
  }
}

