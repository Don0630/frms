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

export default function EditMonitoringModal({
  monitoring,
  onClose,
  onSubmit,
  loading,
}) {
  // ================= FARMER =================
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [farmerDisplay, setFarmerDisplay] = useState("");
  const [searchFarmer, setSearchFarmer] = useState("");

  // ================= CROP =================
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [cropDisplay, setCropDisplay] = useState("");
  const [searchCrop, setSearchCrop] = useState("");

  // ================= LIVESTOCK =================
  const [selectedLivestock, setSelectedLivestock] = useState(null);
  const [livestockDisplay, setLivestockDisplay] = useState("");
  const [searchLivestock, setSearchLivestock] = useState("");

  // ================= OTHER =================
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



  // ================= INIT DATA =================
  useEffect(() => {
    if (!monitoring) return;

    setReportDate(monitoring.ReportDate?.split("T")[0] || "");
    setProductionVolume(monitoring.ProductionVolume || "");
    setIssues(monitoring.Issues || "");
    setRemarks(monitoring.Remarks || "");

    // FARMER
    if (monitoring.FirstName) {
      setSelectedFarmer({ FarmerID: monitoring.FarmerID });
      setFarmerDisplay(`${monitoring.FirstName} ${monitoring.LastName}`);
    }

    // CROP
    if (monitoring.CropName) {
      setSelectedCrop({ CropID: monitoring.CropID });
      setCropDisplay(monitoring.CropName);
    }

    // LIVESTOCK
    if (monitoring.Type) {
      setSelectedLivestock({ LivestockID: monitoring.LivestockID });
      setLivestockDisplay(`${monitoring.Type} ${monitoring.Breed || ""}`);
    }

    setSearchFarmer("");
    setSearchCrop("");
    setSearchLivestock("");
  }, [monitoring]);

  // ================= SEARCH =================
  const debouncedFarmer = useDebounce(searchFarmer, 300);
  const debouncedCrop = useDebounce(searchCrop, 300);
  const debouncedLivestock = useDebounce(searchLivestock, 300);

  const { searchFarmerQuery } = useSearchFarmer(debouncedFarmer);
  const { searchCropQuery } = useSearchCrop(debouncedCrop);
  const { searchLivestockQuery } = useSearchLivestock(debouncedLivestock);

  const farmers = searchFarmerQuery?.data?.data || [];
  const crops = searchCropQuery?.data?.data || [];
  const livestock = searchLivestockQuery?.data?.data || [];

  const loadingFarmer = searchFarmerQuery?.isLoading || searchFarmerQuery?.isFetching;
  const loadingCrop = searchCropQuery?.isLoading || searchCropQuery?.isFetching;
  const loadingLivestock = searchLivestockQuery?.isLoading || searchLivestockQuery?.isFetching;



  
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
      FarmerID: selectedFarmer?.FarmerID,
      CropID: selectedCrop?.CropID || null,
      LivestockID: selectedLivestock?.LivestockID || null,
      ReportDate,
      ProductionVolume,
      Issues,
      Remarks,
    });
  };

  return (
    <Modal title="Edit Monitoring" onClose={onClose} width="max-w-xl">

      {error && (
        <p className="text-red-500 text-sm mb-3">{error}</p>
      )}

      <form className="space-y-4 text-sm" onSubmit={handleSubmit}>

        {/* ================= FARMER ================= */}
        <div ref={farmerRef} className="relative">

      <div className="flex items-center justify-between">
        <label className={modalLabel}>Farmer *</label>
          <div className="text-xs min-h-[16px] flex items-center">
            {loadingFarmer ? (
              <span className="text-green-600 animate-pulse">
                Searching Farmers...
              </span>
            ) : !loadingFarmer &&
              !selectedFarmer &&
              farmers.length === 0 &&
              searchFarmer.length > 0 ? (
              <span className="text-red-400">No farmer found!</span>
            ) : (
              <span className="opacity-0">.</span>
            )}
          </div>
        </div>


          <input
            value={selectedFarmer ? farmerDisplay : searchFarmer}
            onFocus={() => setShowFarmerDropdown(true)}
            onChange={(e) => {
              setSearchFarmer(e.target.value);
              setSelectedFarmer(null);
              setShowFarmerDropdown(true);
            }}
            className={modalInput}
          />

          {/* STATUS */}

     

          {showFarmerDropdown && farmers.length > 0 && (
            <div className={modalDropdown}>
              {farmers.map((f) => (
                <div
                  key={f.FarmerID}
                  className={modalDropdownItem}
                  onClick={() => {
                    setSelectedFarmer(f);
                    setFarmerDisplay(`${f.FirstName} ${f.LastName}`);
                    setSearchFarmer("");
                    setShowFarmerDropdown(false);
                  }}
                >
                  {f.FirstName} {f.LastName}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ================= CROP + LIVESTOCK ================= */}
        <div className="grid grid-cols-2 gap-3">

          {/* CROP */}
          <div ref={cropRef} className="relative">
            <div className="flex items-center justify-between">
              <label className={modalLabel}>Crop</label>
                <div className="text-xs min-h-[16px] flex items-center">
                  {loadingCrop ? (
                    <span className="text-green-600 animate-pulse">
                      Searching Crops...
                    </span>
                  ) : !loadingCrop &&
                    !selectedCrop &&
                    crops.length === 0 &&
                    searchCrop.length > 0 ? (
                    <span className="text-red-400">No crop found!</span>
                  ) : (
                    <span className="opacity-0">.</span>
                  )}
                </div>
            </div>

            <input
              value={selectedCrop ? cropDisplay : searchCrop}
              onFocus={() => setShowCropDropdown(true)}
              onChange={(e) => {
                setSearchCrop(e.target.value);
                setSelectedCrop(null);
                setShowCropDropdown(true);
              }}
              className={modalInput}
            />


            {showCropDropdown && crops.length > 0 && (
              <div className={modalDropdown}>
                {crops.map((c) => (
                  <div
                    key={c.CropID}
                    className={modalDropdownItem}
                    onClick={() => {
                      setSelectedCrop(c);
                      setCropDisplay(c.CropName);
                      setSearchCrop("");
                      setShowCropDropdown(false);
                    }}
                  >
                    {c.CropName}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* LIVESTOCK */}
          <div ref={livestockRef} className="relative">

<div className="flex items-center justify-between">
            <label className={modalLabel}>Livestock</label>
            <div className="text-xs min-h-[16px] flex items-center">
              {loadingLivestock ? (
                <span className="text-green-600 animate-pulse">
                  Searching Livestock...
                </span>
              ) : !loadingLivestock &&
                !selectedLivestock &&
                livestock.length === 0 &&
                searchLivestock.length > 0 ? (
                <span className="text-red-400">No livestock found!</span>
              ) : (
                <span className="opacity-0">.</span>
              )}
            </div>
    </div>

            <input
              value={selectedLivestock ? livestockDisplay : searchLivestock}
              onFocus={() => setShowLivestockDropdown(true)}
              onChange={(e) => {
                setSearchLivestock(e.target.value);
                setSelectedLivestock(null);
                setShowLivestockDropdown(true);
              }}
              className={modalInput}
            />

            

            {showLivestockDropdown && livestock.length > 0 && (
              <div className={modalDropdown}>
                {livestock.map((l) => (
                  <div
                    key={l.LivestockID}
                    className={modalDropdownItem}
                    onClick={() => {
                      setSelectedLivestock(l);
                      setLivestockDisplay(`${l.Type} ${l.Breed || ""}`);
                      setSearchLivestock("");
                      setShowLivestockDropdown(false);
                    }}
                  >
                    {l.Type} - {l.Breed || "Unknown"}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* ================= OTHER FIELDS ================= */}
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

        <div>
          <label className={modalLabel}>Issue</label>
          <textarea
            value={Issues}
            onChange={(e) => setIssues(e.target.value)}
            className={modalInput}
          />
        </div>

        <div>
          <label className={modalLabel}>Remarks</label>
          <textarea
            value={Remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className={modalInput}
          />
        </div>

        {/* ================= ACTIONS ================= */}
        <div className="flex justify-end gap-2">
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
            {loading ? "Updating..." : "Update Monitoring"}
          </button>
        </div>

      </form>
    </Modal>
  );
}