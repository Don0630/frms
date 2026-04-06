// controllers/subsidyController.js
import * as subsidyService from "../services/subsidyService.js";
import { successResponse, errorResponse } from "../utils/response.js";


// ------------- GET ALL SUBSIDY -------------
export async function getAllSubsidy(req, res) {

  try {
    const subsidyData = await subsidyService.fetchSubsidies();

    if (!subsidyData) {
      return errorResponse(res, "No active record found", 404);
    }
      return successResponse(res, "Subsidies record fetched successfully", subsidyData, 200);
  } catch (err) {
    console.error("Error fetching Subsidy Data:", err);
    next(err);
  }

}
 