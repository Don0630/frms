import { AlertTriangle } from "lucide-react";
import Modal from "../common/Modal";

export default function DeleteUserModal({
  user,
  onClose,
  onConfirm,
  loading,
}) {
  // ✅ Prevent crashes if user is missing or invalid
  if (!user || !user.UserID) return null;

  return (
    <Modal title="Delete User" onClose={onClose} width="max-w-md">

      <div className="space-y-4">

        {/* WARNING */}
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-medium">
            This action cannot be undone
          </span>
        </div>

        {/* USER INFO */}
        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm text-gray-700 dark:text-gray-200">

          <p>
            <span className="font-semibold">Name:</span>{" "}
            {user?.FirstName ?? ""} {user?.LastName ?? ""}
          </p>

          <p>
            <span className="font-semibold">Username:</span>{" "}
            {user?.Username ?? "-"}
          </p>

          <p>
            <span className="font-semibold">Role:</span>{" "}
            {user?.Role ?? "-"}
          </p>

        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2">

          <button
            onClick={onClose}
            className="px-3 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="
              px-3 py-2 rounded bg-red-600 text-white
              hover:bg-red-700
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors
            "
          >
            {loading ? "Deleting..." : "Delete"}
          </button>

        </div>

      </div>

    </Modal>
  );
}