// src/api/monitoringApi.js
import { apiFetch } from "./apiFetch.js";


// ------------ FETCH ALL MONITORING ------------
export async function fetchAllMonitoring() {
  return apiFetch("/monitoring/monitoringsData");
}

 