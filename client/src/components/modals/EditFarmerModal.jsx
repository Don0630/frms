import React, { useEffect, useState } from "react";
import { showErrorToast, showSuccessToast } from "../../utils/toastUtility";
import Modal from "../common/Modal";
import {
  modalInput,
  modalLabel,
  modalButtonPrimary,
  modalButtonSecondary,
} from "../common/ModalUI";
import * as validators from "../../utils/validators"; 

export default function EditFarmerModal({ onClose, selectedFarmer, onSubmit, loading,}) {
  
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
        DateOfBirth: selectedFarmer.DateOfBirth || "",
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

  // ================= VALIDATION =================
const validate = () => {
  // 1. Required fields check
const requiredError = validators.validateRequiredFields(
  form,
  [
    "FirstName",
    "MiddleName",
    "LastName",
    "Gender",
    "DateOfBirth",
    "ContactNumber",
    "Barangay",
    "Municipality",
    "Province",
  ],
  {
    FirstName: "First name",
    MiddleName: "Middle name",
    LastName: "Last name",
    Gender: "Gender",
    DateOfBirth: "Date of birth",
    ContactNumber: "Contact number",
    Barangay: "Barangay",
    Municipality: "Municipality",
    Province: "Province",
  }
);
  if (requiredError) return requiredError;

  // No Changes Check
  const noChangesError = validators.validateNoChanges(
  selectedFarmer,
  form,
  [
    "FirstName",
    "MiddleName",
    "LastName",
    "Gender",
    "DateOfBirth",
    "Barangay",
    "Municipality",
    "Province",
    "ContactNumber",
    "Email",
  ]
);
  if (noChangesError) return noChangesError;

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
    } else {
      showErrorToast(message);
    }
  }
};

  return (
   <Modal title="Edit Farmer" onClose={onClose} width="max-w-lg">

  {/* INFO TEXT */}
  <p className="text-xs text-gray-500 dark:text-gray-400 -mt-4 mb-3">
    Update the farmer's information below.
  </p>

  {/* ERROR */}
  <div className="min-h-[24px] mb-2 text-center">
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
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
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