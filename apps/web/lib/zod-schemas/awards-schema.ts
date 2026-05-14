import z from "zod";

export const createAwardSchema = z.object({
  title: z.string().min(1, "Title is required"),
  shortDescription: z.string().min(1, "Description is required"),
  thumbnail: z.string().nullable(),
  longDescription: z.string().min(1, "Description is required"),
  year: z.string().min(1, "Year is required"),
  tags: z.array(z.string()).min(1, "At least one item is required"),
});

export type CreateAwardFormValues = z.infer<typeof createAwardSchema>;
