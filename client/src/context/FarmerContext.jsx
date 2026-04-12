import { createContext, useContext, useState } from "react";
import * as farmerApi from "../api/farmerApi.js";

const FarmerContext = createContext();

export function FarmerProvider({ children }) {
  const farmer = useProvideFarmer();
  return <FarmerContext.Provider value={farmer}>{children}</FarmerContext.Provider>;
}

export function useFarmer() {
  return useContext(FarmerContext);
}

// --- Custom hook containing all farmer logic ---
function useProvideFarmer() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [farmer, setFarmer] = useState([]);

  

  // ------ LOAD FARMER ------
  const loadFarmer = async () => {
    setLoading(true);
    setError(null);

    try {
      const { success, data: farmerData } = await farmerApi.fetchAllFarmer();

      console.log("👨‍🌾 Farmer fetched from API:", farmerData);

      if (success) {
        setFarmer(farmerData);
      } else {
        setError("Failed to fetch farmer");
      }
    } catch (err) {
      console.error("⚠️ Error fetching farmer:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

 
 


  // ------ ADD FARMER ------
  const addFarmer = async (farmerData) => {
    setLoading(true);
    setError(null);

    try {
      const newFarmer = await farmerApi.addFarmer(farmerData);
      console.log("✅ New farmer added:", newFarmer);

      setFarmer((prev) => [...prev, newFarmer]);
      return newFarmer;
    } catch (err) {
      console.error("⚠️ Error adding farmer:", err);
      setError(err.message);
      throw err; // rethrow so modal can catch it
    } finally {
      setLoading(false);
    }
  };



// ------ LOAD SEARCHED FARMER (for modals/dropdowns) ------
const loadSearchFarmer = async (search = "") => {
  setLoading(true);
  setError(null);

  try {
    const { success, data: searchFarmer } = await farmerApi.fetchSearchFarmers(search);
    if (success) {
      return searchFarmer;
    } else {
      setError("Failed to fetch search farmer");
      return [];
    }
  } catch (err) {
    console.error("⚠️ Error fetching search farmer:", err);
    setError(err.message);
    return [];
  } finally {
    setLoading(false);
  }
};




  // Optional: clear farmer data
  const clearFarmer = () => {
    setFarmer([]);
  };

  return {
    loading,
    error,
    farmer,
    loadFarmer,
    addFarmer,
    loadSearchFarmer,
    clearFarmer,
  };
}