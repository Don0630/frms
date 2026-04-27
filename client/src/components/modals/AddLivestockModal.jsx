import React, { useState } from "react";
import Modal from "../common/Modal";
import {
  modalInput,
  modalLabel,
  modalButtonPrimary,
  modalButtonSecondary,
} from "../common/ModalUI";

export default function AddLivestockModal({ onClose, onSubmit, loading }) {
  const [formData, setFormData] = useState({
    Type: "",
    Breed: "",
    AverageProduction: "",
    MarketPrice: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if (error) setError("");
  };

  const validate = () => {
    const { Type, Breed, AverageProduction, MarketPrice } = formData;

    if (!Type?.trim()) return "Type is required";
    if (!Breed?.trim()) return "Breed is required";
    if (!AverageProduction) return "Average Production is required";
    if (!MarketPrice) return "Market Price is required";

    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const err = validate();
    if (err) return setError(err);

    onSubmit({
      Type: formData.Type,
      Breed: formData.Breed,
      AverageProduction: parseFloat(formData.AverageProduction),
      MarketPrice: parseFloat(formData.MarketPrice),
    });
  };

  return (
    <Modal title="Add Livestock" onClose={onClose} width="max-w-lg">

      {/* ERROR */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 p-2 text-sm rounded mb-3">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">

        {/* TYPE */}
        <div>
          <label className={modalLabel}>Type</label>
          <input
            name="Type"
            value={formData.Type}
            onChange={handleChange}
            className={modalInput}
            placeholder="e.g. Cow, Goat"
          />
        </div>

        {/* BREED */}
        <div>
          <label className={modalLabel}>Breed</label>
          <input
            name="Breed"
            value={formData.Breed}
            onChange={handleChange}
            className={modalInput}
            placeholder="Breed"
          />
        </div>

        {/* PRODUCTION + PRICE */}
        <div className="grid grid-cols-2 gap-2">

          <div>
            <label className={modalLabel}>Avg Production</label>
            <input
              type="number"
              step="0.01"
              name="AverageProduction"
              value={formData.AverageProduction}
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
              value={formData.MarketPrice}
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
            {loading ? "Saving..." : "Save Livestock"}
          </button>

        </div>

      </form>
    </Modal>
  );
}