CREATE TABLE "jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"company_name" varchar(255) NOT NULL,
	"role" varchar(255) NOT NULL,
	"location" varchar(255),
	"salary_range" varchar(255),
	"status" varchar(255) NOT NULL,
	"notes" text,
	"platform" varchar(255),
	"date_applied" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "awards" ADD COLUMN "sort_order" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "sort_order" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "skills" ADD COLUMN "sort_order" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;