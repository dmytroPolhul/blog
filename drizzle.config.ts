import type { Config } from 'drizzle-kit';
import { get } from '@nestled/config/lib/validate';
import { config } from 'dotenv';

config();
export default {
  schema: ['./src/modules/**/*.schema.ts'],
  out: './drizzle',
  driver: 'pg',
  schemaFilter: 'public',
  dbCredentials: {
    host: get('DB_HOST').required().asString(),
    port: get('POSTGRES_PORT').required().asPortNumber() || 5433,
    user: get('POSTGRES_USER').required().asString(),
    password: get('POSTGRES_PASSWORD').required().asString(),
    database: get('POSTGRES_DB').required().asString(),
  },
} satisfies Config;
