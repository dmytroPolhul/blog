import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { get } from '@nestled/config/lib/validate';
import { BlogTable } from '../modules/blog/entities/blog.schema';
import { userTable } from '../modules/user/entities/user.schema';
import { BlogPostTable } from '../modules/blog-post/entities/blog-post.schema';
import { config } from 'dotenv';

config();
const pool = new Pool({
  host: get('DB_HOST').required().asString(),
  port: get('POSTGRES_PORT').required().asPortNumber() || 5433,
  user: get('POSTGRES_USER').required().asString(),
  password: get('POSTGRES_PASSWORD').required().asString(),
  database: get('POSTGRES_DB').required().asString(),
});

const schemas = {
  userTable,
  BlogTable,
  BlogPostTable,
};

export const db = drizzle(pool, { schema: { ...schemas } });
