import React, { useState, useEffect, useRef, } from "react";
import { showErrorToast, showSuccessToast } from "../../utils/toastUtility";
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

  // ================= SEARCH STATES =================
  const [searchFarmer, setSearchFarmer] = useState("");
  const [searchCrop, setSearchCrop] = useState("");
  const [searchLivestock, setSearchLivestock] = useState("");

  // ================= SELECTED =================
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [selectedLivestock, setSelectedLivestock] = useState(null);

  // ================= FORM STATE =================
  const [form, setForm] = useState({
    ReportDate: "",
    ProductionVolume: "",
    Issues: "",
    Remarks: "",
  });

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

  const loadingFarmer = searchFarmerQuery?.isLoading || searchFarmerQuery?.isFetching;
  const loadingCrop = searchCropQuery?.isLoading || searchCropQuery?.isFetching;
  const loadingLivestock = searchLivestockQuery?.isLoading || searchLivestockQuery?.isFetching;

  // ================= OUTSIDE CLICK =================
  useEffect(() => {
    const handleClickOutside = (e) => {

      if (
        farmerRef.current && !farmerRef.current.contains(e.target)
      ) {
        setShowFarmerDropdown(false);
      }

      if (
        cropRef.current && !cropRef.current.contains(e.target)
      ) {
        setShowCropDropdown(false);
      }

      if (livestockRef.current && !livestockRef.current.contains(e.target)
      ) {
        setShowLivestockDropdown(false);
      }
    };

    document.addEventListener("mousedown",handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({...prev,[name]: value,}));
    if (error) setError("");
  };

  // ================= VALIDATION =================
  const validate = () => {

    if (!selectedFarmer)
      return "Please select a Farmer!";

    const requiredError = validators.validateRequiredFields(
        form,
        [
          "ReportDate",
          "ProductionVolume",
          "Issues",
          "Remarks",
        ],
        {
          ReportDate: "Report Date",
          ProductionVolume: "Production Volume",
          Issues: "Issues",
          Remarks: "Remarks",
        }
      );
    if (requiredError)return requiredError;

    const dateError = monitoringValidator.validateMonitoringDate(form.ReportDate,"Report Date");
    if (dateError) return dateError;

    const productionError = validators.validatePositiveNumber(form.ProductionVolume, "Production Volume");
    if (productionError) return productionError;

    return "";
  };


  // ================= SUBMIT =================
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");

      const err = validate();
      if (err) return setError(err);
      console.log(form);
      try {
        await onSubmit({
          FarmerID: selectedFarmer.FarmerID,
          CropID: selectedCrop?.CropID || null,
          LivestockID: selectedLivestock?.LivestockID || null,
          ...form,
          ProductionVolume: Number(form.ProductionVolume),
          Issues: form.Issues.trim(),
          Remarks: form.Remarks.trim(),
        });
      } catch (error) {
        const status = error?.response?.status;
        const message = error?.response?.data?.message || error.message;

           if (status === 400 || status === 409) {
              setError(message);
            } else {
              showErrorToast(message);
            }
      }
    };


  
  return (
    <Modal title="Add Monitoring" onClose={onClose} width="max-w-xl">
     
  {/* INFO TEXT */}
  <p className="text-xs text-gray-500 dark:text-gray-400 -mt-4 mb-3">
    Fill in the required fields to register a new report.
  </p>
 
  <div className="min-h-[20px] mb-2 text-center">
    {error && (
      <p className="text-red-500 font-medium text-sm">{error}</p>
    )}
  </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 text-sm"
      >

        {/* ================= FARMER ================= */}
        <div
          className="relative"
          ref={farmerRef}
        >

          <div className="flex items-center justify-between">

            <label className={modalLabel}>
              Farmer *
            </label>

            <div className="text-xs min-h-[16px] flex items-center">

              {loadingFarmer ? (
                <span className="text-green-600 animate-pulse">
                  Searching Farmers...
                </span>

              ) : !loadingFarmer &&
                !selectedFarmer &&
                availableFarmers.length === 0 &&
                searchFarmer.length > 0 ? (

                <span className="text-red-400">
                  No farmer found!
                </span>

              ) : (
                <span className="opacity-0">
                  .
                </span>
              )}

            </div>
          </div>

          <input
            value={searchFarmer}
            onFocus={() =>
              setShowFarmerDropdown(true)
            }
            onChange={(e) => {
              setSearchFarmer( e.target.value);
              setSelectedFarmer(null);
              setShowFarmerDropdown(true);

              if (error)setError("");
            }}
            className={modalInput}
          />

          {showFarmerDropdown &&
            !loadingFarmer &&
            availableFarmers.length >0 && (
              <div className={`${modalDropdown} absolute z-50`}>
                {availableFarmers.map(
                  (farmer) => (
                    <div
                      key={
                        farmer.FarmerID
                      }
                      onClick={() => {
                        setSelectedFarmer(farmer);
                        setSearchFarmer(`${farmer.LastName}, ${farmer.FirstName}${farmer.MiddleName ? ` ${farmer.MiddleName}` : ""}`);
                        setShowFarmerDropdown(false);
                      }}
                      className={
                        modalDropdownItem
                      }
                    >
                      {farmer.LastName}, {farmer.FirstName}{farmer.MiddleName ? ` ${farmer.MiddleName}` : ""}
                    </div>
                  )
                )}
              </div>
            )}
        </div>

        {/* ================= CROP + LIVESTOCK ================= */}
        <div className="grid grid-cols-2 gap-3">

          {/* ================= CROP ================= */}
          <div
            className="relative"
            ref={cropRef}
          >

            <div className="flex items-center justify-between">

              <label className={modalLabel}>
                Crop
              </label>

              <div className="text-xs min-h-[16px] flex items-center">

                {loadingCrop ? (
                  <span className="text-green-600 animate-pulse">
                    Searching Crops...
                  </span>

                ) : !loadingCrop &&
                  !selectedCrop &&
                  availableCrops.length ===
                    0 &&
                  searchCrop.length >
                    0 ? (

                  <span className="text-red-400">
                    No crop found!
                  </span>

                ) : (
                  <span className="opacity-0">
                    .
                  </span>
                )}

              </div>
            </div>

            <input
              value={searchCrop}
              onFocus={() =>
                setShowCropDropdown(
                  true
                )
              }
              onChange={(e) => {
                setSearchCrop(
                  e.target.value
                );

                setSelectedCrop(null);

                setShowCropDropdown(
                  true
                );

                if (error)
                  setError("");
              }}
              className={modalInput}
            />

            {showCropDropdown &&
              !loadingCrop &&
              availableCrops.length >
                0 && (

                <div
                  className={`${modalDropdown} absolute z-50`}
                >
                  {availableCrops.map(
                    (crop) => (
                      <div
                        key={
                          crop.CropID
                        }
                        onClick={() => {
                          setSelectedCrop(
                            crop
                          );

                          setSearchCrop(
                            crop.CropName
                          );

                          setShowCropDropdown(
                            false
                          );
                        }}
                        className={
                          modalDropdownItem
                        }
                      >
                        {
                          crop.CropName
                        }
                      </div>
                    )
                  )}
                </div>
              )}
          </div>

          {/* ================= LIVESTOCK ================= */}
          <div
            className="relative"
            ref={livestockRef}
          >

            <div className="flex items-center justify-between">

              <label className={modalLabel}>
                Livestock
              </label>

              <div className="text-xs min-h-[16px] flex items-center">

                {loadingLivestock ? (
                  <span className="text-green-600 animate-pulse">
                    Searching Livestock...
                  </span>

                ) : !loadingLivestock &&
                  !selectedLivestock &&
                  availableLivestock.length ===
                    0 &&
                  searchLivestock.length >
                    0 ? (

                  <span className="text-red-400">
                    No livestock found!
                  </span>

                ) : (
                  <span className="opacity-0">
                    .
                  </span>
                )}

              </div>
            </div>

            <input
              value={searchLivestock}
              onFocus={() =>
                setShowLivestockDropdown(
                  true
                )
              }
              onChange={(e) => {
                setSearchLivestock(
                  e.target.value
                );

                setSelectedLivestock(
                  null
                );

                setShowLivestockDropdown(
                  true
                );

                if (error)
                  setError("");
              }}
              className={modalInput}
            />

            {showLivestockDropdown &&
              !loadingLivestock &&
              availableLivestock.length >
                0 && (

                <div
                  className={`${modalDropdown} absolute z-50`}
                >
                  {availableLivestock.map(
                    (livestock) => (
                      <div
                        key={
                          livestock.LivestockID
                        }
                        onClick={() => {
                          setSelectedLivestock(livestock);
                          setSearchLivestock(`${livestock.Type} - ${livestock.Breed || "Unknown"}`);
                          setShowLivestockDropdown(false);
                        }}
                        className={modalDropdownItem}
                      >
                        { livestock.Type}{" "}-{" "}{livestock.Breed || "Unknown"}
                      </div>
                    )
                  )}
                </div>
              )}
          </div>

        </div>

        {/* ================= DATE + PRODUCTION ================= */}
        <div className="grid grid-cols-2 gap-3">

          <div>
            <label className={modalLabel}>
              Report Date *
            </label>

            <input
              type="date"
              name="ReportDate"
              value={
                form.ReportDate
              }
              onChange={
                handleChange
              }
              className={`${modalInput} dark:[color-scheme:dark]`}
            />
          </div>

          <div>
            <label className={modalLabel}>
              Production Volume
            </label>

            <input
              type="number"
              name="ProductionVolume"
              value={
                form.ProductionVolume
              }
              onChange={
                handleChange
              }
              className={`${modalInput} dark:[color-scheme:dark]`}
            />
          </div>

        </div>

        {/* ================= ISSUES ================= */}
        <div>
          <label className={modalLabel}>
            Issues
          </label>

          <textarea
            rows="3"
            name="Issues"
            value={form.Issues}
            onChange={
              handleChange
            }
            className={modalInput}
          />
        </div>

        {/* ================= REMARKS ================= */}
        <div>
          <label className={modalLabel}>
            Remarks
          </label>

          <textarea
            rows="3"
            name="Remarks"
            value={form.Remarks}
            onChange={
              handleChange
            }
            className={modalInput}
          />
        </div>

        {/* ================= ACTIONS ================= */}
        <div className="flex justify-end gap-2 pt-2">

          <button
            type="button"
            onClick={onClose}
            className={
              modalButtonSecondary
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className={
              modalButtonPrimary
            }
          >
            {loading
              ? "Saving..."
              : "Save Monitoring"}
          </button>

        </div>

      </form>
    </Modal>
  );
}