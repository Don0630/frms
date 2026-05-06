import { useState } from "react";
import Modal from "../common/Modal";
import {
  modalInput,
  modalLabel,
  modalButtonPrimary,
  modalButtonSecondary,
} from "../common/ModalUI";
import * as validators from "../../utils/validators";



export default function AddCropModal({ onClose, onSubmit, loading }) {
  const [form, setForm] = useState({
    CropName: "",
    Category: "",
    Season: "",
    AverageYieldPerHectare: "",
    MarketPrice: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

 const validate = () => {
    // 1. Required fields check
    const requiredError = validators.validateRequiredFields(
  form,
  [
    "CropName",
    "Category",
    "Season",
    "AverageYieldPerHectare",
  ],
  {
    CropName: "Crop name",
    Category: "Category",
    Season: "Season",
    AverageYieldPerHectare: "Average yield per hectare",
  }
);
    if (requiredError) return requiredError;
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
    <Modal title="Add Crop" onClose={onClose} width="max-w-lg">

      {error && (
        <p className="text-red-500 text-sm mb-3">{error}</p>
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
            {loading ? "Saving..." : "Save Crop"}
          </button>

        </div>

      </form>
    </Modal>
  );
}