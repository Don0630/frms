// controllers/subsidyController.js
import * as subsidyService from "../services/subsidyService.js";
import { successResponse, errorResponse } from "../utils/response.js";


// ------------- GET ALL SUBSIDY -------------
export async function getAllSubsidy(req, res, next) {

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
export async function saveSubsidy(req, res, next) {
  try {
    console.log("req.body:", req.body);
    const newSubsidy = await subsidyService.addSubsidy(req.body);
    return successResponse(res, "Subsidy added successfully", newSubsidy, 201);
  } catch (err) {
    console.error("Error adding Subsidy:", err);
    return next(err);
  }
}



export async function getAvailableFarmer(req, res, next) {
  try {
    const distributionID = req.query.distributionID;
    const search = req.query.search || "";

    if (!distributionID) {
      return errorResponse(res, "Distribution ID is required", 400);
    }

    const availableFarmer = await subsidyService.fetchAvailableFarmer(
      distributionID,
      search
    );

    // ✅ ALWAYS return 200 even if empty
    return successResponse(
      res,
      "Available farmers fetched successfully",
      availableFarmer || [],
      200
    );

  } catch (err) {
    console.error("Error fetching available farmer:", err);
    return next(err);
  }
}


// ------------- ADD FARMER SUBSIDY -------------
export async function saveDistribution(req, res, next) {
  try {
    // console.log("req.body:", req.body);
    const newDistribution = await subsidyService.addDistribution(req.body);
    return successResponse(res, "Farmer Subsidy added successfully", newDistribution, 201);
  } catch (err) {
    console.error("Error adding Distribution:", err);
    return next(err);
  }
}



// ------------- UPDATE DISTRIBUTION  -------------
export async function updateDistribution(req, res, next) {
  try {
    console.log("req.body:", req.body);
    const updated = await subsidyService.editDistribution(req.params.id, req.body);
    return successResponse(res, "Distribute Subsidy updated successfully", updated, 200);
  } catch (err) {
    console.error("Error updating Farmer Subsidy:", err);
    return next(err);
  }
}



// ------------- DELETE DISTRIBUTION -------------
export async function deleteDistribution(req, res) {
  try {
    const deleted = await subsidyService.removeDistribution(req.params.id);

    if (!deleted.deleted) {
      return errorResponse(res, "Distribution not found", 404);
    }

    return successResponse(res, "Distribution deleted successfully", deleted);
  } catch (err) {
    console.error("Error deleting Farmer Subsidy:", err);
    return next(err);
  }
}



export async function getSubsidyById(req, res, next) {
  try {
    const subsidy = await subsidyService.fetchSubsidyById(req.params.id);

    if (!subsidy) {
      return errorResponse(res, "Subsidy not found", 404);
    }

    return successResponse(
      res,
      "Subsidy fetched successfully",
      subsidy,
      200
    );
  } catch (err) {
    console.error("Error fetching subsidy:", err);
    return next(err);
  }
}