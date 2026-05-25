// src/api/subsidyApi.js
import api from "./api.js";

// ------------ FETCH ALL SUBSIDY ------------
export async function fetchAllSubsidy() {
  return api.get("/subsidy/subsidiesData");
}

// ------------ ADD SUBSIDY ------------
export async function addSubsidy(subsidy) {
  return api.post("/subsidy/addSubsidy", subsidy);
}


// ------------ UPDATE SUBSIDY ------------
export async function updateSubsidy(subsidy) {
  return api.put(`/subsidy/updateSubsidy/${subsidy.DistributionID}`, subsidy);
}

// ------------ DELETE SUBSIDY ------------
export async function deleteSubsidy(id) {
  return api.delete(`/subsidy/deleteSubsidy/${id}`);
}


// ------------ FETCH SUBSIDY DETAILS ------------
export async function fetchSubsidyDetails(id) {
  return api.get(`/subsidy/subsidyDetails/${id}`);
}



// ------------ ADD DISTRIBUTION ------------
export async function addDistribution(distribution) {
  return api.post("/subsidy/addDistribution", distribution);
}

// ------------ UPDATE DISTRIBUTION ------------
export async function updateDistribution(distribution) {
  return api.put(`/subsidy/updateDistribution/${distribution.DistributionDetailsID}`, distribution);
}

// ------------ DELETE DISTRIBUTION ------------
export async function deleteDistribution(id) {
  return api.delete(`/subsidy/deleteDistribution/${id}`);
}

// ------------ FETCH AVAILABLE FARMER FOR SUBSIDY ------------
export async function fetchAvailableFarmer(distributionID, search = "") {
  return api.get("/subsidy/availableFarmer", {
    params: {
      ...(distributionID != null && { distributionID }),
      ...(search.trim() && { search: search.trim() }),
    },
  });
}