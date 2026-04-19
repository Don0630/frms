// controllers/cropController.js
import * as cropService from "../services/cropService.js";
import { successResponse, errorResponse } from "../utils/response.js";


// ------------- GET ALL CROP -------------
export async function getAllCrop(req, res) {

  try {
    const cropsData = await cropService.fetchCrops();

    if (!cropsData) {
      return errorResponse(res, "No active record found", 404);
    }
      return successResponse(res, "Crops record fetched successfully", cropsData, 200);
  } catch (err) {
    console.error("Error fetching Crops Data:", err);
    next(err);
  }
} 



// ------------- ADD CROP -------------
export async function saveCrop(req, res) {
  try {
    // console.log("req.body:", req.body);
    const newCrop = await cropService.addCrop(req.body);
    return successResponse(res, "Crop added successfully", newCrop, 201);
  } catch (err) {
    console.error("Error adding Crop:", err);
    return errorResponse(res, err.message, 500);
  }
}



// --------- UPDATE CROP ---------
export async function updateCrop(req, res) {
  try {
    const updated = await cropService.editCrop(req.params.id, req.body);
    return successResponse(res, "Crop updated successfully", updated);
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
}




// ------------- SEARCH CROP -------------
export async function getSearchCrops(req, res, next) {
  try { 
    const search = req.query.search || "";
    const searchedCrops = await cropService.fetchSearchCrops(search);

    if (!searchedCrops || searchedCrops.length === 0) {
      return errorResponse(res, "No Crops found", 404);
    }
    return successResponse(res, "Crops fetched successfully", searchedCrops, 200);
  } catch (err) {
    console.error("Error fetching searched crops:", err);
    next(err);
  }
}