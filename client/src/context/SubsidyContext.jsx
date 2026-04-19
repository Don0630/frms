import { createContext, useContext, useState, useMemo } from "react";
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
  // GLOBAL STATES
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subsidy, setSubsidy] = useState([]);

  // FARMERS STATE
  const [farmers, setFarmers] = useState([]);
  const [farmersLoading, setFarmersLoading] = useState(false);
  const [farmersError, setFarmersError] = useState(null);





  // ================= LOAD ALL SUBSIDY =================
const loadSubsidy = async () => {
  setLoading(true);
  setError(null);

  try {
    const { success, message, data } = await subsidyApi.fetchAllSubsidy();

    if (success) {
      setSubsidy(data);

      // optional: show success message (toast or console)
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

  // ================= ADD SUBSIDY =================
  const addSubsidy = async (subsidyData) => {
    setActionLoading(true);
    setError(null);

    try {
      const { success, data } = await subsidyApi.addSubsidy(subsidyData);

      if (success) {
        setSubsidy((prev) => [...prev, data]);
        return data;
      } else {
        throw new Error("Failed to add subsidy");
      }
    } catch (err) {
      console.error("⚠️ Error adding subsidy:", err);
      setError(err.message);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  // ================= FARMERS PER SUBSIDY =================
  const loadFarmersPerSubsidy = async (distributionID) => {
    setFarmersLoading(true);
    setFarmersError(null);

    try {
      const { success, data } =
        await subsidyApi.fetchAllFarmersPerSubsidy(distributionID);

      if (success) {
        setFarmers(data);
      } else {
        setFarmers([]);
        setFarmersError("No farmers found");
      }
    } catch (err) {
      setFarmersError(err.message);
    } finally {
      setFarmersLoading(false);
    }
  };

  // ================= CLEAR FARMERS =================
  const clearFarmers = () => {
    setFarmers([]);
  };

  // ================= AVAILABLE FARMERS =================
const loadAvailableFarmer = async (distributionID, search = "") => {
  setLoading(true);
  setError(null);

  try {
    const data = await subsidyApi.fetchAvailableFarmer(distributionID, search);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error(err);
    setError(err.message);
    return [];
  } finally {
    setLoading(false);
  }
};

  // ================= ADD FARMER SUBSIDY =================
  const addFarmerSubsidy = async (farmerSubsidyData) => {
    setActionLoading(true);
    setError(null);

    try {
      const { success, data } =
        await subsidyApi.addFarmerSubsidy(farmerSubsidyData);

      if (!success) throw new Error("Failed to add farmer");

      // ❗ DO NOT push to state → rely on reload
      return data;
    } catch (err) {
      console.error("⚠️ Error adding farmer subsidy:", err);
      setError(err.message);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  // ================= UPDATE DISTRIBUTE =================
  const updateDistributeSubsidy = async (id, data) => {
    setActionLoading(true);
    setError(null);

    try {
      const { success } =
        await subsidyApi.updateDistributeSubsidy(id, data);

      if (!success) throw new Error("Failed to update distribution");

      // ✅ Optimistic UI update
      setFarmers((prev) =>
        prev.map((f) =>
          f.DistributionDetailsID === id
            ? { ...f, IsDistributed: 1 }
            : f
        )
      );

    } catch (err) {
      console.error("⚠️ Error updating distribution:", err);
      setError(err.message);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  // ================= CLEAR =================
  const clearSubsidy = () => setSubsidy([]);

  // ================= MEMO =================
  return useMemo(
    () => ({
      // subsidy
      subsidy,
      loadSubsidy,
      addSubsidy,
      clearSubsidy,

      // farmers
      farmers,
      farmersLoading,
      farmersError,
      loadFarmersPerSubsidy,
      clearFarmers,
      loadAvailableFarmer,
      addFarmerSubsidy,

      // actions
      updateDistributeSubsidy,

      // states
      loading,
      actionLoading,
      error,
    }),
    [subsidy, farmers, loading, farmersLoading, actionLoading, error]
  );
}