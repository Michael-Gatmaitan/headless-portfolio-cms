import type { Response } from "express";
import { z } from "zod";
import type { AuthRequest } from "../middleware/auth.middleware";
import * as ProjectService from "../services/project.service";

const createProjectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  url: z.string().min(1),
  github: z.string().min(1),
  dateRange: z.string().min(1),
});

const updateProjectSchema = createProjectSchema.partial();

export async function list(req: AuthRequest, res: Response): Promise<void> {
  if (!req.userId) {
    res.status(401).json({ success: false, error: "Unauthorized" });
    return;
  }
  const projects = await ProjectService.listProjects(req.userId);
  res.json({ success: true, data: projects });
}

export async function get(req: AuthRequest, res: Response): Promise<void> {
  if (!req.userId) {
    res.status(401).json({ success: false, error: "Unauthorized" });
    return;
  }
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const project = await ProjectService.getProject(req.userId, id);
  if (!project) {
    res.status(404).json({ success: false, error: "Not found" });
    return;
  }
  res.json({ success: true, data: project });
}

export async function create(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }
    const data = createProjectSchema.parse(req.body);
    const created = await ProjectService.createProject(req.userId, data);
    res.status(201).json({ success: true, data: created });
  } catch (err: any) {
    if (err?.name === "ZodError") {
      res
        .status(400)
        .json({ success: false, error: "Validation failed", details: err.flatten().fieldErrors });
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
    const data = updateProjectSchema.parse(req.body);
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const updated = await ProjectService.updateProject(req.userId, id, data);
    if (!updated) {
      res.status(404).json({ success: false, error: "Not found" });
      return;
    }
    res.json({ success: true, data: updated });
  } catch (err: any) {
    if (err?.name === "ZodError") {
      res
        .status(400)
        .json({ success: false, error: "Validation failed", details: err.flatten().fieldErrors });
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
  const deleted = await ProjectService.deleteProject(req.userId, id);
  if (!deleted) {
    res.status(404).json({ success: false, error: "Not found" });
    return;
  }
  res.json({ success: true, data: deleted });
}
