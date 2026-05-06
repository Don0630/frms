import React, { useState, useEffect, useRef } from "react";
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
import * as userValidator from "../../utils/userValidator";
import * as validators from "../../utils/validators";

export default function AddUserModal({ onClose, onSubmit, loading, }) {
  

  // ================= STAFF SEARCH =================
  const [searchStaff, setSearchStaff] = useState("");
  const [selectedStaff, setSelectedStaff] = useState(null);

  // ================= FORM STATE =================
  const [form, setForm] = useState({
    Username: "",
    Password: "",
    ConfirmPassword: "",
    Role: "",
  });

  const [error, setError] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const wrapperRef = useRef(null);

  // ================= DEBOUNCE =================
  const debouncedSearch = useDebounce(searchStaff, 300);

  const { availableStaffQuery } = useStaff(debouncedSearch);

  const availableStaff = availableStaffQuery.data?.data || [];

  const loadingStaff = availableStaffQuery.isLoading;


  // ================= OUTSIDE CLICK CLOSE =================
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value, }));
    if (error) setError("");
  };

  // ================= VALIDATION =================
  const validate = () => {
  
  if (!selectedStaff) return "Please select a Staff!";
  
  const requiredError = validators.validateRequiredFields(
      form,
      ["Username", "Password", "ConfirmPassword", "Role"],
      {
        Username: "Username",
        Password: "Password",
        ConfirmPassword: "Confirm Password",
        Role: "Role",
      }
    );
    if (requiredError) return requiredError;

    const usernameError = userValidator.validateUsername(form.Username);
    if (usernameError) return usernameError;

    const passwordError = userValidator.validatePassword( form.Password, form.ConfirmPassword);
    if (passwordError) return passwordError;

    return "";
  };

  // ================= SUBMIT =================
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const err = validate();
    if (err) return setError(err);

    onSubmit({
      staffId: selectedStaff.StaffID,
      username: form.Username,
      password: form.Password,
      role: form.Role,
    });
  };

  return (
    <Modal
      title="Create User"
      onClose={onClose}
      width="max-w-lg"
    >
      {error && (
        <p className="text-red-500 text-sm mb-3">{error}</p>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 text-sm"
      >
        {/* ================= STAFF SEARCH ================= */}
        <div
          className="relative"
          ref={wrapperRef}
        >
          <div className="flex items-center justify-between">
            <label className={modalLabel}>
              Select Staff *
            </label>

            <div className="text-xs min-h-[16px] flex items-center">
              {loadingStaff ? (
                <span className="text-green-600 animate-pulse">
                  Searching Staff...
                </span>
              ) : !loadingStaff &&
                !selectedStaff &&
                availableStaff.length === 0 &&
                searchStaff.length > 0 ? (
                <span className="text-red-400">
                  No staff found!
                </span>
              ) : (
                <span className="opacity-0">
                  .
                </span>
              )}
            </div>
          </div>

          <input
            type="text"
            placeholder="Search staff..."
            value={searchStaff}
            onFocus={() =>
              setShowDropdown(true)
            }
            onChange={(e) => {
              setSearchStaff(e.target.value);
              setSelectedStaff(null);
              setShowDropdown(true);

              if (error) setError("");
            }}
            className={modalInput}
          />

          {/* RESULTS */}
          {showDropdown &&
            !selectedStaff &&
            availableStaff.length > 0 && (
              <div
                className={`${modalDropdown} absolute z-50`}
              >
                {availableStaff.map(
                  (staff) => (
                    <div
                      key={staff.StaffID}
                      onClick={() => {
                        setSelectedStaff(
                          staff
                        );
                        setSearchStaff(
                          `${staff.FirstName} ${staff.LastName}`
                        );
                        setShowDropdown(
                          false
                        );
                      }}
                      className={
                        modalDropdownItem
                      }
                    >
                      {staff.FirstName}{" "}
                      {staff.LastName}
                    </div>
                  )
                )}
              </div>
            )}
        </div>

        {/* ================= USERNAME ================= */}
        <div>
          <label className={modalLabel}>
            Username
          </label>

          <input
            name="Username"
            value={form.Username}
            onChange={handleChange}
            className={modalInput}
          />
        </div>

        {/* ================= PASSWORD ================= */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={modalLabel}>
              Password
            </label>

            <input
              type="password"
              name="Password"
              value={form.Password}
              onChange={handleChange}
              className={modalInput}
            />
          </div>

          <div>
            <label className={modalLabel}>
              Confirm
            </label>

            <input
              type="password"
              name="ConfirmPassword"
              value={form.ConfirmPassword}
              onChange={handleChange}
              className={modalInput}
            />
          </div>
        </div>

        {/* ================= ROLE ================= */}
        <div>
          <label className={modalLabel}>
            Role
          </label>

          <select
            name="Role"
            className={modalInput}
            value={form.Role}
            onChange={handleChange}
          >
            <option value="">
              Select Role
            </option>
            <option value="Admin">
              Admin
            </option>
            <option value="Staff">
              Staff
            </option>
          </select>
        </div>

        {/* ================= ACTIONS ================= */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className={
              modalButtonSecondary
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className={
              modalButtonPrimary
            }
          >
            {loading
              ? "Creating..."
              : "Create User"}
          </button>
        </div>
      </form>
    </Modal>
  );
}