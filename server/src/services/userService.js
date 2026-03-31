// server/src/services/userService.js
import * as userModel from "../models/userModel.js";
import bcrypt from "bcrypt";

export async function createUser({ staffId, username, password, role }) {
  // 1️⃣ Generate salt and hash password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // 2️⃣ Insert user with hashed password
  const user = await userModel.insertUser({ staffId, username, hashedPassword, role });

  // 3️⃣ Mark the staff as a user
  await userModel.markStaffAsUser(staffId);

  return user;
}