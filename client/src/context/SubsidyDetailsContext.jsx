// src/context/SubsidyDetailsContext.jsx
import { createContext, useContext, useState } from "react";
import * as subsidyDetailsApi from "../api/subsidyDetailsApi.js";

const SubsidyDetailsContext = createContext();

export function SubsidyDetailsProvider({ children }) {
  const subsidydetails = useProvideSubsidyDetails();
  return <SubsidyDetailsContext.Provider value={subsidydetails}>{children}</SubsidyDetailsContext.Provider>;
}

export function useSubsidyDetails() {
  return useContext(SubsidyDetailsContext);
}

// --- Custom hook containing all subsidy details logic ---
function useProvideSubsidyDetails() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subsidydetails, setSubsidyDetails] = useState([]);

  // ------ LOAD ALL SUBSIDY DETAILS ------
  const loadSubsidyDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const { success, data: subsidyDetailsData } = await subsidyDetailsApi.fetchAllSubsidyDetails();
      console.log("👨‍🌾 Subsidy Details fetched from API:", subsidyDetailsData);

      if (success) {
        setSubsidyDetails(subsidyDetailsData);
      } else {
        setError("Failed to fetch subsidy details");
      }
    } catch (err) {
      console.error("⚠️ Error fetching subsidy details:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

 
  

  // ------ CLEAR SUBSIDY DETAILS STATE ------
  const clearSubsidyDetails = () => setSubsidyDetails([]);

  return {
    loading,
    error,
    subsidydetails,
    loadSubsidyDetails,
    clearSubsidyDetails,
  };
}