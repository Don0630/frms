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
    return next(err);
  }

}
 


// ------------- ADD Farmer -------------
export async function saveFarmer(req, res, next) {
  try {
    // console.log("req.body:", req.body);
    const newFarmer = await farmerService.addFarmer(req.body);
    return successResponse(res, "Farmer added successfully", newFarmer, 201);
  } catch (err) {
    console.error("Error adding Farmer:", err);
    return next(err);
  }
}



// ------------- UPDATE FARMER -------------
export async function updateFarmer(req, res, next) {
  try {
    const updated = await farmerService.editFarmer(req.params.id, req.body);
    return successResponse(res, "Farmer updated successfully", updated);
  } catch (err) {
    console.error("Error updating Farmer:", err);
    return next(err);
  }
}





// ------------- ADD Farm -------------
export async function saveFarm(req, res, next) {
  try {
    // console.log("req.body:", req.body);
    const newFarm = await farmerService.addFarm(req.body);
    return successResponse(res, "Farm added successfully", newFarm, 201);
  } catch (err) {
    console.error("Error adding Farm:", err);
    return next(err);
  }
}


// ------------- UPDATE FARM -------------
export async function updateFarm(req, res, next) {
  try {
    const updated = await farmerService.editFarm(req.params.id, req.body);
    return successResponse(res, "Farm updated successfully", updated);
  } catch (err) {
    console.error("Error updating Farm:", err);
    return next(err);
  }
}



// ------------- DELETE FARM -------------
export async function deleteFarm(req, res, next) {
  try {
    const deleted = await farmerService.removeFarm(req.params.id);

    if (!deleted.deleted) {
      return errorResponse(res, "Farm not found", 404);
    }

    return successResponse(res, "Farm deleted successfully", deleted);
  } catch (err) {
    console.error("Error deleting Farm:", err);
    return next(err);
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
    return next(err);
  }
}

 

export async function getFarmerById(req, res) {
  try {
    const { id } = req.params;

    const farmer = await farmerService.fetchFarmerById(id);

    if (!farmer) {
      return res.status(404).json({
        message: "Farmer not found",
      });
    }

    res.json(farmer);
  } catch (err) {
    console.error("Get Farmer By ID Error:", err);
    res.status(500).json({ message: "Server error" });
  }
}