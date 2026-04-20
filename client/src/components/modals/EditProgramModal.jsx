import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useProgram } from "../../context/ProgramContext.jsx";

export default function EditProgramModal({ onClose, selectedProgram }) {
  const { updateProgram, loading } = useProgram();

  const [form, setForm] = useState({});
  const [error, setError] = useState("");

  // Format date for input type="date"
  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };

  // Load selected program
  useEffect(() => {
    if (selectedProgram) {
      setForm({
        ProgramID: selectedProgram.ProgramID,
        ProgramName: selectedProgram.ProgramName || "",
        Description: selectedProgram.Description || "",
        StartDate: formatDate(selectedProgram.StartDate),
        EndDate: formatDate(selectedProgram.EndDate),
        Budget: selectedProgram.Budget || "",
        TargetBeneficiaries: selectedProgram.TargetBeneficiaries || "",
      });
    }
  }, [selectedProgram]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await updateProgram({
        ...form,
        Budget: parseFloat(form.Budget),
        TargetBeneficiaries: parseInt(form.TargetBeneficiaries),
      });

      onClose();
    } catch (err) {
      setError(err.message || "Failed to update program");
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
            Edit Program
          </h2>
          <p className="text-sm text-gray-500">
            Update program information
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-600 p-2 text-sm rounded mb-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* PROGRAM NAME */}
          <div>
            <label className="text-xs text-gray-500">Program Name</label>
            <input
              name="ProgramName"
              value={form.ProgramName || ""}
              onChange={handleChange}
              className="input"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-xs text-gray-500">Description</label>
            <textarea
              name="Description"
              value={form.Description || ""}
              onChange={handleChange}
              className="input"
              rows={3}
            />
          </div>

          {/* DATES */}
          <div className="grid grid-cols-2 gap-2">

            <div>
              <label className="text-xs text-gray-500">Start Date</label>
              <input
                type="date"
                name="StartDate"
                value={form.StartDate || ""}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500">End Date</label>
              <input
                type="date"
                name="EndDate"
                value={form.EndDate || ""}
                onChange={handleChange}
                className="input"
              />
            </div>

          </div>

          {/* BUDGET + BENEFICIARIES */}
          <div className="grid grid-cols-2 gap-2">

            <div>
              <label className="text-xs text-gray-500">Budget</label>
              <input
                type="number"
                name="Budget"
                value={form.Budget || ""}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500">
                Target Beneficiaries
              </label>
              <input
                type="number"
                name="TargetBeneficiaries"
                value={form.TargetBeneficiaries || ""}
                onChange={handleChange}
                className="input"
              />
            </div>

          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn-gray">
              Cancel
            </button>

            <button type="submit" disabled={loading} className="btn-green">
              {loading ? "Updating..." : "Update Program"}
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