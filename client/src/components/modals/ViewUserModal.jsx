// src/components/modals/ViewUserModal.jsx
import React from "react";
import { X, Briefcase, Building2, Phone, Mail } from "lucide-react";

export default function ViewUserModal({ user, onClose }) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 dark:bg-black/70 z-50">
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg p-6 w-96 relative shadow-xl border border-gray-200 dark:border-gray-800">

        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
          onClick={onClose}
        >
          <X />
        </button>

        {/* User Name */}
        <h3 className="font-semibold text-lg mb-2">
          {user.FirstName} {user.LastName}
        </h3>

        <div className="h-px bg-gray-200 dark:bg-gray-700 my-3" />

        {/* User Info */}
        <div className="space-y-3 text-sm">

          <div className="flex justify-between">
            <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Briefcase size={14} className="text-purple-500" /> Role
            </span>
            <span className="text-gray-800 dark:text-gray-200">
              {user.Role}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Building2 size={14} className="text-yellow-500" /> Department
            </span>
            <span className="text-gray-800 dark:text-gray-200">
              {user.Department}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Phone size={14} className="text-red-500" /> Contact
            </span>
            <span className="text-gray-800 dark:text-gray-200">
              {user.ContactNumber}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Mail size={14} className="text-blue-500" /> Email
            </span>
            <span className="text-gray-800 dark:text-gray-200">
              {user.Email}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}