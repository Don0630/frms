import React from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

import Modal from "../common/Modal";
import {
  modalButtonPrimary,
  modalButtonSecondary,
} from "../common/ModalUI";

/* =========================
   CONFIG
========================= */
const MODAL_CONFIG = {
  distribute: {
    title: "Confirm Distribution",
    message:
      "Are you sure you want to distribute this subsidy to this farmer?",
    warning: "This will mark the record as distributed.",
    confirmText: "Distribute",
    icon: CheckCircle2,
    iconStyle:
      "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
  },
  cancel: {
    title: "Cancel Distribution",
    message:
      "This will revert the distribution status of this record.",
    warning: "The farmer will be marked as pending again.",
    confirmText: "Cancel Distribution",
    icon: AlertTriangle,
    iconStyle:
      "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
  },
  delete: {
    title: "Delete Record",
    message:
      "Are you sure you want to permanently delete this record?",
    warning: "This action cannot be undone.",
    confirmText: "Delete",
    icon: AlertTriangle,
    iconStyle:
      "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
  },
};

/* =========================
   COMPONENT
========================= */
export default function ActionDistributionModal({
  selectedDistribution,
  actionType,
  onClose,
  onConfirm,
  loading = false,
  loadingText = "Processing...",
}) {
  if (!selectedDistribution) return null;

  const config = MODAL_CONFIG[actionType] || MODAL_CONFIG.distribute;
  const Icon = config.icon;

  return (
    <Modal onClose={onClose} width="max-w-sm">

      <div className="text-center">

        {/* ICON */}
        <div className="flex justify-center mb-3">
          <div className={`p-3 rounded-full ${config.iconStyle}`}>
            <Icon />
          </div>
        </div>

        {/* TITLE */}
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          {config.title}
        </h2>

        {/* MESSAGE */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {config.message}
        </p>

        {/* WARNING */}
        <p className="text-xs text-green-500 mt-2">
          {config.warning}
        </p>

        {/* ACTIONS */}
        <div className="flex justify-center gap-3 mt-5">

          <button
            type="button"
            onClick={onClose}
            className={modalButtonSecondary}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={
              actionType === "delete"
                ? "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                : modalButtonPrimary
            }
          >
            {loading ? loadingText : config.confirmText}
          </button>

        </div>

      </div>

    </Modal>
  );
}