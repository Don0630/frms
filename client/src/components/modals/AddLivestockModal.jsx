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
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const validate = () => {
    const requiredError = validators.validateRequiredFields(form,
      ["Type", "Breed", "AverageProduction", "MarketPrice"],
      {
        Type: "Livestock type",
        Breed: "Breed",
        AverageProduction: "Average production",
        MarketPrice: "Market price",
      }
    );
    if (requiredError) return requiredError;

    const aveProdError = validators.validatePositiveNumber(form.AverageProduction, "Average Production");
    if (aveProdError) return aveProdError;

    const marketPriceError = validators.validatePositiveNumber(form.MarketPrice, "Market Price");
    if (marketPriceError) return marketPriceError;

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const err = validate();
    if (err) return setError(err);

    try {
      await onSubmit({
        ...form,
        AverageProduction: Number(form.AverageProduction),
        MarketPrice: Number(form.MarketPrice),
      });
    } catch (error) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message || "Network error. Please check your connection.";

      if (status === 400 || status === 409) {
        setError(message);
      }
    }
  };

  return (
    <Modal title="Add Livestock" onClose={onClose} width="max-w-lg">

      {/* INFO TEXT */}
      <p className="text-xs text-gray-500 dark:text-gray-400 -mt-4 mb-3">
        Fill in the required fields to register a new livestock.
      </p>

      {/* ERROR */}
      <div className="min-h-[24px] mb-2 text-center">
        <p className={`text-red-500 font-medium text-sm transition-opacity duration-200 ${error ? "opacity-100" : "opacity-0"}`}>
          {error || "​"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
 
{/* TYPE */}
<div>
  <label className={modalLabel}>Type</label>
  <select name="Type" value={form.Type} onChange={handleChange} className={modalInput}>
    <option value="">Select type</option>
    {["Cattle", "Poultry", "Swine", "Goat"].map((type) => (
      <option key={type} value={type}>{type}</option>
    ))}
  </select>
</div>

        {/* BREED */}
        <div>
          <label className={modalLabel}>Breed</label>
          <input name="Breed" value={form.Breed} onChange={handleChange} className={modalInput} placeholder="Breed" />
        </div>

        {/* PRODUCTION + PRICE */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={modalLabel}>Avg Production</label>
            <input type="number" step="0.01" name="AverageProduction" value={form.AverageProduction} onChange={handleChange} className={`${modalInput} dark:[color-scheme:dark]`} />
          </div>
          <div>
            <label className={modalLabel}>Market Price</label>
            <input type="number" step="0.01" name="MarketPrice" value={form.MarketPrice} onChange={handleChange} className={`${modalInput} dark:[color-scheme:dark]`} />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className={modalButtonSecondary}>Cancel</button>
          <button type="submit" disabled={loading} className={modalButtonPrimary}>
            {loading ? "Saving..." : "Save Livestock"}
          </button>
        </div>

      </form>
    </Modal>
  );
}