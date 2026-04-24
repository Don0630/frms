import React, { useState } from "react";
import { X, User, Key, ShieldCheck } from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import * as staffApi from "../../api/staffApi.js";
import useDebounce from "../../hooks/useDebounce";

import useUsers from "../../hooks/useUsers";

export default function AddUserModal({ onClose }) {
  const { createUserMutation } = useUsers();

  const [searchStaff, setSearchStaff] = useState("");
  const debouncedSearch = useDebounce(searchStaff, 300);

  const [selectedStaff, setSelectedStaff] = useState(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");

  const [error, setError] = useState("");

  // ================= STAFF QUERY =================
  const { data: staffData, isLoading: loadingStaff } = useQuery({
    queryKey: ["available-staff", debouncedSearch],
    queryFn: () => staffApi.fetchAvailableStaff(debouncedSearch),
    keepPreviousData: true,
  });

  const availableStaff = staffData?.data || [];

  // ================= SUBMIT =================
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!selectedStaff || !username || !password || !confirmPassword || !role) {
      setError("Please fill all required fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    createUserMutation.mutate(
      {
        staffId: selectedStaff.StaffID,
        username,
        password,
        role,
      },
      {
        onSuccess: () => {
          onClose(); // closes modal
        },
        onError: (err) => {
          setError(err.message || "Failed to create user");
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-xl shadow-xl p-6 relative border border-gray-200 dark:border-gray-800">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 dark:text-gray-300 hover:text-red-500"
        >
          <X />
        </button>

        {/* HEADER */}
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Create User
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Assign login credentials to staff
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 p-2 text-sm rounded mb-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">

          {/* STAFF SEARCH */}
          <div className="relative">
            <label className="text-xs text-gray-500 dark:text-gray-400">
              Select Staff
            </label>

            <input
              type="text"
              placeholder="Search staff..."
              value={searchStaff}
              onChange={(e) => {
                setSearchStaff(e.target.value);
                setSelectedStaff(null);
              }}
              className="input bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
            />

            {loadingStaff && (
              <p className="text-xs text-gray-400 mt-1">Searching...</p>
            )}

            {!loadingStaff &&
              !selectedStaff &&
              availableStaff.length === 0 &&
              searchStaff.length > 0 && (
                <p className="text-xs text-gray-400 mt-1">
                  No staff found
                </p>
              )}

            {availableStaff.length > 0 && (
              <div className="border border-gray-200 dark:border-gray-700 mt-1 max-h-40 overflow-y-auto bg-white dark:bg-gray-800 rounded-md shadow">
                {availableStaff.map((s) => (
                  <div
                    key={s.StaffID}
                    onClick={() => {
                      setSelectedStaff(s);
                      setSearchStaff(`${s.FirstName} ${s.LastName}`);
                    }}
                    className={`px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 ${
                      selectedStaff?.StaffID === s.StaffID
                        ? "bg-green-100 dark:bg-green-800/30"
                        : ""
                    }`}
                  >
                    {s.FirstName} {s.LastName}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* USERNAME */}
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400">
              Username
            </label>
            <div className="flex items-center input bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
              <User size={14} className="text-gray-400 mr-2" />
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full outline-none bg-transparent text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="grid grid-cols-2 gap-2">

            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400">
                Password
              </label>
              <div className="flex items-center input bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                <Key size={14} className="text-gray-400 mr-2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full outline-none bg-transparent text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400">
                Confirm
              </label>
              <div className="flex items-center input bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                <ShieldCheck size={14} className="text-gray-400 mr-2" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full outline-none bg-transparent text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

          </div>

          {/* ROLE */}
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400">
              Role
            </label>
            <select
              className="input bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
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
              className="px-3 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={createUserMutation.isPending}
              className="px-3 py-2 rounded bg-green-600 dark:bg-green-500 text-white"
            >
              {createUserMutation.isPending ? "Creating..." : "Create User"}
            </button>

          </div>

        </form>
      </div>

      <style>{`
        .input {
          width: 100%;
          border: 1px solid #e5e7eb;
          padding: 8px;
          border-radius: 8px;
          display: flex;
          align-items: center;
        }

        .input:focus-within {
          border-color: #16a34a;
          box-shadow: 0 0 0 2px rgba(22,163,74,0.2);
        }
      `}</style>

    </div>
  );
}