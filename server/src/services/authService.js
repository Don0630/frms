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

const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCK_TIME = 5 * 60 * 1000;

// --------- LOGIN ---------
export async function loginUser({ identifier, password }) {
  const attempts = loginAttempts.get(identifier) || { count: 0, lastAttempt: null };

  if (
    attempts.count >= MAX_ATTEMPTS &&
    attempts.lastAttempt &&
    Date.now() - attempts.lastAttempt < LOCK_TIME
  ) {
    throwError("Too many failed attempts. Try again after 5 minutes.", "AUTH_RATE_LIMIT", 429);
  }

  const user = await authModel.getUserById(identifier);

  if (!user) {
    loginAttempts.set(identifier, { count: attempts.count + 1, lastAttempt: Date.now() });
    throwError("Invalid credentials", "AUTH_INVALID_CREDENTIALS", 401);
  }

  const isMatch = await bcrypt.compare(password, user.PasswordHash);
  if (!isMatch) {
    loginAttempts.set(identifier, { count: attempts.count + 1, lastAttempt: Date.now() });
    throwError("Invalid credentials", "AUTH_INVALID_CREDENTIALS", 401);
  }

  loginAttempts.delete(identifier);

  const payload = { id: user.UserID, role: user.Role };
  const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });

  const { PasswordHash, ...userSafe } = user;
  return { userSafe, accessToken, refreshToken };
}

// --------- REFRESH TOKEN ---------
export async function refreshAccessToken(refreshToken) {
  if (!refreshToken)
    throwError("No refresh token provided.", "UNAUTHORIZED", 401);

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const payload = { id: decoded.id, role: decoded.role };
    const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
    return { accessToken };
  } catch (err) {
    if (err.name === "TokenExpiredError")
      throwError("Refresh token expired. Please log in again.", "TOKEN_EXPIRED", 401);
    throwError("Invalid refresh token.", "INVALID_TOKEN", 401);
  }
}

// --------- GET USER ---------
export async function getUser(userId) {
  const user = await authModel.fetchUser(userId);
  if (!user) throwError("User not found.", "NOT_FOUND", 404);
  return user; 
}