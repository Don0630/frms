import React, { useState, useEffect } from "react";
import Modal from "../common/Modal";
import { modalInput, modalLabel, modalButtonPrimary, modalButtonSecondary } from "../common/ModalUI";

export default function EditUserModal({ user, onClose, onSubmit, loading }) {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setUsername(user.Username || "");
      setRole(user.Role || "");
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!username || !role) {
      setError("Username and role are required");
      return;
    }

    onSubmit({ username, role });
  };

  if (!user) return null;

  return (
    <Modal title="Edit User" onClose={onClose} width="max-w-md">

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 p-2 rounded">
            {error}
          </div>
        )}

        {/* USERNAME */}
        <div>
          <label className={modalLabel}>Username</label>

          <div className={modalInput}>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-transparent outline-none"
            />
          </div>
        </div>

        {/* ROLE */}
        <div>
          <label className={modalLabel}>Role</label>

          <div>
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