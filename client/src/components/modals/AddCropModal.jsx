// src/components/modals/AddCropModal.jsx
import { useState } from "react";
import { X, Tag, CloudSun, BarChart3, PhilippinePeso } from "lucide-react";
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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Convert numeric fields
      const newCrop = {
        ...formData,
        AverageYieldPerHectare: parseFloat(formData.AverageYieldPerHectare),
        MarketPrice: parseFloat(formData.MarketPrice),
      };

      await addCrop(newCrop);
      onClose(); // close modal after successful add
    } catch (err) {
      setError(err.message || "Failed to add crop");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg p-6 w-96 relative shadow-lg">
        <button
          className="absolute top-3 right-3"
          onClick={onClose}
        >
          <X />
        </button>
        <h3 className="font-semibold text-lg mb-4">Add New Crop</h3>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block mb-1">Crop Name</label>
            <input
              type="text"
              name="CropName"
              value={formData.CropName}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 flex items-center gap-1">
              <Tag size={14} className="text-red-500" /> Category
            </label>
            <input
              type="text"
              name="Category"
              value={formData.Category}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 flex items-center gap-1">
              <CloudSun size={14} className="text-blue-500" /> Season
            </label>
            <input
              type="text"
              name="Season"
              value={formData.Season}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 flex items-center gap-1">
              <BarChart3 size={14} className="text-green-500" /> Yield (ha)
            </label>
            <input
              type="number"
              step="0.01"
              name="AverageYieldPerHectare"
              value={formData.AverageYieldPerHectare}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 flex items-center gap-1">
              <PhilippinePeso size={14} className="text-purple-500" /> Price
            </label>
            <input
              type="number"
              step="0.01"
              name="MarketPrice"
              value={formData.MarketPrice}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Crop"}
          </button>
        </form>
      </div>
    </div>
  );
}