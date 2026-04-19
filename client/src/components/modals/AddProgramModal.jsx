import { useState } from "react";
import { X } from "lucide-react";
import { useProgram } from "../../context/ProgramContext.jsx";

export default function AddProgramModal({ onClose, onSuccess }) {
  const { addProgram } = useProgram();

  const [formData, setFormData] = useState({
    ProgramName: "",
    Description: "",
    StartDate: "",
    EndDate: "",
    Budget: "",
    TargetBenefits: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { ProgramName, StartDate, EndDate, Budget, TargetBenefits } = formData;

    if (!ProgramName || !StartDate || !EndDate || !Budget || !TargetBenefits) {
      setError("Please fill all required fields");
      setLoading(false);
      return;
    }

    try {
      await addProgram({
        ...formData,
        Budget: parseFloat(Budget),
        TargetBenefits: parseFloat(TargetBenefits),
        Status: "Active",
      });

      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to add program");
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
            Add Program
          </h2>
          <p className="text-sm text-gray-500">
            Fill in program information
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-600 p-2 text-sm rounded mb-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">

          {/* PROGRAM NAME */}
          <div>
            <label className="text-xs text-gray-500">Program Name</label>
            <input
              type="text"
              name="ProgramName"
              value={formData.ProgramName}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-xs text-gray-500">Description</label>
            <textarea
              name="Description"
              value={formData.Description}
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
                value={formData.StartDate}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label className="text-xs text-gray-500">End Date</label>
              <input
                type="date"
                name="EndDate"
                value={formData.EndDate}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

          </div>

          {/* BUDGET + BENEFITS */}
          <div className="grid grid-cols-2 gap-2">

            <div>
              <label className="text-xs text-gray-500">Budget</label>
              <input
                type="number"
                name="Budget"
                value={formData.Budget}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label className="text-xs text-gray-500">Target Benefits</label>
              <input
                type="number"
                name="TargetBenefits"
                value={formData.TargetBenefits}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn-gray">
              Cancel
            </button>

            <button type="submit" disabled={loading} className="btn-green">
              {loading ? "Saving..." : "Save Program"}
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