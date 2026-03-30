// server/src/services/authService.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  createAccount,
  findByEmail,
  findByUsername,
  findByUsernameOrEmail,
} from "../models/authModel.js";
 
const {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
} = process.env;

// Track failed login attempts (in-memory)
const loginAttempts = new Map();

// --------- LOGIN ---------
export async function loginUser({ identifier, password }) {
  const MAX_ATTEMPTS = 5;
  const LOCK_TIME = 5 * 60 * 1000; // 5 minutes

  const attempts = loginAttempts.get(identifier) || {
    count: 0,
    lastAttempt: null,
  };

  // 🔹 Check lock time
  if (
    attempts.count >= MAX_ATTEMPTS &&
    Date.now() - attempts.lastAttempt < LOCK_TIME
  ) {
    throw Object.assign(
      new Error("Too many failed attempts. Try again later."),
      { statusCode: 429 }
    );
  }

  const user = await findByUsernameOrEmail(identifier);

  if (!user) {
    loginAttempts.set(identifier, {
      count: attempts.count + 1,
      lastAttempt: Date.now(),
    });

    throw Object.assign(new Error("Invalid credentials"), {
      statusCode: 401,
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    loginAttempts.set(identifier, {
      count: attempts.count + 1,
      lastAttempt: Date.now(),
    });

    throw Object.assign(new Error("Invalid credentials"), {
      statusCode: 401,
    });
  }

  // 🔹 Reset attempts on success
  loginAttempts.delete(identifier);



  // 🔹 Token payload
  const payload = {
    id: user.id,
  };

  const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });

  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });

  // 🔹 Remove password
  const { password: _, ...userSafe } = user;

  return {
    userSafe,
    accessToken,
    refreshToken,
  };
}