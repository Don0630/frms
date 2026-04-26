// server/src/services/userService.js
import * as userModel from "../models/userModel.js";
import bcrypt from "bcrypt";


export async function fetchUsers() {
   const user = await userModel.getAllUsers();
   return user;
}


export async function addUser({ staffId, username, password, role }) {
  // 1️⃣ Generate salt and hash password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // 2️⃣ Insert user with hashed password
  const user = await userModel.insertUser({ staffId, username, hashedPassword, role });
  return user;
}


export async function updateUser({ userId, username, role }) {
  const user = await userModel.updateUser({ userId, username, role });
  return user;
}

export async function removeUser(userId) {
  const user = await userModel.deleteUser(userId);
  return user;
}