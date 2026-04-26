import React, { useState } from "react";
import Modal from "../common/Modal";
import {
  modalInput,
  modalLabel,
  modalButtonPrimary,
  modalButtonSecondary,
} from "../common/ModalUI";

export default function AddFarmerModal({ onClose, onSubmit, loading }) {
  const [form, setForm] = useState({
    FirstName: "",
    MiddleName: "",
    LastName: "",
    Gender: "",
    DateOfBirth: "",
    Barangay: "",
    Municipality: "",
    Province: "",
    ContactNumber: "",
    Email: "",
  });

  const [error, setError] = useState("");

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  // ================= VALIDATION =================
  const validate = () => {
    const {
      FirstName,
      LastName,
      Gender,
      DateOfBirth,
      ContactNumber,
      Barangay,
      Municipality,
      Province,
    } = form;

    if (!FirstName?.trim() || !LastName?.trim())
      return "First and Last name are required";

    if (!Gender) return "Gender is required";

    if (!DateOfBirth) return "Date of birth is required";

    if (!ContactNumber?.trim())
      return "Contact number is required";

    if (!Barangay?.trim() || !Municipality?.trim() || !Province?.trim())
      return "Complete address is required";

    return "";
  };

  // ================= SUBMIT =================
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const err = validate();
    if (err) return setError(err);

    const currentDate = new Date().toISOString().split("T")[0];

    onSubmit({
      ...form,
      RegistrationDate: currentDate,
    });
  };

  return (
    <Modal title="Add Farmer" onClose={onClose} width="max-w-lg">

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
              value={form.Gender}
              onChange={handleChange}
              className={modalInput}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

  
<div className="date-input-wrapper">
  <label className={modalLabel}>Date of Birth</label>

  <input
    type="date"
    name="DateOfBirth"
    value={form.DateOfBirth || ""}
    onChange={handleChange}
     max={new Date().toISOString().split("T")[0]}
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
            {loading ? "Saving..." : "Save Farmer"}
          </button>

        </div>

      </form>
 


    </Modal>
  );
}