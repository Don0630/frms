import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/response.js";

const SECRET_KEY = process.env.JWT_ACCESS_SECRET;

export function authenticateToken(req, res, next) {
  const token = req.cookies.accessToken;

  if (!token) {
    return errorResponse(res, "Access denied. No token provided.", "NO_TOKEN", null, 401);
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();

  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return errorResponse(res, "Token expired.", "TOKEN_EXPIRED", null, 401);
    }
    return errorResponse(res, "Invalid token.", "INVALID_TOKEN", null, 403);
  }
}