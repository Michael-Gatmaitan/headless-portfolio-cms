"use client";
import axios from "@/lib/axios";
import { CreateApiKeyFormValues } from "@/lib/zod-schemas/api-keys-schema";
import { createApiKey, getApiKeys, revokeApiKey, bulkRevokeApiKeys } from "@/services/api-keys";
import { ApiKey } from "@portfolio-types/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export const useApiKeys = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useQuery<ApiKey[]>({
    queryKey: ["api-keys", userId],
    queryFn: async () => {
      try {
        const res = await getApiKeys();

        return res.data.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            return null;
          }
          toast.error("Failed to fetch api keys");
        }
        return [];
      }
    },
  });
};

export const useCreateApiKey = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useMutation({
    mutationFn: async (data: CreateApiKeyFormValues) => createApiKey(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys", userId] });
      toast.success("Api key created successfully");
    },
    onError: () => {
      toast.error("Failed to create api key");
    },
  });
};

export const useRevokeApiKey = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useMutation({
    mutationFn: (id: string) => revokeApiKey(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys", userId] });
      toast.success("API key revoked successfully");
    },
    onError: () => {
      toast.error("Failed to revoke API key");
    },
  });
};

export const useBulkRevokeApiKeys = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useMutation({
    mutationFn: (ids: string[]) => bulkRevokeApiKeys(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys", userId] });
      toast.success("Selected API keys revoked successfully");
    },
    onError: () => {
      toast.error("Failed to revoke selected API keys");
    },
  });
};

