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



  // ------ UPDATE FARMER ------
  const updateFarmer = async (farmerData) => {
    setLoading(true);
    setError(null);

    try {
      const updatedFarmer = await farmerApi.updateFarmer(farmerData);

      setFarmer((prev) =>
  prev.map((f) =>
    f.FarmerID === updatedFarmer.FarmerID
      ? { ...f, ...updatedFarmer }
      : f
  )
);

      return updatedFarmer;
    } catch (err) {
      console.error("⚠️ Error updating farmer:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };




 // ------ ADD FARM ------
  const addFarm = async (farmData) => {
    setLoading(true);
    setError(null);

    try {
      const newFarm = await farmerApi.addFarm(farmData);
      console.log("✅ New farm added:", newFarm);

      await loadFarmer();
      return newFarm;
    } catch (err) {
      console.error("⚠️ Error adding farm:", err);
      setError(err.message);
      throw err; // rethrow so modal can catch it
    } finally {
      setLoading(false);
    }
  };




  // ------ UPDATE FARM ------
const updateFarm = async (farmData) => {
  setLoading(true);
  setError(null);

  try {
    const updatedFarm = await farmerApi.updateFarm(farmData);

    setFarmer((prev) =>
      prev.map((farmer) => {
        // only update farmer that owns this farm
        if (!farmer.Farms) return farmer;

        return {
          ...farmer,
          Farms: farmer.Farms.map((farm) =>
            farm.FarmID === updatedFarm.FarmID
              ? { ...farm, ...updatedFarm }
              : farm
          ),
        };
      })
    );

    return updatedFarm;
  } catch (err) {
    console.error("⚠️ Error updating farm:", err);
    setError(err.message);
    throw err;
  } finally {
    setLoading(false);
  }
};




// ------ DELETE FARM ------
const deleteFarm = async (farmID) => {
  setLoading(true);
  setError(null);

  try {
    const res = await farmerApi.deleteFarm(farmID);

    console.log("🗑️ Farm deleted:", res);

    // simplest + safest approach
    await loadFarmer();

    return res;
  } catch (err) {
    console.error("⚠️ Error deleting farm:", err);
    setError(err.message);
    throw err;
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
    updateFarmer,
    addFarm,
    updateFarm,
    deleteFarm,
    loadSearchFarmer,
    clearFarmer,
  };
}