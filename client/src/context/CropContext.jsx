// src/context/CropContext.jsx
import { createContext, useContext, useState } from "react";
import * as cropApi from "../api/cropApi.js";

const CropContext = createContext();

export function CropProvider({ children }) {
  const crop = useProvideCrop();
  return <CropContext.Provider value={crop}>{children}</CropContext.Provider>;
}

export function useCrop() {
  return useContext(CropContext);
}

// --- Custom hook containing all crop logic ---
function useProvideCrop() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [crop, setCrop] = useState([]);



  // ------ LOAD ALL CROP ------
  const loadCrop = async () => {
    setLoading(true);
    setError(null);

    try {
      const { success, data: cropData } = await cropApi.fetchAllCrop();
      console.log("👨‍🌾 Crop fetched from API:", cropData);

      if (success) {
        setCrop(cropData);
      } else {
        setError("Failed to fetch Crop");
      }
    } catch (err) {
      console.error("⚠️ Error fetching crop:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };



  // ------ ADD CROP ------
  const addCrop = async (cropData) => {
    setLoading(true);
    setError(null);

    try {
      const newCrop = await cropApi.addCrop(cropData);
      console.log("✅ New crop added:", newCrop);

      setCrop((prev) => [...prev, newCrop]);
      return newCrop;
    } catch (err) {
      console.error("⚠️ Error adding crop:", err);
      setError(err.message);
      throw err; // rethrow so modal can catch it
    } finally {
      setLoading(false);
    }
  };


  // ------ UPDATE CROP ------
const updateCrop = async (cropData) => {
  setLoading(true);
  setError(null);

  try {
    const updatedCrop = await cropApi.updateCrop(cropData);

    setCrop((prev) =>
      prev.map((c) =>
        c.CropID === updatedCrop.CropID
          ? { ...c, ...updatedCrop }
          : c
      )
    );

    return updatedCrop;
  } catch (err) {
    setError(err.message);
    throw err;
  } finally {
    setLoading(false);
  }
};



// ------ LOAD SEARCHED CROPS (for modals/dropdowns) ------
const loadSearchCrop = async (search = "") => {
  setLoading(true);
  setError(null);

  try {
    const { success, data: searchCrop } = await cropApi.fetchSearchCrops(search);
    if (success) {
      return searchCrop;
    } else {
      setError("Failed to fetch search crop");
      return [];
    }
  } catch (err) {
    console.error("⚠️ Error fetching search crop:", err);
    setError(err.message);
    return [];
  } finally {
    setLoading(false);
  }
};
  

  // ------ CLEAR CROP STATE ------
  const clearCrop = () => setCrop([]);

  return {
    loading,
    error,
    crop,
    loadCrop,
    loadSearchCrop,
    addCrop,
    updateCrop,
    clearCrop,
  };
}