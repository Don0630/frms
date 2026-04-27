import { useEffect, useState } from "react";
import Modal from "../common/Modal";
import {
  modalInput,
  modalLabel,
  modalButtonPrimary,
  modalButtonSecondary,
} from "../common/ModalUI";

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
        AverageProduction:
          selectedLivestock.AverageProduction || "",
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
    if (
      !form.Type?.trim() ||
      !form.Breed?.trim() ||
      !form.AverageProduction ||
      !form.MarketPrice
    ) {
      return "Please fill in all fields";
    }

    return "";
  };

  // ================= SUBMIT =================
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
    <Modal
      title="Edit Livestock"
      onClose={onClose}
      width="max-w-lg"
    >
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