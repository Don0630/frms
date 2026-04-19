import { useState, useEffect } from "react";
import { X, Search, User } from "lucide-react";
import { useSubsidy } from "../../context/SubsidyContext.jsx";

export default function AddFarmerSubsidyModal({
  distributionID,
  onClose,
  onSuccess,
}) {
  const {
    loadAvailableFarmer,
    addFarmerSubsidy,
    loading,
  } = useSubsidy();

  const [availableFarmers, setAvailableFarmers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  // ================= LOAD FARMERS =================
  const fetchFarmers = async (keyword = "") => {
    try {
      const data = await loadAvailableFarmer(distributionID, keyword);
      setAvailableFarmers(data || []);
    } catch {
      setAvailableFarmers([]);
    }
  };

  // ================= DEBOUNCED SEARCH =================
  useEffect(() => {
    const t = setTimeout(() => {
      if (distributionID) fetchFarmers(search);
    }, 300);

    return () => clearTimeout(t);
  }, [search, distributionID]);

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedFarmer || !amount) {
      setError("Please select a farmer and enter amount");
      return;
    }

    try {
      await addFarmerSubsidy({
        DistributionID: distributionID,
        FarmerID: selectedFarmer.FarmerID,
        Amount: parseFloat(amount),
      });

      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to assign subsidy");
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
            Add Farmer Subsidy
          </h2>
          <p className="text-sm text-gray-500">
            Select a farmer and assign subsidy amount
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-600 p-2 text-sm rounded mb-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">

          {/* ================= SEARCH FARMER ================= */}
          <div>
            <label className="text-xs text-gray-500">Search Farmer</label>

            <div className="relative"> 

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input pl-8"
                placeholder="Type here..."
              />
            </div>

            {/* FARMER LIST */}
            <div className="max-h-28 overflow-y-auto border rounded-md mt-2">
              {availableFarmers.length === 0 ? (
                <p className="text-xs text-gray-400 p-2">
                  No farmers found
                </p>
              ) : (
                availableFarmers.map((f) => (
                  <div
                    key={f.FarmerID}
                    onClick={() => setSelectedFarmer(f)}
                    className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                      selectedFarmer?.FarmerID === f.FarmerID
                        ? "bg-green-100 font-semibold"
                        : ""
                    }`}
                  >
                    {f.FirstName} {f.LastName}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ================= SELECTED FARMER ================= */}
          {selectedFarmer && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User size={14} />
              <span>
                Selected:{" "}
                <strong>
                  {selectedFarmer.FirstName} {selectedFarmer.LastName}
                </strong>
              </span>
            </div>
          )}

          {/* ================= AMOUNT ================= */}
          <div>
            <label className="text-xs text-gray-500">Amount</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input"
              placeholder="Enter subsidy amount"
            />
          </div>

          {/* ================= ACTIONS ================= */}
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
              {loading ? "Saving..." : "Assign Subsidy"}
            </button>
          </div>

        </form>
      </div>

      {/* ================= STYLES ================= */}
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