
import { env } from '@/schema/env/server';
import type { Config } from 'drizzle-kit';

export default {
  driver: 'mysql2',
  out: './src/schema/drizzle',
  schema: './src/schema/drizzle/schema.ts',
  dbCredentials: {
    host: env.DB_HOST,
    port: Number(env.DB_PORT),
    user: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    
  },
  // Print all statements
  verbose: true,
  // Always ask for confirmation
  strict: true,
} satisfies Config;
