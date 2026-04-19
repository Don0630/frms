import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useFarmer } from "../../context/FarmerContext.jsx";

export default function EditFarmerModal({ onClose, selectedFarmer }) {
  const { updateFarmer, loading } = useFarmer();

  const [form, setForm] = useState({});
  const [error, setError] = useState("");

  // Load selected farmer into form
  useEffect(() => {
    if (selectedFarmer) {
      setForm({
        FarmerID: selectedFarmer.FarmerID,
        FirstName: selectedFarmer.FirstName || "",
        MiddleName: selectedFarmer.MiddleName || "",
        LastName: selectedFarmer.LastName || "",
        Gender: selectedFarmer.Gender || "",
        DateOfBirth: selectedFarmer.DateOfBirth?.split("T")[0] || "",
        Barangay: selectedFarmer.Barangay || "",
        Municipality: selectedFarmer.Municipality || "",
        Province: selectedFarmer.Province || "",
        ContactNumber: selectedFarmer.ContactNumber || "",
        Email: selectedFarmer.Email || "",
      });
    }
  }, [selectedFarmer]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await updateFarmer(form);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to update farmer");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6 relative animate-fadeIn">

        {/* CLOSE */}
        <button onClick={onClose} className="absolute top-3 right-3">
          <X />
        </button>

        {/* Header */}
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-gray-800">
            Edit Farmer
          </h2>
          <p className="text-sm text-gray-500">
            Edit the details below to update a farmer
          </p>
        </div>


        {error && (
          <div className="bg-red-100 text-red-600 p-2 text-sm rounded mb-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* NAME */}
          <div className="grid grid-cols-3 gap-2">

            <div>
              <label className="text-xs text-gray-500">First Name</label>
              <input name="FirstName" value={form.FirstName || ""} onChange={handleChange} className="input" />
            </div>

            <div>
              <label className="text-xs text-gray-500">Middle Name</label>
              <input name="MiddleName" value={form.MiddleName || ""} onChange={handleChange} className="input" />
            </div>

            <div>
              <label className="text-xs text-gray-500">Last Name</label>
              <input name="LastName" value={form.LastName || ""} onChange={handleChange} className="input" />
            </div>

          </div>

          {/* GENDER + DOB */}
          <div className="grid grid-cols-2 gap-2">

            <div>
              <label className="text-xs text-gray-500">Gender</label>
              <select
                name="Gender"
                value={form.Gender || ""}
                onChange={handleChange}
                className="input"
              >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-500">Date of Birth</label>
              <input
                type="date"
                name="DateOfBirth"
                value={form.DateOfBirth || ""}
                onChange={handleChange}
                className="input"
              />
            </div>

          </div>


            {/* CONTACT + EMAIL ROW */}
            <div className="grid grid-cols-2 gap-2">

              <div>
                <label className="text-xs text-gray-500">Contact Number</label>
                <input
                  name="ContactNumber"
                  value={form.ContactNumber || ""}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500">Email Address</label>
                <input
                  name="Email"
                  value={form.Email || ""}
                  onChange={handleChange}
                  className="input"
                />
              </div>

            </div>








          {/* ADDRESS */}
          <div className="grid grid-cols-1 gap-3">

            {/* ADDRESS ROW */}
            <div className="grid grid-cols-3 gap-2">

              <div>
                <label className="text-xs text-gray-500">Barangay</label>
                <input
                  name="Barangay"
                  value={form.Barangay || ""}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500">Municipality</label>
                <input
                  name="Municipality"
                  value={form.Municipality || ""}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500">Province</label>
                <input
                  name="Province"
                  value={form.Province || ""}
                  onChange={handleChange}
                  className="input"
                />
              </div>

            </div>


          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn-gray">
              Cancel
            </button>

            <button type="submit" disabled={loading} className="btn-green">
              {loading ? "Updating..." : "Update"}
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