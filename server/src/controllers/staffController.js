// controllers/staffController.js
import * as staffService from "../services/staffService.js";
import { successResponse, errorResponse } from "../utils/response.js";


// ------------- GET ALL STAFF -------------
export async function getAllStaff(req, res) {

  try {
    const staffsData = await staffService.fetchStaffs();

    if (!staffsData) {
      return errorResponse(res, "No active record found", 404);
    }
      return successResponse(res, "Staffs record fetched successfully", staffsData, 200);
  } catch (err) {
    console.error("Error fetching Staffs Data:", err);
    next(err);
  }

}


// ------------- ADD STAFF -------------
export async function saveStaff(req, res) {
  try {
    // console.log("req.body:", req.body);
    const newStaff = await staffService.addStaff(req.body);
    return successResponse(res, "Staff added successfully", newStaff, 201);
  } catch (err) {
    console.error("Error adding Staff:", err);
    return errorResponse(res, err.message, 500);
  }
}

// ------------- UPDATE STAFF -------------
export async function updateStaff(req, res) {
  try {
    const updated = await staffService.editStaff(req.params.id, req.body);
    return successResponse(res, "Staff updated successfully", updated);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}