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




export async function getSearchFarmers(req, res, next) {
  try { 
    const search = req.query.search || "";
    const searchedFarmer = await farmerService.fetchSearchFarmers(search);

    if (!searchedFarmer || searchedFarmer.length === 0) {
      return errorResponse(res, "No farmers found", 404);
    }

    return successResponse(res, "Farmers fetched successfully", searchedFarmer, 200);
  } catch (err) {
    console.error("Error fetching searched farmer:", err);
    next(err);
  }
}