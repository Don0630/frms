// services/monitoringService.js
import * as monitoringModel from "../models/monitoringModel.js";


export async function fetchMonitorings() {
  return await monitoringModel.getAllMonitoring();
}


export async function addMonitoring(monitoring) {
  return await monitoringModel.createMonitoring(monitoring);
}

export async function editMonitoring(id, monitoring) {
  return await monitoringModel.updateMonitoring(id, monitoring);
}
