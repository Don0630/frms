// services/farmerService.js
import * as farmerModel from "../models/farmerModel.js";
import { throwError } from "../utils/throwError.js";

// --------- FETCH ALL FARMER ---------
export async function fetchFarmers() {
  return await farmerModel.getAllFarmer();
}


// --------- ADD FARMER ---------
export async function addFarmer(farmer) {
  return await farmerModel.createFarmer(farmer);
}


// --------- EDIT FARMER ---------
export async function editFarmer(id, farmer) {
  const farmerId = parseInt(id);

  const existing = await farmerModel.getFarmerById(farmerId);
  if (!existing) throwError("Farmer not found", "NOT_FOUND", 404);

  return await farmerModel.updateFarmer(farmerId, farmer);
}


// --------- REMOVE FARMER ---------
export async function removeFarmer(id) {
  const farmerId = parseInt(id);

  const existing = await farmerModel.getFarmerById(farmerId);
  if (!existing) throwError("Farmer not found", "NOT_FOUND", 404);

  return await farmerModel.deleteFarmer(farmerId);
}


// --------- ADD FARM ---------
export async function addFarm(farm) {
  return await farmerModel.createFarm(farm);
}


// --------- EDIT FARM ---------
export async function editFarm(id, farm) {
  const farmId = parseInt(id);

  const existing = await farmerModel.getFarmById(farmId);
  if (!existing) throwError("Farm not found", "NOT_FOUND", 404);
  
  return await farmerModel.updateFarm(farmId, farm);
}


// --------- REMOVE FARM ---------
export async function removeFarm(id) {
  const farmId = parseInt(id);

  const existing = await farmerModel.getFarmById(farmId);
  if (!existing) throwError("Farm not found", "NOT_FOUND", 404);

  return await farmerModel.deleteFarm(farmId);
}


export async function fetchSearchFarmer(search = "") {
  return await farmerModel.getSearchFarmer(search);
}

 
export async function fetchFarmerById(id) {
  return await farmerModel.getFarmerById(id);
}