import { useState, useEffect } from "react";
import Modal from "../common/Modal";
import {
  modalInput,
  modalLabel,
  modalButtonPrimary,
  modalButtonSecondary,
} from "../common/ModalUI";
import * as validators from "../../utils/validators";

export default function EditStaffModal({ selectedStaff, onClose, onSubmit, loading,}) {
  
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



// ================= LOAD SELECTED DATA =================
  useEffect(() => {
    if (selectedStaff) {
      setForm({
        FirstName: selectedStaff.FirstName || "",
        MiddleName: selectedStaff.MiddleName || "",
        LastName: selectedStaff.LastName || "",
        Gender: selectedStaff.Gender || "Male",
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

  setForm((prev) => ({
    ...prev,
    [name]: value,
  }));

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
        "Position",
        "Department",
        "ContactNumber",
        "Email", 
      ],
      {
        FirstName: "First name",
        MiddleName: "Middle name",
        LastName: "Last name",
        Gender: "Gender",
        Position: "Position",
        Department: "Department",
        ContactNumber: "Contact number",
        Email: "Email",
      }
      );
      if (requiredError) return requiredError;

    // No Changes Check
    const noChangesError = validators.validateNoChanges(
      selectedStaff,
      form,
      [
        "FirstName",
            "MiddleName",
            "LastName",
            "Gender",
            "Position",
            "Department",
            "ContactNumber",
            "Email", 
      ]
    );
    if (noChangesError) return noChangesError;

    // phone validation
    const phoneError = validators.validatePHMobileNumber(form.ContactNumber);
    if (phoneError) return phoneError;
 
    // email validation
    const emailError = validators.validateEmail(form.Email);
    if (emailError) return emailError;

    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const err = validate();
    if (err) return setError(err);

    // 👇 SAME PATTERN AS USER MODAL
    onSubmit(form);
  };

  return (
    <Modal title="Edit Staff" onClose={onClose} width="max-w-lg">

      {error && (
        <p className="text-red-500 text-sm mb-3">{error}</p>
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
            type="email"
            name="Email"
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
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>

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
            {loading ? "Saving..." : "Save Changes"}
          </button>

        </div>

      </form>
    </Modal>
  );
}