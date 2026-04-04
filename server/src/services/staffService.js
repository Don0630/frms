// services/staffService.js
import * as staffModel from "../models/staffModel.js";


export async function fetchStaffs() {
  return await staffModel.getAllStaff();
}

export async function addStaff(staff) {
  return await staffModel.createStaff(staff);
}

export async function editStaff(id, staff) {
  return await staffModel.updateStaff(id, staff);
}