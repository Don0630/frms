// server/src/services/userService.js
import * as userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import { throwError } from "../utils/throwError.js";


export async function fetchUsers() {
  return await userModel.getAllUsers();
}


export async function addUser({ staffId, username, password, role }) {
  // check if staff exists and is not already a user
  const existingUser = await userModel.findUserByStaffId(staffId);
  if (existingUser) throwError("This staff is already a user.", "DUPLICATE", 409);

  // check duplicate username
  const dupUsername = await userModel.findDuplicateUsername(username);
  if (dupUsername) throwError("Username is already taken.", "DUPLICATE", 409);

  const hashedPassword = await bcrypt.hash(password, 10);
  return await userModel.insertUser({ staffId, username, hashedPassword, role });
}


export async function editUser(userId, { username, role }) {
  // check duplicate username excluding current user
  const dupUsername = await userModel.findDuplicateUsername(username, userId);
  if (dupUsername) throwError("Username is already taken.", "DUPLICATE", 409);

  return await userModel.updateUser({ userId, username, role });
}


export async function removeUser(userId) {
  return await userModel.deleteUser(userId);
}