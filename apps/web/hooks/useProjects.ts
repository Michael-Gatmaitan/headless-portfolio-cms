"use client";

import { createProject, updateProject, getProjects } from "@/services/projects";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { AxiosError } from "axios";
import {
  CreateProjectFormValues,
  EditProjectFormValues,
} from "@/lib/zod-schemas/projects-schema";
import { toast } from "sonner";
import { Project } from "@portfolio-types/shared";

export const useProjects = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useQuery<Project[]>({
    queryKey: ["projects", userId],
    queryFn: async () => {
      try {
        const res = await getProjects();
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

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useMutation({
    mutationFn: (project: CreateProjectFormValues) => createProject(project),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", userId] });
      toast.success("Project created successfully");
    },
    onError: () => {
      toast.error("Failed to create project");
    },
  });
};

export const useEditProject = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: EditProjectFormValues }) =>
      updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", userId] });
      toast.success("Project updated successfully");
    },
    onError: () => {
      toast.error("Failed to update project");
    },
  });
};
