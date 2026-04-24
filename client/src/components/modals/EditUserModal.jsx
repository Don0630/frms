import React, { useState, useEffect } from "react";
import { X, User } from "lucide-react";

import useUsers from "../../hooks/useUsers";

export default function EditUserModal({ user, onClose }) {
  const { updateUserMutation } = useUsers();

  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");

  // ================= PREFILL =================
  useEffect(() => {
    if (user) {
      setUsername(user.Username || "");
      setRole(user.Role || "");
    }
  }, [user]);

  // ================= SUBMIT =================
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!username || !role) {
      setError("Username and role are required");
      return;
    }

    updateUserMutation.mutate(
      {
        id: user.UserID,
        data: {
          username,
          role,
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (err) => {
          setError(err.message || "Failed to update user");
        },
      }
    );
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-xl shadow-xl p-6 relative border border-gray-200 dark:border-gray-800">

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
            Edit User
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Update username and role
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 p-2 text-sm rounded mb-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">

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
              disabled={updateUserMutation.isPending}
              className="px-3 py-2 rounded bg-green-600 dark:bg-green-500 text-white"
            >
              {updateUserMutation.isPending ? "Saving..." : "Save Changes"}
            </button>

          </div>

        </form>
      </div>

      {/* INPUT STYLE */}
      <style>{`
        .input {
          width: 100%;
          border: 1px solid #e5e7eb;
          padding: 8px;
          border-radius: 8px;
          display: flex;
          align-items: center;
        }

        .input input {
          width: 100%;
          outline: none;
          background: transparent;
        }

        .input:focus-within {
          border-color: #16a34a;
          box-shadow: 0 0 0 2px rgba(22,163,74,0.2);
        }
      `}</style>

    </div>
  );
}