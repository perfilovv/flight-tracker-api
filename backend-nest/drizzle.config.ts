import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';
import z from 'zod';

const migrationEnvSchema = z.object({
  DATABASE_URL: z.url(),
});

const env = migrationEnvSchema.parse(process.env);

export default defineConfig({
  schema: './src/modules/**/*.schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
});
