import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/response.js";

const SECRET_KEY = process.env.JWT_ACCESS_SECRET;

export function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return errorResponse(res, "Access denied. No token provided.", null, "NO_TOKEN" , 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();

  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return errorResponse(res, "Token expired", null, "TOKEN_EXPIRED" , 401);
    }

    return errorResponse(res, "Invalid token", null, "INVALID_TOKEN", 403);
  }
}