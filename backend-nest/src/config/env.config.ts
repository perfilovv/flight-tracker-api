import z from 'zod';
import 'dotenv/config';

const envSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  NODE_ENV: z.string().optional(),
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string().min(1),
  REDIS_URL: z.string(),
});

const env = envSchema.parse(process.env);

export const config = {
  port: env.PORT,
  nodeEnv: env.NODE_ENV,
  databaseUrl: env.DATABASE_URL,
  jwtSecret: env.JWT_SECRET,
  redisUrl: env.REDIS_URL,
} as const;
