// src/components/modals/EditStaffModal.jsx
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { updateStaff } from "../../api/staffApi.js"; // we’ll create this

export default function EditStaffModal({ data, onClose, onSuccess }) {
  const [form, setForm] = useState({
    FirstName: "",
    LastName: "",
    Gender: "Male",
    Position: "",
    Department: "",
    ContactNumber: "",
  });

  useEffect(() => {
    if (data) setForm({ ...data });
  }, [data]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await updateStaff(form); // call API
      onSuccess(); // reload staff list
      onClose();   // close modal
    } catch (err) {
      console.error("Error updating staff:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg p-5 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Edit Staff</h2>
          <button onClick={onClose}><X /></button>
        </div>

        <div className="flex flex-col gap-3">
          <input name="FirstName" placeholder="First Name" value={form.FirstName} onChange={handleChange} className="border p-2 rounded" />
          <input name="LastName" placeholder="Last Name" value={form.LastName} onChange={handleChange} className="border p-2 rounded" />
          <select name="Gender" value={form.Gender} onChange={handleChange} className="border p-2 rounded">
            <option>Male</option>
            <option>Female</option>
          </select>
          <input name="Position" placeholder="Position" value={form.Position} onChange={handleChange} className="border p-2 rounded" />
          <input name="Department" placeholder="Department" value={form.Department} onChange={handleChange} className="border p-2 rounded" />
          <input name="ContactNumber" placeholder="Contact Number" value={form.ContactNumber} onChange={handleChange} className="border p-2 rounded" />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-3 py-1 bg-gray-200 rounded">Cancel</button>
          <button onClick={handleSubmit} className="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
        </div>
      </div>
    </div>
  );
}