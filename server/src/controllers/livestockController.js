// controllers/livestockController.js
import * as livestockService from "../services/livestockService.js";
import { successResponse, errorResponse } from "../utils/response.js";


// ------------- GET ALL LIVESTOCK -------------
export async function getAllLivestock(req, res, next) {

  try {
    const livestocksData = await livestockService.fetchLivestocks();

    if (!livestocksData) {
      return errorResponse(res, "No active record found", 404);
    }
      return successResponse(res, "Livestocks record fetched successfully", livestocksData, 200);
  } catch (err) {
    console.error("Error fetching Livestocks Data:", err);
    return next(err);
  }

}


// ------------- ADD LIVESTOCK -------------
export async function saveLivestock(req, res, next) {
  try {
    // console.log("req.body:", req.body);
    const newLivestock = await livestockService.addLivestock(req.body);
    return successResponse(res, "Livestock added successfully", newLivestock, 201);
  } catch (err) {
    console.error("Error adding Livestock:", err);
    return next(err);
  }
}


// ------------- UPDATE LIVESTOCK -------------
export async function updateLivestock(req, res, next) {
  try {
    const updated = await livestockService.editLivestock(req.params.id, req.body);
    return successResponse(res, "Livestock updated successfully", updated);
  } catch (err) {
    console.error("Error updating Livestock:", err);
    return next(err);
  }
}


// ------------- SEARCH LIVESTOCK -------------
export async function getSearchLivestock(req, res, next) {
  try { 
    const search = req.query.search || "";
    const searchedLivestock = await livestockService.fetchSearchLivestock(search);

    if (!searchedLivestock || searchedLivestock.length === 0) {
      return errorResponse(res, "No Livestock found", 404);
    }
    return successResponse(res, "Livestock fetched successfully", searchedLivestock, 200);
  } catch (err) {
    console.error("Error fetching searched Livestock:", err);
    return next(err);
  }
}


