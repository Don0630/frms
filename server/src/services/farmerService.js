// services/farmerService.js
import * as farmerModel from "../models/farmerModel.js";
import { throwError } from "../utils/throwError.js";

// --------- FETCH ALL FARMER ---------
export async function fetchFarmers() {
  return await farmerModel.getAllFarmer();
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


// --------- REMOVE FARMER ---------
export async function removeFarmer(id) {
  const farmerId = parseInt(id);

  const existing = await farmerModel.getFarmerById(farmerId);
  if (!existing) throwError("Farmer not found", "NOT_FOUND", 404);

  return await farmerModel.deleteFarmer(farmerId);
}


// --------- ADD FARM ---------
export async function addFarm(farm) {
  const duplicate = await farmerModel.findDuplicateFarm(
    farm.FarmerID, farm.FarmBarangay, farm.FarmMunicipality, farm.FarmProvince
  );
  if (duplicate) throwError("Farm already exists!", "DUPLICATE_FARM", 409);

  return await farmerModel.createFarm(farm);
}


// --------- EDIT FARM ---------
export async function editFarm(id, farm) {
  const farmId = parseInt(id);

  const existing = await farmerModel.getFarmById(farmId);
  if (!existing) throwError("Farm not found", "NOT_FOUND", 404);
  const farmerId = parseInt(existing.FarmerID);
  
console.log(existing.FarmerID, farm.FarmBarangay, farm.FarmMunicipality, farm.FarmProvince, farmId);

  const duplicate = await farmerModel.findDuplicateFarm(farmerId, farm.FarmBarangay, farm.FarmMunicipality, farm.FarmProvince, 0);
  if (duplicate) throwError("Farm already exists!", "DUPLICATE_FARM", 409);

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