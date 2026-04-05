// src/context/LivestockContext.jsx
import { createContext, useContext, useState } from "react";
import * as livestockApi from "../api/livestockApi.js";

const LivestockContext = createContext();

export function LivestockProvider({ children }) {
  const livestock = useProvideLivestock();
  return <LivestockContext.Provider value={livestock}>{children}</LivestockContext.Provider>;
}

export function useLivestock() {
  return useContext(LivestockContext);
}

// --- Custom hook containing all livestock logic ---
function useProvideLivestock() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [livestock, setLivestock] = useState([]);

  // ------ LOAD ALL LIVESTOCK ------
  const loadLivestock = async () => {
    setLoading(true);
    setError(null);

    try {
      const { success, data: livestockData } = await livestockApi.fetchAllLivestock();
      console.log("👨‍🌾 Livestock fetched from API:", livestockData);

      if (success) {
        setLivestock(livestockData);
      } else {
        setError("Failed to fetch livestock");
      }
    } catch (err) {
      console.error("⚠️ Error fetching livestock:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
 
  

  // ------ CLEAR STAFF STATE ------
  const clearLivestock = () => setLivestock([]);

  return {
    loading,
    error,
    livestock,
    loadLivestock,
    clearLivestock,
  };
}