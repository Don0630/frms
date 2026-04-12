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

  // ---------------- LOAD ALL SUBSIDY DETAILS ----------------
  const loadSubsidyDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const { success, data } =
        await subsidyDetailsApi.fetchAllSubsidyDetails();

      if (success) setSubsidyDetails(data);
      else setError("Failed to fetch subsidy details");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- FARMERS PER SUBSIDY ----------------
  const loadFarmersPerSubsidy = async (distributionID) => {
    setFarmersLoading(true);
    setFarmersError(null);

    try {
      const { success, data } =
        await subsidyDetailsApi.fetchAllFarmersPerSubsidy(distributionID);

      if (success) setFarmers(data);
      else setFarmersError("No farmers found");
    } catch (err) {
      setFarmersError(err.message);
    } finally {
      setFarmersLoading(false);
    }
  };

  // ---------------- AVAILABLE FARMERS ----------------
  const loadAvailableFarmer = async (distributionID, search = "") => {
    setLoading(true);
    setError(null);

    try {
      const { success, data } =
        await subsidyDetailsApi.fetchAvailableFarmer(distributionID, search);

      return success ? data : [];
    } catch (err) {
      console.error("⚠️ Error fetching available farmer:", err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // ---------------- ADD FARMER SUBSIDY ----------------
  const addFarmerSubsidy = async (farmerSubsidyData) => {
    setLoading(true);
    setError(null);

    try {
      const result =
        await subsidyDetailsApi.addFarmerSubsidy(farmerSubsidyData);

      setFarmers((prev) => [...prev, result]);
      return result;
    } catch (err) {
      console.error("⚠️ Error adding farmer subsidy:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ---------------- FIXED: UPDATE DISTRIBUTE SUBSIDY ----------------
  const updateDistributeSubsidy = async (id, data) => {
    setLoading(true);
    setError(null);

    try {
      // IMPORTANT FIX: pass (id, data)
      const result = await subsidyDetailsApi.updateDistributeSubsidy(
        id,
        data
      );

      return result;
    } catch (err) {
      console.error("⚠️ Error updating Distribution Details:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ---------------- CLEAR FUNCTIONS ----------------
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
    loadAvailableFarmer,
    addFarmerSubsidy,

    // FIXED FUNCTION
    updateDistributeSubsidy,

    clearFarmers,
  };
}