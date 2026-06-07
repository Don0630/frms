import api from "./api.js";

// ------------ FETCH ALL FARMER ------------
export async function fetchDashboardData() {
  return api.get("/dashboard/dashboardData");
}
