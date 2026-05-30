"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { AxiosError } from "axios";
import { getDashboardStats } from "@/services/dashboard";

export interface DashboardStats {
  projects: number;
  skills: number;
  awards: number;
}

export const useDashboardStats = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useQuery<DashboardStats>({
    queryKey: ["dashboard-stats", userId],
    queryFn: async () => {
      try {
        const res = await getDashboardStats();
        return res.data.data;
      } catch (err) {
        const error = err as AxiosError;
        if (error.response?.status === 401) {
          return null;
        }
        throw err;
      }
    },
    enabled: !!userId,
    retry: false,
  });
};
