"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { AxiosError } from "axios";
import { toast } from "sonner";

import {
  createAward,
  deleteAward,
  getAwards,
  updateAward,
} from "@/services/awards";
import { CreateAwardFormValues } from "@/lib/zod-schemas/awards-schema";
import { Award } from "@portfolio-types/shared";

export const useAwards = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useQuery<Award[]>({
    queryKey: ["awards", userId],
    queryFn: async () => {
      try {
        const res = await getAwards();

        console.log("AWARDS: ", res.data.data);
        return res.data.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            return null;
          }
          toast.error("Failed to fetch awards");
        }
        return [];
      }
    },
    enabled: !!userId,
    retry: false,
  });
};

export const useCreateAward = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useMutation({
    mutationFn: (award: CreateAwardFormValues) => createAward(award),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["awards", userId] });
      toast.success("Award created successfully");
    },
    onError: () => {
      toast.error("Failed to create award");
    },
  });
};

export const useUpdateAward = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateAwardFormValues }) =>
      updateAward(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["awards", userId] });
      toast.success("Award updated successfully");
    },
    onError: () => {
      toast.error("Failed to update award");
    },
  });
};

export const useDeleteAward = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useMutation({
    mutationFn: (id: string) => deleteAward(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["awards", userId] });
      toast.success("Award deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete award");
    },
  });
};
