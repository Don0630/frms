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

  

  // ------ LOAD STAFF ------
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

  // ------ ADD STAFF ------
  const addStaff = async (staffData) => {
    setLoading(true);
    setError(null);

    try {
      const newStaff = await staffApi.addStaff(staffData);
      console.log("✅ New staff added:", newStaff);

      // update local state instantly
      setStaff((prev) => [...prev, newStaff]);

      return newStaff;
    } catch (err) {
      console.error("⚠️ Error adding staff:", err);
      setError(err.message);
      throw err; // rethrow so modal can catch
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



  // Optional: clear staff data
  const clearStaff = () => {
    setStaff([]);
  };

  return {
    loading,
    error,
    staff,
    loadStaff,
    addStaff,
    updateStaff,
    clearStaff,
  };
}