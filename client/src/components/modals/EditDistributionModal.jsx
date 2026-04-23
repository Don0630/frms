import React from "react";
import { X, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function EditDistributionModal({
  open,
  type = "distribute",
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  loadingText = "Processing...",
  onCancel,
  onConfirm,
  loading = false,
}) {
  if (!open) return null;

  const isCancel = type === "cancel";

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
          className="absolute top-3 right-3 text-gray-500 dark:text-gray-300 hover:text-red-500"
        >
          <X size={18} />
        </button>

        {/* ICON */}
        <div className="flex justify-center mb-3">
          <div
            className={`p-3 rounded-full ${
              isCancel
                ? "bg-orange-100 dark:bg-orange-500/20"
                : "bg-green-100 dark:bg-green-500/20"
            }`}
          >
            {isCancel ? (
              <AlertTriangle className="text-orange-600 dark:text-orange-400" />
            ) : (
              <CheckCircle2 className="text-green-600 dark:text-green-400" />
            )}
          </div>
        </div>

        {/* TITLE */}
        <h2 className="text-center text-lg font-semibold text-gray-800 dark:text-white">
          {title}
        </h2>

        {/* MESSAGE */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
          {message}
        </p>

        {/* BUTTONS */}
        <div className="flex justify-center gap-3 mt-5">

          {/* CANCEL */}
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

          {/* CONFIRM */}
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-white transition ${
              isCancel
                ? "bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-400"
                : "bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-400"
            } disabled:opacity-60`}
          >
            {loading ? loadingText : confirmText}
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