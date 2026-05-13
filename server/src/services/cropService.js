// services/cropService.js
import * as cropModel from "../models/cropModel.js";
import { throwError } from "../utils/throwError.js";

export async function fetchCrops() {
  return await cropModel.getAllCrop();
}


// --------- ADD CROP ---------
export async function addCrop(crop) {
  const duplicate = await cropModel.findDuplicateCrop(crop.CropName);
  if (duplicate) throwError("Crop already exists!", "DUPLICATE_CROP", 409);

  return await cropModel.createCrop(crop);
}


// --------- EDIT CROP ---------
export async function editCrop(id, crop) {
  const cropId = parseInt(id);

  const existing = await cropModel.getCropById(cropId);
  if (!existing) throwError("Crop not found", "NOT_FOUND", 404);

  const duplicate = await cropModel.findDuplicateCrop(crop.CropName, cropId);
  if (duplicate) throwError("Crop already exists!", "DUPLICATE_CROP", 409);

  return await cropModel.updateCrop(cropId, crop);
}


export async function fetchSearchCrop(search = "") {
  return await cropModel.getSearchCrop(search);
}
