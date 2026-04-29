import { and, eq } from "drizzle-orm";
import { db } from "../db/index";
import { projects } from "../db/schema";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

export type Project = InferSelectModel<typeof projects>;
export type NewProject = InferInsertModel<typeof projects>;

export async function listProjectsByUser(userId: string): Promise<Project[]> {
  return db.query.projects.findMany({
    where: eq(projects.userId, userId),
  });
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
  data: Omit<NewProject, "id" | "userId">,
): Promise<Project> {
  const [created] = await db
    .insert(projects)
    .values({ ...data, userId })
    .returning();
  return created!;
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
