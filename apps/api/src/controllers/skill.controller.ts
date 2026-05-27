import type { Response } from "express";
import { z } from "zod";
import type { AuthRequest } from "../middleware/auth.middleware";
import * as SkillService from "../services/skill.service";
import { reorderItemsSchema } from "../schemas/reorderSchema";

const createSkillSchema = z.object({
  title: z.string().min(1),
  tags: z.array(z.string()).optional().default([]),
});

const updateSkillSchema = createSkillSchema.partial();

export async function list(req: AuthRequest, res: Response): Promise<void> {
  if (!req.userId) {
    res.status(401).json({ success: false, error: "Unauthorized" });
    return;
  }

  const skills = await SkillService.listSkills(req.userId);
  res.json({ success: true, data: skills });
}

export async function get(req: AuthRequest, res: Response): Promise<void> {
  if (!req.userId) {
    res.status(401).json({ success: false, error: "Unauthorized" });
    return;
  }
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const skill = await SkillService.getSkill(req.userId, id);
  if (!skill) {
    res.status(404).json({ success: false, error: "Not found" });
    return;
  }
  res.json({ success: true, data: skill });
}

export async function create(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }
    const data = createSkillSchema.parse(req.body);
    const created = await SkillService.createSkill(req.userId, data);
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
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export async function update(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }
    const data = updateSkillSchema.parse(req.body);
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const updated = await SkillService.updateSkill(req.userId, id, data);
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

export async function reorder(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }
    const { items } = reorderItemsSchema.parse(req.body);
    const skills = await SkillService.reorderSkills(req.userId, items);
    if (skills.length === 0) {
      res.status(400).json({
        success: false,
        error: "One or more skills were not found",
      });
      return;
    }
    res.json({ success: true, data: skills });
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
  const deleted = await SkillService.deleteSkill(req.userId, id);
  if (!deleted) {
    res.status(404).json({ success: false, error: "Not found" });
    return;
  }
  res.json({ success: true, data: deleted });
}
