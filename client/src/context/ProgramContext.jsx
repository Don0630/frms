// src/context/ProgramContext.jsx
import { createContext, useContext, useState } from "react";
import * as programApi from "../api/programApi.js";

const ProgramContext = createContext();

export function ProgramProvider({ children }) {
  const program = useProvideProgram();
  return <ProgramContext.Provider value={program}>{children}</ProgramContext.Provider>;
}

export function useProgram() {
  return useContext(ProgramContext);
}

// --- Custom hook containing all program logic ---
function useProvideProgram() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [program, setProgram] = useState([]);

  // ------ LOAD ALL PROGRAM ------
  const loadProgram = async () => {
    setLoading(true);
    setError(null);

    try {
      const { success, data: programData } = await programApi.fetchAllProgram();
      console.log("👨‍🌾 Program fetched from API:", programData);

      if (success) {
        setProgram(programData);
      } else {
        setError("Failed to fetch program");
      }
    } catch (err) {
      console.error("⚠️ Error fetching program:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };




  // ------ ADD PROGRAM ------
  const addProgram = async (programData) => {
    setLoading(true);
    setError(null);

    try {
      const newProgram = await programApi.addProgram(programData);
      console.log("✅ New program added:", newProgram);

      setProgram((prev) => [...prev, newProgram]);
      return newProgram;
    } catch (err) {
      console.error("⚠️ Error adding program:", err);
      setError(err.message);
      throw err; // rethrow so modal can catch it
    } finally {
      setLoading(false);
    }
  };





 // ------ LOAD AVAILABLE PROGRAM (for modals/dropdowns) ------
  const loadAvailableProgram = async (search = "") => {
    setLoading(true);
    setError(null);

    try {
      const { success, data: availableProgram } = await programApi.fetchAvailableProgram(search);
      if (success) {
        return availableProgram;
      } else {
        setError("Failed to fetch available program");
        return [];
      }
    } catch (err) {
      console.error("⚠️ Error fetching available program:", err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  




  // ------ CLEAR PROGRAM STATE ------
  const clearProgram = () => setProgram([]);

  return {
    loading,
    error,
    program,
    addProgram,
    loadProgram,
    loadAvailableProgram,
    clearProgram,
  };
}