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

 