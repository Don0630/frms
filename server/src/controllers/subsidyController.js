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


// ------------- ADD SUBSIDY -------------
export async function saveSubsidy(req, res) {
  try {
    // console.log("req.body:", req.body);
    const newSubsidy = await subsidyService.addSubsidy(req.body);
    return successResponse(res, "Subsidy added successfully", newSubsidy, 201);
  } catch (err) {
    console.error("Error adding Subsidy:", err);
    return errorResponse(res, err.message, 500);
  }
}