import axios from "@/lib/axios";

export const getDashboardStats = () => {
  return axios.get("/api/dashboard/stats");
};
