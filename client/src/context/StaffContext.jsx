// src/context/StaffContext.jsx
import { createContext, useContext, useState } from "react";
import * as staffApi from "../api/staffApi.js";

const StaffContext = createContext();

export function StaffProvider({ children }) {
  const staff = useProvideStaff();
  return <StaffContext.Provider value={staff}>{children}</StaffContext.Provider>;
}

export function useStaff() {
  return useContext(StaffContext);
}

// --- Custom hook containing all staff logic ---
function useProvideStaff() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [staff, setStaff] = useState([]);

  // ------ LOAD ALL STAFF ------
  const loadStaff = async () => {
    setLoading(true);
    setError(null);

    try {
      const { success, data: staffData } = await staffApi.fetchAllStaff();
      console.log("👨‍🌾 Staff fetched from API:", staffData);

      if (success) {
        setStaff(staffData);
      } else {
        setError("Failed to fetch staff");
      }
    } catch (err) {
      console.error("⚠️ Error fetching staff:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ------ LOAD AVAILABLE STAFF (for modals/dropdowns) ------
  const loadAvailableStaff = async (search = "") => {
    setLoading(true);
    setError(null);

    try {
      const { success, data: availableStaff } = await staffApi.fetchAvailableStaff(search);
      if (success) {
        return availableStaff;
      } else {
        setError("Failed to fetch available staff");
        return [];
      }
    } catch (err) {
      console.error("⚠️ Error fetching available staff:", err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };
  

  // ------ ADD STAFF ------
  const addStaff = async (staffData) => {
    setLoading(true);
    setError(null);

    try {
      const newStaff = await staffApi.addStaff(staffData);
      console.log("✅ New staff added:", newStaff);

      setStaff((prev) => [...prev, newStaff]);
      return newStaff;
    } catch (err) {
      console.error("⚠️ Error adding staff:", err);
      setError(err.message);
      throw err; // rethrow so modal can catch it
    } finally {
      setLoading(false);
    }
  };

  // ------ UPDATE STAFF ------
  const updateStaff = async (staffData) => {
    setLoading(true);
    setError(null);

    try {
      const updatedStaff = await staffApi.updateStaff(staffData);

      setStaff((prev) =>
        prev.map((s) => (s.StaffID === updatedStaff.StaffID ? updatedStaff : s))
      );

      return updatedStaff;
    } catch (err) {
      console.error("⚠️ Error updating staff:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ------ CLEAR STAFF STATE ------
  const clearStaff = () => setStaff([]);

  return {
    loading,
    error,
    staff,
    loadStaff,
    loadAvailableStaff,
    addStaff,
    updateStaff,
    clearStaff,
  };
}