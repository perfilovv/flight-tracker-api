import { client } from '../config/database.ts';
import type { FastifyInstance } from 'fastify';

export async function healthPlugin(app: FastifyInstance) {
  app.get('/health', async () => ({
    status: 'ok',
    uptime: process.uptime(),
  }));

  app.get('/health/ready', async (req, reply) => {
    try {
      await client`SELECT 1`;
      return { status: 'ready', database: 'connected' };
    } catch {
      reply.code(503);
      return { status: 'not ready', database: 'disconnected' };
    }
  });
}

