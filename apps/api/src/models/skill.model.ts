import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { db } from "../db";
import { skills } from "../db/schema";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { nextSortOrder } from "../utils/sortOrder";
import type { ReorderItemsInput } from "../schemas/reorderSchema";

export type Skill = InferSelectModel<typeof skills>;
export type NewSkill = InferInsertModel<typeof skills>;

export async function listSkillsByUser(userId: string): Promise<Skill[]> {
  return db.query.skills.findMany({
    where: eq(skills.userId, userId),
    orderBy: asc(skills.sortOrder),
  });
}

async function getLastSkillSortOrder(
  userId: string,
): Promise<string | undefined> {
  const [last] = await db
    .select({ sortOrder: skills.sortOrder })
    .from(skills)
    .where(eq(skills.userId, userId))
    .orderBy(desc(skills.sortOrder))
    .limit(1);
  return last?.sortOrder;
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
  data: Omit<NewSkill, "id" | "userId" | "sortOrder">,
): Promise<Skill> {
  const sortOrder = await nextSortOrder(await getLastSkillSortOrder(userId));
  const [created] = await db
    .insert(skills)
    .values({ ...data, userId, sortOrder })
    .returning();
  return created!;
}

export async function reorderSkills(
  userId: string,
  items: ReorderItemsInput["items"],
): Promise<Skill[]> {
  const ids = items.map((item) => item.id);
  const owned = await db.query.skills.findMany({
    where: and(eq(skills.userId, userId), inArray(skills.id, ids)),
    columns: { id: true },
  });

  if (owned.length !== ids.length) {
    return [];
  }

  await db.transaction(async (tx) => {
    for (const item of items) {
      await tx
        .update(skills)
        .set({ sortOrder: item.sortOrder })
        .where(and(eq(skills.userId, userId), eq(skills.id, item.id)));
    }
  });

  return listSkillsByUser(userId);
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
