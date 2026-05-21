// src/components/modals/InfoModal.jsx
import { X, Info } from "lucide-react";
import { useEffect } from "react";

export default function InfoModal({ title, content, onClose }) {
  if (!title && !content) return null;

  // ESC key close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-11/12 max-w-sm border border-gray-200 dark:border-gray-700 overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="bg-green-100 dark:bg-green-900 p-1.5 rounded-full">
              <Info className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-justify leading-relaxed">
            {content || "No description available."}
          </p>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-gray-50 dark:bg-gray-800 flex justify-end border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="text-xs px-4 py-1.5 rounded-md bg-green-600 hover:bg-green-700 text-white transition-colors"
          >
            Close
          </button>
        </div>

      </div>

      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}