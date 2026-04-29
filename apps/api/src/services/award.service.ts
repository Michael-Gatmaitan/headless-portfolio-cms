import * as AwardModel from "../models/award.model";

export async function listAwards(userId: string) {
  return AwardModel.listAwardsByUser(userId);
}

export async function getAward(userId: string, id: string) {
  return AwardModel.getAwardById(userId, id);
}

export async function createAward(
  userId: string,
  data: Parameters<typeof AwardModel.createAward>[1],
) {
  return AwardModel.createAward(userId, data);
}

export async function updateAward(
  userId: string,
  id: string,
  data: Parameters<typeof AwardModel.updateAward>[2],
) {
  return AwardModel.updateAward(userId, id, data);
}

export async function deleteAward(userId: string, id: string) {
  return AwardModel.deleteAward(userId, id);
}
