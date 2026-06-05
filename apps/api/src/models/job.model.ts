import { and, desc, eq } from "drizzle-orm";
import { db } from "../db/index";
import { jobs } from "../db/schema";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

export type Job = InferSelectModel<typeof jobs>;
export type NewJob = InferInsertModel<typeof jobs>;

export const listJobsByUser = async (userId: string): Promise<Job[]> => {
  return db.query.jobs.findMany({
    where: eq(jobs.userId, userId),
    orderBy: desc(jobs.dateApplied),
  });
};

export const getJobById = async (
  userId: string,
  id: string,
): Promise<Job | undefined> => {
  return db.query.jobs.findFirst({
    where: and(eq(jobs.userId, userId), eq(jobs.id, id)),
  });
};

export const createJob = async (
  userId: string,
  data: Omit<NewJob, "id" | "userId">,
): Promise<Job> => {
  const [created] = await db
    .insert(jobs)
    .values({ ...data, userId })
    .returning();
  return created!;
};

export const updateJob = async (
  userId: string,
  id: string,
  data: Partial<Omit<NewJob, "id" | "userId">>,
): Promise<Job | undefined> => {
  console.log(data);
  const [updated] = await db
    .update(jobs)
    .set(data)
    .where(and(eq(jobs.userId, userId), eq(jobs.id, id)))
    .returning();
  return updated;
};

export const deleteJob = async (
  userId: string,
  id: string,
): Promise<Job | undefined> => {
  const [deleted] = await db
    .delete(jobs)
    .where(and(eq(jobs.userId, userId), eq(jobs.id, id)))
    .returning();
  return deleted;
};
