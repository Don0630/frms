// src/components/modals/InfoModal.jsx
import { X, Info } from "lucide-react";
import { useEffect, useState } from "react";

export default function InfoModal({ title, content, onClose, width = "max-w-sm" }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
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
    setTimeout(() => onClose?.(), 200);
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
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
           
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
      </div>
    </div>
  );
}