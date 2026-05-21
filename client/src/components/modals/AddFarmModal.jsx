import React, { useState } from "react";
import { showErrorToast } from "../../utils/toastUtility";
import Modal from "../common/Modal";
import {
  modalInput,
  modalLabel,
  modalButtonPrimary,
  modalButtonSecondary,
} from "../common/ModalUI";
import * as validators from "../../utils/validators";

export default function AddFarmModal({ onClose, onSubmit, loading, farmer }) {
  
  const [form, setForm] = useState({
    FarmBarangay: "",
    FarmMunicipality: "",
    FarmProvince: "",
    FarmSize: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const validate = () => {
    const requiredError = validators.validateRequiredFields(form,
      ["FarmBarangay", "FarmMunicipality", "FarmProvince", "FarmSize"],
      {
        FarmBarangay: "Barangay",
        FarmMunicipality: "Municipality",
        FarmProvince: "Province",
        FarmSize: "Farm size",
      }
    );
    if (requiredError) return requiredError;

    const farmSizeError = validators.validatePositiveNumber(form.FarmSize, "Farm Size");
    if (farmSizeError) return farmSizeError;

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const err = validate();
    if (err) return setError(err);

    try {
      await onSubmit(form);
    } catch (error) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message || "Network error. Please check your connection.";

      if (status === 400 || status === 409) {
        setError(message);
      } else {
        showErrorToast(message);
      }
    }
  };

  return (
    <Modal title="Add Farm" onClose={onClose} width="max-w-lg">

      {/* INFO TEXT */}
      <p className="text-xs text-gray-500 dark:text-gray-400 -mt-4 mb-3">
        Register a new farm for {farmer?.FirstName} {farmer?.LastName}.
      </p>

      {/* ERROR */}
      <div className="min-h-[24px] mb-2 text-center">
        <p className={`text-red-500 font-medium text-sm transition-opacity duration-200 ${error ? "opacity-100" : "opacity-0"}`}>
         {error || "​"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">

        {/* LOCATION */}
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className={modalLabel}>Barangay</label>
            <input name="FarmBarangay" value={form.FarmBarangay} onChange={handleChange} className={modalInput} />
          </div>
          <div>
            <label className={modalLabel}>Municipality</label>
            <input name="FarmMunicipality" value={form.FarmMunicipality} onChange={handleChange} className={modalInput} />
          </div>
          <div>
            <label className={modalLabel}>Province</label>
            <input name="FarmProvince" value={form.FarmProvince} onChange={handleChange} className={modalInput} />
          </div>
        </div>

        {/* SIZE */}
        <div>
          <label className={modalLabel}>Farm Size (hectares)</label>
          <input
            type="number"
            step="0.01"
            name="FarmSize"
            value={form.FarmSize}
            onChange={handleChange}
            className={`${modalInput} dark:[color-scheme:dark]`}
          />
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className={modalButtonSecondary}>Cancel</button>
          <button type="submit" disabled={loading} className={modalButtonPrimary}>
            {loading ? "Saving..." : "Save Farm"}
          </button>
        </div>

      </form>
    </Modal>
  );
}