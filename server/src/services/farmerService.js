// services/farmerService.js
import * as farmerModel from "../models/farmerModel.js";
import { throwError } from "../utils/throwError.js";

// --------- FETCH ALL FARMER ---------
export async function fetchFarmers() {
  const farmers = await farmerModel.getAllFarmer();

  if (!farmers || farmers.length === 0) {
    throwError("No farmer records found!", "NOT_FOUND", 404);
  }
  return farmers;
}


// --------- ADD FARMER ---------
export async function addFarmer(farmer) {

  const duplicateFarmer = await farmerModel.findDuplicateFarmer(farmer.FirstName, farmer.MiddleName, farmer.LastName);
  if (duplicateFarmer) {
    throwError("Farmer already exists!", "DUPLICATE_ENTRY", 409);
  }

  const duplicateContact = await farmerModel.findDuplicateContact(farmer.ContactNumber);
  if (duplicateContact) {
    throwError("Contact number already exists!", "DUPLICATE_ENTRY", 409);
  }

  const duplicateEmail = await farmerModel.findDuplicateEmail(farmer.Email);
  if (duplicateEmail) {
    throwError("Email address already exists!", "DUPLICATE_ENTRY", 409);
  }

  return await farmerModel.createFarmer(farmer);
}


// --------- EDIT FARMER ---------
export async function editFarmer(id, farmer) {
  const farmerId = parseInt(id);

  const existing = await farmerModel.getFarmerById(farmerId);
  if (!existing) throwError("Farmer not found", "NOT_FOUND", 404);

  if (farmer.FirstName && farmer.LastName) {
    const duplicateFarmer = await farmerModel.findDuplicateFarmer(
      farmer.FirstName, farmer.MiddleName, farmer.LastName, farmerId
    );
    if (duplicateFarmer) throwError("Farmer already exists!", "DUPLICATE_FARMER", 409);
  }

  if (farmer.Email) {
    const duplicateEmail = await farmerModel.findDuplicateEmail(farmer.Email, farmerId);
    if (duplicateEmail) throwError("Email already exists!", "DUPLICATE_EMAIL", 409);
  }

  if (farmer.ContactNumber) {
    const duplicateContact = await farmerModel.findDuplicateContact(farmer.ContactNumber, farmerId);
    if (duplicateContact) throwError("Contact number already exists!", "DUPLICATE_CONTACT", 409);
  }

  return await farmerModel.updateFarmer(farmerId, farmer);
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

export async function fetchSearchFarmer(search = "") {
  return await farmerModel.getSearchFarmer(search);
}

 
export async function fetchFarmerById(id) {
  return await farmerModel.getFarmerById(id);
}