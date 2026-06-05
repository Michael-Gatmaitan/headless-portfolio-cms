import { z } from "zod";

export const createJobSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  role: z.string().min(1, "Role is required"),
  location: z.string().optional().nullable().transform(val => val === "" ? null : val),
  salaryRange: z.string().optional().nullable().transform(val => val === "" ? null : val),
  status: z.string().min(1, "Status is required"),
  notes: z.string().optional().nullable().transform(val => val === "" ? null : val),
  platform: z.string().optional().nullable().transform(val => val === "" ? null : val),
  dateApplied: z.string().min(1, "Date applied is required"),
});

// Input type: what the form fields hold (pre-transform)
export type CreateJobFormInput = z.input<typeof createJobSchema>;
// Output type: what the submit handler receives (post-transform)
export type CreateJobFormValues = z.output<typeof createJobSchema>;

export const editJobSchema = createJobSchema.partial();

// Input type for the edit form fields (pre-transform)
export type EditJobFormInput = z.input<typeof editJobSchema>;
// Output type for the edit submit handler (post-transform)
export type EditJobFormValues = z.output<typeof editJobSchema>;
