import React, { useState, useEffect, useRef } from "react";
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
  const [searchProgram, setSearchProgram] = useState("");
  const [selectedProgram, setSelectedProgram] = useState(null);

  const [totalAmount, setTotalAmount] = useState("");
  const [distributionDate, setDistributionDate] = useState("");
  const [remarks, setRemarks] = useState("");

  const [error, setError] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const wrapperRef = useRef(null);

  const debouncedSearch = useDebounce(searchProgram, 300);
  const { availableProgramsQuery } = useProgram(debouncedSearch);

  const availablePrograms =
    availableProgramsQuery.data?.data || [];

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

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ================= VALIDATION =================
  const validate = () => {
    if (!selectedProgram) return "Please select a program!";
    if (!totalAmount) return "Total amount is required!";
    if (!distributionDate) return "Distribution date is required!";
    if (!remarks) return "Remarks is required!";

    const totalAmountError = validators.validatePositiveNumber( totalAmount, "Total Amount");
    if (totalAmountError) return totalAmountError;

    const dateError = subsidyValidator.validateDistributionDate(distributionDate);
    if (dateError) return dateError;

    return "";
  };

  // ================= SUBMIT =================
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const err = validate();
    if (err) return setError(err);

    onSubmit({
      ProgramID: selectedProgram.ProgramID,
      TotalAmount: Number(totalAmount),
      DistributionDate: distributionDate,
      Remarks: remarks?.trim() || "",
    });
  };

  return (
    <Modal title="Add Subsidy" onClose={onClose} width="max-w-lg">
      {error && (
        <p className="text-red-500 text-sm mb-3">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">

        {/* PROGRAM SEARCH */}
        <div className="relative" ref={wrapperRef}>
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
      <span className="opacity-0">.</span>
    )}
  </div>
</div>

          <input
            type="text"
            placeholder="Search program..."
            value={searchProgram}
            onFocus={() => setShowDropdown(true)}
            onChange={(e) => {
              setSearchProgram(e.target.value);
              setSelectedProgram(null);
              setShowDropdown(true);
            }}
            className={modalInput}
          />

          {/* DROPDOWN */}
          {showDropdown &&
            !selectedProgram &&
            availablePrograms.length > 0 && (
              <div className={`${modalDropdown} absolute z-50`}>
                {availablePrograms.map((p) => (
                  <div
                    key={p.ProgramID}
                    onClick={() => {
                      setSelectedProgram(p);
                      setSearchProgram(p.ProgramName);
                      setShowDropdown(false);
                    }}
                    className={modalDropdownItem}
                  >
                    {p.ProgramName}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
            - Budget:{" "}
            {Number(p.Budget || 0).toLocaleString("en-PH", {
              style: "currency",
              currency: "PHP",
              minimumFractionDigits: 2,
            })}
          </span>
                  </div>
                ))}
              </div>
            )}
        </div>

        {/* AMOUNT + DATE */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={modalLabel}>Total Amount</label>
            <input
              type="number"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              className={`${modalInput} dark:[color-scheme:dark]`}
            />
          </div>

          <div>
            <label className={modalLabel}>Distribution Date</label>
            <input
              type="date"
              value={distributionDate}
              onChange={(e) => setDistributionDate(e.target.value)}
              className={`${modalInput} dark:[color-scheme:dark]`}
            />
          </div>
        </div>

        {/* REMARKS */}
        <div>
          <label className={modalLabel}>Remarks</label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className={modalInput}
            rows={3}
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
            {loading ? "Saving..." : "Save Subsidy"}
          </button>
        </div>
      </form>
    </Modal>
  );
}