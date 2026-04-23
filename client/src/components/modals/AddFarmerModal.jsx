import React, { useState } from "react";
import { X, User, Phone, Mail, MapPin, Home, Calendar } from "lucide-react";
import { useFarmer } from "../../context/FarmerContext.jsx";

export default function AddFarmerModal({ onClose, onSuccess }) {
  const { addFarmer } = useFarmer();

  const [form, setForm] = useState({
    FirstName: "",
    MiddleName: "",
    LastName: "",
    Gender: "",
    DateOfBirth: "",
    Barangay: "",
    Municipality: "",
    Province: "",
    ContactNumber: "",
    Email: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const inputWrapper =
    "flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-200 bg-white";

  const inputClass = "w-full outline-none text-sm bg-transparent";

  const iconClass = "text-gray-400 mr-2";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6 relative">

        {/* CLOSE */}
        <button onClick={onClose} className="absolute top-3 right-3">
          <X />
        </button>

        <h2 className="text-xl font-semibold mb-4">Add Farmer</h2>

        <form className="space-y-4">

          {/* NAME */}
          <div className="grid grid-cols-3 gap-2">

            <div className={inputWrapper}>
              <User size={16} className={iconClass} />
              <input
                name="FirstName"
                value={form.FirstName}
                onChange={handleChange}
                placeholder="First"
                className={inputClass}
              />
            </div>

            <div className={inputWrapper}>
              <User size={16} className={iconClass} />
              <input
                name="MiddleName"
                value={form.MiddleName}
                onChange={handleChange}
                placeholder="Middle"
                className={inputClass}
              />
            </div>

            <div className={inputWrapper}>
              <User size={16} className={iconClass} />
              <input
                name="LastName"
                value={form.LastName}
                onChange={handleChange}
                placeholder="Last"
                className={inputClass}
              />
            </div>

          </div>

          {/* GENDER + DOB */}
          <div className="grid grid-cols-2 gap-2">

            <div className={inputWrapper}>
              <User size={16} className={iconClass} />
              <select
                name="Gender"
                value={form.Gender}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Gender</option>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>

            <div className={inputWrapper}>
              <Calendar size={16} className={iconClass} />
              <input
                type="date"
                name="DateOfBirth"
                value={form.DateOfBirth}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

          </div>

          {/* CONTACT + EMAIL */}
          <div className="grid grid-cols-2 gap-2">

            <div className={inputWrapper}>
              <Phone size={16} className={iconClass} />
              <input
                name="ContactNumber"
                value={form.ContactNumber}
                onChange={handleChange}
                placeholder="Contact"
                className={inputClass}
              />
            </div>

            <div className={inputWrapper}>
              <Mail size={16} className={iconClass} />
              <input
                name="Email"
                value={form.Email}
                onChange={handleChange}
                placeholder="Email"
                className={inputClass}
              />
            </div>

          </div>

          {/* ADDRESS */}
          <div className="space-y-2">

            <div className={inputWrapper}>
              <MapPin size={16} className={iconClass} />
              <input
                name="Barangay"
                value={form.Barangay}
                onChange={handleChange}
                placeholder="Barangay"
                className={inputClass}
              />
            </div>

            <div className={inputWrapper}>
              <Home size={16} className={iconClass} />
              <input
                name="Municipality"
                value={form.Municipality}
                onChange={handleChange}
                placeholder="Municipality"
                className={inputClass}
              />
            </div>

            <div className={inputWrapper}>
              <Home size={16} className={iconClass} />
              <input
                name="Province"
                value={form.Province}
                onChange={handleChange}
                placeholder="Province"
                className={inputClass}
              />
            </div>

          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg">
              Cancel
            </button>

            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg">
              Save Farmer
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}