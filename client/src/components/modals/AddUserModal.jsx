// src/components/modals/AddUserModal.jsx
import React, { useState, useEffect } from "react";
import { X, User, Key, ShieldCheck } from "lucide-react";
import { useUser } from "../../context/UserContext.jsx";
import * as staffApi from "../../api/staffApi.js";

export default function AddUserModal({ onClose, onSuccess }) {
  const { createUser } = useUser();
  const [availableStaff, setAvailableStaff] = useState([]);
  const [searchStaff, setSearchStaff] = useState("");
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [loadingStaff, setLoadingStaff] = useState(false);

  const loadAvailableStaff = async (search = "") => {
    try {
      setLoadingStaff(true);
      const { success, data } = await staffApi.fetchAvailableStaff(search);
      setAvailableStaff(success ? data : []);
    } catch {
      setAvailableStaff([]);
    } finally {
      setLoadingStaff(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timeout = setTimeout(() => loadAvailableStaff(searchStaff), 300);
    return () => clearTimeout(timeout);
  }, [searchStaff]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStaff || !username || !password || !confirmPassword || !role) {
      setError("Please fill all required fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await createUser({
        staffId: selectedStaff.StaffID,
        username,
        password,
        role,
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to create user");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-sm p-6 w-96 relative shadow-xl">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
          onClick={onClose}
        >
          <X size={18} />
        </button>

        {/* Header */}
        <h3 className="font-semibold text-xl mb-5 text-gray-800">Add User</h3>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <form className="space-y-4 text-sm" onSubmit={handleSubmit}>
          {/* Staff Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search staff..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-green-400"
              value={searchStaff}
              onChange={(e) => setSearchStaff(e.target.value)}
            />
            {loadingStaff && (
              <span className="absolute right-3 top-2 text-gray-400 text-xs">Searching...</span>
            )}
            <div className="max-h-28 overflow-y-auto border border-t-0 border-gray-200 rounded-b-md">
              {availableStaff.map((s) => (
                <div
                  key={s.StaffID}
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                    selectedStaff?.StaffID === s.StaffID ? "bg-green-500 font-semibold" : ""
                  }`}
                  onClick={() => setSelectedStaff(s)}
                >
                  {s.FirstName} {s.LastName}
                </div>
              ))}
            </div>
          </div>

          {/* Username */}
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-green-400">
            <User size={16} className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Username"
              className="w-full outline-none text-gray-700"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-green-400">
            <Key size={16} className="text-gray-400 mr-2" />
            <input
              type="password"
              placeholder="Password"
              className="w-full outline-none text-gray-700"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-green-400">
            <ShieldCheck size={16} className="text-gray-400 mr-2" />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full outline-none text-gray-700"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* Role */}
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-400 text-gray-700"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">Select Role</option>
            <option value="Admin">Admin</option>
            <option value="Staff">Staff</option>
          </select>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition"
          >
            Create User
          </button>
        </form>
      </div>
    </div>
  );
}