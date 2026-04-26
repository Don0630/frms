import React, { useEffect, useState } from "react";
import Modal from "../common/Modal";
import {
  modalInput,
  modalLabel,
  modalButtonPrimary,
  modalButtonSecondary,
} from "../common/ModalUI";

export default function EditFarmerModal({
  onClose,
  selectedFarmer,
  onSubmit,
  loading,
}) {
  const [form, setForm] = useState({});
  const [error, setError] = useState("");

  // ================= LOAD DATA =================
  useEffect(() => {
    if (selectedFarmer) {
      setForm({
        FarmerID: selectedFarmer.FarmerID,
        FirstName: selectedFarmer.FirstName || "",
        MiddleName: selectedFarmer.MiddleName || "",
        LastName: selectedFarmer.LastName || "",
        Gender: selectedFarmer.Gender || "",
        DateOfBirth: selectedFarmer.DateOfBirth?.split("T")[0] || "",
        Barangay: selectedFarmer.Barangay || "",
        Municipality: selectedFarmer.Municipality || "",
        Province: selectedFarmer.Province || "",
        ContactNumber: selectedFarmer.ContactNumber || "",
        Email: selectedFarmer.Email || "",
      });
    }
  }, [selectedFarmer]);

  // ================= HANDLE =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  // ================= VALIDATE =================
  const validate = () => {
    if (!form.FirstName || !form.LastName) return "Name is required";
    if (!form.Gender) return "Gender is required";
    if (!form.DateOfBirth) return "Date of birth is required";
    if (!form.ContactNumber) return "Contact number is required";
    return "";
  };

  // ================= SUBMIT =================
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const err = validate();
    if (err) return setError(err);

    onSubmit(form);
  };

  return (
    <Modal title="Edit Farmer" onClose={onClose} width="max-w-lg">
      {/* ERROR */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 p-2 text-sm rounded mb-3">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">

        {/* NAME */}
        <div className="grid grid-cols-3 gap-2">

          <div>
            <label className={modalLabel}>First Name</label>
            <input
              name="FirstName"
              value={form.FirstName || ""}
              onChange={handleChange}
              className={modalInput}
            />
          </div>

          <div>
            <label className={modalLabel}>Middle Name</label>
            <input
              name="MiddleName"
              value={form.MiddleName || ""}
              onChange={handleChange}
              className={modalInput}
            />
          </div>

          <div>
            <label className={modalLabel}>Last Name</label>
            <input
              name="LastName"
              value={form.LastName || ""}
              onChange={handleChange}
              className={modalInput}
            />
          </div>

        </div>

        {/* GENDER + DOB */}
        <div className="grid grid-cols-2 gap-2">

          <div>
            <label className={modalLabel}>Gender</label>
            <select
              name="Gender"
              value={form.Gender || ""}
              onChange={handleChange}
              className={modalInput}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label className={modalLabel}>Date of Birth</label>
            <input
              type="date"
              name="DateOfBirth"
              value={form.DateOfBirth || ""}
              onChange={handleChange}
              className={`${modalInput} dark:[color-scheme:dark]`}
            />
          </div>

        </div>

        {/* CONTACT + EMAIL */}
        <div className="grid grid-cols-2 gap-2">

          <div>
            <label className={modalLabel}>Contact Number</label>
            <input
              name="ContactNumber"
              value={form.ContactNumber || ""}
              onChange={handleChange}
              className={modalInput}
            />
          </div>

          <div>
            <label className={modalLabel}>Email</label>
            <input
              name="Email"
              value={form.Email || ""}
              onChange={handleChange}
              className={modalInput}
            />
          </div>

        </div>

        {/* ADDRESS */}
        <div className="grid grid-cols-3 gap-2">

          <div>
            <label className={modalLabel}>Barangay</label>
            <input
              name="Barangay"
              value={form.Barangay || ""}
              onChange={handleChange}
              className={modalInput}
            />
          </div>

          <div>
            <label className={modalLabel}>Municipality</label>
            <input
              name="Municipality"
              value={form.Municipality || ""}
              onChange={handleChange}
              className={modalInput}
            />
          </div>

          <div>
            <label className={modalLabel}>Province</label>
            <input
              name="Province"
              value={form.Province || ""}
              onChange={handleChange}
              className={modalInput}
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
            {loading ? "Updating..." : "Update Farmer"}
          </button>

        </div>

      </form>
    </Modal>
  );
}