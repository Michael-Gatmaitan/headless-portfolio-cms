import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";

export async function findUserByEmail(email: string) {
  return db.query.users.findFirst({
    where: eq(users.email, email),
  });
}

export async function findUserById(id: string) {
  return db.query.users.findFirst({
    where: eq(users.id, id),
  });
}

export async function createUser(data: {
  name: string;
  email: string;
  passwordHash: string | null;
}) {
  const [user] = await db.insert(users).values(data).returning();
  return user;
}
