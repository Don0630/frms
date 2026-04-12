import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useSubsidyDetails } from "../../context/SubsidyDetailsContext.jsx";

export default function AddFarmerSubsidyModal({ distributionID, onClose, onSuccess }) {
  const { loadAvailableFarmer, addFarmerSubsidy } = useSubsidyDetails();

  const [availableFarmers, setAvailableFarmers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // 🔍 Load farmers (debounced)
  const loadFarmers = async (search = "") => {
    try {
      setLoading(true);
      const data = await loadAvailableFarmer(distributionID, search);
      setAvailableFarmers(data || []);
    } catch {
      setAvailableFarmers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!distributionID) return;
    const timeout = setTimeout(() => loadFarmers(search), 300);
    return () => clearTimeout(timeout);
  }, [search, distributionID]);

  // ✅ ADD FARMER (FIXED)
  const handleAddFarmer = async () => {
    if (!selectedFarmer) {
      setError("Please select a farmer first.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await addFarmerSubsidy({
        DistributionID: distributionID,
        FarmerID: selectedFarmer.FarmerID,
        Amount: amount ? Number(amount) : 0,
      });

      // ✅ Reset after success
      setSelectedFarmer(null);
      setAmount("");
      setSearch("");
      setAvailableFarmers([]);
      onSuccess?.()
      onClose(); // close modal
    } catch (err) {
      console.error(err);
      setError("Failed to add farmer.");
    } finally {
      setSaving(false);
    }
  };

  if (!distributionID) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-sm p-6 w-96 relative shadow-xl">

        {/* Close */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          <X size={18} />
        </button>

        <h3 className="font-semibold text-xl mb-5 text-gray-800">
          Add Farmer
        </h3>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <div className="space-y-4 text-sm">

          {/* 🔍 Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search farmer..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-green-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {loading && (
              <span className="absolute right-3 top-2 text-gray-400 text-xs">
                Searching...
              </span>
            )}

            <div className="max-h-28 overflow-y-auto border border-t-0 border-gray-200 rounded-b-md">
              
              {!loading && availableFarmers.length === 0 && (
                <div className="px-3 py-2 text-gray-400 text-xs">
                  No results found
                </div>
              )}

              {availableFarmers.map((f) => (
                <div
                  key={f.FarmerID}
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                    selectedFarmer?.FarmerID === f.FarmerID
                      ? "bg-green-500 text-white font-semibold"
                      : ""
                  }`}
                  onClick={() => setSelectedFarmer(f)}
                >
                  {f.FirstName} {f.LastName}
                </div>
              ))}
            </div>
          </div>

          {/* 💰 Amount */}
          <input
            type="number"
            placeholder="Amount (optional)"
            className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-green-400"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          {/* Submit */}
          <button
            onClick={handleAddFarmer}
            disabled={saving}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition disabled:opacity-50"
          >
            {saving ? "Adding..." : "Add Farmer"}
          </button>
        </div>
      </div>
    </div>
  );
}