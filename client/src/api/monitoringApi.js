import api from "./api.js";

// ------------ FETCH ALL MONITORING ------------
export async function fetchAllMonitoring() {
  return api.get("/monitoring/monitoringsData");
}

// ------------ ADD MONITORING ------------
export async function addMonitoring(monitoring) {
  return api.post("/monitoring/addMonitoring", monitoring);
}

// ------------ UPDATE MONITORING ------------
export async function updateMonitoring(monitoring) {
  const { ReportID, ...data } = monitoring;
  return api.put(`/monitoring/updateMonitoring/${ReportID}`, data);
}