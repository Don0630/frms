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

 
// ------------------ FETCH AVAILABLE FARMERS (SEARCH) ------------------
export async function fetchAvailableFarmer(distributionID, search = "") {
  return await subsidyModel.getAvailableFarmer(distributionID, search);
}

// ------------------ ADD DISTRIBUTION ------------------
export async function addDistribution(distribution) {
  return await subsidyModel.createDistribution(distribution);
}

// ------------------ EDIT DISTRIBUTION ------------------
export async function editDistribution(id, distribution) {
  return await subsidyModel.updateDistribution(id, distribution);
}

// ------------------ REMOVE DISTRIBUTION ------------------
export async function removeDistribution(id) {
  return await subsidyModel.deleteDistribution(id);
}


export async function fetchSubsidyById(id) {
  return await subsidyModel.getSubsidyById(id);
}