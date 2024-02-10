import 'dotenv/config';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import {get} from "@nestled/config/lib/validate";

// This will run migrations on the database, skipping the ones already applied
const pool = new Pool({
    host: get('DB_HOST').required().asString(),
    port: get('POSTGRES_PORT').required().asPortNumber() || 5433,
    user: get('POSTGRES_USER').required().asString(),
    password: get('POSTGRES_PASSWORD').required().asString(),
    database: get('POSTGRES_DB').required().asString(),
});

migrate(pool, { migrationsFolder: './drizzle', migrationsTable: 'migrations' });
