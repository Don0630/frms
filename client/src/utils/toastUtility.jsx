// src/utils/toastUtility.jsx
import { CheckCircle, XCircle, X } from "lucide-react";
import toast from "react-hot-toast";

export const showErrorToast = (message) => {
  toast.custom((t) => (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg bg-red-600 text-white text-sm transition-opacity ${t.visible ? "opacity-100" : "opacity-0"}`}>
      <XCircle className="w-5 h-5 shrink-0" />
      <p>{message || "Something went wrong. Please try again."}</p>
      <button onClick={() => toast.dismiss(t.id)} className="ml-auto text-white/60 hover:text-white">
        <X className="w-4 h-4" />
      </button>
    </div>
  ), {
    duration: 60000,
  });
};

export const showSuccessToast = (message) => {
  toast.custom((t) => (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg bg-green-600 text-white text-sm transition-opacity ${t.visible ? "opacity-100" : "opacity-0"}`}>
      <CheckCircle className="w-5 h-5 shrink-0" />
      <p>{message || "Action completed successfully."}</p>
      <button onClick={() => toast.dismiss(t.id)} className="ml-auto text-white/60 hover:text-white">
        <X className="w-4 h-4" />
      </button>
    </div>
  ), {
    duration: 4000,
  });
};