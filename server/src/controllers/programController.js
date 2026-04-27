// controllers/programController.js
import * as programService from "../services/programService.js";
import { successResponse, errorResponse } from "../utils/response.js";


// ------------- GET ALL PROGRAM -------------
export async function getAllProgram(req, res, next) {

  try {
    const programsData = await programService.fetchPrograms();

    if (!programsData) {
      return errorResponse(res, "No active record found", 404);
    }
      return successResponse(res, "Programs record fetched successfully", programsData, 200);
  } catch (err) {
    console.error("Error fetching Programs Data:", err);
    return next(err);
  }

}


// ------------- ADD PROGRAM -------------
export async function saveProgram(req, res, next) {
  try {
    // console.log("req.body:", req.body);
    const newProgram = await programService.addProgram(req.body);
    return successResponse(res, "Program added successfully", newProgram, 201);
  } catch (err) {
    console.error("Error saving Program:", err);
    return next(err);
  }
}




// ------------- UPDATE PROGRAM -------------
export async function updateProgram(req, res, next) {
  try {
    const updated = await programService.editProgram(req.params.id, req.body);
    return successResponse(res, "Program updated successfully", updated);
  } catch (err) {
     console.error("Error updating Program:", err);
    return next(err);
  }
}




// ------------- GET AVAILABLE PROGRAMS -------------
export async function getAvailableProgram(req, res, next) {
  try {
    const search = req.query.search || "";
    const availableProgram = await programService.fetchAvailablePrograms(search);
 

    return successResponse(res, "Available program fetched successfully", availableProgram, 200);
  } catch (err) {
    console.error("Error fetching available program:", err);
    return next(err);
  }
}