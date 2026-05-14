import axios from "@/lib/axios";
import { CreateAwardFormValues } from "@/lib/zod-schemas/awards-schema";

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
