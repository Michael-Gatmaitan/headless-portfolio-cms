// // Dev: Node Postgres
// import { drizzle as drizzleNode } from "drizzle-orm/node-postgres";
// import { Pool } from "pg";
// import * as dotenv from "dotenv";
// import * as schema from "./schema";

// // Prod: Neon Postgres
// import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
// import { neon } from "@neondatabase/serverless";

// dotenv.config();

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

// let db: typeof drizzleNode;

// if (process.env.NODE_ENV === "development") {
//  db = drizzleNode(pool, { schema });
// } else if (process.env.NODE_ENV === "production") {
// const sql = neon(process.env.DATABASE_URL!);
//  db = drizzleNeon({ client: sql });
// } else {
//  db = drizzleNode(pool, { schema });
// }

// export type DB = typeof db;

// export { db };
// Dev: Node Postgres
import { drizzle as drizzleNode } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as dotenv from "dotenv";
import * as schema from "./schema";
// Prod: Neon Postgres
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
// Import the concrete type helpers
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Union type that works for both drivers
type DBClient = NodePgDatabase<typeof schema> | NeonHttpDatabase<typeof schema>;

let db: DBClient;

if (process.env.NODE_ENV === "development") {
  console.log("DB proceeding in DEV mode");
  db = drizzleNode(pool, { schema });
} else if (process.env.NODE_ENV === "production") {
  console.log("DB proceeding in PROD mode");
  const sql = neon(process.env.DATABASE_URL!);
  db = drizzleNeon({ client: sql, schema });
} else {
  db = drizzleNode(pool, { schema });
}

export type DB = DBClient;

export { db };
