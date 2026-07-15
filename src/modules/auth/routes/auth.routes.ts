import type { FastifyInstance } from 'fastify';
import { authController } from '../controller/auth.controller.ts';

const registerSchema = {
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 8 },
    },
  },
};

export async function authPlugin(app: FastifyInstance) {
  app.post('/auth/register', { schema: registerSchema }, authController.register);
  app.post('/auth/login', { schema: registerSchema }, authController.login);
}

