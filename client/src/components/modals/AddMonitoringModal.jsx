import React, { useState, useEffect, useRef } from "react";
import Modal from "../common/Modal";

import useSearchFarmer from "../../hooks/useSearchFarmer";
import useSearchCrop from "../../hooks/useSearchCrop";
import useSearchLivestock from "../../hooks/useSearchLivestock";
import useDebounce from "../../hooks/useDebounce";
import * as validators from "../../utils/validators";
import * as monitoringValidator from "../../utils/monitoringValidator";

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
  // ================= STATES =================
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

  // ================= DROPDOWNS =================
  const [showFarmerDropdown, setShowFarmerDropdown] = useState(false);
  const [showCropDropdown, setShowCropDropdown] = useState(false);
  const [showLivestockDropdown, setShowLivestockDropdown] = useState(false);

  // ================= REFS =================
  const farmerRef = useRef(null);
  const cropRef = useRef(null);
  const livestockRef = useRef(null);

  // ================= DEBOUNCE =================
  const debouncedFarmer = useDebounce(searchFarmer, 300);
  const debouncedCrop = useDebounce(searchCrop, 300);
  const debouncedLivestock = useDebounce(searchLivestock, 300);

  // ================= QUERIES =================
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
    searchLivestockQuery?.isLoading || searchLivestockQuery?.isFetching;

  // ================= OUTSIDE CLICK =================
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (farmerRef.current && !farmerRef.current.contains(e.target)) {
        setShowFarmerDropdown(false);
      }
      if (cropRef.current && !cropRef.current.contains(e.target)) {
        setShowCropDropdown(false);
      }
      if (livestockRef.current && !livestockRef.current.contains(e.target)) {
        setShowLivestockDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);


