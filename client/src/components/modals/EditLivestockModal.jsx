import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Modal from "../common/Modal";
import {
  modalInput,
  modalLabel,
  modalButtonPrimary,
  modalButtonSecondary,
} from "../common/ModalUI";
import * as validators from "../../utils/validators";

export default function EditLivestockModal({
  onClose,
  onSubmit,
  loading,
  selectedLivestock,
}) {
  const [form, setForm] = useState({
    Type: "",
    Breed: "",
    AverageProduction: "",
    MarketPrice: "",
  });

  const [error, setError] = useState("");

  // ================= LOAD SELECTED DATA =================
  useEffect(() => {
    if (selectedLivestock) {
      setForm({
        Type: selectedLivestock.Type || "",
        Breed: selectedLivestock.Breed || "",
        AverageProduction: selectedLivestock.AverageProduction || "",
        MarketPrice: selectedLivestock.MarketPrice || "",
      });
    }
  }, [selectedLivestock]);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
  };

  // ================= VALIDATION =================
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

  const noChangesError = validators.validateNoChanges(selectedLivestock, form,
    ["Type", "Breed", "AverageProduction", "MarketPrice"]
  );
  if (noChangesError) return noChangesError;

  // 👈 missing in your current code
  const aveProdError = validators.validatePositiveNumber(form.AverageProduction, "Average Production");
  if (aveProdError) return aveProdError;

  const marketPriceError = validators.validatePositiveNumber(form.MarketPrice, "Market Price");
  if (marketPriceError) return marketPriceError;

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
      Type: form.Type,
      Breed: form.Breed,
      AverageProduction: parseFloat(form.AverageProduction),
      MarketPrice: parseFloat(form.MarketPrice),
    });
  } catch (error) {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || error.message;

    if (status === 400 || status === 409) {
      setError(message);
    } else if (status === 500) {
      toast.error("Something went wrong. Please try again.");
    } else if (!error.response) {
      toast.error("Network error. Please check your connection.");
    } else {
      toast.error(message);
    }
  }
};

  return (
    <Modal
      title="Edit Livestock"
      onClose={onClose}
      width="max-w-lg"
    >
      {/* ERROR */}
      {error && (
        <p className="text-red-500 text-sm mb-3">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">

        {/* TYPE */}
        <div>
          <label className={modalLabel}>Type</label>
          <input
            type="text"
            name="Type"
            value={form.Type}
            onChange={handleChange}
            className={modalInput}
          />
        </div>

        {/* BREED */}
        <div>
          <label className={modalLabel}>Breed</label>
          <input
            type="text"
            name="Breed"
            value={form.Breed}
            onChange={handleChange}
            className={modalInput}
          />
        </div>

        {/* PRODUCTION + PRICE */}
        <div className="grid grid-cols-2 gap-2">

          <div>
            <label className={modalLabel}>
              Avg Production
            </label>
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
            <label className={modalLabel}>
              Market Price
            </label>
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
            {loading ? "Updating..." : "Update Livestock"}
          </button>

        </div>

      </form>
    </Modal>
  );
}