import type { FastifyReply, FastifyRequest } from 'fastify';
import { db } from '../../../app/config/database.ts';
import { usersTable } from '../../users/users.schema.ts';
import { eq } from 'drizzle-orm';
import { AppError } from '../../../shared/errors/AppError.ts';
import bcrypt from 'bcrypt';

type AuthBody = {
  email: string;
  password: string;
};

export const authController = {
  register: async (request: FastifyRequest<{ Body: AuthBody }>, reply: FastifyReply) => {
    const { email, password } = request.body;

    const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, email));

    if (existing) {
      throw new AppError(409, 'Email already registered');
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const [user] = await db
      .insert(usersTable)
      .values({ email, passwordHash })
      .returning({ id: usersTable.id, email: usersTable.email });

    const token = await reply.jwtSign(
      {
        id: user.id,
        email: user.email,
      },
      {
        expiresIn: '7d',
      },
    );

    reply.code(201);
    return { token, user };
  },
  login: async (request: FastifyRequest<{ Body: AuthBody }>, reply: FastifyReply) => {
    const { email, password } = request.body;

    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));

    if (!user) {
      throw new AppError(404, 'Invalid credentials');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);

    if (!valid) {
      throw new AppError(404, 'Invalid credentials');
    }

    const token = await reply.jwtSign(
      {
        id: user.id,
        email: user.email,
      },
      {
        expiresIn: '7d',
      },
    );

    return { token };
  },
};

