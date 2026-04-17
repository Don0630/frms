// services/subsidyService.js
import * as subsidyModel from "../models/subsidyModel.js";

export async function fetchSubsidies() {
  return await subsidyModel.getAllSubsidy();
}

export async function addSubsidy(subsidy) {
  return await subsidyModel.createSubsidy(subsidy);
}



export async function fetchAllFarmerPerSubsidy(distributionID) {
  return await subsidyModel.getAllFarmerPerSubsidy(distributionID);
}


export async function fetchAvailableFarmer(distributionID, search = "") {
  return await subsidyModel.getAvailableFarmer(distributionID, search);
}


export async function addFarmerSubsidy(farmerSubsidy) {
  return await subsidyModel.createFarmerSubsidy(farmerSubsidy);
}


export async function editDistributeSubsidy(id, data) {
  return await subsidyModel.distributeSubsidy(id, data);
}
