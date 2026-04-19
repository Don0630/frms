import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useSubsidy } from "../../context/SubsidyContext.jsx";
import { useProgram } from "../../context/ProgramContext.jsx";

export default function AddSubsidyModal({ onClose, onSuccess }) {
  const { addSubsidy } = useSubsidy();
  const { loadAvailableProgram } = useProgram();

  const [availablePrograms, setAvailablePrograms] = useState([]);
  const [searchProgram, setSearchProgram] = useState("");
  const [selectedProgram, setSelectedProgram] = useState(null);

  const [formData, setFormData] = useState({
    TotalAmount: "",
    DistributionDate: "",
    Remarks: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingPrograms, setLoadingPrograms] = useState(false);

  // LOAD PROGRAMS (debounced)
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

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { TotalAmount, DistributionDate } = formData;

    if (!selectedProgram || !TotalAmount || !DistributionDate) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      await addSubsidy({
        ProgramID: selectedProgram.ProgramID,
        TotalAmount: parseFloat(TotalAmount),
        DistributionDate,
        Remarks: formData.Remarks,
      });

      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to add subsidy");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6 relative animate-fadeIn">

        {/* CLOSE */}
        <button onClick={onClose} className="absolute top-3 right-3">
          <X />
        </button>

        {/* HEADER */}
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-gray-800">
            Add Subsidy
          </h2>
          <p className="text-sm text-gray-500">
            Assign subsidy to a program
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-600 p-2 text-sm rounded mb-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">

          {/* PROGRAM SEARCH */}
          <div className="relative">
            <label className="text-xs text-gray-500">Program</label>

            <input
              type="text"
              placeholder="Search program..."
              className="input"
              value={searchProgram}
              onChange={(e) => {
                setSearchProgram(e.target.value);
                setSelectedProgram(null);
              }}
            />

            {/* dropdown */}
            {loadingPrograms && (
              <p className="text-xs text-gray-400 mt-1">Searching...</p>
            )}

            {availablePrograms.length > 0 && (
              <div className="border rounded-md mt-1 max-h-28 overflow-y-auto bg-white">
                {availablePrograms.map((p) => (
                  <div
                    key={p.ProgramID}
                    onClick={() => {
                      setSelectedProgram(p);
                      setSearchProgram(p.ProgramName);
                    }}
                    className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                      selectedProgram?.ProgramID === p.ProgramID
                        ? "bg-green-600 text-white"
                        : ""
                    }`}
                  >
                    {p.ProgramName}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AMOUNT + DATE */}
          <div className="grid grid-cols-2 gap-2">

            <div>
              <label className="text-xs text-gray-500">Total Amount</label>
              <input
                type="number"
                name="TotalAmount"
                value={formData.TotalAmount}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500">Distribution Date</label>
              <input
                type="date"
                name="DistributionDate"
                value={formData.DistributionDate}
                onChange={handleChange}
                className="input"
              />
            </div>

          </div>

          {/* REMARKS */}
          <div>
            <label className="text-xs text-gray-500">Remarks</label>
            <textarea
              name="Remarks"
              value={formData.Remarks}
              onChange={handleChange}
              className="input"
              rows={3}
            />
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn-gray">
              Cancel
            </button>

            <button type="submit" disabled={loading} className="btn-green">
              {loading ? "Saving..." : "Save Subsidy"}
            </button>
          </div>

        </form>
      </div>

      {/* STYLES */}
      <style>{`
        .input {
          width: 100%;
          border: 1px solid #e5e7eb;
          padding: 8px;
          border-radius: 8px;
          font-size: 14px;
        }

        .input:focus {
          outline: none;
          border-color: #16a34a;
          box-shadow: 0 0 0 2px rgba(22,163,74,0.2);
        }

        .btn-green {
          background: #16a34a;
          color: white;
          padding: 8px 14px;
          border-radius: 8px;
        }

        .btn-gray {
          background: #e5e7eb;
          padding: 8px 14px;
          border-radius: 8px;
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}