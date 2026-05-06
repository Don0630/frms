import React, { useState } from "react";
import Modal from "../common/Modal";
import {
  modalInput,
  modalLabel,
  modalButtonPrimary,
  modalButtonSecondary,
} from "../common/ModalUI";
import * as validators from "../../utils/validators";

export default function AddLivestockModal({ onClose, onSubmit, loading }) {
  const [form, setForm] = useState({
    Type: "",
    Breed: "",
    AverageProduction: "",
    MarketPrice: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if (error) setError("");
  };


 const validate = () => {
    // 1. Required fields check
    const requiredError = validators.validateRequiredFields(
  form,
  [
    "Type",
    "Breed",
    "AverageProduction",
    "MarketPrice",
  ],
  {
    Type: "Livestock type",
    Breed: "Breed",
    AverageProduction: "Average production",
    MarketPrice: "Market price",
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
      Type: form.Type,
      Breed: form.Breed,
      AverageProduction: parseFloat(form.AverageProduction),
      MarketPrice: parseFloat(form.MarketPrice),
    });
  };

  return (
    <Modal title="Add Livestock" onClose={onClose} width="max-w-lg">

      {/* ERROR */}
      {error && (
        <p className="text-red-500 text-sm mb-3">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">

        {/* TYPE */}
        <div>
          <label className={modalLabel}>Type</label>
          <input
            name="Type"
            value={form.Type}
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
            value={form.Breed}
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
              value={form.AverageProduction}
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
            {loading ? "Saving..." : "Save Livestock"}
          </button>

        </div>

      </form>
    </Modal>
  );
}