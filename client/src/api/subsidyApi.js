// src/api/subsidyApi.js
import { apiFetch } from "./apiFetch.js";


// ------------ FETCH ALL SUBSIDY ------------
export async function fetchAllSubsidy() {
  return apiFetch("/subsidy/subsidiesData");
}

// ------------ ADD SUBSIDY ------------
export async function addSubsidy(subsidy) {
  return await apiFetch("/subsidy/addSubsidy", {
    method: "POST",
    body: JSON.stringify(subsidy),
  });
}


// ------------ FETCH ALL FARMERS PER SUBSIDY ------------
export async function fetchAllFarmersPerSubsidy(distributionID) {
  return apiFetch(`/subsidy/subsidyData/${distributionID}/farmers`);
}


// ------------ FETCH AVAILABLE FARMER FOR SUBSIDY ------------
export async function fetchAvailableFarmer(distributionID, search = "") {
  const params = new URLSearchParams();

  if (distributionID != null) {
    params.append("distributionID", distributionID);
  }

  if (search.trim()) {
    params.append("search", search.trim());
  }

  const url = `/subsidy/availableFarmer?${params.toString()}`;
  return await apiFetch(url); 
}


// ------------ ADD FARMER SUBSIDY ------------
export async function addFarmerSubsidy(subsidy) {
  return await apiFetch("/subsidy/addFarmerSubsidy", {
    method: "POST",
    body: JSON.stringify(subsidy),
  });
}



// ------------ UPDATE DISTRIBUTION ------------
export async function updateDistribution(distribution) {
  return await apiFetch(
    `/subsidy/updateDistribution/${distribution.DistributionDetailsID}`,
    {
      method: "PUT",
      body: JSON.stringify(distribution),
    }
  );
}



// ------------ DELETE DISTRIBUTION ------------
export async function deleteDistribution(id) {
  return await apiFetch(`/subsidy/deleteDistribution/${id}`, {
    method: "DELETE",
  });
}
