import type { Response, NextFunction } from "express";
import type { AuthRequest } from "./auth.middleware";
import { verifyApiKey } from "../services/apiKey.service";

export async function authenticateApiKey(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const rawKey = req.headers["x-api-key"];

  if (!rawKey || typeof rawKey !== "string") {
    res.status(401).json({ success: false, error: "Missing X-API-Key header" });
    return;
  }

  const keyRow = await verifyApiKey(rawKey);

  if (!keyRow) {
    res.status(401).json({ success: false, error: "Invalid or revoked API key" });
    return;
  }

  req.userId = keyRow.userId;
  next();
}
