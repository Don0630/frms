import React from "react";
import { X, Trash2 } from "lucide-react";

export default function DeleteModal({
  open,
  title = "Delete Farmer",
  message = "Are you sure you want to delete this farmer?",
  confirmText = "Delete",
  loadingText = "Deleting...",
  onCancel,
  onConfirm,
  loading = false,
}) {
  if (!open) return null;

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
          className="
            absolute top-3 right-3
            text-gray-500 dark:text-gray-300
            hover:text-red-500 dark:hover:text-red-400
            transition
          "
        >
          <X size={18} />
        </button>

        {/* ICON */}
        <div className="flex justify-center mb-3">
          <div className="
            bg-red-100 dark:bg-red-500/20
            p-3 rounded-full
          ">
            <Trash2 className="text-red-600 dark:text-red-400" />
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

        {/* ACTIONS */}
        <div className="flex justify-center gap-3 mt-5">

          {/* CANCEL */}
          <button
            onClick={onCancel}
            disabled={loading}
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

          {/* DELETE */}
          <button
            onClick={onConfirm}
            disabled={loading}
            className="
              flex items-center gap-1 px-4 py-2 rounded-lg
              bg-red-600 dark:bg-red-500
              hover:bg-red-700 dark:hover:bg-red-400
              text-white
              transition
              disabled:opacity-60
            "
          >
            <Trash2 size={14} />
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