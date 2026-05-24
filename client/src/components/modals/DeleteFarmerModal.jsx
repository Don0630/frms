import React from "react";
import { AlertTriangle } from "lucide-react";
import Modal from "../common/Modal";
import { modalButtonDanger, modalButtonSecondary } from "../common/ModalUI";

export default function DeleteFarmerModal({ farmer, onClose, onConfirm, loading = false }) {
  return (
    <Modal onClose={onClose} width="max-w-sm">
      <div className="text-center">

        <div className="flex justify-center mb-3">
          <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
            <AlertTriangle className="text-red-600 dark:text-red-400" />
          </div>
        </div>

        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Remove Farmer
        </h2>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Are you sure you want to remove this farmer?
        </p>

        {farmer?.FirstName && (
          <p className="text-sm mt-2 text-gray-800 dark:text-gray-200">
            <span className="font-medium">
              {farmer.FirstName} {farmer.MiddleName ? `${farmer.MiddleName[0]}.` : ""} {farmer.LastName}
            </span>
          </p>
        )}

        <p className="text-xs text-red-500 mt-2">
          This action cannot be undone.
        </p>

        <div className="flex justify-center gap-3 mt-5">
          <button onClick={onClose} className={modalButtonSecondary}>Cancel</button>
          <button onClick={onConfirm} disabled={loading} className={modalButtonDanger}>
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>

      </div>
    </Modal>
  );
}