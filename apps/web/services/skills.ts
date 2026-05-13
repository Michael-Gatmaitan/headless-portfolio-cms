import axios from "@/lib/axios";
import { CreateSkillFormValues } from "@/lib/zod-schemas/skills-schema";

export const getSkills = () => {
  return axios.get("/api/skills");
};

export const createSkill = (data: CreateSkillFormValues) => {
  return axios.post("/api/skills", data);
};

export const updateSkill = (id: string, data: any) => {
  return axios.put(`/api/skills/${id}`, data);
};

export const deleteSkill = (id: string) => {
  return axios.delete(`/api/skills/${id}`);
};
