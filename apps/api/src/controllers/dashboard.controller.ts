import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware";
import * as DashboardService from "../services/dashboard.service";

export async function getStats(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }

    const stats = await DashboardService.getUserStats(req.userId);
    res.json({ success: true, data: stats });
  } catch (err: any) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}
