DO $$ BEGIN
 CREATE TYPE "ROLE" AS ENUM('Writer', 'Moderator');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text,
	"created_at" timestamp (6) with time zone DEFAULT now(),
	"updated_at" timestamp (6) with time zone DEFAULT now(),
	"deleted_at" timestamp (6) with time zone,
	"first_name" varchar NOT NULL,
	"last_name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	"is_active" boolean DEFAULT false,
	"role" "ROLE" DEFAULT 'Writer' NOT NULL,
	"token" varchar
);
