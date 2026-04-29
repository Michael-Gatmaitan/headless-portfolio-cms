import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { awards } from "../db/schema";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

export type Award = InferSelectModel<typeof awards>;
export type NewAward = InferInsertModel<typeof awards>;

export async function listAwardsByUser(userId: string): Promise<Award[]> {
  return db.query.awards.findMany({
    where: eq(awards.userId, userId),
  });
}

export async function getAwardById(
  userId: string,
  id: string,
): Promise<Award | undefined> {
  return db.query.awards.findFirst({
    where: and(eq(awards.userId, userId), eq(awards.id, id)),
  });
}

export async function createAward(
  userId: string,
  data: Omit<NewAward, "id" | "userId">,
): Promise<Award> {
  const [created] = await db
    .insert(awards)
    .values({ ...data, userId })
    .returning();
  return created!;
}

export async function updateAward(
  userId: string,
  id: string,
  data: Partial<Omit<NewAward, "id" | "userId">>,
): Promise<Award | undefined> {
  const [updated] = await db
    .update(awards)
    .set(data)
    .where(and(eq(awards.userId, userId), eq(awards.id, id)))
    .returning();
  return updated;
}

export async function deleteAward(
  userId: string,
  id: string,
): Promise<Award | undefined> {
  const [deleted] = await db
    .delete(awards)
    .where(and(eq(awards.userId, userId), eq(awards.id, id)))
    .returning();
  return deleted;
}
