// src/context/MonitoringContext.jsx
import { createContext, useContext, useState } from "react";
import * as monitoringApi from "../api/monitoringApi.js";

const MonitoringContext = createContext();

export function MonitoringProvider({ children }) {
  const monitoring = useProvideMonitoring();
  return <MonitoringContext.Provider value={monitoring}>{children}</MonitoringContext.Provider>;
}

export function useMonitoring() {
  return useContext(MonitoringContext);
}

// --- Custom hook containing all monitoring logic ---
function useProvideMonitoring() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [monitoring, setMonitoring] = useState([]);

  // ------ LOAD ALL MONITORING ------
  const loadMonitoring = async () => {
    setLoading(true);
    setError(null);

    try {
      const { success, data: monitoringData } = await monitoringApi.fetchAllMonitoring();
      console.log("👨‍🌾 Monitoring fetched from API:", monitoringData);

      if (success) {
        setMonitoring(monitoringData);
      } else {
        setError("Failed to fetch monitoring");
      }
    } catch (err) {
      console.error("⚠️ Error fetching monitoring:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

 

  // ------ ADD MONITORING ------
  const addMonitoring = async (monitoringfData) => {
    setLoading(true);
    setError(null);

    try {
      const newMonitoring = await monitoringApi.addMonitoring(monitoringData);
      console.log("✅ New monitoring added:", newMonitoring);

      setMonitoring((prev) => [...prev, newMonitoring]);
      return newMonitoring;
    } catch (err) {
      console.error("⚠️ Error adding monitoring:", err);
      setError(err.message);
      throw err; // rethrow so modal can catch it
    } finally {
      setLoading(false);
    }
  };

  

  // ------ CLEAR MONITORING STATE ------
  const clearMonitoring = () => setMonitoring([]);

  return {
    loading,
    error,
    monitoring,
    addMonitoring,
    loadMonitoring,
    clearMonitoring,
  };
}