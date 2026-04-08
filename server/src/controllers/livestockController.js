// controllers/livestockController.js
import * as livestockService from "../services/livestockService.js";
import { successResponse, errorResponse } from "../utils/response.js";


// ------------- GET ALL LIVESTOCK -------------
export async function getAllLivestock(req, res) {

  try {
    const livestocksData = await livestockService.fetchLivestocks();

    if (!livestocksData) {
      return errorResponse(res, "No active record found", 404);
    }
      return successResponse(res, "Livestocks record fetched successfully", livestocksData, 200);
  } catch (err) {
    console.error("Error fetching Livestocks Data:", err);
    next(err);
  }

}


// ------------- ADD LIVESTOCK -------------
export async function saveLivestock(req, res) {
  try {
    // console.log("req.body:", req.body);
    const newLivestock = await livestockService.addLivestock(req.body);
    return successResponse(res, "Livestock added successfully", newLivestock, 201);
  } catch (err) {
    console.error("Error adding Livestock:", err);
    return errorResponse(res, err.message, 500);
  }
}


 