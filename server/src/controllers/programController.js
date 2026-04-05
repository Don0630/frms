// controllers/programController.js
import * as programService from "../services/programService.js";
import { successResponse, errorResponse } from "../utils/response.js";


// ------------- GET ALL PROGRAM -------------
export async function getAllProgram(req, res) {

  try {
    const programsData = await programService.fetchPrograms();

    if (!programsData) {
      return errorResponse(res, "No active record found", 404);
    }
      return successResponse(res, "Programs record fetched successfully", programsData, 200);
  } catch (err) {
    console.error("Error fetching Programs Data:", err);
    next(err);
  }

}

 