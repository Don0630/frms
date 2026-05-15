// services/staffService.js
import * as staffModel from "../models/staffModel.js";
import { throwError } from "../utils/throwError.js";


// --------- FETCH ALL STAFF ---------
export async function fetchStaffs() {
   const staff = await staffModel.getAllStaff();
  return staff;
}

// --------- ADD STAFF ---------
export async function addStaff(staffData) {
  
  const duplicate = await staffModel.findDuplicateStaff(staffData.FirstName, staffData.MiddleName, staffData.LastName);
  if (duplicate) throwError("A staff with the same name already exists.", "DUPLICATE", 409);

  const dupContact = await staffModel.findDuplicateStaffContact(staffData.ContactNumber);
  if (dupContact) throwError("Contact number is already in use.", "DUPLICATE", 409);

  const dupEmail = await staffModel.findDuplicateStaffEmail(staffData.Email);
  if (dupEmail) throwError("Email is already in use.", "DUPLICATE", 409);
  
  const staff =  await staffModel.insertStaff(staffData);
  return staff;
}


// --------- EDIT STAFF ---------
export async function editStaff(id, staffData) {
  const staffId = parseInt(id);

  const duplicate = await staffModel.findDuplicateStaff(staffData.FirstName, staffData.MiddleName, staffData.LastName, staffId);
  if (duplicate) throwError("A staff with the same name already exists.", "DUPLICATE", 409);

  const dupContact = await staffModel.findDuplicateStaffContact(staffData.ContactNumber, staffId);
  if (dupContact) throwError("Contact number is already in use.", "DUPLICATE", 409);

  const dupEmail = await staffModel.findDuplicateStaffEmail(staffData.Email, staffId);
  if (dupEmail) throwError("Email is already in use.", "DUPLICATE", 409);

  const staff = await staffModel.updateStaff(id, staffData);
  return staff;
}

// Fetch available staff (not yet users), optional search
export async function fetchAvailableStaff(search = "") {
  const staff = await staffModel.getAvailableStaff(search);
  return staff;
}