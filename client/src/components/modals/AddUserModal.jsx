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

export default function AddUserModal({
  onClose,
  onSubmit,
  loading,
}) {
  const [searchStaff, setSearchStaff] = useState("");
  const [selectedStaff, setSelectedStaff] = useState(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");
  const [role, setRole] = useState("");

  const [error, setError] = useState("");

  const [showDropdown, setShowDropdown] =
    useState(false);

  const wrapperRef = useRef(null);

  // debounce
  const debouncedSearch = useDebounce(
    searchStaff,
    300
  );

  const { availableStaffQuery } =
    useStaff(debouncedSearch);

  const availableStaff =
    availableStaffQuery.data?.data || [];

  const loadingStaff =
    availableStaffQuery.isLoading;

  // close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(
          e.target
        )
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
      setError(
        "Please fill all required fields"
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match"
      );
      return;
    }

    onSubmit({
      staffId:
        selectedStaff.StaffID,
      username,
      password,
      role,
    });
  };

  return (
    <Modal
      title="Create User"
      onClose={onClose}
      width="max-w-lg"
    >
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 p-2 text-sm rounded mb-3">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 text-sm"
      >
        {/* STAFF SEARCH */}
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
        Searching Staffs...
      </span>
    ) : !loadingStaff &&
      !selectedStaff &&
      availableStaff.length === 0 &&
      searchStaff.length > 0 ? (
      <span className="text-red-400">
        No staff found!
      </span>
    ) : (
      <span className="opacity-0">.</span>
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
              setSearchStaff(
                e.target.value
              );
              setSelectedStaff(
                null
              );
              setShowDropdown(true);
            }}
            className={modalInput}
          />

       
        

          {/* RESULTS */}
          {showDropdown &&
            !selectedStaff &&
            availableStaff.length >
              0 && (
              <div
                className={`${modalDropdown} absolute z-50`}
              >
                {availableStaff.map(
                  (staff) => (
                    <div
                      key={
                        staff.StaffID
                      }
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
                      {
                        staff.LastName
                      }
                    </div>
                  )
                )}
              </div>
            )}
        </div>

        {/* USERNAME */}
        <div>
          <label className={modalLabel}>
            Username
          </label>

          <input
            value={username}
            onChange={(e) =>
              setUsername(
                e.target.value
              )
            }
            className={modalInput}
          />
        </div>

        {/* PASSWORD */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={modalLabel}>
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              className={modalInput}
            />
          </div>

          <div>
            <label className={modalLabel}>
              Confirm
            </label>

            <input
              type="password"
              value={
                confirmPassword
              }
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              className={modalInput}
            />
          </div>
        </div>

        {/* ROLE */}
        <div>
          <label className={modalLabel}>
            Role
          </label>

          <select
            className={modalInput}
            value={role}
            onChange={(e) =>
              setRole(
                e.target.value
              )
            }
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

        {/* ACTIONS */}
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