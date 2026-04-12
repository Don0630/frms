// src/components/modals/AddMonitoringModal.jsx
import React, { useState, useEffect } from "react";
import { X, User, Activity, Hash, Calendar, BarChart2 } from "lucide-react";
import { useMonitoring } from "../../context/MonitoringContext.jsx";
import { useFarmer } from "../../context/FarmerContext.jsx";
import { useCrop } from "../../context/CropContext.jsx";
import { useLivestock } from "../../context/LivestockContext.jsx"; // assumed context

export default function AddMonitoringModal({ onClose, onSuccess }) {
  const { addMonitoring } = useMonitoring();
  const { loadSearchFarmer } = useFarmer();
  const { loadSearchCrop } = useCrop();
  const { loadSearchLivestock } = useLivestock(); // new

  const [availableFarmers, setAvailableFarmers] = useState([]);
  const [searchFarmer, setSearchFarmer] = useState("");
  const [selectedFarmer, setSelectedFarmer] = useState(null);

  const [availableCrops, setAvailableCrops] = useState([]);
  const [searchCrop, setSearchCrop] = useState("");
  const [selectedCrop, setSelectedCrop] = useState(null);

  const [availableLivestock, setAvailableLivestock] = useState([]);
  const [searchLivestock, setSearchLivestock] = useState("");
  const [selectedLivestock, setSelectedLivestock] = useState(null);

  const [ReportDate, setReportDate] = useState("");
  const [ProductionVolume, setProductionVolume] = useState("");
  const [Issues, setIssues] = useState("");
  const [Remarks, setRemarks] = useState("");

  const [error, setError] = useState("");
  const [loadingFarmer, setLoadingFarmer] = useState(false);
  const [loadingCrop, setLoadingCrop] = useState(false);
  const [loadingLivestock, setLoadingLivestock] = useState(false);

  // Loaders
  const loadFarmers = async (search = "") => {
    try {
      setLoadingFarmer(true);
      const data = await loadSearchFarmer(search);
      setAvailableFarmers(data || []);
    } catch {
      setAvailableFarmers([]);
    } finally {
      setLoadingFarmer(false);
    }
  };

  const loadCrops = async (search = "") => {
    try {
      setLoadingCrop(true);
      const data = await loadSearchCrop(search);
      setAvailableCrops(data || []);
    } catch {
      setAvailableCrops([]);
    } finally {
      setLoadingCrop(false);
    }
  };

  const loadLivestock = async (search = "") => {
    try {
      setLoadingLivestock(true);
      const data = await loadSearchLivestock(search);
      setAvailableLivestock(data || []);
    } catch {
      setAvailableLivestock([]);
    } finally {
      setLoadingLivestock(false);
    }
  };

  // Debounced searches
  useEffect(() => {
    const timeout = setTimeout(() => loadFarmers(searchFarmer), 300);
    return () => clearTimeout(timeout);
  }, [searchFarmer]);

  useEffect(() => {
    const timeout = setTimeout(() => loadCrops(searchCrop), 300);
    return () => clearTimeout(timeout);
  }, [searchCrop]);

  useEffect(() => {
    const timeout = setTimeout(() => loadLivestock(searchLivestock), 300);
    return () => clearTimeout(timeout);
  }, [searchLivestock]);

  useEffect(() => {
    loadFarmers();
    loadCrops();
    loadLivestock();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFarmer || !ReportDate) {
      setError("Please fill all required fields");
      return;
    }
    try {
      await addMonitoring({
        FarmerID: selectedFarmer.FarmerID,
        CropID: selectedCrop?.CropID || null,
        LivestockID: selectedLivestock?.LivestockID || null,
        ReportDate,
        ProductionVolume,
        Issues,
        Remarks,
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to add monitoring");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-sm p-6 w-96 relative shadow-xl">
        {/* Close */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
          onClick={onClose}
        >
          <X size={18} />
        </button>

        <h3 className="font-semibold text-xl mb-5 text-gray-800">Add Monitoring</h3>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <form className="space-y-4 text-sm" onSubmit={handleSubmit}>

          {/* Farmer Search */}
          <div className="relative">
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-green-400">
              <User size={16} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search farmer..."
                className="w-full outline-none text-gray-700"
                value={searchFarmer}
                onChange={(e) => setSearchFarmer(e.target.value)}
              />
            </div>
            {loadingFarmer && <span className="absolute right-3 top-2 text-gray-400 text-xs">Searching...</span>}
            <div className="max-h-28 overflow-y-auto border border-t-0 border-gray-200 rounded-b-md">
              {availableFarmers.map((f) => (
                <div
                  key={f.FarmerID}
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                    selectedFarmer?.FarmerID === f.FarmerID ? "bg-green-500 text-white font-semibold" : ""
                  }`}
                  onClick={() => setSelectedFarmer(f)}
                >
                  {f.FirstName} {f.LastName}
                </div>
              ))}
            </div>
          </div>

          {/* Crop Search */}
          <div className="relative">
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-green-400">
              <Activity size={16} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search crop..."
                className="w-full outline-none text-gray-700"
                value={searchCrop}
                onChange={(e) => setSearchCrop(e.target.value)}
              />
            </div>
            {loadingCrop && <span className="absolute right-3 top-2 text-gray-400 text-xs">Searching...</span>}
            <div className="max-h-28 overflow-y-auto border border-t-0 border-gray-200 rounded-b-md">
              {availableCrops.map((c) => (
                <div
                  key={c.CropID}
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                    selectedCrop?.CropID === c.CropID ? "bg-green-500 text-white font-semibold" : ""
                  }`}
                  onClick={() => setSelectedCrop(c)}
                >
                  {c.CropName}
                </div>
              ))}
            </div>
          </div>

          {/* Livestock Search */}
          <div className="relative">
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-green-400">
              <Hash size={16} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search livestock..."
                className="w-full outline-none text-gray-700"
                value={searchLivestock}
                onChange={(e) => setSearchLivestock(e.target.value)}
              />
            </div>
            {loadingLivestock && <span className="absolute right-3 top-2 text-gray-400 text-xs">Searching...</span>}
            <div className="max-h-28 overflow-y-auto border border-t-0 border-gray-200 rounded-b-md">
              {availableLivestock.map((l) => (
                <div
                  key={l.LivestockID}
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                    selectedLivestock?.LivestockID === l.LivestockID ? "bg-green-500 text-white font-semibold" : ""
                  }`}
                  onClick={() => setSelectedLivestock(l)}
                >
                  {l.Type} - {l.Breed || "Unknown"}
                </div>
              ))}
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-green-400">
            <Calendar size={16} className="text-gray-400 mr-2" />
            <input
              type="date"
              className="w-full outline-none text-gray-700"
              value={ReportDate}
              onChange={(e) => setReportDate(e.target.value)}
              required
            />
          </div>

          {/* Production */}
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-green-400">
            <BarChart2 size={16} className="text-gray-400 mr-2" />
            <input
              type="number"
              placeholder="Production Volume"
              className="w-full outline-none text-gray-700"
              value={ProductionVolume}
              onChange={(e) => setProductionVolume(e.target.value)}
            />
          </div>

          {/* Issues */}
          <textarea
            placeholder="Issues"
            className="w-full border px-3 py-2 rounded"
            value={Issues}
            onChange={(e) => setIssues(e.target.value)}
          />

          {/* Remarks */}
          <textarea
            placeholder="Remarks"
            className="w-full border px-3 py-2 rounded"
            value={Remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition"
          >
            Add Monitoring
          </button>
        </form>
      </div>
    </div>
  );
}