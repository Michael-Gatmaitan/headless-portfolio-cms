import { Pool } from "pg";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const main = async (): Promise<void> => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const pool = new Pool({ connectionString });

  console.log("Checking if jobs table exists...");
  const checkRes = await pool.query(`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'jobs'
    );
  `);

  if (checkRes.rows[0].exists) {
    console.log("Jobs table already exists, skipping creation.");
  } else {
    console.log("Creating jobs table...");
    await pool.query(`
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
    `);

    console.log("Adding foreign key constraint...");
    await pool.query(`
      ALTER TABLE "jobs" ADD CONSTRAINT "jobs_user_id_users_id_fk" 
      FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
    `);

    console.log("Jobs table and constraints created successfully!");
  }

  await pool.end();
  process.exit(0);
};

main().catch((err) => {
  console.error("Failed to apply schema change:", err);
  process.exit(1);
});
