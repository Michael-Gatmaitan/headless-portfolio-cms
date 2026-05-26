import axios from "@/lib/axios";
import { CreateAwardFormValues } from "@/lib/zod-schemas/awards-schema";
import type { ReorderItem } from "@portfolio-types/shared";

export const getAwards = () => {
  return axios.get("/api/awards");
};

export const createAward = (data: CreateAwardFormValues) => {
  return axios.post("/api/awards", data);
};

export const deleteAward = (id: string) => {
  return axios.delete(`/api/awards/${id}`);
};

export const updateAward = (id: string, data: CreateAwardFormValues) => {
  return axios.put(`/api/awards/${id}`, data);
};

export const reorderAwards = (items: ReorderItem[]) => {
  return axios.put("/api/awards/reorder", { items });
};
