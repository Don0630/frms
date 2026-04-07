// controllers/subsidyDetailsController.js
import * as subsidyDetailsService from "../services/subsidyDetailsService.js";
import { successResponse, errorResponse } from "../utils/response.js";


// ------------- GET ALL SUBSIDY DETAILS -------------
export async function getAllSubsidyDetails(req, res) {

  try {
    const subsidyDetailsData = await subsidyDetailsService.fetchSubsidyDetails();
    // console.log(subsidyDetailsData);
    if (!subsidyDetailsData) {
      return errorResponse(res, "No active record found", 404);
    }
      return successResponse(res, "Subsidy Details record fetched successfully", subsidyDetailsData, 200);
  } catch (err) {
    console.error("Error fetching Subsidy Details Data:", err);
    next(err);
  }

}


// ------------- GET ALL FARMERS PER SUBSIDY -------------
export async function getAllFarmerPerSubsidy(req, res, next) {
  const { distributionID } = req.params;

  if (!distributionID) {
    return errorResponse(res, "Distribution ID is required", 400);
  }

  try {
    const farmers = await subsidyDetailsService.fetchAllFarmerPerSubsidy(distributionID);
    if (!farmers || farmers.length === 0) {
      return errorResponse(res, "No farmers found for this distribution", 404);
    }
    return successResponse(res, "Farmers fetched successfully", farmers, 200);
  } catch (err) {
    console.error(`Error fetching farmers for DistributionID ${distributionID}:`, err);
    next(err);
  }
}