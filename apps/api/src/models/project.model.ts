import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { db } from "../db/index";
import { projects } from "../db/schema";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { nextSortOrder } from "../utils/sortOrder";
import type { ReorderItemsInput } from "../schemas/reorderSchema";

export type Project = InferSelectModel<typeof projects>;
export type NewProject = InferInsertModel<typeof projects>;

export async function listProjectsByUser(userId: string): Promise<Project[]> {
  return db.query.projects.findMany({
    where: eq(projects.userId, userId),
    orderBy: asc(projects.sortOrder),
  });
}

async function getLastProjectSortOrder(
  userId: string,
): Promise<string | undefined> {
  const [last] = await db
    .select({ sortOrder: projects.sortOrder })
    .from(projects)
    .where(eq(projects.userId, userId))
    .orderBy(desc(projects.sortOrder))
    .limit(1);
  return last?.sortOrder;
}

export async function getProjectById(
  userId: string,
  id: string,
): Promise<Project | undefined> {
  return db.query.projects.findFirst({
    where: and(eq(projects.userId, userId), eq(projects.id, id)),
  });
}

export async function createProject(
  userId: string,
  data: Omit<NewProject, "id" | "userId" | "sortOrder">,
): Promise<Project> {
  const sortOrder = await nextSortOrder(await getLastProjectSortOrder(userId));
  const [created] = await db
    .insert(projects)
    .values({ ...data, userId, sortOrder })
    .returning();
  return created!;
}

export async function reorderProjects(
  userId: string,
  items: ReorderItemsInput["items"],
): Promise<Project[]> {
  const ids = items.map((item) => item.id);
  const owned = await db.query.projects.findMany({
    where: and(eq(projects.userId, userId), inArray(projects.id, ids)),
    columns: { id: true },
  });

  if (owned.length !== ids.length) {
    return [];
  }

  await Promise.all(
    items.map((item) =>
      db
        .update(projects)
        .set({ sortOrder: item.sortOrder })
        .where(and(eq(projects.userId, userId), eq(projects.id, item.id)))
    )
  );

  return listProjectsByUser(userId);
}

export async function updateProject(
  userId: string,
  id: string,
  data: Partial<Omit<NewProject, "id" | "userId">>,
): Promise<Project | undefined> {
  const [updated] = await db
    .update(projects)
    .set(data)
    .where(and(eq(projects.userId, userId), eq(projects.id, id)))
    .returning();

  return updated;
}

export async function deleteProject(
  userId: string,
  id: string,
): Promise<Project | undefined> {
  const [deleted] = await db
    .delete(projects)
    .where(and(eq(projects.userId, userId), eq(projects.id, id)))
    .returning();
  return deleted;
}
