import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import toast from "react-hot-toast";

export const showSuccessToast = (message) => {
  toast.custom((t) => (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg bg-green-600 text-white text-sm transition-opacity ${t.visible ? "opacity-100" : "opacity-0"}`}>
      <CheckCircle className="w-5 h-5 shrink-0" />
      <p>{message || "Action completed successfully."}</p>
      <button onClick={() => toast.dismiss(t.id)} className="ml-auto text-white/60 hover:text-white">
        <X className="w-4 h-4" />
      </button>
    </div>
  ), { duration: 4000 });
};

export const showErrorToast = (message) => {
  toast.custom((t) => (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg bg-red-600 text-white text-sm transition-opacity ${t.visible ? "opacity-100" : "opacity-0"}`}>
      <XCircle className="w-5 h-5 shrink-0" />
      <p>{message || "Something went wrong. Please try again."}</p>
      <button onClick={() => toast.dismiss(t.id)} className="ml-auto text-white/60 hover:text-white">
        <X className="w-4 h-4" />
      </button>
    </div>
  ), { duration: 4000 });
};

export const showWarningToast = (message) => {
  toast.custom((t) => (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg bg-yellow-500 text-white text-sm transition-opacity ${t.visible ? "opacity-100" : "opacity-0"}`}>
      <AlertTriangle className="w-5 h-5 shrink-0" />
      <p>{message || "Please review before proceeding."}</p>
      <button onClick={() => toast.dismiss(t.id)} className="ml-auto text-white/60 hover:text-white">
        <X className="w-4 h-4" />
      </button>
    </div>
  ), { duration: 4000 });
};

export const showInfoToast = (message) => {
  toast.custom((t) => (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg bg-blue-600 text-white text-sm transition-opacity ${t.visible ? "opacity-100" : "opacity-0"}`}>
      <Info className="w-5 h-5 shrink-0" />
      <p>{message || "Here's something you should know."}</p>
      <button onClick={() => toast.dismiss(t.id)} className="ml-auto text-white/60 hover:text-white">
        <X className="w-4 h-4" />
      </button>
    </div>
  ), { duration: 4000 });
};


export const showNeutralToast = (message) => {
  toast.custom((t) => (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg bg-gray-600 text-white text-sm transition-opacity ${t.visible ? "opacity-100" : "opacity-0"}`}>
      <Info className="w-5 h-5 shrink-0" />
      <p>{message || "No changes were made."}</p>
      <button onClick={() => toast.dismiss(t.id)} className="ml-auto text-white/60 hover:text-white">
        <X className="w-4 h-4" />
      </button>
    </div>
  ), { duration: 4000 });
};