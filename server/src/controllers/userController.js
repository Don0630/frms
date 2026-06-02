// controllers/userController.js
import * as userService from "../services/userService.js";
import { successResponse, errorResponse } from "../utils/response.js";


// ------------- GET ALL USERS -------------
export async function getAllUser(req, res, next) {
  try {
    const usersData = await userService.fetchUsers();
    return successResponse(res, "Users record fetched successfully", usersData, 200);
  } catch (err) {
    return next(err);
  }
}


// ------------- SAVE USER -------------
export async function saveUser(req, res, next) {
  try {
    const userData = await userService.addUser(req.body);
    return successResponse(res, "User account setup successfully", userData, 201);
  } catch (err) {
    return next(err);
  }
}


// ------------- UPDATE USER -------------
export async function updateUser(req, res, next) {
  try { 
    const updatedUser = await userService.editUser(req.params.id, req.body);
    return successResponse(res, "User updated successfully", updatedUser, 200);
  } catch (err) { 
    return next(err);
  }
}


// ------------- DELETE USER -------------
export async function deleteUser(req, res, next) {
  try {
    await userService.removeUser(req.params.id);
    return successResponse(res, "User deleted successfully", null, 200);
  } catch (err) {
    return next(err);
  }
}