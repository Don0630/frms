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
  const staff =  await staffModel.insertStaff(staffData);
  return staff;
}


// --------- EDIT STAFF ---------
export async function editStaff(id, staffData) {
  const staffId = parseInt(id);

  const existing = await staffModel.getStaffById(staffId);
  if (!existing) throwError("Staff not found", "NOT_FOUND", 404);

  const staff = await staffModel.updateStaff(id, staffData);
  return staff;
}


// --------- REMOVE STAFF ---------
export async function removeStaff(id) {
  const staffId = parseInt(id);

  const existing = await staffModel.getStaffById(staffId);
  if (!existing) throwError("Staff not found", "NOT_FOUND", 404);

  return await staffModel.deleteStaff(staffId);
}


// Fetch available staff (not yet users), optional search
export async function fetchAvailableStaff(search = "") {
  const staff = await staffModel.getAvailableStaff(search);
  return staff;
}

