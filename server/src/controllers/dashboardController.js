// server/src/controllers/dashboardController.js
import { getSummary } from "../services/dashboardService.js";
import { successResponse } from "../utils/response.js";

export async function summary(req, res, next) {
  try {
    const data = await getSummary();
    return successResponse(res, "Dashboard summary", { summary: data });
  } catch (err) {
    next(err);
  }
}