// controllers/farmerController.js
import * as farmerService from "../services/farmerService.js";
import { successResponse, errorResponse } from "../utils/response.js";


// ------------- GET ALL FARMER -------------
export async function getAllFarmer(req, res, next) {

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



// ------------- UPDATE FARMER -------------
export async function updateFarmer(req, res) {
  try {
    const updated = await farmerService.editFarmer(req.params.id, req.body);
    return successResponse(res, "Farmer updated successfully", updated);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}





// ------------- ADD Farm -------------
export async function saveFarm(req, res) {
  try {
    // console.log("req.body:", req.body);
    const newFarm = await farmerService.addFarm(req.body);
    return successResponse(res, "Farm added successfully", newFarm, 201);
  } catch (err) {
    console.error("Error adding Farm:", err);
    return errorResponse(res, err.message, 500);
  }
}


// ------------- UPDATE FARM -------------
export async function updateFarm(req, res) {
  try {
    const updated = await farmerService.editFarm(req.params.id, req.body);
    return successResponse(res, "Farm updated successfully", updated);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}



// ------------- DELETE FARM -------------
export async function deleteFarm(req, res) {
  try {
    const deleted = await farmerService.removeFarm(req.params.id);

    if (!deleted.deleted) {
      return errorResponse(res, "Farm not found", 404);
    }

    return successResponse(res, "Farm deleted successfully", deleted);
  } catch (err) {
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