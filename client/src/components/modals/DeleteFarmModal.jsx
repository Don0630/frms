import React from "react";
import { X, AlertTriangle } from "lucide-react";

export default function DeleteFarmModal({
  open,
  title = "Confirm Delete",
  message = "Are you sure you want to delete this item?",
  onCancel,
  onConfirm,
  loading = false,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="bg-white w-full max-w-sm rounded-xl shadow-xl p-5 relative animate-fadeIn">

        {/* CLOSE */}
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X size={18} />
        </button>

        {/* ICON */}
        <div className="flex justify-center mb-3">
          <div className="bg-red-100 p-3 rounded-full">
            <AlertTriangle className="text-red-600" />
          </div>
        </div>

        {/* TEXT */}
        <h2 className="text-center text-lg font-semibold text-gray-800">
          {title}
        </h2>

        <p className="text-center text-sm text-gray-500 mt-2">
          {message}
        </p>

        {/* BUTTONS */}
        <div className="flex justify-center gap-3 mt-5">

          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>

        </div>
      </div>

      {/* ANIMATION STYLE */}
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