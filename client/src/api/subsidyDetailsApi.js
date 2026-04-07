// src/api/subsidyApi.js
import { apiFetch } from "./apiFetch.js";


// ------------ FETCH ALL SUBSIDY DETAILS ------------
export async function fetchAllSubsidyDetails() {
  return apiFetch("/subsidydetails/subsidyDetailsData");
}

 