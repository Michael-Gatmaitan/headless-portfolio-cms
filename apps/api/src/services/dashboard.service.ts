import * as DashboardModel from "../models/dashboard.model";

export async function getUserStats(userId: string) {
  return DashboardModel.getUserStats(userId);
}
