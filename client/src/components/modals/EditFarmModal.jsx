import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useFarmer } from "../../context/FarmerContext.jsx";

export default function EditFarmModal({ onClose, selectedFarm, onSuccess }) {
  const { updateFarm, loading } = useFarmer();

  const [form, setForm] = useState({});
  const [error, setError] = useState("");

  // Load selected farm into form
  useEffect(() => {
    if (selectedFarm) {
      setForm({
        FarmID: selectedFarm.FarmID,
        FarmerID: selectedFarm.FarmerID,
        FarmBarangay: selectedFarm.FarmBarangay || "",
        FarmMunicipality: selectedFarm.FarmMunicipality || "",
        FarmProvince: selectedFarm.FarmProvince || "",
        FarmSize: selectedFarm.FarmSize || "",
      });
    }
  }, [selectedFarm]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { FarmBarangay, FarmMunicipality, FarmProvince, FarmSize } = form;

    if (!FarmBarangay || !FarmMunicipality || !FarmProvince || !FarmSize) {
      setError("Please fill all required fields");
      return;
    }

    try {
      await updateFarm(form);
      onSuccess?.(); // reload data
      onClose();
    } catch (err) {
      setError(err.message || "Failed to update farm");
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
            Edit Farm
          </h2>
          <p className="text-sm text-gray-500">
            Update farm details
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 text-sm rounded mb-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* LOCATION */}
          <div className="grid grid-cols-3 gap-2">

            <div>
              <label className="text-xs text-gray-500">Barangay</label>
              <input
                name="FarmBarangay"
                value={form.FarmBarangay || ""}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500">Municipality</label>
              <input
                name="FarmMunicipality"
                value={form.FarmMunicipality || ""}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500">Province</label>
              <input
                name="FarmProvince"
                value={form.FarmProvince || ""}
                onChange={handleChange}
                className="input"
              />
            </div>

          </div>

          {/* SIZE */}
          <div>
            <label className="text-xs text-gray-500">Farm Size (hectares)</label>
            <input
              type="number"
              step="0.01"
              name="FarmSize"
              value={form.FarmSize || ""}
              onChange={handleChange}
              className="input"
            />
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn-gray">
              Cancel
            </button>

            <button type="submit" disabled={loading} className="btn-green">
              {loading ? "Updating..." : "Update Farm"}
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