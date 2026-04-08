// src/components/modals/AddProgramModal.jsx
import React, { useState } from "react";
import { X } from "lucide-react";
import { useProgram } from "../../context/ProgramContext.jsx";

export default function AddProgramModal({ onClose, onSuccess }) {
  const { addProgram } = useProgram();

  const [ProgramName, setProgramName] = useState("");
  const [Description, setDescription] = useState("");
  const [StartDate, setStartDate] = useState("");
  const [EndDate, setEndDate] = useState("");
  const [Budget, setBudget] = useState("");
  const [TargetBenefits, setTargetBenefits] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!ProgramName || !StartDate || !EndDate || !Budget || !TargetBenefits) {
      setError("Please fill all required fields");
      return;
    }

    try {
      await addProgram({
        ProgramName,
        Description,
        StartDate,
        EndDate,
        Budget,
        TargetBenefits,
        Status: "Active", // auto-set
      });

      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to add program");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg p-6 w-96 relative">
        
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X />
        </button>

        {/* Header */}
        <h3 className="font-semibold text-lg mb-4">Add New Program</h3>
        {error && <p className="text-red-500 text-xs mb-2">{error}</p>}

        {/* Form */}
        <form className="space-y-3 text-xs" onSubmit={handleSubmit}>
          
          <input
            type="text"
            placeholder="Program Name"
            className="w-full border px-3 py-2 rounded"
            value={ProgramName}
            onChange={(e) => setProgramName(e.target.value)}
            required
          />

          <textarea
            placeholder="Description"
            className="w-full border px-3 py-2 rounded"
            value={Description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="date"
            className="w-full border px-3 py-2 rounded"
            value={StartDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />

          <input
            type="date"
            className="w-full border px-3 py-2 rounded"
            value={EndDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Budget"
            className="w-full border px-3 py-2 rounded"
            value={Budget}
            onChange={(e) => setBudget(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Target Benefits"
            className="w-full border px-3 py-2 rounded"
            value={TargetBenefits}
            onChange={(e) => setTargetBenefits(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white px-3 py-2 rounded text-sm"
          >
            Add Program
          </button>
        </form>
      </div>
    </div>
  );
}