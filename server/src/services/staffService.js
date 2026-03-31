// services/staffService.js
import { getAllStaff } from "../models/staffModel.js";

export async function fetchStaffs() {
  return await getAllStaff();
}