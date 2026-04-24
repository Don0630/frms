import * as userService from "../services/userService.js";
import { successResponse, errorResponse } from "../utils/response.js";

// ------------- GET ALL USERS -------------
export async function getAllUser(req, res, next) {
  try {
    const usersData = await userService.fetchUsers();

    if (!usersData || usersData.length === 0) {
      return errorResponse(res, "No active record found", 404);
    }

    return successResponse(res, "Users record fetched successfully", usersData, 200);
  } catch (err) {
    console.error("Error fetching User Data:", err);
    return next(err);
  }
}


// ------------- CREATE USER -------------
export async function createUser(req, res, next) {
  try {
    const { staffId, username, password, role } = req.body;

    const userData = await userService.createUser({
      staffId,
      username,
      password,
      role,
    });

    return successResponse(
      res,
      "User account setup successfully",
      userData,
      201
    );
  } catch (err) {
    console.error("Error Saving User Account:", err);
    return next(err);
  }
}



// ------------- UPDATE USER -------------
export async function updateUser(req, res, next) {
  try {
    const userId = req.params.id;
    const { username, role } = req.body;

    if (!userId || !username || !role) {
      return errorResponse(res, "Missing required fields", 400);
    }

    const updatedUser = await userService.updateUserService({
      userId,
      username,
      role,
    });

    return successResponse(
      res,
      "User updated successfully",
      updatedUser,
      200
    );
  } catch (err) {
    console.error("Error updating user:", err);
    return next(err);
  }
}


export async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;

    await userService.removeUser(id);

    return successResponse(res, "User deleted successfully", null, 200);
  } catch (err) {
    return next(err);
  }
}