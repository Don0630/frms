// src/components/modals/AddUserModal.jsx
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useUser } from "../../context/UserContext.jsx";
import { useStaff } from "../../context/StaffContext.jsx"; 
import * as staffApi from "../../api/staffApi.js";

export default function AddUserModal({ onClose, onSuccess }) {
  const { createUser } = useUser();
  const { staff } = useStaff(); // full staff list if needed elsewhere
  const [availableStaff, setAvailableStaff] = useState([]);
  const [searchStaff, setSearchStaff] = useState("");
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");

  // Load available staff for the modal (staff without user accounts)
  const loadAvailableStaff = async (search = "") => {
    try {
      const { success, data } = await staffApi.fetchAvailableStaff(search);
      if (success) {
        setAvailableStaff(data); // store only for modal
      } else {
        setAvailableStaff([]);
      }
    } catch (err) {
      console.error("Failed to load available staff:", err);
      setAvailableStaff([]);
    }
  };

  // Trigger fetch on modal open and when search changes
  useEffect(() => {
    loadAvailableStaff(searchStaff);
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
        role
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to create user");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg p-6 w-96 relative">
        <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" onClick={onClose}>
          <X />
        </button>

        <h3 className="font-semibold text-lg mb-4">Add User</h3>
        {error && <p className="text-red-500 text-xs mb-2">{error}</p>}

        <form className="space-y-3 text-xs" onSubmit={handleSubmit}>
          {/* Searchable Available Staff */}
          <div className="border rounded">
            <input
              type="text"
              placeholder="Search staff..."
              className="w-full px-3 py-2 text-sm outline-none"
              value={searchStaff}
              onChange={(e) => setSearchStaff(e.target.value)}
            />
            <div className="max-h-24 overflow-y-auto">
              {availableStaff.map((s) => (
                <div
                  key={s.StaffID}
                  className={`px-3 py-1 cursor-pointer hover:bg-gray-100 ${
                    selectedStaff?.StaffID === s.StaffID ? "bg-gray-200 font-semibold" : ""
                  }`}
                  onClick={() => setSelectedStaff(s)}
                >
                  {s.FirstName} {s.LastName}
                </div>
              ))}
            </div>
          </div>

          <input
            type="text"
            placeholder="Username"
            className="w-full border px-3 py-2 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border px-3 py-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full border px-3 py-2 rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <select
            className="w-full border px-3 py-2 rounded"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">Select Role</option>
            <option value="Admin">Admin</option>
            <option value="Staff">Staff</option>
          </select>

          <button
            type="submit"
            className="w-full bg-green-600 text-white px-3 py-2 rounded text-sm"
          >
            Create User
          </button>
        </form>
      </div>
    </div>
  );
}