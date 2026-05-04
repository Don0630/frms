// server/src/middleware/errorHandler.js

import { errorResponse } from "../utils/response.js";

export function errorHandler(err, req, res, next) { 
  console.error("❌ ERROR MESSAGE:", err.message);
  console.error("📍 METHOD + URL:", req.method, req.originalUrl);
  console.error("📦 BODY:", req.body);
  console.error("🔐 AUTH HEADER:", req.headers.authorization);

  // optional full stack (VERY useful in dev)
  console.error("📚 STACK TRACE:", err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const code = err.code || "SERVER_ERROR";

  return errorResponse(res, message, code, null, statusCode);
}
