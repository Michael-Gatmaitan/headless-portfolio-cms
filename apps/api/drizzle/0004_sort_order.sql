ALTER TABLE "projects" ADD COLUMN "sort_order" varchar(255);--> statement-breakpoint
ALTER TABLE "skills" ADD COLUMN "sort_order" varchar(255);--> statement-breakpoint
ALTER TABLE "awards" ADD COLUMN "sort_order" varchar(255);--> statement-breakpoint
UPDATE "projects" p SET "sort_order" = 'a' || lpad((sub.rn - 1)::text, 10, '0')
FROM (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at ASC) AS rn
  FROM "projects"
) sub
WHERE p.id = sub.id;--> statement-breakpoint
UPDATE "skills" s SET "sort_order" = 'a' || lpad((sub.rn - 1)::text, 10, '0')
FROM (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) AS rn
  FROM "skills"
) sub
WHERE s.id = sub.id;--> statement-breakpoint
UPDATE "awards" a SET "sort_order" = 'a' || lpad((sub.rn - 1)::text, 10, '0')
FROM (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) AS rn
  FROM "awards"
) sub
WHERE a.id = sub.id;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "sort_order" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "skills" ALTER COLUMN "sort_order" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "awards" ALTER COLUMN "sort_order" SET NOT NULL;
