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





  

  // ------ CLEAR CROP STATE ------
  const clearCrop = () => setCrop([]);

  return {
    loading,
    error,
    crop,
    loadCrop,
    addCrop,
    clearCrop,
  };
}