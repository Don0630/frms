import React, { useState } from "react";
import Modal from "../common/Modal";

import useSearchFarmer from "../../hooks/useSearchFarmer";
import useSearchCrop from "../../hooks/useSearchCrop";
import useSearchLivestock from "../../hooks/useSearchLivestock";

import useDebounce from "../../hooks/useDebounce";

import {
  modalInput,
  modalDropdown,
  modalDropdownItem,
  modalLabel,
  modalButtonPrimary,
  modalButtonSecondary,
} from "../common/ModalUI";

export default function AddMonitoringModal({
  onClose,
  onSubmit,
  loading,
}) {
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

  // debounce
  const debouncedFarmer = useDebounce(searchFarmer, 300);
  const debouncedCrop = useDebounce(searchCrop, 300);
  const debouncedLivestock = useDebounce(searchLivestock, 300);

  // queries
  const { searchFarmerQuery } = useSearchFarmer(debouncedFarmer);
  const { searchCropQuery } = useSearchCrop(debouncedCrop);
  const { searchLivestockQuery } = useSearchLivestock(debouncedLivestock);

  const availableFarmers = searchFarmerQuery?.data?.data || [];
  const availableCrops = searchCropQuery?.data?.data || [];
  const availableLivestock = searchLivestockQuery?.data?.data || [];

  const loadingFarmer =
    searchFarmerQuery?.isLoading || searchFarmerQuery?.isFetching;

  const loadingCrop =
    searchCropQuery?.isLoading || searchCropQuery?.isFetching;

  const loadingLivestock =
    searchLivestockQuery?.isLoading ||
    searchLivestockQuery?.isFetching;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!selectedFarmer || !ReportDate) {
      setError("Farmer and Report Date are required");
      return;
    }

    onSubmit({
      FarmerID: selectedFarmer.FarmerID,
      CropID: selectedCrop?.CropID || null,
      LivestockID: selectedLivestock?.LivestockID || null,
      ReportDate,
      ProductionVolume,
      Issues,
      Remarks,
    });
  };

  return (
    <Modal title="Add Monitoring" onClose={onClose} width="max-w-2xl">
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 p-2 text-sm rounded mb-3">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">

        {/* ================= FARMER ================= */}
        <div className="relative">
          <label className={modalLabel}>Farmer *</label>

          <input
            type="text"
            placeholder="Search farmer..."
            value={searchFarmer}
            onChange={(e) => {
              setSearchFarmer(e.target.value);
              setSelectedFarmer(null);
            }}
            className={modalInput}
          />

          {loadingFarmer && (
            <div className="mt-2 text-xs text-gray-500">
              Searching farmers...
            </div>
          )}

          {!selectedFarmer && availableFarmers.length > 0 && (
            <div className={modalDropdown}>
              {availableFarmers.map((farmer) => (
                <div
                  key={farmer.FarmerID}
                  className={modalDropdownItem}
                  onClick={() => {
                    setSelectedFarmer(farmer);
                    setSearchFarmer(
                      `${farmer.FirstName} ${farmer.LastName}`
                    );
                  }}
                >
                  {farmer.FirstName} {farmer.LastName}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ================= CROP + LIVESTOCK ================= */}
        <div className="grid grid-cols-2 gap-3">

          {/* CROP */}
          <div className="relative">
            <label className={modalLabel}>Crop</label>

            <input
              type="text"
              placeholder="Search crop..."
              value={searchCrop}
              onChange={(e) => {
                setSearchCrop(e.target.value);
                setSelectedCrop(null);
              }}
              className={modalInput}
            />

            {loadingCrop && (
              <div className="mt-2 text-xs text-gray-500">
                Searching crops...
              </div>
            )}

            {!selectedCrop && availableCrops.length > 0 && (
              <div className={modalDropdown}>
                {availableCrops.map((crop) => (
                  <div
                    key={crop.CropID}
                    className={modalDropdownItem}
                    onClick={() => {
                      setSelectedCrop(crop);
                      setSearchCrop(crop.CropName);
                    }}
                  >
                    {crop.CropName}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* LIVESTOCK */}
          <div className="relative">
            <label className={modalLabel}>Livestock</label>

            <input
              type="text"
              placeholder="Search livestock..."
              value={searchLivestock}
              onChange={(e) => {
                setSearchLivestock(e.target.value);
                setSelectedLivestock(null);
              }}
              className={modalInput}
            />

            {loadingLivestock && (
              <div className="mt-2 text-xs text-gray-500">
                Searching livestock...
              </div>
            )}

            {!selectedLivestock && availableLivestock.length > 0 && (
              <div className={modalDropdown}>
                {availableLivestock.map((livestock) => (
                  <div
                    key={livestock.LivestockID}
                    className={modalDropdownItem}
                    onClick={() => {
                      setSelectedLivestock(livestock);
                      setSearchLivestock(
                        `${livestock.Type} ${livestock.Breed || ""}`
                      );
                    }}
                  >
                    {livestock.Type} - {livestock.Breed || "Unknown"}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ================= DATE + PRODUCTION ================= */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={modalLabel}>Report Date *</label>
            <input
              type="date"
              value={ReportDate}
              onChange={(e) => setReportDate(e.target.value)}
              className={modalInput}
            />
          </div>

          <div>
            <label className={modalLabel}>Production Volume</label>
            <input
              type="number"
              value={ProductionVolume}
              onChange={(e) => setProductionVolume(e.target.value)}
              className={modalInput}
            />
          </div>
        </div>

        {/* ISSUES */}
        <div>
          <label className={modalLabel}>Issues</label>
          <textarea
            rows="3"
            value={Issues}
            onChange={(e) => setIssues(e.target.value)}
            className={modalInput}
          />
        </div>

        {/* REMARKS */}
        <div>
          <label className={modalLabel}>Remarks</label>
          <textarea
            rows="3"
            value={Remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className={modalInput}
          />
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className={modalButtonSecondary}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className={modalButtonPrimary}
          >
            {loading ? "Saving..." : "Save Monitoring"}
          </button>
        </div>
      </form>
    </Modal>
  );
}