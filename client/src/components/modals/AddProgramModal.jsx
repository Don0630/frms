import React, { useState } from "react";
import toast from "react-hot-toast";
import Modal from "../common/Modal";
import {
  modalInput,
  modalLabel,
  modalButtonPrimary,
  modalButtonSecondary,
} from "../common/ModalUI";
import * as validators from "../../utils/validators";
import * as programValidator from "../../utils/programValidator";

export default function AddProgramModal({
  onClose,
  onSubmit,
  loading,
}) {
  const [form, setForm] = useState({
    ProgramName: "",
    Description: "",
    StartDate: "",
    EndDate: "",
    Budget: "",
    TargetBeneficiaries: "",
  });

  const [error, setError] = useState("");

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
    // 1. Required fields check
    const requiredError = validators.validateRequiredFields(
      form,
      [
        "ProgramName",
        "StartDate",
        "EndDate",
        "Budget",
        "TargetBeneficiaries",
      ],
      {
        ProgramName: "Program name",
        StartDate: "Start date",
        EndDate: "End date",
        Budget: "Budget",
        TargetBeneficiaries: "Target beneficiaries",
      }
    );
    if (requiredError) return requiredError;

    const programDateError = programValidator.programDateRange(form.StartDate, form.EndDate);
    if (programDateError) return programDateError;

    const budgetError = validators.validatePositiveNumber(form.Budget,"Budget");
    if (budgetError) return budgetError;

    const beneError = validators.validatePositiveNumber(form.TargetBeneficiaries,"Target Beneficiaries");
    if (beneError) return beneError;

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
      ...form,
      Budget: parseFloat(form.Budget),
      TargetBeneficiaries: parseInt(form.TargetBeneficiaries),
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
      title="Add Program"
      onClose={onClose}
      width="max-w-lg"
    >
      {/* ERROR */}
      {error && (
        <p className="text-red-500 text-sm mb-3">{error}</p>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 text-sm"
      >
        {/* PROGRAM NAME */}
        <div>
          <label className={modalLabel}>
            Program Name
          </label>

          <input
            name="ProgramName"
            value={form.ProgramName}
            onChange={handleChange}
            className={modalInput}
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className={modalLabel}>
            Description
          </label>

          <textarea
            name="Description"
            value={form.Description}
            onChange={handleChange}
            rows={3}
            className={modalInput}
          />
        </div>

        {/* DATES */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={modalLabel}>
              Start Date
            </label>

            <input
              type="date"
              name="StartDate"
              value={form.StartDate}
              onChange={handleChange}
              className={`${modalInput} dark:[color-scheme:dark]`}
            />
          </div>  

          <div>
            <label className={modalLabel}>
              End Date
            </label>

            <input
              type="date"
              name="EndDate"
              value={form.EndDate}
              onChange={handleChange}
              className={`${modalInput} dark:[color-scheme:dark]`}
            />
          </div>
        </div>

        {/* BUDGET + BENEFICIARIES */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={modalLabel}>
              Budget
            </label>

            <input
              type="number"
              name="Budget"
              value={form.Budget}
              onChange={handleChange}
              className={`${modalInput} dark:[color-scheme:dark]`}
            />
          </div>

          <div>
            <label className={modalLabel}>
              Target Beneficiaries
            </label>

            <input
              type="number"
              name="TargetBeneficiaries"
              value={form.TargetBeneficiaries}
              onChange={handleChange}
              className={`${modalInput} dark:[color-scheme:dark]`}
            />
          </div>
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
            {loading ? "Saving..." : "Save Program"}
          </button>
        </div>
      </form>
    </Modal>
  );
}