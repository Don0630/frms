// src/api/monitoringApi.js
import { apiFetch } from "./apiFetch.js";


// ------------ FETCH ALL MONITORING ------------
export async function fetchAllMonitoring() {
  return apiFetch("/monitoring/monitoringsData");
}


// ------------ ADD MONITORING ------------
export async function addMonitoring(monitoring) {
  const data = await apiFetch("/monitoring/addMonitoring", {
    method: "POST",
    body: JSON.stringify(monitoring),
  });

  return data.data;
}