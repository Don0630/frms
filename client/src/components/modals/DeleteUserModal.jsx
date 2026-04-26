import { AlertTriangle } from "lucide-react";
import Modal from "../common/Modal";
import { modalButtonDanger, modalButtonSecondary } from "../common/ModalUI";

export default function DeleteUserModal({
  user,
  onClose,
  onConfirm,
  loading,
}) {
  if (!user) return null;

  return (
    <Modal onClose={onClose} width="max-w-sm">

      <div className="text-center">

        {/* ICON */}
        <div className="flex justify-center mb-3">
          <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
            <AlertTriangle className="text-red-600 dark:text-red-400" />
          </div>
        </div>

        {/* TITLE */}
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Delete User
        </h2>

        {/* MESSAGE */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Are you sure you want to delete{" "}
          <span className="font-medium text-gray-800 dark:text-gray-200">
            {user.FirstName} {user.LastName}
          </span>
          ?
        </p>

        <p className="text-xs text-red-500 mt-2">
          This action cannot be undone.
        </p>

        {/* ACTIONS */}
        <div className="flex justify-center gap-3 mt-5">

          <button
            onClick={onClose}
            className={modalButtonSecondary}
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className={modalButtonDanger + " bg-red-600 hover:bg-red-700"}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>

        </div>

      </div>

    </Modal>
  );
}