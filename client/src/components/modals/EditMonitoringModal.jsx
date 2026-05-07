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
  // ================= SEARCH =================
  const [searchFarmer, setSearchFarmer] = useState("");
  const [searchCrop, setSearchCrop] = useState("");
  const [searchLivestock, setSearchLivestock] = useState("");

  // ================= SELECTED =================
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [selectedLivestock, setSelectedLivestock] = useState(null);

  // ================= FORM =================
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

  // ================= INIT =================
  useEffect(() => {
    if (!monitoring) return;

    setForm({
      ReportDate: monitoring.ReportDate?.split("T")[0] || "",
      ProductionVolume: monitoring.ProductionVolume || "",
      Issues: monitoring.Issues || "",
      Remarks: monitoring.Remarks || "",
    });

    // FARMER
    if (monitoring.FirstName) {
      const farmer = {
        FarmerID: monitoring.FarmerID,
        FirstName: monitoring.FirstName,
        LastName: monitoring.LastName,
      };

      setSelectedFarmer(farmer);
      setSearchFarmer(
        `${monitoring.FirstName} ${monitoring.LastName}`
      );
    }

    // CROP
    if (monitoring.CropName) {
      const crop = {
        CropID: monitoring.CropID,
        CropName: monitoring.CropName,
      };

      setSelectedCrop(crop);
      setSearchCrop(monitoring.CropName);
    }

    // LIVESTOCK
    if (monitoring.Type) {
      const livestock = {
        LivestockID: monitoring.LivestockID,
        Type: monitoring.Type,
        Breed: monitoring.Breed,
      };

      setSelectedLivestock(livestock);
      setSearchLivestock(
        `${monitoring.Type} ${monitoring.Breed || ""}`
      );
    }
  }, [monitoring]);

  // ================= OUTSIDE CLICK =================
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        farmerRef.current &&
        !farmerRef.current.contains(e.target)
      ) {
        setShowFarmerDropdown(false);
      }

      if (
        cropRef.current &&
        !cropRef.current.contains(e.target)
      ) {
        setShowCropDropdown(false);
      }

      if (
        livestockRef.current &&
        !livestockRef.current.contains(e.target)
      ) {
        setShowLivestockDropdown(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  // ================= DEBOUNCE =================
  const debouncedFarmer = useDebounce(searchFarmer, 300);
  const debouncedCrop = useDebounce(searchCrop, 300);
  const debouncedLivestock = useDebounce(
    searchLivestock,
    300
  );

  // ================= QUERIES =================
  const { searchFarmerQuery } =
    useSearchFarmer(debouncedFarmer);

  const { searchCropQuery } =
    useSearchCrop(debouncedCrop);

  const { searchLivestockQuery } =
    useSearchLivestock(debouncedLivestock);

  const farmers =
    searchFarmerQuery?.data?.data || [];

  const crops =
    searchCropQuery?.data?.data || [];

  const livestock =
    searchLivestockQuery?.data?.data || [];

  const loadingFarmer =
    searchFarmerQuery?.isLoading ||
    searchFarmerQuery?.isFetching;

  const loadingCrop =
    searchCropQuery?.isLoading ||
    searchCropQuery?.isFetching;

  const loadingLivestock =
    searchLivestockQuery?.isLoading ||
    searchLivestockQuery?.isFetching;

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
  };

  // ================= VALIDATION =================
  const validate = () => {
    if (!selectedFarmer)
      return "Please select a Farmer!";

    const requiredError =
      validators.validateRequiredFields(
        form,
        ["ReportDate", "Issues", "Remarks"],
        {
          ReportDate: "Report Date",
          Issues: "Issues",
          Remarks: "Remarks",
        }
      );

    if (requiredError) return requiredError;

    const dateError =
      monitoringValidator.validateMonitoringDate(
        form.ReportDate,
        "Report Date"
      );

    if (dateError) return dateError;

    if (form.ProductionVolume !== "") {
      const productionError =
        validators.validatePositiveNumber(
          form.ProductionVolume,
          "Production Volume"
        );

      if (productionError) return productionError;
    }

    const noChangesError =
      validators.validateNoChanges(
        {
          FarmerID: monitoring.FarmerID,
          CropID: monitoring.CropID || "",
          LivestockID:
            monitoring.LivestockID || "",
          ReportDate:
            monitoring.ReportDate?.split(
              "T"
            )[0] || "",
          ProductionVolume:
            monitoring.ProductionVolume || "",
          Issues: monitoring.Issues || "",
          Remarks: monitoring.Remarks || "",
        },
        {
          FarmerID:
            selectedFarmer?.FarmerID || "",
          CropID: selectedCrop?.CropID || "",
          LivestockID:
            selectedLivestock?.LivestockID ||
            "",
          ReportDate: form.ReportDate,
          ProductionVolume:
            form.ProductionVolume,
          Issues: form.Issues,
          Remarks: form.Remarks,
        },
        [
          "FarmerID",
          "CropID",
          "LivestockID",
          "ReportDate",
          "ProductionVolume",
          "Issues",
          "Remarks",
        ]
      );

    if (noChangesError) return noChangesError;

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
      LivestockID:
        selectedLivestock?.LivestockID || null,

      ReportDate: form.ReportDate,
      ProductionVolume:
        form.ProductionVolume === ""
          ? null
          : Number(form.ProductionVolume),

      Issues: form.Issues.trim(),
      Remarks: form.Remarks.trim(),
    });
  };

  if (!monitoring) return null;

  return (
    <Modal
      title="Edit Monitoring"
      onClose={onClose}
      width="max-w-xl"
    >
      {error && (
        <p className="text-red-500 text-sm mb-3">
          {error}
        </p>
      )}

      <form
        className="space-y-4 text-sm"
        onSubmit={handleSubmit}
      >
        {/* ================= FARMER ================= */}
        <div
          ref={farmerRef}
          className="relative"
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
                farmers.length === 0 &&
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
              setSearchFarmer(
                e.target.value
              );
              setSelectedFarmer(null);
              setShowFarmerDropdown(true);

              if (error) setError("");
            }}
            className={modalInput}
          />

          {showFarmerDropdown &&
            farmers.length > 0 && (
              <div
                className={`${modalDropdown} absolute z-50`}
              >
                {farmers.map((f) => (
                  <div
                    key={f.FarmerID}
                    className={
                      modalDropdownItem
                    }
                    onClick={() => {
                      setSelectedFarmer(f);

                      setSearchFarmer(
                        `${f.FirstName} ${f.LastName}`
                      );

                      setShowFarmerDropdown(
                        false
                      );
                    }}
                  >
                    {f.FirstName}{" "}
                    {f.LastName}
                  </div>
                ))}
              </div>
            )}
        </div>

        {/* ================= CROP + LIVESTOCK ================= */}
        <div className="grid grid-cols-2 gap-3">
          {/* CROP */}
          <div
            ref={cropRef}
            className="relative"
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
                  crops.length === 0 &&
                  searchCrop.length > 0 ? (
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
                setShowCropDropdown(true)
              }
              onChange={(e) => {
                setSearchCrop(
                  e.target.value
                );

                setSelectedCrop(null);
                setShowCropDropdown(true);

                if (error) setError("");
              }}
              className={modalInput}
            />

            {showCropDropdown &&
              crops.length > 0 && (
                <div
                  className={`${modalDropdown} absolute z-50`}
                >
                  {crops.map((c) => (
                    <div
                      key={c.CropID}
                      className={
                        modalDropdownItem
                      }
                      onClick={() => {
                        setSelectedCrop(c);

                        setSearchCrop(
                          c.CropName
                        );

                        setShowCropDropdown(
                          false
                        );
                      }}
                    >
                      {c.CropName}
                    </div>
                  ))}
                </div>
              )}
          </div>

          {/* LIVESTOCK */}
          <div
            ref={livestockRef}
            className="relative"
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
                  livestock.length === 0 &&
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

                if (error) setError("");
              }}
              className={modalInput}
            />

            {showLivestockDropdown &&
              livestock.length > 0 && (
                <div
                  className={`${modalDropdown} absolute z-50`}
                >
                  {livestock.map((l) => (
                    <div
                      key={l.LivestockID}
                      className={
                        modalDropdownItem
                      }
                      onClick={() => {
                        setSelectedLivestock(
                          l
                        );

                        setSearchLivestock(
                          `${l.Type} ${
                            l.Breed || ""
                          }`
                        );

                        setShowLivestockDropdown(
                          false
                        );
                      }}
                    >
                      {l.Type} -{" "}
                      {l.Breed ||
                        "Unknown"}
                    </div>
                  ))}
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
              value={form.ReportDate}
              onChange={handleChange}
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
              value={form.ProductionVolume}
              onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
            className={modalInput}
          />
        </div>

        {/* ================= ACTIONS ================= */}
        <div className="flex justify-end gap-2">
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
              ? "Updating..."
              : "Update Monitoring"}
          </button>
        </div>
      </form>
    </Modal>
  );
}