import { useNavigate } from "react-router-dom";
import { AlertTriangle, LogIn } from "lucide-react";

export default function SessionExpired() {
  const navigate = useNavigate();

  const handleRedirect = () => {
    // Optional: clear storage/session
    localStorage.removeItem("token");
    sessionStorage.clear();

    navigate("/login");
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-[90%] max-w-md text-center">

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-4 rounded-full">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Session Expired
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-6">
          Your session has expired for security reasons. Please log in again to continue.
        </p>

        {/* Button */}
        <button
          onClick={handleRedirect}
          className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition"
        >
          <LogIn className="w-4 h-4" />
          Go to Login
        </button>
      </div>
    </div>
  );
}