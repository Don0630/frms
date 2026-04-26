import { X } from "lucide-react";
import { useEffect } from "react";

export default function Modal({
  title,
  children,
  onClose,
  width = "max-w-lg",
}) {
  // ESC key close (pro UX)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // prevent background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose} // click outside closes
    >
      <div
        className={`bg-white dark:bg-gray-900 w-full ${width} rounded-xl shadow-xl p-6 relative animate-fadeIn`}
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking modal
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition"
        >
          <X />
        </button>

        {/* TITLE */}
        {title && (
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            {title}
          </h2>
        )}

        {/* CONTENT */}
        <div>{children}</div>
      </div>

      {/* ANIMATION */}
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