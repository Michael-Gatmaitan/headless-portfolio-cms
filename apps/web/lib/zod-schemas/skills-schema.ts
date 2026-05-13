import { z } from "zod";

export const createSkillSchema = z.object({
  title: z.string().min(1, "Skill name is required"),
  tags: z.array(z.string()).min(1, "At least one item is required"),
});

export type CreateSkillFormValues = z.infer<typeof createSkillSchema>;
