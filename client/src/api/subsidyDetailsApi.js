// src/api/subsidyApi.js
import { apiFetch } from "./apiFetch.js";


// ------------ FETCH ALL SUBSIDY DETAILS ------------
export async function fetchAllSubsidyDetails() {
  return apiFetch("/subsidydetails/subsidyDetailsData");
}


// ------------ FETCH ALL FARMERS PER SUBSIDY ------------
export async function fetchAllFarmersPerSubsidy(distributionID) {
  return apiFetch(`/subsidydetails/subsidyDetailsData/${distributionID}/farmers`);
}