CREATE TABLE "webhoos" (
	"id" text PRIMARY KEY NOT NULL,
	"method" text NOT NULL,
	"pathname" text NOT NULL,
	"ip" text NOT NULL,
	"status_code" integer DEFAULT 200 NOT NULL,
	"content_type" text,
	"content_lenght" integer,
	"query_params" jsonb,
	"headers" jsonb NOT NULL,
	"body" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
