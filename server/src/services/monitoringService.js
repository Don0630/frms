// services/monitoringService.js
import * as monitoringModel from "../models/monitoringModel.js";


export async function fetchMonitorings() {
  return await monitoringModel.getAllMonitoring();
} 