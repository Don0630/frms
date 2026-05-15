import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import Modal from "../common/Modal";

import useDebounce from "../../hooks/useDebounce";
import useProgram from "../../hooks/useProgram";

import * as validators from "../../utils/validators";
import * as subsidyValidator from "../../utils/subsidyValidator";

import {
  modalInput,
  modalDropdown,
  modalDropdownItem,
  modalLabel,
  modalButtonPrimary,
  modalButtonSecondary,
} from "../common/ModalUI";

export default function AddSubsidyModal({
  onClose,
  onSubmit,
  loading,
}) {

  // ================= PROGRAM SEARCH =================
  const [searchProgram, setSearchProgram] = useState("");
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef(null);


  // ================= FORM STATE =================
  const [form, setForm] = useState({
    TotalAmount: "",
    DistributionDate: "",
    Remarks: "",
  });

  const [error, setError] = useState("");


  // ================= DEBOUNCE =================
  const debouncedSearch = useDebounce(searchProgram, 300);

  const { availableProgramsQuery } = useProgram(debouncedSearch);

  const availablePrograms = availableProgramsQuery.data?.data || [];

  const loadingPrograms = availableProgramsQuery.isLoading;

  // ================= OUTSIDE CLICK CLOSE =================
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target)
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

    if (!selectedProgram)
      return "Please select a Program!";

    const requiredError =
      validators.validateRequiredFields(
        form,
        [
          "TotalAmount",
          "DistributionDate",
          "Remarks",
        ],
        {
          TotalAmount: "Total Amount",
          DistributionDate:
            "Distribution Date",
          Remarks: "Remarks",
        }
      );
    if (requiredError) return requiredError;

    const totalAmountError = validators.validatePositiveNumber(form.TotalAmount, "Total Amount");
    if (totalAmountError) return totalAmountError;

    const budgetError = subsidyValidator.validateSubsidyAmount(form.TotalAmount,selectedProgram.AvailableBudget);
    if (budgetError) return budgetError;

    const dateError = subsidyValidator.validateDistributionDate(form.DistributionDate, selectedProgram.StartDate, selectedProgram.EndDate);
    if (dateError) return dateError;

    return "";
  };


  // ================= SUBMIT =================
const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  const err = validate();
  if (err) return setError(err);

  try {
    await onSubmit({
      ProgramID: selectedProgram.ProgramID,
      TotalAmount: Number(form.TotalAmount),
      DistributionDate: form.DistributionDate,
      Remarks: form.Remarks.trim(),
    });
  } catch (error) {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || error.message;

    if (status === 400 || status === 409) {
      setError(message);
    } else if (status === 500) {
      toast.error("Something went wrong. Please try again.");
    } else if (!error.response) {
      toast.error("Network error. Please check your connection.");
    } else {
      toast.error(message);
    }
  }
};

  return (
    <Modal
      title="Add Subsidy"
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

        {/* ================= PROGRAM SEARCH ================= */}
        <div
          className="relative"
          ref={wrapperRef}
        >
          <div className="flex items-center justify-between">

            <label className={modalLabel}>
              Program *
            </label>

            <div className="text-xs min-h-[16px] flex items-center">

              {loadingPrograms ? (
                <span className="text-green-600 animate-pulse">
                  Searching programs...
                </span>

              ) : !loadingPrograms &&
                !selectedProgram &&  
                availablePrograms.length === 0 &&
                searchProgram.length > 0 ? (

                <span className="text-red-400">
                  No programs found!
                </span>

              ) : (
                <span className="opacity-0">
                  .
                </span>
              )}

            </div>
          </div>

          <input
            type="text"
            placeholder="Search program..."
            value={searchProgram}
            onFocus={() =>
              setShowDropdown(true)
            }
            onChange={(e) => {
              setSearchProgram(
                e.target.value
              );

              setSelectedProgram(null);

              setShowDropdown(true);

              if (error) setError("");
            }}
            className={modalInput}
          />

          {/* RESULTS */}
          {showDropdown &&
            availablePrograms.length >
              0 && (

<div
  className={`${modalDropdown} absolute z-50`}
>
  {availablePrograms.map((program) => (
    <div
      key={program.ProgramID}
      onClick={() => {
        setSelectedProgram(program);
        setSearchProgram(program.ProgramName);
        setShowDropdown(false);
      }}
      className={modalDropdownItem}
    >


<div className="flex items-center justify-between gap-2">
  <span className="text-gray-800 dark:text-gray-100 truncate">
    <span className="font-medium">{program.ProgramName}</span>
    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
      - Total: {Number(program.Budget || 0).toLocaleString("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
      })}
    </span>
  </span>

  <span className="text-xs text-green-600 dark:text-green-400 shrink-0">
    Available: {Number(program.AvailableBudget || 0).toLocaleString("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    })}
  </span>
</div>

    </div>
  ))}
</div>
            )}
        </div>

        {/* ================= AMOUNT + DATE ================= */}
        <div className="grid grid-cols-2 gap-2">

          <div>
            <label className={modalLabel}>
              Total Amount
            </label>

            <input
              type="number"
              step="0.01"
              name="TotalAmount"
              value={form.TotalAmount}
              onChange={handleChange}
              className={`${modalInput} dark:[color-scheme:dark]`}
            />
          </div>

          <div>
            <label className={modalLabel}>
              Distribution Date
            </label>

            <input
              type="date"
              name="DistributionDate"
              value={
                form.DistributionDate
              }
              onChange={handleChange}
              className={`${modalInput} dark:[color-scheme:dark]`}
            />
          </div>

        </div>

        {/* ================= REMARKS ================= */}
        <div>
          <label className={modalLabel}>
            Remarks
          </label>

          <textarea
            name="Remarks"
            value={form.Remarks}
            onChange={handleChange}
            className={modalInput}
            rows={3}
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
              : "Save Subsidy"}
          </button>

        </div>

      </form>
    </Modal>
  );
}