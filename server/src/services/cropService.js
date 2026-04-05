// services/cropService.js
import * as cropModel from "../models/cropModel.js";


export async function fetchCrops() {
  return await cropModel.getAllCrop();
}

export async function addCrop(crop) {
  return await cropModel.createCrop(crop);
}
