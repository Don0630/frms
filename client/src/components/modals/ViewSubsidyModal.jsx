import { X, PhilippinePeso, Calendar, FileText, User, Tag } from "lucide-react";

export default function ViewSubsidyModal({ subsidy, onClose }) {
  if (!subsidy) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6 relative">

        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <h3 className="text-lg font-semibold mb-4">
          Subsidy Details
        </h3>

        <div className="w-full h-px bg-gray-300 my-2"></div>

        {/* Content */}
        <div className="grid grid-cols-1 gap-2 text-gray-700 text-xs">

          {/* Farmer */}
          <div className="flex justify-between items-center mb-2">
            <span className="flex items-center gap-1">
              <User size={16} className="text-blue-500" />
              <strong>Farmer:</strong>
            </span>
            <span>
              {subsidy.FirstName || subsidy.LastName
                ? `${subsidy.FirstName ?? ""} ${subsidy.LastName ?? ""}`.trim()
                : subsidy.FarmerID}
            </span>
          </div>

          {/* Program */}
          <div className="flex justify-between items-center mb-2">
            <span className="flex items-center gap-1">
              <Tag size={16} className="text-green-500" />
              <strong>Program:</strong>
            </span>
            <span>{subsidy.ProgramName || subsidy.ProgramID}</span>
          </div>

          {/* Amount */}
          <div className="flex justify-between items-center mb-2">
            <span className="flex items-center gap-1">
              <PhilippinePeso size={16} className="text-purple-500" />
              <strong>Amount:</strong>
            </span>
            <span>
              ₱ {Number(subsidy.Amount).toLocaleString()}
            </span>
          </div>

          {/* Date */}
          <div className="flex justify-between items-center mb-2">
            <span className="flex items-center gap-1">
              <Calendar size={16} className="text-yellow-500" />
              <strong>Date:</strong>
            </span>
            <span>{subsidy.DistributionDate}</span>
          </div>

          {/* Remarks */}
          <div className="flex justify-between items-center mb-2">
            <span className="flex items-center gap-1">
              <FileText size={16} className="text-red-500" />
              <strong>Remarks:</strong>
            </span>
            <span>{subsidy.Remarks || "N/A"}</span>
          </div>

        </div>
      </div>
    </div>
  );
}