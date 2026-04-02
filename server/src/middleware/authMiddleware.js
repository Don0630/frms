// server/src/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/response.js";

const SECRET_KEY = process.env.JWT_ACCESS_SECRET;

export function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return errorResponse(res, "Access denied. No token provided.", 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    // 🔹 Attach only safe/needed data
    req.user = {
      id: decoded.id,
      role:decoded.role, 
    };

    next();

  } catch (err) {
    // 🔥 Better error handling
    if (err.name === "TokenExpiredError") {
      return errorResponse(res, "Token expired", 401);
    }

    return errorResponse(res, "Invalid token", 403);
  }
}