CREATE TABLE IF NOT EXISTS "blogs" (
	"id" text,
	"created_at" timestamp (6) with time zone DEFAULT now(),
	"updated_at" timestamp (6) with time zone DEFAULT now(),
	"deleted_at" timestamp (6) with time zone,
	"title" varchar NOT NULL,
	"description" varchar NOT NULL,
	"author_id" varchar
);
