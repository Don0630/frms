import React, { useState } from "react";
import Modal from "../common/Modal";
import {
  modalInput,
  modalLabel,
  modalButtonPrimary,
  modalButtonSecondary,
} from "../common/ModalUI";
import * as validators from "../../utils/validators";

export default function AddFarmModal({ onClose, onSubmit, loading, farmer,}) {
  
  const [form, setForm] = useState({
    FarmBarangay: "",
    FarmMunicipality: "",
    FarmProvince: "",
    FarmSize: "",
  });

  const [error, setError] = useState("");


  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value,}));
    if (error) setError("");
  };

  // ================= VALIDATION =================
  const validate = () => {
    // 1. Required fields check
    const requiredError = validators.validateRequiredFields( form,
  [
    "FarmBarangay",
    "FarmMunicipality",
    "FarmProvince",
    "FarmSize",
  ],
  {
    FarmBarangay: "Barangay",
    FarmMunicipality: "Municipality",
    FarmProvince: "Province",
    FarmSize: "Farm size",
  }
);
    if (requiredError) return requiredError;


    return "";
  };

// ================= SUBMIT =================
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const err = validate();
    if (err) return setError(err);

    onSubmit({
      FarmerID: farmer.FarmerID,
      ...form,
    });
  };

  return (
    <Modal title="Add Farm" onClose={onClose} width="max-w-lg">

      {error && (
        <p className="text-red-500 text-sm mb-3">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">

        {/* LOCATION */}
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className={modalLabel}>Barangay</label>
            <input
              name="FarmBarangay"
              value={form.FarmBarangay}
              onChange={handleChange}
              className={modalInput}
            />
          </div>

          <div>
            <label className={modalLabel}>Municipality</label>
            <input
              name="FarmMunicipality"
              value={form.FarmMunicipality}
              onChange={handleChange}
              className={modalInput}
            />
          </div>

          <div>
            <label className={modalLabel}>Province</label>
            <input
              name="FarmProvince"
              value={form.FarmProvince}
              onChange={handleChange}
              className={modalInput}
            />
          </div>
        </div>

        {/* SIZE */}
        <div className="number-input-wrapper">
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
            {loading ? "Saving..." : "Save Farm"}
          </button>
        </div>

      </form>
    </Modal>
  );
}