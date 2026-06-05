import type { Response } from "express";
import { z } from "zod";
import type { AuthRequest } from "../middleware/auth.middleware";
import * as JobService from "../services/job.service";

const createJobSchema = z.object({
  companyName: z.string().min(1),
  role: z.string().min(1),
  location: z.string().optional().nullable(),
  salaryRange: z.string().optional().nullable(),
  status: z.string().min(1),
  notes: z.string().optional().nullable(),
  platform: z.string().optional().nullable(),
  dateApplied: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
});

const updateJobSchema = createJobSchema.partial();

export const list = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.userId) {
    res.status(401).json({ success: false, error: "Unauthorized" });
    return;
  }
  const jobs = await JobService.listJobs(req.userId);
  res.json({ success: true, data: jobs });
};

export const get = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.userId) {
    res.status(401).json({ success: false, error: "Unauthorized" });
    return;
  }
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const job = await JobService.getJob(req.userId, id);
  if (!job) {
    res.status(404).json({ success: false, error: "Not found" });
    return;
  }
  res.json({ success: true, data: job });
};

export const create = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }
    const data = createJobSchema.parse(req.body);
    const created = await JobService.createJob(req.userId, data);

    res.status(201).json({ success: true, data: created });
  } catch (err: any) {
    if (err?.name === "ZodError") {
      res.status(400).json({
        success: false,
        error: "Validation failed",
        details: err.flatten().fieldErrors,
      });
      return;
    }

    console.log(err);
    res
      .status(500)
      .json({ success: false, error: "Internal server error: " + err });
  }
};

export const update = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }
    const data = updateJobSchema.parse(req.body);
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const updated = await JobService.updateJob(req.userId, id, data);
    if (!updated) {
      res.status(404).json({ success: false, error: "Not found" });
      return;
    }
    res.json({ success: true, data: updated });
  } catch (err: any) {
    if (err?.name === "ZodError") {
      res.status(400).json({
        success: false,
        error: "Validation failed",
        details: err.flatten().fieldErrors,
      });
      return;
    }
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const remove = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  if (!req.userId) {
    res.status(401).json({ success: false, error: "Unauthorized" });
    return;
  }
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const deleted = await JobService.deleteJob(req.userId, id);
  if (!deleted) {
    res.status(404).json({ success: false, error: "Not found" });
    return;
  }
  res.json({ success: true, data: deleted });
};
