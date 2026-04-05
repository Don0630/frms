// src/components/modals/AddFarmerModal.jsx
import React, { useState } from "react";
import { X } from "lucide-react";
import { useFarmer } from "../../context/FarmerContext.jsx";

export default function AddFarmerModal({ onClose, onSuccess }) {
  const { addFarmer } = useFarmer();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [farmLocation, setFarmLocation] = useState("");
  const [farmSize, setFarmSize] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !gender || !dateOfBirth || !contactNumber || !farmLocation || !farmSize) {
      setError("Please fill all required fields");
      return;
    }

    try {
      const currentDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
      await addFarmer({
        FirstName: firstName,
        LastName: lastName,
        Gender: gender,
        DateOfBirth: dateOfBirth,
        Address: address,
        ContactNumber: contactNumber,
        Email: email,
        FarmLocation: farmLocation,
        FarmSize: farmSize,
        RegistrationDate: currentDate
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to add farmer");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg p-6 w-96 relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X />
        </button>

        <h3 className="font-semibold text-lg mb-4">Add New Farmer</h3>
        {error && <p className="text-red-500 text-xs mb-2">{error}</p>}

        <form className="space-y-3 text-xs" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="First Name"
            className="w-full border px-3 py-2 rounded"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Last Name"
            className="w-full border px-3 py-2 rounded"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />

          <select
            className="w-full border px-3 py-2 rounded"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <input
            type="date"
            placeholder="Date of Birth"
            className="w-full border px-3 py-2 rounded"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Address"
            className="w-full border px-3 py-2 rounded"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Contact Number"
            className="w-full border px-3 py-2 rounded"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full border px-3 py-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="text"
            placeholder="Farm Location"
            className="w-full border px-3 py-2 rounded"
            value={farmLocation}
            onChange={(e) => setFarmLocation(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Farm Size (ha)"
            className="w-full border px-3 py-2 rounded"
            value={farmSize}
            onChange={(e) => setFarmSize(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white px-3 py-2 rounded text-sm"
          >
            Add Farmer
          </button>
        </form>
      </div>
    </div>
  );
}