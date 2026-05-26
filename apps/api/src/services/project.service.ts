import * as ProjectModel from "../models/project.model";
import type { ReorderItemsInput } from "../schemas/reorderSchema";

export async function listProjects(userId: string) {
  return ProjectModel.listProjectsByUser(userId);
}

export async function getProject(userId: string, id: string) {
  return ProjectModel.getProjectById(userId, id);
}

export async function createProject(
  userId: string,
  data: Parameters<typeof ProjectModel.createProject>[1],
) {
  return ProjectModel.createProject(userId, data);
}

export async function updateProject(
  userId: string,
  id: string,
  data: Parameters<typeof ProjectModel.updateProject>[2],
) {
  return ProjectModel.updateProject(userId, id, data);
}

export async function deleteProject(userId: string, id: string) {
  return ProjectModel.deleteProject(userId, id);
}

export async function reorderProjects(
  userId: string,
  items: ReorderItemsInput["items"],
) {
  return ProjectModel.reorderProjects(userId, items);
}
