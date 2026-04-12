// services/subsidyDetailsService.js
import * as subsidyDetailsModel from "../models/subsidyDetailsModel.js";


export async function fetchSubsidyDetails() { 
  return await subsidyDetailsModel.getAllSubsidyDetails();
}


export async function fetchAllFarmerPerSubsidy(distributionID) {
  return await subsidyDetailsModel.getAllFarmerPerSubsidy(distributionID);
}


export async function fetchAvailableFarmer(distributionID, search = "") {
  return await subsidyDetailsModel.getAvailableFarmer(distributionID, search);
}


export async function addFarmerSubsidy(farmerSubsidy) {
  return await subsidyDetailsModel.createFarmerSubsidy(farmerSubsidy);
}


export async function editDistributeSubsidy(id, data) {
  return await subsidyDetailsModel.distributeSubsidy(id, data);
}
