// server/src/middleware/errorHandler.js

import { errorResponse } from "../utils/response.js";

export function errorHandler(err, req, res, next) {
  console.error("❌ Error:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return errorResponse(res, message, null, statusCode);
}
