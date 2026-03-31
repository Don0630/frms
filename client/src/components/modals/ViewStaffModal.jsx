import { X, Users, Briefcase, Building2, Phone, Mail } from "lucide-react";

export default function ViewStaffModal({ data, onClose }) {
  if (!data) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg p-6 w-96 relative">
        
        <button
          className="absolute top-3 right-3"
          onClick={onClose}
        >
          <X />
        </button>

        <h3 className="font-semibold text-lg mb-2">
          {data.FirstName} {data.LastName}
        </h3>

        <div className="h-px bg-gray-300 my-2"></div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="flex items-center gap-1">
              <Users size={14} className="text-green-500" /> Gender
            </span>
            {data.Gender}
          </div>

          <div className="flex justify-between">
            <span className="flex items-center gap-1">
              <Briefcase size={14} className="text-purple-500" /> Position
            </span>
            {data.Position}
          </div>

          <div className="flex justify-between">
            <span className="flex items-center gap-1">
              <Building2 size={14} className="text-yellow-500" /> Department
            </span>
            {data.Department}
          </div>

          <div className="flex justify-between">
            <span className="flex items-center gap-1">
              <Phone size={14} className="text-red-500" /> Contact
            </span>
            {data.ContactNumber}
          </div>

          <div className="flex justify-between">
            <span className="flex items-center gap-1">
              <Mail size={14} className="text-blue-500" /> Email
            </span>
            {data.Email}
          </div>
        </div>
      </div>
    </div>
  );
}