import { z } from "zod";

export const createProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  url: z.string().min(1, "Link is required"),
  github: z.string().min(1, "Github link is required"),
  dateRange: z.string().min(1, "Date range is required"),
  thumbnail: z.string().min(1, "Thumbnail is required"),
});

export type CreateProjectFormValues = z.infer<typeof createProjectSchema>;

export const editProjectSchema = createProjectSchema.partial().extend({
  thumbnail: z.string().optional(),
});

export type EditProjectFormValues = z.infer<typeof editProjectSchema>;
