CREATE TABLE IF NOT EXISTS "blog-post" (
	"id" text,
	"created_at" timestamp (6) with time zone DEFAULT now(),
	"updated_at" timestamp (6) with time zone DEFAULT now(),
	"deleted_at" timestamp (6) with time zone,
	"title" varchar NOT NULL,
	"main_text" varchar NOT NULL,
	"is_publish" boolean DEFAULT false
);
