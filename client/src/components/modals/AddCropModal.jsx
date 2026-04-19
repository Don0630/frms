import { useState } from "react";
import { X } from "lucide-react";
import { useCrop } from "../../context/CropContext.jsx";

export default function AddCropModal({ onClose }) {
  const { addCrop } = useCrop();

  const [formData, setFormData] = useState({
    CropName: "",
    Category: "",
    Season: "",
    AverageYieldPerHectare: "",
    MarketPrice: "",
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

    try {
      const newCrop = {
        ...formData,
        AverageYieldPerHectare: parseFloat(formData.AverageYieldPerHectare),
        MarketPrice: parseFloat(formData.MarketPrice),
      };

      await addCrop(newCrop);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to add crop");
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
            Add Crop
          </h2>
          <p className="text-sm text-gray-500">
            Fill in crop information
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 text-sm rounded mb-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">

          {/* CROP NAME */}
          <div>
            <label className="text-xs text-gray-500">Crop Name</label>
            <input
              type="text"
              name="CropName"
              value={formData.CropName}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          {/* CATEGORY + SEASON */}
          <div className="grid grid-cols-2 gap-2">

            <div>
              <label className="text-xs text-gray-500">Category</label>
              <select
                name="Category"
                value={formData.Category}
                onChange={handleChange}
                className="input"
              >
                <option value="">Select Category</option>
                <option>Grain</option>
                <option>Vegetable</option>
                <option>Fruit</option>
                <option>Root Crop</option>
                <option>Legume</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-500">Season</label>
              <select
                name="Season"
                value={formData.Season}
                onChange={handleChange}
                className="input"
              >
                <option value="">Select Season</option>
                <option>Wet</option>
                <option>Dry</option>
                <option>All Year</option>
              </select>
            </div>

          </div>

{/* YIELD + PRICE */}
<div className="grid grid-cols-2 gap-2">

  <div>
    <label className="text-xs text-gray-500">
      Yield per Hectare
    </label>
    <input
      type="number"
      step="0.01"
      name="AverageYieldPerHectare"
      value={formData.AverageYieldPerHectare}
      onChange={handleChange}
      className="input"
    />
  </div>

  <div>
    <label className="text-xs text-gray-500">
      Market Price
    </label>
    <input
      type="number"
      step="0.01"
      name="MarketPrice"
      value={formData.MarketPrice}
      onChange={handleChange}
      className="input"
    />
  </div>

</div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-gray"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="btn-green"
            >
              {loading ? "Saving..." : "Save Crop"}
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