import { useEffect, useState } from "react";
import Modal from "../common/Modal";
import {
  modalInput,
  modalLabel,
  modalButtonPrimary,
  modalButtonSecondary,
} from "../common/ModalUI";

export default function EditCropModal({
  onClose,
  onSubmit,
  loading,
  selectedCrop,
}) {
  const [form, setForm] = useState({
    CropID: "",
    CropName: "",
    Category: "",
    Season: "",
    AverageYieldPerHectare: "",
    MarketPrice: "",
  });

  const [error, setError] = useState("");

  // hydrate form
  useEffect(() => {
    if (selectedCrop) {
      setForm({
        CropID: selectedCrop.CropID,
        CropName: selectedCrop.CropName || "",
        Category: selectedCrop.Category || "",
        Season: selectedCrop.Season || "",
        AverageYieldPerHectare:
          selectedCrop.AverageYieldPerHectare || "",
        MarketPrice: selectedCrop.MarketPrice || "",
      });
    }
  }, [selectedCrop]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const validate = () => {
    if (!form.CropName?.trim()) return "Crop name is required";
    if (!form.Category) return "Category is required";
    if (!form.Season) return "Season is required";
    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const err = validate();
    if (err) return setError(err);

    onSubmit({
      ...form,
      AverageYieldPerHectare: parseFloat(form.AverageYieldPerHectare),
      MarketPrice: parseFloat(form.MarketPrice),
    });
  };

  return (
    <Modal title="Edit Crop" onClose={onClose} width="max-w-lg">

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 p-2 text-sm rounded mb-3">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">

        {/* CROP NAME */}
        <div>
          <label className={modalLabel}>Crop Name</label>
          <input
            name="CropName"
            value={form.CropName}
            onChange={handleChange}
            className={modalInput}
          />
        </div>

        {/* CATEGORY + SEASON */}
        <div className="grid grid-cols-2 gap-2">

          <div>
            <label className={modalLabel}>Category</label>
            <select
              name="Category"
              value={form.Category}
              onChange={handleChange}
              className={modalInput}
            >
              <option value="">Select Category</option>
              <option>Grain</option>
              <option>Vegetable</option>
              <option>Fruit</option>
              <option>Root Crop</option>
              <option>Legume</option>
            </select>
          </div>

          <div>
            <label className={modalLabel}>Season</label>
            <select
              name="Season"
              value={form.Season}
              onChange={handleChange}
              className={modalInput}
            >
              <option value="">Select Season</option>
              <option>Wet</option>
              <option>Dry</option>
              <option>All Year</option>
            </select>
          </div>

        </div>

        {/* YIELD + PRICE */}
        <div className="grid grid-cols-2 gap-2">

          <div>
            <label className={modalLabel}>Yield per Hectare</label>
            <input
              type="number"
              step="0.01"
              name="AverageYieldPerHectare"
              value={form.AverageYieldPerHectare}
              onChange={handleChange}
              className={`${modalInput} dark:[color-scheme:dark]`}
            />
          </div>

          <div>
            <label className={modalLabel}>Market Price</label>
            <input
              type="number"
              step="0.01"
              name="MarketPrice"
              value={form.MarketPrice}
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
            {loading ? "Updating..." : "Update Crop"}
          </button>

        </div>

      </form>
    </Modal>
  );
}