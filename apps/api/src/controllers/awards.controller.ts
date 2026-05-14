import type { Response } from "express";
import { z } from "zod";
import type { AuthRequest } from "../middleware/auth.middleware";
import * as AwardService from "../services/award.service";

const createAwardSchema = z.object({
  title: z.string().min(1),
  shortDescription: z.string().min(1),
  longDescription: z.string().min(1),
  year: z.string().min(1),
  thumbnail: z.string().optional().default(""),
  tags: z.array(z.string()).optional().default([]),
});

const updateAwardSchema = createAwardSchema.partial();

export async function list(req: AuthRequest, res: Response): Promise<void> {
  if (!req.userId) {
    res.status(401).json({ success: false, error: "Unauthorized" });
    return;
  }
  const awards = await AwardService.listAwards(req.userId);
  console.log("AWARDS IN BACKEND: ", awards);
  res.json({ success: true, data: awards });
}

export async function get(req: AuthRequest, res: Response): Promise<void> {
  if (!req.userId) {
    res.status(401).json({ success: false, error: "Unauthorized" });
    return;
  }
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const award = await AwardService.getAward(req.userId, id);
  if (!award) {
    res.status(404).json({ success: false, error: "Not found" });
    return;
  }
  res.json({ success: true, data: award });
}

export async function create(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }
    const data = createAwardSchema.parse(req.body);
    const created = await AwardService.createAward(req.userId, data);
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
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export async function update(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }
    const data = updateAwardSchema.parse(req.body);
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const updated = await AwardService.updateAward(req.userId, id, data);
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
}

export async function remove(req: AuthRequest, res: Response): Promise<void> {
  if (!req.userId) {
    res.status(401).json({ success: false, error: "Unauthorized" });
    return;
  }
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const deleted = await AwardService.deleteAward(req.userId, id);
  if (!deleted) {
    res.status(404).json({ success: false, error: "Not found" });
    return;
  }
  res.json({ success: true, data: deleted });
}
