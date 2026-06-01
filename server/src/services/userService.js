// services/userService.js
import * as userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import { throwError } from "../utils/throwError.js";

// --------- FETCH USERS ---------
export async function fetchUsers() {
  return await userModel.getAllUsers();
}

// --------- ADD USER ---------
export async function addUser(user) {
  const existing = await userModel.findUserByStaffId(user.id);
  if (existing) throwError("This staff is already a user.", "DUPLICATE", 409);

  const hashedPassword = await bcrypt.hash(user.password, 10);
  return await userModel.insertUser({ ...user, hashedPassword });
}

// --------- EDIT USER ---------
export async function editUser(id, user) {
  const userId = parseInt(id);

  const existing = await userModel.getUserById(userId);
  if (!existing) throwError("User not found", "NOT_FOUND", 404);

  return await userModel.updateUser(userId, user);
}

// --------- DELETE USER ---------
export async function removeUser(id) {
  const userId = parseInt(id);

  const existing = await userModel.getUserById(userId);
  if (!existing) throwError("User not found", "NOT_FOUND", 404);

  return await userModel.deleteUser(userId);
}