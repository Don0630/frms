import React from "react";
import { X, AlertTriangle, CheckCircle2 } from "lucide-react";

/* =========================
   CONFIG (PRO APPROACH)
========================= */
const MODAL_CONFIG = {
  distribute: {
    title: "Confirm Distribution",
    message: "Are you sure you want to distribute this subsidy to the selected farmer?",
    confirmText: "Distribute",
    variant: "success",
    icon: CheckCircle2,
  },
  cancel: {
    title: "Cancel Distribution",
    message: "This will remove the distribution record and revert its status. Do you want to continue?",
    confirmText: "Cancel Distribution",
    variant: "warning",
    icon: AlertTriangle,
  },
  delete: {
    title: "Delete Record",
    message: "This action cannot be undone. The record will be permanently removed.",
    confirmText: "Delete",
    variant: "danger",
    icon: AlertTriangle,
  },
};

/* =========================
   COMPONENT
========================= */
export default function EditDistributionModal({
  open,
  type = "distribute",
  onCancel,
  onConfirm,
  loading = false,
  loadingText = "Processing...",
}) {
  if (!open) return null;

  const config = MODAL_CONFIG[type] || MODAL_CONFIG.distribute;
  const Icon = config.icon;

  const variantStyles = {
    success: "bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-400",
    warning: "bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-400",
    danger: "bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400",
  };

  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="
        w-full max-w-sm rounded-xl shadow-xl p-5 relative animate-fadeIn
        bg-white dark:bg-gray-900
        text-gray-800 dark:text-gray-100
        border border-gray-200 dark:border-gray-800
      ">

        {/* CLOSE */}
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 text-gray-500 dark:text-gray-300 hover:text-red-500 transition"
        >
          <X size={18} />
        </button>

        {/* ICON */}
        <div className="flex justify-center mb-3">
          <div className={`
            p-3 rounded-full
            ${type === "cancel"
              ? "bg-yellow-100 dark:bg-yellow-500/20"
              : type === "delete"
              ? "bg-red-100 dark:bg-red-500/20"
              : "bg-green-100 dark:bg-green-500/20"}
          `}>
            <Icon className={
              type === "cancel"
                ? "text-yellow-600 dark:text-yellow-400"
                : type === "delete"
                ? "text-red-600 dark:text-red-400"
                : "text-green-600 dark:text-green-400"
            } />
          </div>
        </div>

        {/* TITLE */}
        <h2 className="text-center text-lg font-semibold text-gray-800 dark:text-white">
          {config.title}
        </h2>

        {/* MESSAGE */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
          {config.message}
        </p>

        {/* BUTTONS */}
        <div className="flex justify-center gap-3 mt-5">

          {/* CANCEL BUTTON */}
          <button
            onClick={onCancel}
            className="
              px-4 py-2 rounded-lg
              bg-gray-200 dark:bg-gray-700
              text-gray-700 dark:text-gray-200
              hover:bg-gray-300 dark:hover:bg-gray-600
              transition
            "
          >
            Cancel
          </button>

          {/* CONFIRM BUTTON */}
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`
              px-4 py-2 rounded-lg text-white transition
              ${variantStyles[config.variant]}
              disabled:opacity-60
            `}
          >
            {loading ? loadingText : config.confirmText}
          </button>

        </div>
      </div>

      {/* ANIMATION */}
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>

    </div>
  );
}