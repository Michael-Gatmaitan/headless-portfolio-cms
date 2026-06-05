import * as JobModel from "../models/job.model";

export const listJobs = async (userId: string) => {
  return JobModel.listJobsByUser(userId);
};

export const getJob = async (userId: string, id: string) => {
  return JobModel.getJobById(userId, id);
};

export const createJob = async (
  userId: string,
  data: Parameters<typeof JobModel.createJob>[1],
) => {
  return JobModel.createJob(userId, data);
};

export const updateJob = async (
  userId: string,
  id: string,
  data: Parameters<typeof JobModel.updateJob>[2],
) => {
  return JobModel.updateJob(userId, id, data);
};

export const deleteJob = async (userId: string, id: string) => {
  return JobModel.deleteJob(userId, id);
};
