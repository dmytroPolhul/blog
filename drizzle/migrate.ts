import 'dotenv/config';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db } from '../src/config/pg.config';

// This will run migrations on the database, skipping the ones already applied
migrate(db, { migrationsFolder: './drizzle', migrationsTable: 'migrations' });
