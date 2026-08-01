import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';
import { config } from 'src/config/env.config';

export default defineConfig({
  schema: './src/modules/**/*.schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: config.databaseUrl,
  },
  verbose: true,
  strict: true,
});
