import React, { useState, useEffect, useRef } from "react";
import Modal from "../common/Modal";

import {
  modalInput,
  modalDropdown,
  modalDropdownItem,
  modalLabel,
  modalButtonPrimary,
  modalButtonSecondary,
} from "../common/ModalUI";

import useDebounce from "../../hooks/useDebounce";
import { useAvailableFarmer } from "../../hooks/useAvailableFarmer";

import * as validators from "../../utils/validators";

export default function AddDistributionModal({
  distributionID,
  onClose,
  onSubmit,
  loading,
}) {

  // ================= FARMER SEARCH =================
  const [searchFarmer, setSearchFarmer] = useState("");
  const [selectedFarmer, setSelectedFarmer] = useState(null);

  // ================= FORM STATE =================
  const [form, setForm] = useState({
    Amount: "",
  });

  const [error, setError] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const wrapperRef = useRef(null);

  // ================= DEBOUNCE =================
  const debouncedSearch = useDebounce(
    searchFarmer,
    300
  );

  const availableFarmerQuery =
    useAvailableFarmer(
      distributionID,
      debouncedSearch
    );

  const availableFarmers =
    availableFarmerQuery.data?.data || [];

  const loadingFarmers =
    availableFarmerQuery.isLoading;

  // ================= OUTSIDE CLICK CLOSE =================
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(
          e.target
        )
      ) {
        setShowDropdown(false);
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
        ["Amount"],
        {
          Amount: "Amount",
        }
      );

    if (requiredError)
      return requiredError;

    const amountError =
      validators.validatePositiveNumber(
        form.Amount,
        "Amount"
      );

    if (amountError)
      return amountError;

    return "";
  };

  // ================= SUBMIT =================
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const err = validate();

    if (err) return setError(err);

    onSubmit({
      FarmerID:
        selectedFarmer.FarmerID,

      Amount: Number(form.Amount),
    });
  };

  return (
    <Modal
      title="Add Distribution"
      onClose={onClose}
      width="max-w-lg"
    >
      {/* ERROR */}
      {error && (
        <p className="text-red-500 text-sm mb-3">
          {error}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 text-sm"
      >

        {/* ================= FARMER SEARCH ================= */}
        <div
          className="relative"
          ref={wrapperRef}
        >

          <div className="flex items-center justify-between">

            <label className={modalLabel}>
              Select Farmer *
            </label>

            <div className="text-xs min-h-[16px] flex items-center">

              {loadingFarmers ? (
                <span className="text-green-600 animate-pulse">
                  Searching farmers...
                </span>

              ) : !loadingFarmers &&
                !selectedFarmer &&
                availableFarmers.length === 0 &&
                searchFarmer.length > 0 ? (

                <span className="text-red-400">
                  No farmers found!
                </span>

              ) : (
                <span className="opacity-0">
                  .
                </span>
              )}

            </div>
          </div>

          {/* INPUT */}
          <input
            type="text"
            placeholder="Search farmer..."
            value={searchFarmer}
            onFocus={() =>
              setShowDropdown(true)
            }
            onChange={(e) => {
              setSearchFarmer(
                e.target.value
              );

              setSelectedFarmer(null);

              setShowDropdown(true);

              if (error) setError("");
            }}
            className={modalInput}
          />

          {/* DROPDOWN */}
          {showDropdown &&
            !selectedFarmer &&
            availableFarmers.length >
              0 && (

              <div
                className={`${modalDropdown} absolute z-50 w-full`}
              >
                {availableFarmers.map(
                  (farmer) => (
                    <div
                      key={
                        farmer.FarmerID
                      }
                      onClick={() => {
                        setSelectedFarmer(
                          farmer
                        );

                        setSearchFarmer(
                          `${farmer.FirstName} ${farmer.LastName}`
                        );

                        setShowDropdown(
                          false
                        );
                      }}
                      className={
                        modalDropdownItem
                      }
                    >
                      {farmer.FirstName}{" "}
                      {farmer.LastName}
                    </div>
                  )
                )}
              </div>
            )}
        </div>

        {/* ================= AMOUNT ================= */}
        <div>

          <label className={modalLabel}>
            Amount
          </label>

          <input
            type="number"
            step="0.01"
            name="Amount"
            value={form.Amount}
            onChange={handleChange}
            className={`${modalInput} dark:[color-scheme:dark]`}
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
              : "Assign Subsidy"}
          </button>

        </div>

      </form>
    </Modal>
  );
}