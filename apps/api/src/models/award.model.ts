import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { db } from "../db";
import { awards } from "../db/schema";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { nextSortOrder } from "../utils/sortOrder";
import type { ReorderItemsInput } from "../schemas/reorderSchema";

export type Award = InferSelectModel<typeof awards>;
export type NewAward = InferInsertModel<typeof awards>;

export async function listAwardsByUser(userId: string): Promise<Award[]> {
  return db.query.awards.findMany({
    where: eq(awards.userId, userId),
    orderBy: asc(awards.sortOrder),
  });
}

async function getLastAwardSortOrder(
  userId: string,
): Promise<string | undefined> {
  const [last] = await db
    .select({ sortOrder: awards.sortOrder })
    .from(awards)
    .where(eq(awards.userId, userId))
    .orderBy(desc(awards.sortOrder))
    .limit(1);
  return last?.sortOrder;
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
  data: Omit<NewAward, "id" | "userId" | "sortOrder">,
): Promise<Award> {
  const sortOrder = nextSortOrder(await getLastAwardSortOrder(userId));
  const [created] = await db
    .insert(awards)
    .values({ ...data, userId, sortOrder })
    .returning();
  return created!;
}

export async function reorderAwards(
  userId: string,
  items: ReorderItemsInput["items"],
): Promise<Award[]> {
  const ids = items.map((item) => item.id);
  const owned = await db.query.awards.findMany({
    where: and(eq(awards.userId, userId), inArray(awards.id, ids)),
    columns: { id: true },
  });

  if (owned.length !== ids.length) {
    return [];
  }

  await db.transaction(async (tx) => {
    for (const item of items) {
      await tx
        .update(awards)
        .set({ sortOrder: item.sortOrder })
        .where(and(eq(awards.userId, userId), eq(awards.id, item.id)));
    }
  });

  return listAwardsByUser(userId);
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
