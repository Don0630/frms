import React, { useEffect, useState } from "react"; 
import Modal from "../common/Modal";
import {
  modalInput,
  modalLabel,
  modalButtonPrimary,
  modalButtonSecondary,
} from "../common/ModalUI";
import * as validators from "../../utils/validators";
import * as subsidyValidator from "../../utils/subsidyValidator";

export default function EditSubsidyModal({
  onClose,
  onSubmit,
  loading,
  selectedSubsidy,
}) {

  const [form, setForm] = useState({
    TotalAmount: "",
    DistributionDate: "",
    Remarks: "",
  });

  const [error, setError] = useState("");

  // ================= LOAD SELECTED DATA =================
  useEffect(() => {
    if (selectedSubsidy) {
      setForm({
        TotalAmount: selectedSubsidy.TotalAmount || "",
        DistributionDate: selectedSubsidy.DistributionDate || "",
        Remarks: selectedSubsidy.Remarks || "",
      });
    }
  }, [selectedSubsidy]);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  // ================= VALIDATION =================
  const validate = () => {
    const requiredError = validators.validateRequiredFields(form,
      ["TotalAmount", "DistributionDate", "Remarks"],
      {
        TotalAmount: "Total amount",
        DistributionDate: "Distribution date",
        Remarks: "Remarks",
      }
    );
    if (requiredError) return requiredError;

    const noChangesError = validators.validateNoChanges(selectedSubsidy, form,
      ["TotalAmount", "DistributionDate", "Remarks"]
    );
    if (noChangesError) return noChangesError;

    const totalAmountError = validators.validatePositiveNumber(form.TotalAmount, "Total Amount");
    if (totalAmountError) return totalAmountError;

    const budgetError = subsidyValidator.validateSubsidyAmount(
      form.TotalAmount,
      selectedSubsidy.AvailableBudget // remaining after excluding this subsidy
    );
    if (budgetError) return budgetError;

    const dateError = subsidyValidator.validateDistributionDate(
      form.DistributionDate,
      selectedSubsidy.ProgramStartDate,
      selectedSubsidy.ProgramEndDate
    );
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
        ...form,
        TotalAmount: Number(form.TotalAmount),
      });
    } catch (error) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message || error.message;
      setError(message);
    }
  };

  return (
    <Modal title="Edit Subsidy" onClose={onClose} width="max-w-lg">

  {/* INFO TEXT */}
  <p className="text-xs text-gray-500 dark:text-gray-400 -mt-4 mb-3">
    Update the subsidy information below.
  </p>

  {/* ERROR */}
  <div className="min-h-[24px] mb-2 text-center">
    <p className={`text-red-500 font-medium text-sm transition-opacity duration-200 ${error ? "opacity-100" : "opacity-0"}`}>
     {error || "​"}
    </p>
  </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">

        {/* PROGRAM — read only */}
        <div>
          <label className={modalLabel}>Program</label>
          <input
            value={selectedSubsidy?.ProgramName || ""}
            disabled
            className={`${modalInput} opacity-60 cursor-not-allowed`}
          />
        </div>

        {/* AMOUNT + DATE */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={modalLabel}>Total Amount</label>
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
            <label className={modalLabel}>Distribution Date</label>
            <input
              type="date"
              name="DistributionDate"
              value={form.DistributionDate}
              onChange={handleChange}
              className={`${modalInput} dark:[color-scheme:dark]`}
            />
          </div>
        </div>

        {/* REMARKS */}
        <div>
          <label className={modalLabel}>Remarks</label>
          <textarea
            name="Remarks"
            value={form.Remarks}
            onChange={handleChange}
            className={modalInput}
            rows={3}
          />
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className={modalButtonSecondary}>
            Cancel
          </button>
          <button type="submit" disabled={loading} className={modalButtonPrimary}>
            {loading ? "Updating..." : "Update Subsidy"}
          </button>
        </div>

      </form>
    </Modal>
  );
}