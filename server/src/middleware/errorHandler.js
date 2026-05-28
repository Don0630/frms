// server/src/middleware/errorHandler.js
import { errorResponse } from "../utils/response.js";

export function errorHandler(err, req, res, next) { 
  console.error("❌ ERROR MESSAGE:", err.message);
  console.error("📍 METHOD + URL:", req.method, req.originalUrl);
  console.error("📦 BODY:", req.body);
  console.error("🔐 AUTH HEADER:", req.headers.authorization);

  // ================= DB CONNECTION =================
  if (err.code === "ECONNREFUSED" || err.code === "ETIMEDOUT" || err.code === "ENOTFOUND") {
    console.error("🔌 DB CONNECTION ERROR:", err.message);
    return errorResponse(res, "Service temporarily unavailable.", "DB_ERROR", null, 503);
  }

  // ================= MYSQL DUPLICATE =================
  if (err.code === "ER_DUP_ENTRY") {
    const msg = err.message;

    // Farmers
    if (msg.includes("unique_farmer")) return errorResponse(res, "A farmer with the same name already exists.", "DUPLICATE", null, 409);
    if (msg.includes("unique_contact")) return errorResponse(res, "Contact number already in use.", "DUPLICATE", null, 409);
    if (msg.includes("unique_email")) return errorResponse(res, "Email already in use.", "DUPLICATE", null, 409);

    // Farms
    if (msg.includes("unique_farm")) return errorResponse(res, "Farm already exists for this location.", "DUPLICATE", null, 409);

    // Crops
    if (msg.includes("unique_crop")) return errorResponse(res, "Crop already exists.", "DUPLICATE", null, 409);

    // Livestock
    if (msg.includes("unique_livestock")) return errorResponse(res, "Livestock with the same type and breed already exists.", "DUPLICATE", null, 409);

    // Programs
    if (msg.includes("unique_program")) return errorResponse(res, "Program already exists.", "DUPLICATE", null, 409);

    // Participation
    if (msg.includes("unique_participation")) return errorResponse(res, "Farmer is already enrolled in this program.", "DUPLICATE", null, 409);

    // Subsidy distribution
    if (msg.includes("unique_distribution_farmer")) return errorResponse(res, "Farmer is already added to this distribution.", "DUPLICATE", null, 409);

    // Staff
    if (msg.includes("unique_staff_contact")) return errorResponse(res, "Contact number already in use.", "DUPLICATE", null, 409);
    if (msg.includes("unique_staff_email")) return errorResponse(res, "Email already in use.", "DUPLICATE", null, 409);
    if (msg.includes("unique_staff")) return errorResponse(res, "A staff with the same name already exists.", "DUPLICATE", null, 409);

    // Users
    if (msg.includes("unique_username")) return errorResponse(res, "Username already in use.", "DUPLICATE", null, 409);
    if (msg.includes("unique_user_email")) return errorResponse(res, "Email already in use.", "DUPLICATE", null, 409);

    // Monitoring
    if (msg.includes("unique_report")) return errorResponse(res, "A report for this farmer on this date already exists.", "DUPLICATE", null, 409);

    // Fallback
    return errorResponse(res, "Record already exists.", "DUPLICATE", null, 409);
  }

  // ================= MYSQL FK CONSTRAINT =================
  if (err.code === "ER_ROW_IS_REFERENCED_2") {
    return errorResponse(res, "This record is linked to existing data.", "REFERENCED", null, 409);
  }

  // ================= MYSQL DATA ERRORS =================
  if (err.code === "ER_BAD_NULL_ERROR") {
    return errorResponse(res, "A required field is missing.", "MISSING_FIELD", null, 400);
  }

  if (err.code === "ER_DATA_TOO_LONG") {
    return errorResponse(res, "A field value is too long.", "DATA_TOO_LONG", null, 400);
  }

  if (err.code === "ER_TRUNCATED_WRONG_VALUE_FOR_FIELD") {
    return errorResponse(res, "Invalid value provided for a field.", "INVALID_VALUE", null, 400);
  }

  if (err.code === "WARN_DATA_TRUNCATED") {
    return errorResponse(res, "Invalid data format.", "INVALID_FORMAT", null, 400);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  // const message = "Internal Server Error, Please Try Again!";
  const code = err.code || "SERVER_ERROR";

  return errorResponse(res, message, code, null, statusCode);
}