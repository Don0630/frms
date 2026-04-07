// services/farmerService.js
import * as farmerModel from "../models/farmerModel.js";


export async function fetchFarmers() {
  return await farmerModel.getAllFarmer();
}


export async function addFarmer(farmer) {
  return await farmerModel.createFarmer(farmer);
}


export async function fetchAvailableFarmer(distributionID, search = "") {
  return await farmerModel.getAvailableFarmer(distributionID, search);
}