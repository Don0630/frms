// src/api/subsidyApi.js
import { apiFetch } from "./apiFetch.js";


// ------------ FETCH ALL SUBSIDY ------------
export async function fetchAllSubsidy() {
  return apiFetch("/subsidy/subsidiesData");
}

// ------------ ADD SUBSIDY ------------
export async function addSubsidy(subsidy) {
  const data = await apiFetch("/subsidy/addSubsidy", {
    method: "POST",
    body: JSON.stringify(subsidy),
  });

  return data.data;
}
