// src/components/modals/AddSubsidyModal.jsx
import React, { useState, useEffect } from "react";
import { X, DollarSign, Calendar, FileText } from "lucide-react";
import { useSubsidy } from "../../context/SubsidyContext.jsx";
import { useProgram } from "../../context/ProgramContext.jsx";

export default function AddSubsidyModal({ onClose, onSuccess }) {
  const { addSubsidy } = useSubsidy();
  const { loadAvailableProgram } = useProgram();

  const [availablePrograms, setAvailablePrograms] = useState([]);
  const [searchProgram, setSearchProgram] = useState("");
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [TotalAmount, setTotalAmount] = useState("");
  const [DistributionDate, setDistributionDate] = useState("");
  const [Remarks, setRemarks] = useState("");
  const [error, setError] = useState("");
  const [loadingPrograms, setLoadingPrograms] = useState(false);

  // Load programs with debounce
  useEffect(() => {
    const fetchPrograms = async () => {
      setLoadingPrograms(true);
      try {
        const programs = await loadAvailableProgram(searchProgram);
        setAvailablePrograms(programs);
      } catch {
        setAvailablePrograms([]);
      } finally {
        setLoadingPrograms(false);
      }
    };
    const timeout = setTimeout(fetchPrograms, 300);
    return () => clearTimeout(timeout);
  }, [searchProgram]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProgram || !TotalAmount || !DistributionDate) {
      setError("Please fill all required fields");
      return;
    }

    try {
      await addSubsidy({
        ProgramID: selectedProgram.ProgramID,
        TotalAmount,
        DistributionDate,
        Remarks,
      });

      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to add subsidy");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-sm p-6 w-96 relative shadow-xl">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
          onClick={onClose}
        >
          <X size={18} />
        </button>

        {/* Header */}
        <h3 className="font-semibold text-xl mb-5 text-gray-800">Add Subsidy</h3>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <form className="space-y-4 text-sm" onSubmit={handleSubmit}>
          {/* Program Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search active program..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-green-400"
              value={searchProgram}
              onChange={(e) => {
                setSearchProgram(e.target.value);
                setSelectedProgram(null);
              }}
            />
            {loadingPrograms && (
              <span className="absolute right-3 top-2 text-gray-400 text-xs">
                Searching...
              </span>
            )}
            {availablePrograms.length > 0 && (
              <div className="max-h-28 overflow-y-auto border border-t-0 border-gray-200 rounded-b-md">
                {availablePrograms.map((p) => (
                  <div
                    key={p.ProgramID}
                    className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                      selectedProgram?.ProgramID === p.ProgramID
                        ? "bg-green-500 font-semibold text-white"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedProgram(p);
                      setSearchProgram(p.ProgramName);
                    }}
                  >
                    {p.ProgramName}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Total Amount */}
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-green-400">
            <DollarSign size={16} className="text-gray-400 mr-2" />
            <input
              type="number"
              placeholder="Total Amount"
              className="w-full outline-none text-gray-700"
              value={TotalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              required
            />
          </div>

          {/* Distribution Date */}
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-green-400">
            <Calendar size={16} className="text-gray-400 mr-2" />
            <input
              type="date"
              className="w-full outline-none text-gray-700"
              value={DistributionDate}
              onChange={(e) => setDistributionDate(e.target.value)}
              required
            />
          </div>

          {/* Remarks */}
          <div className="flex items-start border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-green-400">
            <FileText size={16} className="text-gray-400 mr-2 mt-1" />
            <textarea
              placeholder="Remarks"
              className="w-full outline-none text-gray-700 resize-none"
              rows={3}
              value={Remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold transition"
          >
            Add Subsidy
          </button>
        </form>
      </div>
    </div>
  );
}