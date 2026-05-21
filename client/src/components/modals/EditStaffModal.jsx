import { useState, useEffect } from "react";
import { showErrorToast, showSuccessToast } from "../../utils/toastUtility";
import Modal from "../common/Modal";
import {
  modalInput,
  modalLabel,
  modalButtonPrimary,
  modalButtonSecondary,
} from "../common/ModalUI";
import * as validators from "../../utils/validators";

export default function EditStaffModal({ selectedStaff, onClose, onSubmit, loading }) {

  const [form, setForm] = useState({
    FirstName: "",
    MiddleName: "",
    LastName: "",
    Gender: "",
    DateOfBirth: "",
    Position: "",
    Department: "",
    ContactNumber: "",
    Email: "",
  });

  const [error, setError] = useState("");

  // ================= LOAD SELECTED DATA =================
  useEffect(() => {
    if (selectedStaff) {
      setForm({
        FirstName: selectedStaff.FirstName || "",
        MiddleName: selectedStaff.MiddleName || "",
        LastName: selectedStaff.LastName || "",
        Gender: selectedStaff.Gender || "",
        DateOfBirth: selectedStaff.DateOfBirth?.split("T")[0] || "",
        Position: selectedStaff.Position || "",
        Department: selectedStaff.Department || "",
        ContactNumber: selectedStaff.ContactNumber || "",
        Email: selectedStaff.Email || "",
      });
    }
  }, [selectedStaff]);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  // ================= VALIDATION =================
  const validate = () => {
    const requiredError = validators.validateRequiredFields(
      form,
      ["FirstName", "MiddleName", "LastName", "Gender", "DateOfBirth", "Position", "Department", "ContactNumber", "Email"],
      {
        FirstName: "First name",
        MiddleName: "Middle name",
        LastName: "Last name",
        Gender: "Gender",
        DateOfBirth: "Date of birth",
        Position: "Position",
        Department: "Department",
        ContactNumber: "Contact number",
        Email: "Email",
      }
    );
    if (requiredError) return requiredError;

    const noChangesError = validators.validateNoChanges(
      {
        ...selectedStaff,
        DateOfBirth: selectedStaff.DateOfBirth?.split("T")[0] || "",  
      },
      form,
      ["FirstName", "MiddleName", "LastName", "Gender", "DateOfBirth", "Position", "Department", "ContactNumber", "Email"]
    );
    if (noChangesError) return noChangesError;

    const phoneError = validators.validatePHMobileNumber(form.ContactNumber);
    if (phoneError) return phoneError;

    const emailError = validators.validateEmail(form.Email);
    if (emailError) return emailError;

    const genderError = validators.validateGender(form.Gender);
    if (genderError) return genderError;

    const ageError = validators.validatePHAge(form.DateOfBirth);
    if (ageError) return ageError;

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
      const message = error?.response?.data?.message || error.message;

       if (status === 400 || status === 409) {
           setError(message);
         } else {
           showErrorToast(message);
         }
    }
  };

  return (
    <Modal title="Edit Staff" onClose={onClose} width="max-w-lg">

     {/* INFO TEXT */}
  <p className="text-xs text-gray-500 dark:text-gray-400 -mt-4 mb-3">
    Update the staff's information below.
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
            type="email"
            name="Email"
            value={form.Email}
            onChange={handleChange}
            className={modalInput}
          />
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
              <option value="Other">Others</option>
            </select>
          </div>

          <div>
            <label className={modalLabel}>Date of Birth</label>
            <input
              type="date"
              name="DateOfBirth"
              value={form.DateOfBirth}
              onChange={handleChange}
              className={`${modalInput} dark:[color-scheme:dark]`}
            />
          </div>
        </div>

        {/* CONTACT */}
        <div>
          <label className={modalLabel}>Contact Number</label>
          <input
            name="ContactNumber"
            value={form.ContactNumber}
            onChange={handleChange}
            className={modalInput}
            maxLength={11}
          />
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
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </div>

      </form>
    </Modal>
  );
}