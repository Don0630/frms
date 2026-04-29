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
    return next(err);
  }

}


// ------------- ADD  MONITORING -------------
export async function saveMonitoring(req, res, next) {
  try {
    // console.log("req.body:", req.body);
    const newMonitoring = await monitoringService.addMonitoring(req.body);
    return successResponse(res, "Monitoring added successfully", newMonitoring, 201);
  } catch (err) {
    console.error("Error adding Monitoring:", err);
     return next(err);
  }
}