// ================= VALIDATION =================
  const validate = () => {
    if (!selectedFarmer) return "Please select a Farmer!";
    if (!ReportDate) return "Report Date is required!"; 
    if (!Issues.trim()) return "Issues is required!";
    if (!Remarks.trim()) return "Remarks is required!";

    const dateError = monitoringValidator.validateMonitoringDate( ReportDate, "Report Date" );
    if (dateError) return dateError;

    const productionVolumeError = validators.validatePositiveNumber( ProductionVolume, "Production Volume");
    if (productionVolumeError) return productionVolumeError;

    return "";
  };


  // ================= SUBMIT =================
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const err = validate();
    if (err) return setError(err);


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
    <Modal title="Add Monitoring" onClose={onClose} width="max-w-xl">
      {error && (
        <p className="text-red-500 text-sm mb-3">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">

        {/* ================= FARMER ================= */}
        <div className="relative" ref={farmerRef}>

          <div className="flex items-center justify-between">
            <label className={modalLabel}>Farmer *</label>

            {loadingFarmer && (
              <span className="text-xs text-green-600 animate-pulse">
                Searching Farmers...
              </span>
            )}

            {!loadingFarmer &&
              !selectedFarmer &&
              availableFarmers.length === 0 &&
              searchFarmer.length > 0 && (
                <p className="text-xs text-red-400 mt-1">
                  No farmer found!
                </p>
              )}
          </div>

          <input
            value={searchFarmer}
            onFocus={() => setShowFarmerDropdown(true)}
            onChange={(e) => {
              setSearchFarmer(e.target.value);
              setSelectedFarmer(null);
              setShowFarmerDropdown(true);
            }}
            className={modalInput}
          />

          {showFarmerDropdown &&
            !loadingFarmer &&
            availableFarmers.length > 0 && (
              <div className={`${modalDropdown} absolute z-50`}>
                {availableFarmers.map((f) => (
                  <div
                    key={f.FarmerID}
                    onClick={() => {
                      setSelectedFarmer(f);
                      setSearchFarmer(`${f.FirstName} ${f.LastName}`);
                      setShowFarmerDropdown(false);
                    }}
                    className={modalDropdownItem}
                  >
                    {f.FirstName} {f.LastName}
                  </div>
                ))}
              </div>
            )}
        </div>

     {/* ================= CROP + LIVESTOCK (SAME ROW) ================= */}
<div className="grid grid-cols-2 gap-3">

  {/* ================= CROP ================= */}
  <div className="relative" ref={cropRef}>

  <div className="flex items-center justify-between">
  <label className={modalLabel}>Crop</label>

  <div className="text-xs min-h-[16px] flex items-center">
    {loadingCrop ? (
      <span className="text-green-600 animate-pulse">
        Searching Crops...
      </span>
    ) : !loadingCrop &&
      !selectedCrop &&
      availableCrops.length === 0 &&
      searchCrop.length > 0 ? (
      <span className="text-red-400">
        No crop found!
      </span>
    ) : (
      <span className="opacity-0">.</span>
    )}
  </div>
</div>

    <input
      value={searchCrop}
      onFocus={() => setShowCropDropdown(true)}
      onChange={(e) => {
        setSearchCrop(e.target.value);
        setSelectedCrop(null);
        setShowCropDropdown(true);
      }}
      className={modalInput}
    />

    {showCropDropdown &&
      !loadingCrop &&
      availableCrops.length > 0 && (
        <div className={`${modalDropdown} absolute z-50`}>
          {availableCrops.map((c) => (
            <div
              key={c.CropID}
              onClick={() => {
                setSelectedCrop(c);
                setSearchCrop(c.CropName);
                setShowCropDropdown(false);
              }}
              className={modalDropdownItem}
            >
              {c.CropName}
            </div>
          ))}
        </div>
      )}
  </div>

  {/* ================= LIVESTOCK ================= */}
  <div className="relative" ref={livestockRef}>

   <div className="flex items-center justify-between">
  <label className={modalLabel}>Livestock</label>

  <div className="text-xs min-h-[16px] flex items-center">
    {loadingLivestock ? (
      <span className="text-green-600 animate-pulse">
        Searching Livestock...
      </span>
    ) : !loadingLivestock &&
      !selectedLivestock &&
      availableLivestock.length === 0 &&
      searchLivestock.length > 0 ? (
      <span className="text-red-400">
        No livestock found!
      </span>
    ) : (
      <span className="opacity-0">.</span>
    )}
  </div>
</div>

    <input
      value={searchLivestock}
      onFocus={() => setShowLivestockDropdown(true)}
      onChange={(e) => {
        setSearchLivestock(e.target.value);
        setSelectedLivestock(null);
        setShowLivestockDropdown(true);
      }}
      className={modalInput}
    />

    {showLivestockDropdown &&
      !loadingLivestock &&
      availableLivestock.length > 0 && (
        <div className={`${modalDropdown} absolute z-50`}>
          {availableLivestock.map((l) => (
            <div
              key={l.LivestockID}
              onClick={() => {
                setSelectedLivestock(l);
                setSearchLivestock(`${l.Type} ${l.Breed || ""}`);
                setShowLivestockDropdown(false);
              }}
              className={modalDropdownItem}
            >
              {l.Type} - {l.Breed || "Unknown"}
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
      className={`${modalInput} dark:[color-scheme:dark]`}
    />
  </div>

  <div>
    <label className={modalLabel}>Production Volume</label>
    <input
      type="number"
      value={ProductionVolume}
      onChange={(e) => setProductionVolume(e.target.value)}
      className={`${modalInput} dark:[color-scheme:dark]`}
    />
  </div>

</div>

        {/* ================= TEXT ================= */}
        <textarea
          rows="3"
          value={Issues}
          onChange={(e) => setIssues(e.target.value)}
          className={modalInput}
          placeholder="Issues"
        />

        <textarea
          rows="3"
          value={Remarks}
          onChange={(e) => setRemarks(e.target.value)}
          className={modalInput}
          placeholder="Remarks"
        />

        {/* ================= ACTIONS ================= */}
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