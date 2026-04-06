// src/context/SubsidyContext.jsx
import { createContext, useContext, useState } from "react";
import * as subsidyApi from "../api/subsidyApi.js";

const SubsidyContext = createContext();

export function SubsidyProvider({ children }) {
  const subsidy = useProvideSubsidy();
  return <SubsidyContext.Provider value={subsidy}>{children}</SubsidyContext.Provider>;
}

export function useSubsidy() {
  return useContext(SubsidyContext);
}

// --- Custom hook containing all subsidy logic ---
function useProvideSubsidy() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subsidy, setSubsidy] = useState([]);

  // ------ LOAD ALL SUBSIDY ------
  const loadSubsidy = async () => {
    setLoading(true);
    setError(null);

    try {
      const { success, data: subsidyData } = await subsidyApi.fetchAllSubsidy();
      console.log("👨‍🌾 Subsidy fetched from API:", subsidyData);

      if (success) {
        setSubsidy(subsidyData);
      } else {
        setError("Failed to fetch subsidy");
      }
    } catch (err) {
      console.error("⚠️ Error fetching subsidy:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


 
  // ------ CLEAR SUBSIDY STATE ------
  const clearSubsidy = () => setSubsidy([]);

  return {
    loading,
    error,
    subsidy,
    loadSubsidy,
    clearSubsidy,
  };
}