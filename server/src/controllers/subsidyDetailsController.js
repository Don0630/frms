// controllers/subsidyDetailsController.js
import * as subsidyDetailsService from "../services/subsidyDetailsService.js";
import { successResponse, errorResponse } from "../utils/response.js";


// ------------- GET ALL SUBSIDY DETAILS -------------
export async function getAllSubsidyDetails(req, res) {

  try {
    const subsidyDetailsData = await subsidyDetailsService.fetchSubsidyDetails();
    console.log(subsidyDetailsData);
    if (!subsidyDetailsData) {
      return errorResponse(res, "No active record found", 404);
    }
      return successResponse(res, "Subsidy Details record fetched successfully", subsidyDetailsData, 200);
  } catch (err) {
    console.error("Error fetching Subsidy Details Data:", err);
    next(err);
  }

}

 