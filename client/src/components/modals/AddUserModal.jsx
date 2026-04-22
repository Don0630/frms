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
  const [loading, setLoading] = useState(false);
  const [loadingStaff, setLoadingStaff] = useState(false);

  // ================= LOAD STAFF =================
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

  // ================= DEBOUNCE =================
  useEffect(() => {
    const t = setTimeout(() => loadAvailableStaff(searchStaff), 300);
    return () => clearTimeout(t);
  }, [searchStaff]);

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
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

    try {
      setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6 relative animate-fadeIn">

        {/* CLOSE */}
        <button onClick={onClose} className="absolute top-3 right-3">
          <X />
        </button>

        {/* HEADER */}
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-gray-800">
            Create User
          </h2>
          <p className="text-sm text-gray-500">
            Assign login credentials to staff
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-600 p-2 text-sm rounded mb-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">

    {/* ================= STAFF SEARCH ================= */}
<div className="relative">
  <label className="text-xs text-gray-500">Select Staff</label>

  <input
    type="text"
    placeholder="Search staff..."
    value={searchStaff}
    onChange={(e) => {
      setSearchStaff(e.target.value);
      setSelectedStaff(null);
    }}
    className="input"
  />

  {/* dropdown */}
  {loadingStaff && (
    <p className="text-xs text-gray-400 mt-1">Searching...</p>
  )}

  {availableStaff.length > 0 && (
    <div className="border rounded-md mt-1 max-h-32 overflow-y-auto bg-white">
      {availableStaff.map((s) => (
        <div
          key={s.StaffID}
          onClick={() => {
            setSelectedStaff(s);
            setSearchStaff(`${s.FirstName} ${s.LastName}`);
            setAvailableStaff([]);
          }}
          className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
            selectedStaff?.StaffID === s.StaffID
              ? "bg-green-100 font-semibold"
              : ""
          }`}
        >
          {s.FirstName} {s.LastName}
        </div>
      ))}
    </div>
  )}
</div>
          {/* ================= USERNAME ================= */}
          <div>
            <label className="text-xs text-gray-500">Username</label>
            <div className="flex items-center input">
              <User size={14} className="text-gray-400 mr-2" />
              <input
                type="text"
                className="w-full outline-none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          {/* ================= PASSWORD ================= */}
          <div className="grid grid-cols-2 gap-2">

            <div>
              <label className="text-xs text-gray-500">Password</label>
              <div className="flex items-center input">
                <Key size={14} className="text-gray-400 mr-2" />
                <input
                  type="password"
                  className="w-full outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500">Confirm</label>
              <div className="flex items-center input">
                <ShieldCheck size={14} className="text-gray-400 mr-2" />
                <input
                  type="password"
                  className="w-full outline-none"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

          </div>

          {/* ================= ROLE ================= */}
          <div>
            <label className="text-xs text-gray-500">Role</label>
            <select
              className="input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">Select Role</option>
              <option value="Admin">Admin</option>
              <option value="Staff">Staff</option>
            </select>
          </div>

          {/* ================= ACTIONS ================= */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-gray"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="btn-green"
            >
              {loading ? "Creating..." : "Create User"}
            </button>
          </div>

        </form>
      </div>

      {/* STYLES */}
      <style>{`
        .input {
          width: 100%;
          border: 1px solid #e5e7eb;
          padding: 8px;
          border-radius: 8px;
          font-size: 14px;
          display: flex;
          align-items: center;
        }

        .input input {
          font-size: 14px;
        }

        .input:focus-within {
          border-color: #16a34a;
          box-shadow: 0 0 0 2px rgba(22,163,74,0.2);
        }

        .btn-green {
          background: #16a34a;
          color: white;
          padding: 8px 14px;
          border-radius: 8px;
        }

        .btn-gray {
          background: #e5e7eb;
          padding: 8px 14px;
          border-radius: 8px;
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}