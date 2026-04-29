"use client";

import { getSkills } from "@/services/skills";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { AxiosError } from "axios";

export const useSkills = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useQuery<{ id: string; title: string }[]>({
    queryKey: ["skills", userId],
    queryFn: async () => {
      try {
        const res = await getSkills();
        return res.data;
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
