import React from "react";
import { AlertTriangle } from "lucide-react";
import Modal from "../common/Modal";
import {
  modalButtonDanger,
  modalButtonSecondary,
} from "../common/ModalUI";

export default function DeleteFarmModal({
  farm,
  onClose,
  onConfirm,
  loading = false,
}) {
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
          Delete Farm
        </h2>

        {/* MESSAGE */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Are you sure you want to delete farm in{" "}
          <span className="font-medium text-gray-800 dark:text-gray-200">
            {farm?.FarmBarangay}
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
            className={modalButtonDanger}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>

        </div>

      </div>

    </Modal>
  );
}