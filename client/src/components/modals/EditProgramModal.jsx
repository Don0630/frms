import React, { useEffect, useState } from "react";
import Modal from "../common/Modal";
import {
  modalInput,
  modalLabel,
  modalButtonPrimary,
  modalButtonSecondary,
} from "../common/ModalUI";

export default function EditProgramModal({
  onClose,
  onSubmit,
  loading,
  selectedProgram,
}) {
  const [form, setForm] = useState({
    ProgramID: "",
    ProgramName: "",
    Description: "",
    StartDate: "",
    EndDate: "",
    Budget: "",
    TargetBeneficiaries: "",
  });

  const [error, setError] = useState("");

  // ================= FORMAT DATE =================
  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };

  // ================= LOAD SELECTED DATA =================
  useEffect(() => {
    if (selectedProgram) {
      setForm({
        ProgramID: selectedProgram.ProgramID,
        ProgramName: selectedProgram.ProgramName || "",
        Description: selectedProgram.Description || "",
        StartDate: formatDate(selectedProgram.StartDate),
        EndDate: formatDate(selectedProgram.EndDate),
        Budget: selectedProgram.Budget || "",
        TargetBeneficiaries:
          selectedProgram.TargetBeneficiaries || "",
      });
    }
  }, [selectedProgram]);

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
    const {
      ProgramName,
      StartDate,
      EndDate,
      Budget,
      TargetBeneficiaries,
    } = form;

    if (!ProgramName?.trim())
      return "Program name is required";

    if (!StartDate || !EndDate)
      return "Start and End date are required";

    if (!Budget)
      return "Budget is required";

    if (!TargetBeneficiaries)
      return "Target beneficiaries is required";

    if (new Date(EndDate) < new Date(StartDate))
      return "End date cannot be earlier than start date";

    return "";
  };

  // ================= SUBMIT =================
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const err = validate();

    if (err) {
      setError(err);
      return;
    }

    onSubmit({
      ...form,
      Budget: parseFloat(form.Budget),
      TargetBeneficiaries: parseInt(
        form.TargetBeneficiaries
      ),
    });
  };

  return (
    <Modal
      title="Edit Program"
      onClose={onClose}
      width="max-w-lg"
    >
      {/* ERROR */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 p-2 text-sm rounded mb-3">
          {error}
        </div>
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
            {loading ? "Updating..." : "Update Program"}
          </button>
        </div>
      </form>
    </Modal>
  );
}