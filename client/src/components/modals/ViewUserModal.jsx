// src/components/modals/ViewUserModal.jsx
import React from "react";
import { X, Briefcase, Building2, Phone, Mail } from "lucide-react";

export default function ViewUserModal({ user, onClose }) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg p-6 w-96 relative">
        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X />
        </button>

        {/* User Name */}
        <h3 className="font-semibold text-lg mb-2">
          {user.FirstName} {user.LastName}
        </h3>

        <div className="h-px bg-gray-300 my-2"></div>

        {/* User Info */}
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="flex items-center gap-1">
              <Briefcase size={14} className="text-purple-500" /> Role
            </span>
            {user.Role}
          </div>

          <div className="flex justify-between">
            <span className="flex items-center gap-1">
              <Building2 size={14} className="text-yellow-500" /> Department
            </span>
            {user.Department}
          </div>

          <div className="flex justify-between">
            <span className="flex items-center gap-1">
              <Phone size={14} className="text-red-500" /> Contact
            </span>
            {user.ContactNumber}
          </div>

          <div className="flex justify-between">
            <span className="flex items-center gap-1">
              <Mail size={14} className="text-blue-500" /> Email
            </span>
            {user.Email}
          </div>
        </div>
      </div>
    </div>
  );
}