// server/src/middleware/errorHandler.js

import { errorResponse } from "../utils/response.js";

export function errorHandler(err, req, res, next) { 
  console.error("❌ ERROR MESSAGE:", err.message);
  console.error("📍 METHOD + URL:", req.method, req.originalUrl);
  console.error("📦 BODY:", req.body);
  console.error("🔐 AUTH HEADER:", req.headers.authorization);
  
// MYSQL DUPLICATE CHECK THROUGH UNIQUE
  if (err.code === "ER_DUP_ENTRY") {
  return errorResponse(res, "Record already exists.", "DUPLICATE", null, 409);
}

    // ================= MYSQL FK CONSTRAINT =================
  if (err.code === "ER_ROW_IS_REFERENCED_2") {
    return errorResponse(res, "This record is linked to existing data!", "REFERENCED", null, 409);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  // const message = "Internal Server Error, Please Try Again!";
  const code = err.code || "SERVER_ERROR";

  return errorResponse(res, message, code, null, statusCode);
}
