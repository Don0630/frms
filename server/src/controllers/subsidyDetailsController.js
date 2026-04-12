// controllers/subsidyDetailsController.js
import * as subsidyDetailsService from "../services/subsidyDetailsService.js";
import { successResponse, errorResponse } from "../utils/response.js";


// ------------- GET ALL SUBSIDY DETAILS -------------
export async function getAllSubsidyDetails(req, res, next) {

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


export async function getAvailableFarmer(req, res, next) {
  try {
    const distributionID = req.query.distributionID; // required
    const search = req.query.search || "";
    const availableFarmer = await subsidyDetailsService.fetchAvailableFarmer(distributionID, search);

    if (!availableFarmer || availableFarmer.length === 0) {
      return errorResponse(res, "No available farmer found", 404);
    }

    return successResponse(res, "Available farmer fetched successfully", availableFarmer, 200);
  } catch (err) {
    console.error("Error fetching available farmer:", err);
    next(err);
  }
}



// ------------- ADD FARMER SUBSIDY -------------
export async function saveFarmerSubsidy(req, res) {
  try {
    // console.log("req.body:", req.body);
    const newFarmerSubsidy = await subsidyDetailsService.addFarmerSubsidy(req.body);
    return successResponse(res, "Farmer Subsidy added successfully", newFarmerSubsidy, 201);
  } catch (err) {
    console.error("Error adding Farmer Subsidy:", err);
    return errorResponse(res, err.message, 500);
  }
}



// ------------- UPDATE DISTRIBUTION SUBSIDY -------------
export async function updateDistributeSubsidy(req, res) {
  try {
    console.log("req.body:", req.body);
    const updated = await subsidyDetailsService.editDistributeSubsidy(req.params.id, req.body);
    return successResponse(res, "Distribute Subsidy updated successfully", updated);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}