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






// ------------- GET ALL FARMERS PER SUBSIDY -------------
export async function getAllFarmerPerSubsidy(req, res, next) {
  const { distributionID } = req.params;

  if (!distributionID) {
    return errorResponse(res, "Distribution ID is required", 400);
  }

  try {
    const farmers = await subsidyService.fetchAllFarmerPerSubsidy(distributionID);
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
    const availableFarmer = await subsidyService.fetchAvailableFarmer(distributionID, search);

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
    const newFarmerSubsidy = await subsidyService.addFarmerSubsidy(req.body);
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
    const updated = await subsidyService.editDistributeSubsidy(req.params.id, req.body);
    return successResponse(res, "Distribute Subsidy updated successfully", updated);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}



