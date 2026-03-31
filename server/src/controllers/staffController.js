// controllers/staffController.js
import { fetchStaffs } from "../services/staffService.js";
import { successResponse, errorResponse } from "../utils/response.js";


export async function getAllStaff(req, res) {

  try {
    const staffsData = await fetchStaffs();

    if (!staffsData) {
      return errorResponse(res, "No active record found", 404);
    }
      return successResponse(res, "Staffs record fetched successfully", staffsData, 200);
  } catch (err) {
    console.error("Error fetching Staffs Data:", err);
    // next(err);
  }

}


 