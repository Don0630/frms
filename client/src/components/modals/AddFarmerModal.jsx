import React, { useState } from "react";
import { X } from "lucide-react";
import { useFarmer } from "../../context/FarmerContext.jsx";

export default function AddFarmerModal({ onClose, onSuccess }) {
  const { addFarmer } = useFarmer();

  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    barangay: "",
    municipality: "",
    province: "",
    contactNumber: "",
    email: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const {
      firstName,
      lastName,
      gender,
      dateOfBirth,
      contactNumber,
      barangay,
      municipality,
      province,
    } = form;

    if (
      !firstName ||
      !lastName ||
      !gender ||
      !dateOfBirth ||
      !contactNumber ||
      !barangay ||
      !municipality ||
      !province
    ) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const currentDate = new Date().toISOString().split("T")[0];

      await addFarmer({
        FirstName: form.firstName,
        MiddleName: form.middleName,
        LastName: form.lastName,
        Gender: form.gender,
        DateOfBirth: form.dateOfBirth,
        Barangay: form.barangay,
        Municipality: form.municipality,
        Province: form.province,
        ContactNumber: form.contactNumber,
        Email: form.email,
        RegistrationDate: currentDate,
      });

      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to add farmer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 relative animate-fadeIn">

        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-gray-800">
            Add New Farmer
          </h2>
          <p className="text-sm text-gray-500">
            Fill in the details below to register a farmer
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-2 rounded mb-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <div className="grid grid-cols-3 gap-3">
            <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} className="input" />
            <input name="middleName" placeholder="Middle Name" value={form.middleName} onChange={handleChange} className="input" />
            <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} className="input" />
          </div>

          {/* Gender + DOB */}
          <div className="grid grid-cols-2 gap-3">
            <select name="gender" value={form.gender} onChange={handleChange} className="input">
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <input
              type="date"
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={handleChange}
              className="input"
            />
          </div>

          {/* Address */}
          <div className="grid grid-cols-3 gap-3">
            <input name="barangay" placeholder="Barangay" value={form.barangay} onChange={handleChange} className="input" />
            <input name="municipality" placeholder="Municipality" value={form.municipality} onChange={handleChange} className="input" />
            <input name="province" placeholder="Province" value={form.province} onChange={handleChange} className="input" />
          </div>

          {/* Contact */}
          <input
            name="contactNumber"
            placeholder="Contact Number"
            value={form.contactNumber}
            onChange={handleChange}
            className="input"
          />

          <input
            name="email"
            type="email"
            placeholder="Email (optional)"
            value={form.email}
            onChange={handleChange}
            className="input"
          />

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-green-600 text-white"
            >
              {loading ? "Saving..." : "Save Farmer"}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .input {
          width: 100%;
          border: 1px solid #e5e7eb;
          padding: 10px;
          border-radius: 10px;
          font-size: 14px;
        }

        .input:focus {
          outline: none;
          border-color: #16a34a;
          box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.2);
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