import type { Config } from "drizzle-kit";
import {get} from "@nestled/config/lib/validate";
export default {
    schema: ['./src/modules/**/*.schema.ts'],
    out: './drizzle',
    driver: 'pg',
    dbCredentials: {
        host: get('DB_HOST').required().asString(),
        port: get('POSTGRES_PORT').required().asPortNumber() || 5433,
        user: get('POSTGRES_USER').required().asString(),
        password: get('POSTGRES_PASSWORD').required().asString(),
        database: get('POSTGRES_DB').required().asString(),
    }
} satisfies Config;
