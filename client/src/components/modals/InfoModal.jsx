// src/components/modals/InfoModal.jsx
import { X, Info } from "lucide-react";
import { useEffect, useState } from "react";

export default function InfoModal({ title, content, onClose, width = "max-w-sm" }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in after mount
    requestAnimationFrame(() => setVisible(true));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onClose?.(), 200); // wait for fade-out to finish
  };

  if (!title && !content) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 transition-all duration-200"
      style={{
        backgroundColor: visible ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0)",
        backdropFilter: visible ? "blur(4px)" : "blur(0px)",
      }}
      onClick={handleClose}
    >
      <div
        className={`bg-white dark:bg-gray-900 rounded-xl shadow-xl w-11/12 ${width} border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200`}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(0.95)",
        }}
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
            onClick={handleClose}
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
            onClick={handleClose}
            className="text-xs px-4 py-1.5 rounded-md bg-green-600 hover:bg-green-700 text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}