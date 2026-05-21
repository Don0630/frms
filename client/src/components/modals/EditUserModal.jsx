import React, { useState, useEffect } from "react";
import { showErrorToast, showSuccessToast } from "../../utils/toastUtility";
import Modal from "../common/Modal";
import {
  modalInput,
  modalLabel,
  modalButtonPrimary,
  modalButtonSecondary,
} from "../common/ModalUI";
import * as userValidator from "../../utils/userValidator";
import * as validators from "../../utils/validators";

export default function EditUserModal({ selectedUser, onClose, onSubmit, loading }) {
  const [form, setForm] = useState({
    Username: "",
    Role: "",
  });

  const [error, setError] = useState("");

  // ================= LOAD USER =================
  useEffect(() => {
    if (selectedUser) {
      setForm({
        Username: selectedUser.Username || "",
        Role: selectedUser.Role || "",
      });
    }
  }, [selectedUser]);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value,}));

    if (error) setError("");
  };

  // ================= VALIDATION =================
  const validate = () => {
    const requiredError = validators.validateRequiredFields(
      form,
      ["Username", "Role"],
      {
        Username: "Username",
        Role: "Role",
      }
    );
    if (requiredError) return requiredError;


  // No Changes Check
  const noChangesError = validators.validateNoChanges(
  selectedUser,
  form,
  [
    "Username",
      "Role", 
  ]
);
  if (noChangesError) return noChangesError;

    // username rule (min 5 chars)
    const usernameError = userValidator.validateUsername(form.Username);
    if (usernameError) return usernameError;

    const roleError = userValidator.validateRole(form.Role);
    if (roleError) return roleError;

    return "";
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const err = validate();
    if (err) return setError(err);

    try {
      await onSubmit({username: form.Username, role: form.Role});
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
    <Modal title="Edit User" onClose={onClose} width="max-w-md">
      
    
  {/* INFO TEXT */}
  <p className="text-xs text-gray-500 dark:text-gray-400 -mt-4 mb-3">
    Update the user's information below.
  </p>

  {/* ERROR */}
  <div className="min-h-[24px] mb-2 text-center">
    <p className={`text-red-500 font-medium text-sm transition-opacity duration-200 ${error ? "opacity-100" : "opacity-0"}`}>
     {error || "​"}
    </p>
  </div>

      
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">

        {/* USERNAME */}
        <div>
          <label className={modalLabel}>Username</label>

          <input
            name="Username"
            value={form.Username}
            onChange={handleChange}
            className={modalInput}
          />
        </div>

        {/* ROLE */}
        <div>
          <label className={modalLabel}>Role</label>

          <select
            name="Role"
            className={modalInput}
            value={form.Role}
            onChange={handleChange}
          >
            <option value="">Select Role</option>
            <option value="Admin">Admin</option>
            <option value="Staff">Staff</option>
          </select>
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