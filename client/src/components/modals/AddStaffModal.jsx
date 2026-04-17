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
    Email: "", // ✅ added
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.FirstName || !form.LastName) {
      return "First and Last name are required";
    }

    if (!form.Email) {
      return "Email is required";
    }

    // simple email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.Email)) {
      return "Invalid email format";
    }

    if (!form.ContactNumber) {
      return "Contact number is required";
    }

    return "";
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      const res = await addStaff(form);
      console.log("Staff added:", res);

      onSuccess(); // reload staff list
      onClose();   // close modal
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg p-5 shadow-lg">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Add Staff</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-3">
          <input
            name="FirstName"
            placeholder="First Name"
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            name="LastName"
            placeholder="Last Name"
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            name="Email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <select
            name="Gender"
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option>Male</option>
            <option>Female</option>
          </select>

          <input
            name="Position"
            placeholder="Position"
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            name="Department"
            placeholder="Department"
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            name="ContactNumber"
            placeholder="Contact Number"
            onChange={handleChange}
            className="border p-2 rounded"
          />

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-3 py-1 bg-green-600 text-white rounded"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}