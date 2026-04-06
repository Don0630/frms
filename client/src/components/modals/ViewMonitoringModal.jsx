import React from "react";
import {
  X,
  Calendar,
  AlertTriangle,
  FileText,
  Users,
  Leaf,
  Activity,
  BarChart3
} from "lucide-react";

export default function ViewMonitoringModal({ monitoring, onClose }) {
  if (!monitoring) return null;

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
          {monitoring.FirstName
            ? `${monitoring.FirstName} ${monitoring.LastName}`
            : "Monitoring Details"}
        </h3>

        <div className="w-full h-px bg-gray-300 my-2"></div>

        {/* Content */}
        <div className="grid grid-cols-1 gap-2 text-gray-700 text-xs">

          {/* Farmer */}
          <div className="flex justify-between items-center mb-2">
            <span className="flex items-center gap-1">
              <Users size={16} className="text-green-500" />
              <strong>Farmer:</strong>
            </span>
            <span>
              {monitoring.FirstName
                ? `${monitoring.FirstName} ${monitoring.LastName}`
                : "N/A"}
            </span>
          </div>

          {/* Crop */}
          <div className="flex justify-between items-center mb-2">
            <span className="flex items-center gap-1">
              <Leaf size={16} className="text-green-600" />
              <strong>Crop:</strong>
            </span>
            <span>{monitoring.CropName || "-"}</span>
          </div>

          {/* Livestock */}
          <div className="flex justify-between items-center mb-2">
            <span className="flex items-center gap-1">
              <Activity size={16} className="text-orange-500" />
              <strong>Livestock:</strong>
            </span>
            <span>
              {monitoring.Type
                ? `${monitoring.Type} - ${monitoring.Breed}`
                : "-"}
            </span>
          </div>

          {/* Production */}
          <div className="flex justify-between items-center mb-2">
            <span className="flex items-center gap-1">
              <BarChart3 size={16} className="text-blue-500" />
              <strong>Production:</strong>
            </span>
            <span>{monitoring.ProductionVolume}</span>
          </div>

          {/* Date */}
          <div className="flex justify-between items-center mb-2">
            <span className="flex items-center gap-1">
              <Calendar size={16} className="text-purple-500" />
              <strong>Date:</strong>
            </span>
            <span>
              {monitoring.ReportDate
                ? new Date(monitoring.ReportDate).toLocaleDateString()
                : "-"}
            </span>
          </div>

          {/* Issues */}
          <div className="flex justify-between items-start mb-2">
            <span className="flex items-center gap-1">
              <AlertTriangle size={16} className="text-red-500" />
              <strong>Issues:</strong>
            </span>
            <div className="max-h-20 overflow-y-auto text-right w-1/2">
              {monitoring.Issues || "-"}
            </div>
          </div>

          {/* Remarks */}
          <div className="flex justify-between items-start mb-2">
            <span className="flex items-center gap-1">
              <FileText size={16} className="text-yellow-500" />
              <strong>Remarks:</strong>
            </span>
            <div className="max-h-20 overflow-y-auto text-right w-1/2">
              {monitoring.Remarks || "-"}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}