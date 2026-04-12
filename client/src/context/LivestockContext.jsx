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
 
  

  // ------ ADD LIVESTOCK ------
  const addLivestock = async (livestockData) => {
    setLoading(true);
    setError(null);

    try {
      const newLivestock = await livestockApi.addLivestock(livestockData);
      console.log("✅ New livestock added:", newLivestock);

      setLivestock((prev) => [...prev, newLivestock]);
      return newLivestock;
    } catch (err) {
      console.error("⚠️ Error adding livestock:", err);
      setError(err.message);
      throw err; // rethrow so modal can catch it
    } finally {
      setLoading(false);
    }
  };




// ------ LOAD SEARCHED LIVESTOCK (for modals/dropdowns) ------
const loadSearchLivestock = async (search = "") => {
  setLoading(true);
  setError(null);

  try {
    const { success, data: searchLivestock } = await livestockApi.fetchSearchLivestock(search);
    if (success) {
      return searchLivestock;
    } else {
      setError("Failed to fetch search livestock");
      return [];
    }
  } catch (err) {
    console.error("⚠️ Error fetching search livestock:", err);
    setError(err.message);
    return [];
  } finally {
    setLoading(false);
  }
};
  



  // ------ CLEAR LIVESTOCK STATE ------
  const clearLivestock = () => setLivestock([]);

  return {
    loading,
    error,
    livestock,
    addLivestock,
    loadLivestock,
    loadSearchLivestock,
    clearLivestock,
  };
}