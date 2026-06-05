"use client";

import { createJob, deleteJob, getJobs, updateJob } from "@/services/jobs";
import { CreateJobFormValues, EditJobFormValues } from "@/lib/zod-schemas/jobs-schema";
import { Job } from "@portfolio-types/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export const useJobs = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useQuery<Job[]>({
    queryKey: ["jobs", userId],
    queryFn: async () => {
      try {
        const res = await getJobs();
        return res.data.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            return null;
          }
          toast.error("Failed to fetch jobs");
        }
        return [];
      }
    },
    enabled: !!userId,
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useMutation({
    mutationFn: async (data: CreateJobFormValues) => createJob(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", userId] });
      toast.success("Job application created successfully");
    },
    onError: () => {
      toast.error("Failed to create job application");
    },
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: EditJobFormValues }) =>
      updateJob(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", userId] });
      toast.success("Job application updated successfully");
    },
    onError: () => {
      toast.error("Failed to update job application");
    },
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useMutation({
    mutationFn: (id: string) => deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", userId] });
      toast.success("Job application deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete job application");
    },
  });
};
