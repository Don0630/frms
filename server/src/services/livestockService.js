// services/livestockService.js
import * as livestockModel from "../models/livestockModel.js";
import { throwError } from "../utils/throwError.js";


export async function fetchLivestocks() {
  return await livestockModel.getAllLivestock();
}


// --------- ADD LIVESTOCK ---------
export async function addLivestock(livestock) {
  const duplicate = await livestockModel.findDuplicateLivestock(
    livestock.Type, livestock.Breed
  );
  if (duplicate) throwError("Livestock already exists!", "DUPLICATE_LIVESTOCK", 409);

  return await livestockModel.createLivestock(livestock);
}

// --------- EDIT LIVESTOCK ---------
export async function editLivestock(id, livestock) {
  const livestockId = parseInt(id);

  const existing = await livestockModel.getLivestockById(livestockId);
  if (!existing) throwError("Livestock not found", "NOT_FOUND", 404);

  const duplicate = await livestockModel.findDuplicateLivestock(
    livestock.Type, livestock.Breed, livestockId
  );
  if (duplicate) throwError("Livestock already exists!", "DUPLICATE_LIVESTOCK", 409);

  return await livestockModel.updateLivestock(livestockId, livestock);
}


// --------- REMOVE LIVESTOCK ---------
export async function removeLivestock(id) {
  const livestockId = parseInt(id);

  const existing = await livestockModel.getLivestockById(livestockId);
  if (!existing) throwError("Livestock not found", "NOT_FOUND", 404);

  return await livestockModel.deleteLivestock(livestockId);
}

export async function fetchSearchLivestock(search = "") {
  return await livestockModel.getSearchLivestock(search);
}
