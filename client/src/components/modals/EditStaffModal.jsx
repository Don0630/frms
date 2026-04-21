import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { updateStaff } from "../../api/staffApi.js";

export default function EditStaffModal({ data, onClose, onSuccess }) {
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

  useEffect(() => {
    if (data) setForm({ ...data });
  }, [data]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await updateStaff(form);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to update staff");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6 relative animate-fadeIn">

        {/* CLOSE */}
        <button onClick={onClose} className="absolute top-3 right-3">
          <X />
        </button>

        {/* HEADER */}
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-gray-800">
            Edit Staff
          </h2>
          <p className="text-sm text-gray-500">
            Update staff information
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-600 p-2 text-sm rounded mb-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">

          {/* NAME */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500">First Name</label>
              <input
                name="FirstName"
                value={form.FirstName}
                onChange={handleChange}
                className="input"
                required
              />
            </div>

            <div>
              <label className="text-xs text-gray-500">Last Name</label>
              <input
                name="LastName"
                value={form.LastName}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-xs text-gray-500">Email</label>
            <input
              type="email"
              name="Email"
              value={form.Email}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          {/* GENDER + POSITION */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500">Gender</label>
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
              <label className="text-xs text-gray-500">Position</label>
              <input
                name="Position"
                value={form.Position}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>

          {/* DEPARTMENT + CONTACT */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500">Department</label>
              <input
                name="Department"
                value={form.Department}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500">Contact Number</label>
              <input
                name="ContactNumber"
                value={form.ContactNumber}
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
              className="btn-gray"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="btn-green"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>

        </form>
      </div>

      {/* STYLES */}
      <style>{`
        .input {
          width: 100%;
          border: 1px solid #e5e7eb;
          padding: 8px;
          border-radius: 8px;
          font-size: 14px;
        }

        .input:focus {
          outline: none;
          border-color: #16a34a;
          box-shadow: 0 0 0 2px rgba(22,163,74,0.2);
        }

        .btn-green {
          background: #16a34a;
          color: white;
          padding: 8px 14px;
          border-radius: 8px;
        }

        .btn-gray {
          background: #e5e7eb;
          padding: 8px 14px;
          border-radius: 8px;
        }

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