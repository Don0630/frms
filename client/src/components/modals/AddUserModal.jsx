import React, { useState } from "react";
import { User, Key, ShieldCheck } from "lucide-react";

import useStaff from "../../hooks/useStaff";
import useDebounce from "../../hooks/useDebounce";

import Modal from "../common/Modal";

import {
  modalInput,
  modalDropdown,
  modalDropdownItem,
  modalLabel,
  modalButtonPrimary,
  modalButtonSecondary,
} from "../common/ModalUI";

export default function AddUserModal({ onClose, onSubmit, loading }) {
  const [searchStaff, setSearchStaff] = useState("");
  const [selectedStaff, setSelectedStaff] = useState(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");

  const [error, setError] = useState("");

  // debounce search input
  const debouncedSearch = useDebounce(searchStaff, 300);

  // use hook instead of direct API
  const { availableStaffQuery } = useStaff(debouncedSearch);

  const availableStaff = availableStaffQuery.data?.data || [];
  const loadingStaff = availableStaffQuery.isLoading;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (
      !selectedStaff ||
      !username ||
      !password ||
      !confirmPassword ||
      !role
    ) {
      setError("Please fill all required fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    onSubmit({
      staffId: selectedStaff.StaffID,
      username,
      password,
      role,
    });
  };

  return (
    <Modal title="Create User" onClose={onClose} width="max-w-lg">
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 p-2 text-sm rounded mb-3">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        {/* STAFF SEARCH */}
        <div>
          <label className={modalLabel}>Select Staff</label>

          <input
            type="text"
            placeholder="Search staff..."
            value={searchStaff}
            onChange={(e) => {
              setSearchStaff(e.target.value);
              setSelectedStaff(null);
            }}
            className={modalInput}
          />

          {/* LOADING */}
          {loadingStaff && (
            <div className="mt-2 text-xs text-gray-500">
              Searching staff...
            </div>
          )}


          {!loadingStaff &&
              !selectedStaff &&
              availableStaff.length === 0 &&
              searchStaff.length > 0 && (
                <p className="text-xs text-gray-400 mt-1">
                  No staff found
                </p>
              )}

          {/* RESULTS */}
          {availableStaff.length > 0 && (
           <div className={modalDropdown}>
              {availableStaff.map((staff) => (
                <div
                  key={staff.StaffID}
                  onClick={() => {
                    setSelectedStaff(staff);
                    setSearchStaff(`${staff.FirstName} ${staff.LastName}`);
                  }}
                  className={modalDropdownItem}
                >
                  {staff.FirstName} {staff.LastName}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* USERNAME */}
        <div>
          <label className={modalLabel}>Username</label>

          <div>
             <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={modalInput}
            />
          </div>
        </div>

        {/* PASSWORD */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={modalLabel}>Password</label>

            <div>
            
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                 className={modalInput}
              />
            </div>
          </div>

          <div>
            <label className={modalLabel}>Confirm</label>

            <div>
              
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={modalInput}
              />
            </div>
          </div>
        </div>

        {/* ROLE */}
        <div>
          <label className={modalLabel}>Role</label>

          <select
            className={modalInput}
            value={role}
            onChange={(e) => setRole(e.target.value)}
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
            {loading ? "Creating..." : "Create User"}
          </button>
        </div>
      </form>
    </Modal>
  );
}