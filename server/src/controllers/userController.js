// server/src/controllers/userController.js
import * as userService from "../services/userService.js";
import { successResponse, errorResponse } from "../utils/response.js";

export async function createUser(req, res, next) {
  try {
    const { staffId, username, password, role } = req.body;

    const userData = await userService.createUser({ staffId, username, password, role });

    return successResponse(res, "User account setup successfully", userData, 201);
  } catch (err) {
    console.error("Error Saving User Account:", err);
    next(err);
  }
}

  

