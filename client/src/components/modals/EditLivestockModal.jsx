import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useLivestock } from "../../context/LivestockContext.jsx";

export default function EditLivestockModal({
  onClose,
  onSuccess,
  selectedLivestock,
}) {
  const { updateLivestock, loading } = useLivestock();

  const [formData, setFormData] = useState({
    LivestockID: "",
    Type: "",
    Breed: "",
    AverageProduction: "",
    MarketPrice: "",
  });

  const [error, setError] = useState("");

  // LOAD SELECTED DATA
  useEffect(() => {
    if (selectedLivestock) {
      setFormData({
        LivestockID: selectedLivestock.LivestockID,
        Type: selectedLivestock.Type || "",
        Breed: selectedLivestock.Breed || "",
        AverageProduction: selectedLivestock.AverageProduction || "",
        MarketPrice: selectedLivestock.MarketPrice || "",
      });
    }
  }, [selectedLivestock]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.Type ||
      !formData.Breed ||
      !formData.AverageProduction ||
      !formData.MarketPrice
    ) {
      setError("Please fill in all fields");
      return;
    }

    try {
      await updateLivestock({
        LivestockID: formData.LivestockID,
        Type: formData.Type,
        Breed: formData.Breed,
        AverageProduction: parseFloat(formData.AverageProduction),
        MarketPrice: parseFloat(formData.MarketPrice),
      });

      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to update livestock");
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
            Edit Livestock
          </h2>
          <p className="text-sm text-gray-500">
            Update livestock information
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-600 p-2 text-sm rounded mb-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">

          {/* TYPE */}
          <div>
            <label className="text-xs text-gray-500">Type</label>
            <input
              type="text"
              name="Type"
              value={formData.Type}
              onChange={handleChange}
              className="input"
            />
          </div>

          {/* BREED */}
          <div>
            <label className="text-xs text-gray-500">Breed</label>
            <input
              type="text"
              name="Breed"
              value={formData.Breed}
              onChange={handleChange}
              className="input"
            />
          </div>

          {/* PRODUCTION + PRICE */}
          <div className="grid grid-cols-2 gap-2">

            <div>
              <label className="text-xs text-gray-500">
                Avg Production
              </label>
              <input
                type="number"
                step="0.01"
                name="AverageProduction"
                value={formData.AverageProduction}
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
              {loading ? "Updating..." : "Update Livestock"}
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