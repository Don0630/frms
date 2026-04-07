// src/context/SubsidyDetailsContext.jsx
import { createContext, useContext, useState } from "react";
import * as subsidyDetailsApi from "../api/subsidyDetailsApi.js";

const SubsidyDetailsContext = createContext();

export function SubsidyDetailsProvider({ children }) {
  const subsidydetails = useProvideSubsidyDetails();
  return (
    <SubsidyDetailsContext.Provider value={subsidydetails}>
      {children}
    </SubsidyDetailsContext.Provider>
  );
}

export function useSubsidyDetails() {
  return useContext(SubsidyDetailsContext);
}

function useProvideSubsidyDetails() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subsidydetails, setSubsidyDetails] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [farmersLoading, setFarmersLoading] = useState(false);
  const [farmersError, setFarmersError] = useState(null);

  // ------ LOAD ALL SUBSIDY DETAILS ------
  const loadSubsidyDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const { success, data: subsidyDetailsData } = await subsidyDetailsApi.fetchAllSubsidyDetails();
      if (success) setSubsidyDetails(subsidyDetailsData);
      else setError("Failed to fetch subsidy details");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ------ LOAD FARMERS FOR A SPECIFIC DISTRIBUTION ------
  const loadFarmersPerSubsidy = async (distributionID) => {
    setFarmersLoading(true);
    setFarmersError(null);
    try {
      const { success, data } = await subsidyDetailsApi.fetchAllFarmersPerSubsidy(distributionID);
      if (success) setFarmers(data);
      else setFarmersError("No farmers found for this distribution.");
    } catch (err) {
      setFarmersError(err.message);
    } finally {
      setFarmersLoading(false);
    }
  };

  // ------ CLEAR STATE ------
  const clearSubsidyDetails = () => setSubsidyDetails([]);
  const clearFarmers = () => setFarmers([]);

  return {
    loading,
    error,
    subsidydetails,
    loadSubsidyDetails,
    clearSubsidyDetails,
    farmers,
    farmersLoading,
    farmersError,
    loadFarmersPerSubsidy,
    clearFarmers,
  };
}