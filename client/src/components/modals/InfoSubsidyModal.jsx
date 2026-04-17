import { X, PhilippinePeso, Calendar, FileText, Tag, Users } from "lucide-react";

export default function ViewSubsidyModal({ subsidy, onClose }) {
  if (!subsidy) return null;

  const percent =
    subsidy.TotalAmount > 0
      ? (subsidy.TotalDistributed / subsidy.TotalAmount) * 100
      : 0;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-xl shadow-xl w-11/12 max-w-md p-6 relative">

        {/* CLOSE */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-900"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>

        {/* TITLE */}
        <h3 className="text-lg font-semibold mb-3 text-gray-800">
          Subsidy Details
        </h3>

        <div className="h-px bg-gray-200 mb-4"></div>

        {/* CONTENT */}
        <div className="space-y-3 text-sm text-gray-700">

          {/* Program */}
          <div className="flex justify-between">
            <span className="flex items-center gap-1">
              <Tag size={16} className="text-green-500" />
              Program
            </span>
            <span className="font-medium">{subsidy.ProgramName}</span>
          </div>

          {/* Total Budget */}
          <div className="flex justify-between">
            <span className="flex items-center gap-1">
              <PhilippinePeso size={16} className="text-purple-500" />
              Total Budget
            </span>
            <span>
              ₱ {Number(subsidy.TotalAmount).toLocaleString()}
            </span>
          </div>

          {/* Distributed */}
          <div className="flex justify-between">
            <span className="flex items-center gap-1">
              <PhilippinePeso size={16} className="text-green-600" />
              Distributed
            </span>
            <span className="text-green-600 font-medium">
              ₱ {Number(subsidy.TotalDistributed || 0).toLocaleString()}
            </span>
          </div>

          {/* Farmers */}
          <div className="flex justify-between">
            <span className="flex items-center gap-1">
              <Users size={16} className="text-blue-500" />
              Farmers
            </span>
            <span>{subsidy.TotalFarmers || 0}</span>
          </div>

          {/* Date */}
          <div className="flex justify-between">
            <span className="flex items-center gap-1">
              <Calendar size={16} className="text-yellow-500" />
              Date
            </span>
            <span>{subsidy.DistributionDate}</span>
          </div>

          {/* Remarks */}
          <div className="flex justify-between">
            <span className="flex items-center gap-1">
              <FileText size={16} className="text-red-500" />
              Remarks
            </span>
            <span>{subsidy.Remarks || "N/A"}</span>
          </div>
        </div>

        {/* 🔥 PROGRESS BAR AT BOTTOM */}
        <div className="mt-5 pt-4 border-t">
          <div className="flex justify-between text-xs mb-1">
            <span>Distribution Progress</span>
            <span>{percent.toFixed(1)}%</span>
          </div>

          <div className="w-full bg-gray-200 h-2 rounded">
            <div
              className="bg-green-500 h-2 rounded transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}