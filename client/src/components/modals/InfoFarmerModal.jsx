import React from "react";
import { X, Calendar, MapPin, Phone, Mail, User, FileText, MapPinned, Ruler } from "lucide-react";

export default function InfoFarmerModal({ data, onClose }) {
  if (!data) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-semibold mb-4">{data.FirstName} {data.LastName}</h3>
        <div className="w-full h-px bg-gray-300 my-2"></div>

        <div className="grid grid-cols-1 gap-2 text-gray-700 text-xs">
          <div className="flex justify-between items-center mb-2">
            <span className="flex items-center gap-1">
              <Calendar size={16} className="text-green-500" /><strong>Date of Birth:</strong>
            </span> {data.DateOfBirth}
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="flex items-center gap-1">
              <MapPin size={16} className="text-blue-500" /><strong>Address:</strong>
            </span> {data.Barangay}, {data.Municipality}, {data.Province}
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="flex items-center gap-1">
              <Phone size={16} className="text-red-500" /><strong>Contact No.:</strong>
            </span> {data.ContactNumber}
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="flex items-center gap-1">
              <Mail size={16} className="text-purple-500" /><strong>Email:</strong>
            </span> {data.Email}
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="flex items-center gap-1">
              <User size={16} className="text-orange-500" /><strong>Gender:</strong>
            </span> {data.Gender}
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="flex items-center gap-1">
              <MapPinned size={16} className="text-green-500" /><strong>Farm Location:</strong>
            </span> {data.FarmLocation}
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="flex items-center gap-1">
              <Ruler size={16} className="text-cyan-500" /><strong>Farm Size:</strong>
            </span> {data.FarmSize} ha
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="flex items-center gap-1">
              <FileText size={16} className="text-yellow-500" /><strong>Registration Date:</strong>
            </span> {data.RegistrationDate}
          </div>
        </div>
      </div>
    </div>
  );
}