// services/staffService.js
import * as staffModel from "../models/staffModel.js";


export async function fetchStaffs() {
   const staff = await staffModel.getAllStaff();
  return staff;
}

export async function addStaff(staffData) {
  const staff =  await staffModel.insertStaff(staffData);
  return staff;
}

export async function editStaff(id, staffData) {
  const staff = await staffModel.updateStaff(id, staffData);
  return staff;
}

// Fetch available staff (not yet users), optional search
export async function fetchAvailableStaff(search = "") {
  const staff = await staffModel.getAvailableStaff(search);
  return staff;
}