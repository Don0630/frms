// server/src/services/dashboardService.js
import * as dashboardModel from "../models/dashboardModel.js";

export async function getSummary() {
  const summary = await dashboardModel.getSummary();
  return summary;
}