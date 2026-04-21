import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useMonitoring } from "../../context/MonitoringContext.jsx";
import { useFarmer } from "../../context/FarmerContext.jsx";
import { useCrop } from "../../context/CropContext.jsx";
import { useLivestock } from "../../context/LivestockContext.jsx";

export default function AddMonitoringModal({ onClose, onSuccess }) {
  const { addMonitoring } = useMonitoring();
  const { loadSearchFarmer } = useFarmer();
  const { loadSearchCrop } = useCrop();
  const { loadSearchLivestock } = useLivestock();

  const [availableFarmers, setAvailableFarmers] = useState([]);
  const [availableCrops, setAvailableCrops] = useState([]);
  const [availableLivestock, setAvailableLivestock] = useState([]);

  const [searchFarmer, setSearchFarmer] = useState("");
  const [searchCrop, setSearchCrop] = useState("");
  const [searchLivestock, setSearchLivestock] = useState("");

  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [selectedLivestock, setSelectedLivestock] = useState(null);

  const [ReportDate, setReportDate] = useState("");
  const [ProductionVolume, setProductionVolume] = useState("");
  const [Issues, setIssues] = useState("");
  const [Remarks, setRemarks] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // SEARCH
  useEffect(() => {
    const t = setTimeout(async () => {
      const data = await loadSearchFarmer(searchFarmer);
      setAvailableFarmers(data || []);
    }, 300);
    return () => clearTimeout(t);
  }, [searchFarmer]);

  useEffect(() => {
    const t = setTimeout(async () => {
      const data = await loadSearchCrop(searchCrop);
      setAvailableCrops(data || []);
    }, 300);
    return () => clearTimeout(t);
  }, [searchCrop]);

  useEffect(() => {
    const t = setTimeout(async () => {
      const data = await loadSearchLivestock(searchLivestock);
      setAvailableLivestock(data || []);
    }, 300);
    return () => clearTimeout(t);
  }, [searchLivestock]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedFarmer || !ReportDate) {
      setError("Farmer and Report Date are required");
      return;
    }

    try {
      setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-3">

      <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl p-6 relative animate-fadeIn max-h-[90vh] overflow-y-auto">

        {/* CLOSE */}
        <button onClick={onClose} className="absolute top-3 right-3">
          <X />
        </button>

        {/* HEADER */}
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-gray-800">
            Add Monitoring
          </h2>
          <p className="text-sm text-gray-500">
            Record production monitoring details
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-600 p-2 text-sm rounded mb-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* FARMER */}
          <div>
            <label className="text-xs text-gray-500">Farmer *</label>
            <input
              className="input"
              value={searchFarmer}
              placeholder="Search farmer..."
              onChange={(e) => {
                setSearchFarmer(e.target.value);
                setSelectedFarmer(null);
              }}
            />

            {availableFarmers.length > 0 && (
              <div className="dropdown">
                {availableFarmers.map((f) => (
                  <div
                    key={f.FarmerID}
                    className="item"
                    onClick={() => {
                      setSelectedFarmer(f);
                      setSearchFarmer(`${f.FirstName} ${f.LastName}`);
                      setAvailableFarmers([]);
                    }}
                  >
                    {f.FirstName} {f.LastName}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CROP + LIVESTOCK ROW */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

            <div>
              <label className="text-xs text-gray-500">Crop</label>
              <input
                className="input"
                value={searchCrop}
                placeholder="Search crop..."
                onChange={(e) => {
                  setSearchCrop(e.target.value);
                  setSelectedCrop(null);
                }}
              />

              {availableCrops.length > 0 && (
                <div className="dropdown">
                  {availableCrops.map((c) => (
                    <div
                      key={c.CropID}
                      className="item"
                      onClick={() => {
                        setSelectedCrop(c);
                        setSearchCrop(c.CropName);
                        setAvailableCrops([]);
                      }}
                    >
                      {c.CropName}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="text-xs text-gray-500">Livestock</label>
              <input
                className="input"
                value={searchLivestock}
                placeholder="Search livestock..."
                onChange={(e) => {
                  setSearchLivestock(e.target.value);
                  setSelectedLivestock(null);
                }}
              />

              {availableLivestock.length > 0 && (
                <div className="dropdown">
                  {availableLivestock.map((l) => (
                    <div
                      key={l.LivestockID}
                      className="item"
                      onClick={() => {
                        setSelectedLivestock(l);
                        setSearchLivestock(l.Type);
                        setAvailableLivestock([]);
                      }}
                    >
                      {l.Type} - {l.Breed || "Unknown"}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* DATE + PRODUCTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

            <div>
              <label className="text-xs text-gray-500">Report Date *</label>
              <input
                type="date"
                className="input"
                value={ReportDate}
                onChange={(e) => setReportDate(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs text-gray-500">Production Volume</label>
              <input
                type="number"
                className="input"
                value={ProductionVolume}
                onChange={(e) => setProductionVolume(e.target.value)}
              />
            </div>

          </div>

          {/* ISSUES + REMARKS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

            <textarea
              className="input"
              rows={3}
              placeholder="Issues"
              value={Issues}
              onChange={(e) => setIssues(e.target.value)}
            />

            <textarea
              className="input"
              rows={3}
              placeholder="Remarks"
              value={Remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />

          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn-gray">
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="btn-green"
            >
              {loading ? "Saving..." : "Save Monitoring"}
            </button>
          </div>

        </form>
      </div>

      {/* STYLE SYSTEM (same as EditFarmerModal) */}
      <style>{`
        .input {
          width: 100%;
          border: 1px solid #e5e7eb;
          padding: 8px;
          border-radius: 8px;
          font-size: 14px;
          margin-top: 4px;
        }

        .input:focus {
          outline: none;
          border-color: #16a34a;
          box-shadow: 0 0 0 2px rgba(22,163,74,0.2);
        }

        .dropdown {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          margin-top: 4px;
          max-height: 120px;
          overflow-y: auto;
          background: white;
        }

        .item {
          padding: 8px;
          cursor: pointer;
        }

        .item:hover {
          background: #f3f4f6;
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