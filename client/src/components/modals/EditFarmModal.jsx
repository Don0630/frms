import React, { useState, useEffect } from "react";
import Modal from "../common/Modal";
import {
  modalInput,
  modalLabel,
  modalButtonPrimary,
  modalButtonSecondary,
} from "../common/ModalUI";

export default function EditFarmModal({
  onClose,
  onSubmit,
  loading,
  selectedFarm,
}) {
  const [form, setForm] = useState({
    FarmBarangay: "",
    FarmMunicipality: "",
    FarmProvince: "",
    FarmSize: "",
  });

  const [error, setError] = useState("");

  // ✅ Load selected farm into form
  useEffect(() => {
    if (selectedFarm) {
      setForm({
        FarmBarangay: selectedFarm.FarmBarangay || "",
        FarmMunicipality: selectedFarm.FarmMunicipality || "",
        FarmProvince: selectedFarm.FarmProvince || "",
        FarmSize: selectedFarm.FarmSize || "",
      });
    }
  }, [selectedFarm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!form.FarmBarangay) return "Barangay is required";
    if (!form.FarmMunicipality) return "Municipality is required";
    if (!form.FarmProvince) return "Province is required";
    if (!form.FarmSize) return "Farm size is required";
    if (Number(form.FarmSize) <= 0) return "Farm size must be greater than 0";
    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const err = validate();
    if (err) return setError(err);

    // ✅ ONLY send form upward
    onSubmit(form);
  };

  return (
    <Modal title="Edit Farm" onClose={onClose} width="max-w-lg">

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 p-2 text-sm rounded mb-3">
          {error}
        </div>
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
            {loading ? "Updating..." : "Update Farm"}
          </button>

        </div>

      </form>
    </Modal>
  );
}