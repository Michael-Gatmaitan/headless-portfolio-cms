import axios from "@/lib/axios";
import { CreateJobFormValues, EditJobFormValues } from "@/lib/zod-schemas/jobs-schema";

export const getJobs = () => {
  return axios.get("/api/jobs");
};

export const getJobById = (id: string) => {
  return axios.get(`/api/jobs/${id}`);
};

export const createJob = (data: CreateJobFormValues) => {
  return axios.post("/api/jobs", data);
};

export const updateJob = (id: string, data: EditJobFormValues) => {
  return axios.put(`/api/jobs/${id}`, data);
};

export const deleteJob = (id: string) => {
  return axios.delete(`/api/jobs/${id}`);
};
