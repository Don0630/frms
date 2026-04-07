import { useEffect, useState } from "react";
import { X, Search, UserPlus } from "lucide-react";
import { useFarmer } from "../../context/FarmerContext.jsx";

export default function AddFarmerSubsidyModal({ distributionID, onClose }) {
  const { loadAvailableFarmer } = useFarmer();

  const [search, setSearch] = useState("");
  const [availableFarmers, setAvailableFarmers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [amount, setAmount] = useState("");

  // 🔹 Fetch farmers with debounce
  useEffect(() => {
    if (!distributionID) return;
    const handler = setTimeout(async () => {
      setLoading(true);
      try {
         const farmers = await loadAvailableFarmer(distributionID, search);
        setAvailableFarmers(farmers);
      } catch (err) {
        console.error(err);
        setAvailableFarmers([]);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms delay

    return () => clearTimeout(handler);
  }, [search, distributionID]);

  const handleSelectFarmer = (farmerID) => setSelectedFarmer(farmerID);

  const handleAddFarmer = () => {
    if (!selectedFarmer) return alert("Please select a farmer first.");
    console.log("Adding farmer:", selectedFarmer, "Amount:", amount);
    // TODO: Call your backend here to add farmer to distribution
    handleClose();
  };

  const handleClose = () => {
    setSelectedFarmer(null);
    setAmount("");
    setAvailableFarmers([]);
    setSearch("");
    onClose();
  };

  if (!distributionID) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-xl p-6 relative">
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
          <X />
        </button>

        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          Select Farmer
        </h2>

        <div className="flex items-center border rounded-lg px-3 py-2 mb-4">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search farmer..."
            className="ml-2 w-full outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="border rounded-lg max-h-60 overflow-y-auto mb-4">
          {loading ? (
            <p className="p-4 text-center text-gray-500">Loading...</p>
          ) : availableFarmers.length > 0 ? (
            availableFarmers.map((farmer) => (
              <label
                key={farmer.FarmerID}
                className="flex items-center justify-between px-4 py-2 border-b hover:bg-gray-50 cursor-pointer"
              >
                <div>
                  <p className="font-medium">{farmer.FirstName} {farmer.LastName}</p>
                  <p className="text-xs text-gray-500">{farmer.FarmLocation}</p>
                </div>
                <input
                  type="radio"
                  name="farmer"
                  checked={selectedFarmer === farmer.FarmerID}
                  onChange={() => handleSelectFarmer(farmer.FarmerID)}
                />
              </label>
            ))
          ) : (
            <p className="p-4 text-center text-gray-500">No available farmers</p>
          )}
        </div>

        <div className="mb-4">
          <label className="text-sm text-gray-600">Amount</label>
          <input
            type="number"
            className="w-full border rounded-lg px-3 py-2 mt-1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount (optional)"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={handleClose} className="px-4 py-2 border rounded-lg">
            Close
          </button>
          <button
            onClick={handleAddFarmer}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Add Farmer
          </button>
        </div>
      </div>
    </div>
  );
}