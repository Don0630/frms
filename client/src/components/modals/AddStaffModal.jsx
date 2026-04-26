import React, { useState } from "react";
import Modal from "../common/Modal";
import {
  modalInput,
  modalLabel,
  modalButtonPrimary,
  modalButtonSecondary,
} from "../common/ModalUI";

export default function AddStaffModal({ onClose, onSubmit, loading }) {
  const [form, setForm] = useState({
    FirstName: "",
    MiddleName: "",
    LastName: "",
    Gender: "Male",
    Position: "",
    Department: "",
    ContactNumber: "",
    Email: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!form.FirstName || !form.LastName)
      return "First and Last name are required";

    if (!form.Email) return "Email is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.Email)) return "Invalid email format";

    if (!form.ContactNumber) return "Contact number is required";

    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const err = validateForm();
    if (err) return setError(err);

    onSubmit(form);
  };

  return (
    <Modal title="Add Staff" onClose={onClose} width="max-w-lg">

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
              value={form.FirstName}
              onChange={handleChange}
              className={modalInput}
            />
          </div>

          <div>
            <label className={modalLabel}>Middle Name</label>
            <input
              name="MiddleName"
              value={form.MiddleName}
              onChange={handleChange}
              className={modalInput}
            />
          </div>

          <div>
            <label className={modalLabel}>Last Name</label>
            <input
              name="LastName"
              value={form.LastName}
              onChange={handleChange}
              className={modalInput}
            />
          </div>

        </div>

        {/* EMAIL */}
        <div>
          <label className={modalLabel}>Email</label>
          <input
            name="Email"
            type="email"
            value={form.Email}
            onChange={handleChange}
            className={modalInput}
          />
        </div>

        {/* GENDER + CONTACT */}
        <div className="grid grid-cols-2 gap-2">

          <div>
            <label className={modalLabel}>Gender</label>
            <select
              name="Gender"
              value={form.Gender}
              onChange={handleChange}
              className={modalInput}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label className={modalLabel}>Contact</label>
            <input
              name="ContactNumber"
              value={form.ContactNumber}
              onChange={handleChange}
              className={modalInput}
            />
          </div>

        </div>

        {/* POSITION + DEPARTMENT */}
        <div className="grid grid-cols-2 gap-2">

          <div>
            <label className={modalLabel}>Position</label>
            <input
              name="Position"
              value={form.Position}
              onChange={handleChange}
              className={modalInput}
            />
          </div>

          <div>
            <label className={modalLabel}>Department</label>
            <input
              name="Department"
              value={form.Department}
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
            {loading ? "Saving..." : "Save Staff"}
          </button>

        </div>

      </form>
    </Modal>
  );
}