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
      return successResponse(res, "Farmers record fetched successfully", farmersData, 200);
  } catch (err) {
    console.error("Error fetching Farmers Data:", err);
    next(err);
  }

}
 


// ------------- ADD Farmer -------------
export async function saveFarmer(req, res) {
  try {
    // console.log("req.body:", req.body);
    const newFarmer = await farmerService.addFarmer(req.body);
    return successResponse(res, "Farmer added successfully", newFarmer, 201);
  } catch (err) {
    console.error("Error adding Farmer:", err);
    return errorResponse(res, err.message, 500);
  }
}



export async function getAvailableFarmer(req, res, next) {
  try {
    const distributionID = req.query.distributionID; // required
    const search = req.query.search || "";
    const availableFarmer = await farmerService.fetchAvailableFarmer(distributionID, search);

    if (!availableFarmer || availableFarmer.length === 0) {
      return errorResponse(res, "No available farmer found", 404);
    }

    return successResponse(res, "Available farmer fetched successfully", availableFarmer, 200);
  } catch (err) {
    console.error("Error fetching available farmer:", err);
    next(err);
  }
}