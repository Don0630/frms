// services/farmerService.js
import * as farmerModel from "../models/farmerModel.js";


export async function fetchFarmers() {
  return await farmerModel.getAllFarmer();
}


export async function addFarmer(farmer) {
  return await farmerModel.createFarmer(farmer);
}


export async function editFarmer(id, farmer) {
  return await farmerModel.updateFarmer(id, farmer);
}


export async function addFarm(farm) {
  return await farmerModel.createFarm(farm);
}


export async function editFarm(id, farm) {
  return await farmerModel.updateFarm(id, farm);
}


export async function removeFarm(id) {
  return await farmerModel.deleteFarm(id);
}

export async function fetchSearchFarmers(search = "") {
  return await farmerModel.getSearchFarmers(search);
}