import React, { useState } from "react"; 
import Modal from "../common/Modal";
import {
  modalInput,
  modalLabel,
  modalButtonPrimary,
  modalButtonSecondary,
} from "../common/ModalUI";
import * as validators from "../../utils/validators";

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
    setForm((prev) => ({ ...prev, [name]: value,}));
    if (error) setError("");
  };

  // ================= VALIDATION =================
  const validate = () => {
    // 1. Required fields check
    const requiredError = validators.validateRequiredFields(
      form,
      [
        "FirstName", 
        "LastName",
        "Gender",
        "DateOfBirth",
        "ContactNumber",
        "Barangay",
        "Municipality",
        "Province",
        "Email",
      ],
      {
        FirstName: "First name", 
        LastName: "Last name",
        Gender: "Gender",
        DateOfBirth: "Date of birth",
        ContactNumber: "Contact number",
        Barangay: "Barangay",
        Municipality: "Municipality",
        Province: "Province",
        Email: "Email",
      }
      );
    if (requiredError) return requiredError;

    // phone validation
    const phoneError = validators.validatePHMobileNumber(form.ContactNumber);
    if (phoneError) return phoneError;

    const genderError = validators.validateGender(form.Gender);
    if (genderError) return genderError;

    // dob validation
    const dobError = validators.validatePHAge(form.DateOfBirth);
    if (dobError) return dobError;

    // email validation
    const emailError = validators.validateEmail(form.Email);
    if (emailError) return emailError;

    return "";
  };


  // ================= SUBMIT =================
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");

      const err = validate();
      if (err) return setError(err);

      try {
        await onSubmit(form);
      } catch (error) {
        const status = error?.response?.status;
        const message = error?.response?.data?.message || "Network error. Please check your connection.";

        if (status === 400 || status === 409) {
          setError(message);
        }
      }
    };

  return (
    <Modal title="Add Farmer" onClose={onClose} width="max-w-lg">

  {/* INFO TEXT */}
  <p className="text-xs text-gray-500 dark:text-gray-400 -mt-4 mb-3">
    Fill in the required fields to register a new farmer.
  </p>
 
  {/* ERROR */}
  <div className="min-h-[12px] mb-2 text-center">
    <p className={`text-red-500 font-medium text-sm transition-opacity duration-200 ${error ? "opacity-100" : "opacity-0"}`}>
     {error || "​"}
    </p>
  </div>

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
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="date-input-wrapper">
            <label className={modalLabel}>Date of Birth</label>
            <input
              type="date"
              name="DateOfBirth"
              value={form.DateOfBirth }
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
              value={form.ContactNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ""); // remove non-numbers
                setForm((prev) => ({
                  ...prev,
                  ContactNumber: value,
                }));
              }}
              className={modalInput}
              maxLength={11} 
            />
          </div>

          <div>
            <label className={modalLabel}>Email</label>
            <input
              type="email"
              name="Email"
              value={form.Email}
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
              value={form.Barangay}
              onChange={handleChange}
              className={modalInput}
            />
          </div>

          <div>
            <label className={modalLabel}>Municipality</label>
            <input
              name="Municipality"
              value={form.Municipality}
              onChange={handleChange}
              className={modalInput}
            />
          </div>

          <div>
            <label className={modalLabel}>Province</label>
            <input
              name="Province"
              value={form.Province}
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