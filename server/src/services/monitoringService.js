// services/monitoringService.js
import * as monitoringModel from "../models/monitoringModel.js";
import { throwError } from "../utils/throwError.js";

export async function fetchMonitorings() {
  return await monitoringModel.getAllMonitoring();
}

// ------------------ ADD MONITORING ------------------
export async function addMonitoring(monitoring) {

  const duplicate = await monitoringModel.findDuplicateMonitoring(monitoring.FarmerID, monitoring.ReportDate);
  if (duplicate) throwError("A report for this farmer on this date already exists.", "DUPLICATE", 409);

  return await monitoringModel.createMonitoring(monitoring);
}

// ------------------ EDIT MONITORING ------------------
export async function editMonitoring(id, monitoring) {
  const monitoringId = parseInt(id);

  const duplicate = await monitoringModel.findDuplicateMonitoring(monitoring.FarmerID, monitoring.ReportDate, monitoringId);
  if (duplicate) throwError("A report for this farmer on this date already exists.", "DUPLICATE", 409);
  
  return await monitoringModel.updateMonitoring(id, monitoring);
}


// ------------------ REMOVE MONITORING ------------------
export async function removeMonitoring(id) {
  const monitoringId = parseInt(id);

  const existing = await monitoringModel.getMonitoringById(monitoringId);
  if (!existing) throwError("Report not found", "NOT_FOUND", 404);

  return await monitoringModel.deleteMonitoring(monitoringId);
}