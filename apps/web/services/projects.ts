import axios from "@/lib/axios";
import { CreateProjectFormValues } from "@/lib/zod-schemas/projects-schema";
import type { ReorderItem } from "@portfolio-types/shared";

export const getProjects = () => {
  return axios.get("/api/projects");
};

export const getProjectById = (id: string) => {
  return axios.get(`/api/projects/${id}`);
};

export const createProject = (data: CreateProjectFormValues) => {
  return axios.post("/api/projects", data);
};

export const updateProject = (id: string, data: any) => {
  return axios.put(`/api/projects/${id}`, data);
};

export const deleteProject = (id: string) => {
  return axios.delete(`/api/projects/${id}`);
};

export const reorderProjects = (items: ReorderItem[]) => {
  return axios.put("/api/projects/reorder", { items });
};
