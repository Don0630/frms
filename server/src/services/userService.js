// server/src/services/userService.js
import * as userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import { throwError } from "../utils/throwError.js";


// --------- GET ALL USER USER ---------
export async function fetchUsers() {
  return await userModel.getAllUsers();
}

// --------- ADD USER ---------
export async function addUser({ id, username, password, role }) {

  // check if staff exists and is not already a user
  const existingUser = await userModel.findUserByid(id);
  if (existingUser) throwError("This staff is already a user.", "DUPLICATE", 409);

  const hashedPassword = await bcrypt.hash(password, 10);
  return await userModel.insertUser({ staffId, username, hashedPassword, role });
}

// --------- EDIT USER ---------
export async function editUser(id, { username, role }) {
    const userId = parseInt(id);
  
    const existing = await userModel.getUserById(userId);
    if (!existing) throwError("User not found", "NOT_FOUND", 404);

  return await userModel.updateUser({ id, username, role });
}

// --------- DELETE USER ---------
export async function removeUser(id) {
    const userId = parseInt(id);
  
    const existing = await userModel.getUserById(userId);
    if (!existing) throwError("User not found", "NOT_FOUND", 404);
    
  return await userModel.deleteUser(id);
}