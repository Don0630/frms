// src/components/modals/AddLivestockModal.jsx
import { useState } from "react";
import { X } from "lucide-react";
import { useLivestock } from "../../context/LivestockContext.jsx";

export default function AddLivestockModal({ onClose, onSuccess }) {
  const { addLivestock, loading } = useLivestock();
  const [form, setForm] = useState({
    Type: "",
    Breed: "",
    AverageProduction: "",
    MarketPrice: "",
  });
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Simple validation
    if (!form.Type || !form.Breed || !form.AverageProduction || !form.MarketPrice) {
      setError("Please fill in all fields");
      return;
    }

    try {
      await addLivestock({
        Type: form.Type,
        Breed: form.Breed,
        AverageProduction: Number(form.AverageProduction),
        MarketPrice: Number(form.MarketPrice),
      });
      onSuccess?.(); // reload list if needed
      onClose();
    } catch (err) {
      setError(err.message || "Failed to add livestock");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
        >
          <X className="w-6 h-6" />
        </button>

        <h3 className="text-xl font-semibold mb-4 text-gray-800">Add Livestock</h3>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <form className="space-y-3" onSubmit={handleSubmit}>
          <input
            name="Type"
            placeholder="Type (e.g., Cow, Goat)"
            className="w-full border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
            value={form.Type}
            onChange={handleChange}
          />
          <input
            name="Breed"
            placeholder="Breed"
            className="w-full border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
            value={form.Breed}
            onChange={handleChange}
          />
          <input
            name="AverageProduction"
            placeholder="Average Production per Month"
            type="number"
            className="w-full border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
            value={form.AverageProduction}
            onChange={handleChange}
          />
          <input
            name="MarketPrice"
            placeholder="Market Price"
            type="number"
            className="w-full border px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
            value={form.MarketPrice}
            onChange={handleChange}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            {loading ? "Saving..." : "Add Livestock"}
          </button>
        </form>
      </div>
    </div>
  );
}