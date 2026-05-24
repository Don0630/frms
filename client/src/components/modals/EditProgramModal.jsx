import React, { useEffect, useState } from "react"; 
import Modal from "../common/Modal";
import {
  modalInput,
  modalLabel,
  modalButtonPrimary,
  modalButtonSecondary,
} from "../common/ModalUI";
import * as validators from "../../utils/validators";
import * as programValidator from "../../utils/programValidator";

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
    Status: "",
  });

  const [error, setError] = useState("");

  // ================= LOAD SELECTED DATA =================
  useEffect(() => {
    if (selectedProgram) {
      setForm({
        ProgramID: selectedProgram.ProgramID,
        ProgramName: selectedProgram.ProgramName || "",
        Description: selectedProgram.Description || "",
        StartDate: selectedProgram.StartDate || "",
        EndDate: selectedProgram.EndDate || "",
        Budget: selectedProgram.Budget || "",
        TargetBeneficiaries: selectedProgram.TargetBeneficiaries || "",
        Status: selectedProgram.Status || "",
      });
    }
  }, [selectedProgram]);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  // ================= VALIDATION =================
  const validate = () => {
    const requiredError = validators.validateRequiredFields(form,
      ["ProgramName", "Description", "StartDate", "EndDate", "Budget", "TargetBeneficiaries", "Status"],
      {
        ProgramName: "Program name",
        Description: "Description",
        StartDate: "Start date",
        EndDate: "End date",
        Budget: "Budget",
        TargetBeneficiaries: "Target beneficiaries",
        Status: "Status",
      }
    );
    if (requiredError) return requiredError;

    const noChangesError = validators.validateNoChanges(selectedProgram, form,
      ["ProgramName", "Description", "StartDate", "EndDate", "Budget", "TargetBeneficiaries", "Status"]
    );
    if (noChangesError) return noChangesError;

    const programDateError = programValidator.programDateRange(form.StartDate, form.EndDate, {
      isEdit: true,
      originalStartDate: selectedProgram.StartDate,
    });
    if (programDateError) return programDateError;

    const budgetError = validators.validatePositiveNumber(form.Budget, "Budget");
    if (budgetError) return budgetError;

    const beneError = validators.validatePositiveNumber(form.TargetBeneficiaries, "Target Beneficiaries");
    if (beneError) return beneError;

    const statusError = programValidator.validateProgramStatus(form.Status);
    if (statusError) return statusError;

    const budgetChangeError = programValidator.validateProgramBudget(form.Budget,selectedProgram.TotalDistributed);
    if (budgetChangeError) return budgetChangeError;

    const statusChangeError = programValidator.validateProgramStatusChange(form.Status, selectedProgram.Status, selectedProgram.PendingDistributions, form.Budget, selectedProgram.TotalDistributed);
    if (statusChangeError) return statusChangeError;

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
        } 
      }
  };

  return (
    <Modal title="Edit Program" onClose={onClose} width="max-w-lg">
      
      {/* INFO TEXT */}
      <p className="text-xs text-gray-500 dark:text-gray-400 -mt-4 mb-3">
        Update the program's information below.
      </p>

      {/* ERROR */}
      <div className="min-h-[24px] mb-2 text-center">
        <p className={`text-red-500 font-medium text-sm transition-opacity duration-200 ${error ? "opacity-100" : "opacity-0"}`}>
           {error || "​"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">

        {/* PROGRAM NAME */}
        <div>
          <label className={modalLabel}>Program Name</label>
          <input name="ProgramName" value={form.ProgramName} onChange={handleChange} className={modalInput} />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className={modalLabel}>Description</label>
          <textarea name="Description" value={form.Description} onChange={handleChange} rows={3} className={modalInput} />
        </div>

        {/* DATES */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={modalLabel}>Start Date</label>
            <input type="date" name="StartDate" value={form.StartDate} onChange={handleChange} className={`${modalInput} dark:[color-scheme:dark]`} />
          </div>
          <div>
            <label className={modalLabel}>End Date</label>
            <input type="date" name="EndDate" value={form.EndDate} onChange={handleChange} className={`${modalInput} dark:[color-scheme:dark]`} />
          </div>
        </div>

        {/* BUDGET + BENEFICIARIES */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={modalLabel}>Budget</label>
            <input type="number" name="Budget" value={form.Budget} onChange={handleChange} className={`${modalInput} dark:[color-scheme:dark]`} />
          </div>
          <div>
            <label className={modalLabel}>Target Beneficiaries</label>
            <input type="number" name="TargetBeneficiaries" value={form.TargetBeneficiaries} onChange={handleChange} className={`${modalInput} dark:[color-scheme:dark]`} />
          </div>
        </div>

        {/* STATUS 👈 */}
        <div>
          <label className={modalLabel}>Status</label>
          <select name="Status" value={form.Status} onChange={handleChange} className={modalInput}>
            <option value="">Select Status</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Dropped">Dropped</option>
          </select>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className={modalButtonSecondary}>Cancel</button>
          <button type="submit" disabled={loading} className={modalButtonPrimary}>
            {loading ? "Updating..." : "Update Program"}
          </button>
        </div>

      </form>
    </Modal>
  );
}