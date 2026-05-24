// controllers/cropController.js
import * as cropService from "../services/cropService.js";
import { successResponse, errorResponse } from "../utils/response.js";


// ------------- GET ALL CROP -------------
export async function getAllCrop(req, res, next) {

  try {
    const cropsData = await cropService.fetchCrops();

    if (!cropsData) {
      return errorResponse(res, "No active record found", 404);
    }
      return successResponse(res, "Crops record fetched successfully", cropsData, 200);
  } catch (err) { 
    return next(err);
  }
} 



// ------------- ADD CROP -------------
export async function saveCrop(req, res, next) {
  try { 
    const newCrop = await cropService.addCrop(req.body);
    return successResponse(res, "Crop added successfully", newCrop, 201);
  } catch (err) { 
    return next(err);
  }
}



// --------- UPDATE CROP ---------
export async function updateCrop(req, res, next) {
  try {
    const updated = await cropService.editCrop(req.params.id, req.body);
    return successResponse(res, "Crop updated successfully", updated);
  } catch (err) { 
    return next(err);
  }
}


// ------------- DELETE CROP -------------
export async function deleteCrop(req, res, next) {
  try {
    await cropService.removeCrop(req.params.id);
    return successResponse(res, "Crop deleted successfully", null, 200);
  } catch (err) { 
    return next(err);
  }
}



// ------------- SEARCH CROP -------------
export async function getSearchCrop(req, res, next) {
  try { 
    const search = req.query.search || "";
    const searchedCrop = await cropService.fetchSearchCrop(search);
    return successResponse(res, "Crop fetched successfully", searchedCrop, 200);
  } catch (err) { 
    return next(err);
  }
}