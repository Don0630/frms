// controllers/farmerController.js
import * as farmerService from "../services/farmerService.js";
import { successResponse, errorResponse } from "../utils/response.js";


// ------------- GET ALL FARMER -------------
export async function getAllFarmer(req, res) {

  try {
    const farmersData = await farmerService.fetchFarmers();

    if (!farmersData) {
      return errorResponse(res, "No active record found", 404);
    }
      return successResponse(res, "Staffs record fetched successfully", farmersData, 200);
  } catch (err) {
    console.error("Error fetching Staffs Data:", err);
    next(err);
  }

}
 