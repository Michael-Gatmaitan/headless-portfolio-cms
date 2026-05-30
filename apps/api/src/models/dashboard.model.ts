import { eq, sql } from "drizzle-orm";
import { db } from "../db";
import { projects, skills, awards } from "../db/schema";

export interface UserStats {
  projects: number;
  skills: number;
  awards: number;
}

export async function getUserStats(userId: string): Promise<UserStats> {
  const [projectRes, skillRes, awardRes] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)` })
      .from(projects)
      .where(eq(projects.userId, userId)),
    db
      .select({ count: sql<number>`count(*)` })
      .from(skills)
      .where(eq(skills.userId, userId)),
    db
      .select({ count: sql<number>`count(*)` })
      .from(awards)
      .where(eq(awards.userId, userId)),
  ]);

  return {
    projects: Number(projectRes[0]?.count || 0),
    skills: Number(skillRes[0]?.count || 0),
    awards: Number(awardRes[0]?.count || 0),
  };
}
