import { z } from "zod";

export const reorderItemsSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().uuid(),
        sortOrder: z.string().min(1).max(255),
      }),
    )
    .min(1),
});

export type ReorderItemsInput = z.infer<typeof reorderItemsSchema>;
