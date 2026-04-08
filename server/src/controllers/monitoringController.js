// controllers/monitoringController.js
import * as monitoringService from "../services/monitoringService.js";
import { successResponse, errorResponse } from "../utils/response.js";


// ------------- GET ALL MONITORING -------------
export async function getAllMonitoring(req, res, next) {

  try {
    const monitoringsData = await monitoringService.fetchMonitorings();
    // console.log(monitoringsData);
    if (!monitoringsData) {
      return errorResponse(res, "No active record found", 404);
    }
      return successResponse(res, "Monitorings record fetched successfully", monitoringsData, 200);
  } catch (err) {
    console.error("Error fetching Monitorings Data:", err);
    next(err);
  }

}


// ------------- ADD  MONITORING -------------
export async function saveMonitroing(req, res) {
  try {
    // console.log("req.body:", req.body);
    const newMonitoring = await monitoringService.addMonitoring(req.body);
    return successResponse(res, "Monito added successfully", newMonitoring, 201);
  } catch (err) {
    console.error("Error adding Monito:", err);
    return errorResponse(res, err.message, 500);
  }
}
