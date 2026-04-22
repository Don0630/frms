import { createContext, useContext, useState } from "react";
import * as subsidyApi from "../api/subsidyApi.js";

const SubsidyContext = createContext();

export function SubsidyProvider({ children }) {
  const subsidy = useProvideSubsidy();

  return (
    <SubsidyContext.Provider value={subsidy}>
      {children}
    </SubsidyContext.Provider>
  );
}

export function useSubsidy() {
  const context = useContext(SubsidyContext);

  if (!context) {
    throw new Error("useSubsidy must be used within SubsidyProvider");
  }

  return context;
}

// ================= CUSTOM HOOK =================
function useProvideSubsidy() {
  // ================= GLOBAL STATE =================
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [subsidy, setSubsidy] = useState([]);
  const [farmers, setFarmers] = useState([]);

  // ================= LOAD SUBSIDY =================
  const loadSubsidy = async () => {
    setLoading(true);
    setError(null);

    try {
      const { success, message, data } =
        await subsidyApi.fetchAllSubsidy();

      if (success) {
        setSubsidy(data);
        console.log(message);
      } else {
        setError(message || "Failed to fetch subsidy");
      }
    } catch (err) {
      console.error("⚠️ Error fetching subsidy:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };




 // ------ ADD SUBSIDY ------
  const addSubsidy = async (subsidyData) => {
    setLoading(true);
    setError(null);

    try {
      const newSubsidy = await subsidyApi.addSubsidy(subsidyData);
      console.log("✅ New subsidy added:", newSubsidy);

      setSubsidy((prev) => [...prev, newSubsidy]);
      return newSubsidy;
    } catch (err) {
      console.error("⚠️ Error adding subsidy:", err);
      setError(err.message);
      throw err; // rethrow so modal can catch it
    } finally {
      setLoading(false);
    }
  };




  // ================= FARMERS PER SUBSIDY =================
  const loadFarmersPerSubsidy = async (distributionID) => {
    setLoading(true);
    setError(null);

    try {
      const { success, data } =
        await subsidyApi.fetchAllFarmersPerSubsidy(distributionID);

      if (success) {
        setFarmers(data);
      } else {
        setFarmers([]);
        setError("No farmers found");
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ================= AVAILABLE FARMERS =================
  const loadAvailableFarmer = async (distributionID, search = "") => {
    setLoading(true);
    setError(null);

    try {
      const data =
        await subsidyApi.fetchAvailableFarmer(distributionID, search);

      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error(err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  

 // ------ ADD FARMER SUBSIDY ------
  const addFarmerSubsidy = async (farmerSubsidyData) => {
    setLoading(true);
    setError(null);

    try {
      const newFarmerSubsidy = await subsidyApi.addFarmerSubsidy(farmerSubsidyData);
      console.log("✅ New farmer subsidy added:", newFarmerSubsidy);

      setSubsidy((prev) => [...prev, newFarmerSubsidy]);
      return newFarmerSubsidy;
    } catch (err) {
      console.error("⚠️ Error adding farmer subsidy:", err);
      setError(err.message);
      throw err; // rethrow so modal can catch it
    } finally {
      setLoading(false);
    }
  };




  // ------ UPDATE DISTRIBUTION ------
const updateDistribution = async (distributionData) => {
  setLoading(true);
  setError(null);

  try {
    const updated = await subsidyApi.updateDistribution(distributionData);

    setFarmers((prev) =>
      prev.map((f) =>
        Number(f.DistributionDetailsID) === Number(updated.DistributionDetailsID)
          ? {
              ...f,
              ...updated,
              IsDistributed: updated.IsDistributed ?? f.IsDistributed,
            }
          : f
      )
    );

    return updated;
  } catch (err) {
    console.error("⚠️ Error updating distribution:", err);
    setError(err.message);
    throw err;
  } finally {
    setLoading(false);
  }
};


// ------ DELETE DISTRIBUTION ------
const deleteDistribution = async (DistributionDetailsID) => {
  setLoading(true);
  setError(null);

  try {
    const res = await subsidyApi.deleteDistribution(DistributionDetailsID);

    console.log("🗑️ Distribution deleted:", res);
 
    return res;
  } catch (err) {
    console.error("⚠️ Error deleting Distribution:", err);
    setError(err.message);
    throw err;
  } finally {
    setLoading(false);
  }
};





  // ================= CLEAR FUNCTIONS =================
  const clearFarmers = () => setFarmers([]);
  const clearSubsidy = () => setSubsidy([]);

  // ================= RETURN =================
  return {
    subsidy,
    farmers,

    loadSubsidy,
    addSubsidy,
    loadFarmersPerSubsidy,
    loadAvailableFarmer,
    addFarmerSubsidy,
    updateDistribution,
    deleteDistribution,
    clearFarmers,
    clearSubsidy,

    loading,
    error,
  };
}