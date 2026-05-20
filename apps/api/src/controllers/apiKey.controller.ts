import type { Response } from "express";
import { z } from "zod";
import type { AuthRequest } from "../middleware/auth.middleware";
import * as ApiKeyService from "../services/apiKey.service";

const createKeySchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  expiresAt: z.iso.datetime().nullable().optional(), // ISO-8601 string, optional
});

export async function create(req: AuthRequest, res: Response): Promise<void> {
  if (!req.userId) {
    res.status(401).json({ success: false, error: "Unauthorized" });
    return;
  }

  try {
    const data = createKeySchema.parse(req.body);
    const expiresAt = data.expiresAt ? new Date(data.expiresAt) : undefined;
    const result = await ApiKeyService.createKey(
      req.userId,
      data.name,
      expiresAt,
    );

    res.status(201).json({
      success: true,
      data: result,
      warning: "Save the 'key' field immediately — it will not be shown again.",
    });
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

export async function list(req: AuthRequest, res: Response): Promise<void> {
  if (!req.userId) {
    res.status(401).json({ success: false, error: "Unauthorized" });
    return;
  }

  const keys = await ApiKeyService.listKeys(req.userId);
  res.json({ success: true, data: keys });
}


export async function revoke(req: AuthRequest, res: Response): Promise<void> {
  if (!req.userId) {
    res.status(401).json({ success: false, error: "Unauthorized" });
    return;
  }

  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const revoked = await ApiKeyService.revokeKey(req.userId, id);

  if (!revoked) {
    res.status(404).json({ success: false, error: "API key not found" });
    return;
  }

  res.json({ success: true, data: revoked });
}

export async function bulkRevoke(req: AuthRequest, res: Response): Promise<void> {
  if (!req.userId) {
    res.status(401).json({ success: false, error: "Unauthorized" });
    return;
  }

  try {
    const bulkRevokeSchema = z.object({
      ids: z.array(z.string().min(1)),
    });
    const { ids } = bulkRevokeSchema.parse(req.body);

    const revoked = await ApiKeyService.bulkRevokeKeys(req.userId, ids);

    res.json({ success: true, data: revoked });
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

