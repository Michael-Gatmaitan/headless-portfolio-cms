import * as SkillModel from "../models/skill.model";

export async function listSkills(userId: string) {
  return SkillModel.listSkillsByUser(userId);
}

export async function getSkill(userId: string, id: string) {
  return SkillModel.getSkillById(userId, id);
}

export async function createSkill(
  userId: string,
  data: Parameters<typeof SkillModel.createSkill>[1],
) {
  return SkillModel.createSkill(userId, data);
}

export async function updateSkill(
  userId: string,
  id: string,
  data: Parameters<typeof SkillModel.updateSkill>[2],
) {
  return SkillModel.updateSkill(userId, id, data);
}

export async function deleteSkill(userId: string, id: string) {
  return SkillModel.deleteSkill(userId, id);
}
