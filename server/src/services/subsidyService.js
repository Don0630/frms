// services/subsidyService.js
import * as subsidyModel from "../models/subsidyModel.js";


// ------------------ FETCH ALL SUBSIDIES ------------------
export async function fetchSubsidies() {
  return await subsidyModel.getAllSubsidy();
}


// ------------------ ADD SUBSIDY ------------------
export async function addSubsidy(subsidy) {
  return await subsidyModel.createSubsidy(subsidy);
}


// ------------------ FETCH ALL FARMER PER SUBSIDY ------------------
export async function fetchAllFarmerPerSubsidy(distributionID) {
  return await subsidyModel.getAllFarmerPerSubsidy(distributionID);
}

// ------------------ FETCH AVAILABLE FARMERS (SEARCH) ------------------
export async function fetchAvailableFarmer(distributionID, search = "") {
  return await subsidyModel.getAvailableFarmer(distributionID, search);
}

// ------------------ ADD FARMER SUBSIDY ------------------
export async function addFarmerSubsidy(farmerSubsidy) {
  return await subsidyModel.createFarmerSubsidy(farmerSubsidy);
}

// ------------------ EDIT DISTRIBUTION ------------------
export async function editDistribution(id, distribution) {
  return await subsidyModel.updateDistribution(id, distribution);
}

// ------------------ REMOVE DISTRIBUTION ------------------
export async function removeDistribution(id) {
  return await subsidyModel.deleteDistribution(id);
}