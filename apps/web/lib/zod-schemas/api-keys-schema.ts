import z from "zod";

export const createApiKeySchema = z.object({
  name: z.string().min(1, "Key name is required"),
  expiresAt: z.iso.datetime().nullable().optional(),
});

export type CreateApiKeyFormValues = z.infer<typeof createApiKeySchema>;
