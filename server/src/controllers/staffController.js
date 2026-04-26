// controllers/staffController.js
import * as staffService from "../services/staffService.js";
import { successResponse, errorResponse } from "../utils/response.js";


// ------------- GET ALL STAFF -------------
export async function getAllStaff(req, res, next) {

  try {
    const staffsData = await staffService.fetchStaffs();

    if (!staffsData || staffsData.length === 0) {
      return errorResponse(res, "No active record found", 404);
    }
      return successResponse(res, "Staffs record fetched successfully", staffsData, 200);
  } catch (err) {
    console.error("Error fetching Staffs Data:", err);
    return next(err);
  }

}


// ------------- ADD STAFF -------------
export async function createStaff(req, res, next) {
  try {
    // console.log("req.body:", req.body);
    const newStaff = await staffService.addStaff(req.body);
    return successResponse(res, "Staff added successfully", newStaff, 201);
  } catch (err) {
    console.error("Error adding Staff:", err);
    return next(err);
  }
}



// ------------- UPDATE STAFF -------------
export async function updateStaff(req, res, next) {
  try {
    const staffId = req.params.id;
    const staffData = req.body;

    // ✅ validation (same style as user controller)
    if (!staffId || !staffData) {
      return errorResponse(res, "Missing required fields", 400);
    }

    const updatedStaff = await staffService.editStaff(staffId, staffData);

    return successResponse(
      res,
      "Staff updated successfully",
      updatedStaff,
      200
    );
  } catch (err) {
    console.error("Error updating staff:", err);
    return next(err);
  }
}


// ------------- GET AVAILABLE STAFF (not yet users) -------------
export async function getAvailableStaff(req, res, next) {
  try {
    const search = req.query.search || "";
    const availableStaff = await staffService.fetchAvailableStaff(search);
 

    return successResponse(res, "Available staff fetched successfully", availableStaff, 200);
  } catch (err) {
    console.error("Error fetching available staff:", err);
    return next(err);
  }
}