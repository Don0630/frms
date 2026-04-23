import { useState } from "react";
import { X } from "lucide-react";
import { addStaff } from "../../api/staffApi.js";

export default function AddStaffModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    FirstName: "",
    LastName: "",
    Gender: "Male",
    Position: "",
    Department: "",
    ContactNumber: "",
    Email: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.FirstName || !form.LastName)
      return "First and Last name are required";

    if (!form.Email) return "Email is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.Email)) return "Invalid email format";

    if (!form.ContactNumber) return "Contact number is required";

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      await addStaff(form);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

      {/* MODAL */}
      <div className="
        w-full max-w-lg rounded-xl shadow-xl p-6 relative
        bg-white dark:bg-gray-900
        text-gray-800 dark:text-gray-100
        border border-gray-200 dark:border-gray-800
        animate-fadeIn
      ">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 dark:text-gray-300 hover:text-red-500"
        >
          <X />
        </button>

        {/* HEADER */}
        <div className="mb-5">
          <h2 className="text-xl font-semibold">
            Add Staff
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Fill in staff information
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 p-2 text-sm rounded mb-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">

          {/* NAME */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400">
                First Name
              </label>
              <input
                name="FirstName"
                value={form.FirstName}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400">
                Last Name
              </label>
              <input
                name="LastName"
                value={form.LastName}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400">
              Email
            </label>
            <input
              type="email"
              name="Email"
              value={form.Email}
              onChange={handleChange}
              className="input"
            />
          </div>

          {/* GENDER + CONTACT */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400">
                Gender
              </label>
              <select
                name="Gender"
                value={form.Gender}
                onChange={handleChange}
                className="input"
              >
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400">
                Contact Number
              </label>
              <input
                name="ContactNumber"
                value={form.ContactNumber}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>

          {/* POSITION + DEPARTMENT */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400">
                Position
              </label>
              <input
                name="Position"
                value={form.Position}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400">
                Department
              </label>
              <input
                name="Department"
                value={form.Department}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-3 py-2 rounded bg-green-600 dark:bg-green-500 text-white hover:bg-green-700 dark:hover:bg-green-400"
            >
              {loading ? "Saving..." : "Save Staff"}
            </button>
          </div>

        </form>
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

        .input {
          width: 100%;
          border-radius: 8px;
          padding: 8px;
          font-size: 14px;

          background: white;
          border: 1px solid #e5e7eb;
          color: #111827;
        }

        .dark .input {
          background: #111827;
          border: 1px solid #374151;
          color: #f3f4f6;
        }

        .input:focus {
          outline: none;
          border-color: #16a34a;
          box-shadow: 0 0 0 2px rgba(22,163,74,0.25);
        }
      `}</style>

    </div>
  );
}