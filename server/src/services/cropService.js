// services/cropService.js
import * as cropModel from "../models/cropModel.js";


export async function fetchCrops() {
  return await cropModel.getAllCrop();
}

export async function addCrop(crop) {
  return await cropModel.createCrop(crop);
}


export async function editCrop(id, crop) {
  return await cropModel.updateCrop(id, crop);
}


export async function fetchSearchCrops(search = "") {
  return await cropModel.getSearchCrops(search);
}
