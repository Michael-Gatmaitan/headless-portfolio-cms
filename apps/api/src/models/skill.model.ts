import { and, desc, eq } from "drizzle-orm";
import { db } from "../db";
import { skills } from "../db/schema";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

export type Skill = InferSelectModel<typeof skills>;
export type NewSkill = InferInsertModel<typeof skills>;

export async function listSkillsByUser(userId: string): Promise<Skill[]> {
  return db.query.skills.findMany({
    where: eq(skills.userId, userId),
    orderBy: desc(skills.createdAt),
  });
}

export async function getSkillById(
  userId: string,
  id: string,
): Promise<Skill | undefined> {
  return db.query.skills.findFirst({
    where: and(eq(skills.userId, userId), eq(skills.id, id)),
  });
}

export async function createSkill(
  userId: string,
  data: Omit<NewSkill, "id" | "userId">,
): Promise<Skill> {
  const [created] = await db
    .insert(skills)
    .values({ ...data, userId })
    .returning();
  return created!;
}

export async function updateSkill(
  userId: string,
  id: string,
  data: Partial<Omit<NewSkill, "id" | "userId">>,
): Promise<Skill | undefined> {
  const [updated] = await db
    .update(skills)
    .set(data)
    .where(and(eq(skills.userId, userId), eq(skills.id, id)))
    .returning();
  return updated;
}

export async function deleteSkill(
  userId: string,
  id: string,
): Promise<Skill | undefined> {
  const [deleted] = await db
    .delete(skills)
    .where(and(eq(skills.userId, userId), eq(skills.id, id)))
    .returning();
  return deleted;
}
