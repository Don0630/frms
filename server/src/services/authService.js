// server/src/services/authService.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as authModel from "../models/authModel.js";
import { throwError } from "../utils/throwError.js";

const {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
} = process.env;

// Track failed login attempts (in-memory)
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCK_TIME = 5 * 60 * 1000; // 5 minutes


// --------- LOGIN ---------
export async function loginUser({ identifier, password }) {
  
  const attempts = loginAttempts.get(identifier) || { count: 0, lastAttempt: null };

  // Check if account is temporarily locked
 if (
  attempts.count >= MAX_ATTEMPTS &&
  attempts.lastAttempt &&
  Date.now() - attempts.lastAttempt < LOCK_TIME
) {
  throwError("Too many failed attempts. Try again later.", "AUTH_RATE_LIMIT", 429);
}


  // Find user by username or email
  const user = await authModel.findByUsernameOrEmail(identifier);

  if (!user) {
    loginAttempts.set(identifier, { count: attempts.count + 1, lastAttempt: Date.now() });
    throwError("Invalid credentials", "AUTH_INVALID_CREDENTIALS", 401);
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.PasswordHash);
  if (!isMatch) {
    loginAttempts.set(identifier, { count: attempts.count + 1, lastAttempt: Date.now() });
    throwError("Invalid credentials", "AUTH_INVALID_CREDENTIALS", 401);
  }

  // Reset attempts on success
  loginAttempts.delete(identifier);

  // Token payload
  const payload = { id: user.UserID, role: user.Role };

  const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });

  // Remove password before returning
  const { PasswordHash, ...userSafe } = user;

  return { userSafe, accessToken, refreshToken };
}

