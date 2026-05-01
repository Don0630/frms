// src/components/modals/ViewProgramModal.jsx
import {
  X,
  Tag,
  Calendar,
  PhilippinePeso,
  Users,
  CheckCheck,
} from "lucide-react";

export default function InfoProgramModal({ program, onClose }) {
  if (!program) return null;

  const formattedBudget = Number(program.Budget || 0).toLocaleString(
    "en-PH",
    {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }
  );

  const statusStyles = {
    Active: "bg-green-500 text-white",
    Completed: "bg-blue-500 text-white",
    Dropped: "bg-red-500 text-white",
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 dark:bg-black/70 z-50">
      <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-lg shadow-lg w-11/12 max-w-md p-6 max-h-[80vh] overflow-y-auto relative border border-gray-200 dark:border-gray-700">

        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <h3 className="text-lg font-semibold mb-4">
          {program.ProgramName}
        </h3>

        <div className="w-full h-px bg-gray-300 dark:bg-gray-700 my-2"></div>

        {/* Content */}
        <div className="grid grid-cols-1 gap-3 text-xs">

          {/* Duration */}
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1 font-medium">
              <Calendar size={16} className="text-yellow-500" />
              Duration:
            </span>
            <span className="text-gray-700 dark:text-gray-300">
              {program.StartDate} → {program.EndDate}
            </span>
          </div>

          {/* Budget */}
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1 font-medium">
              <PhilippinePeso size={16} className="text-purple-500" />
              Budget:
            </span>
            <span className="text-gray-700 dark:text-gray-300">
              {formattedBudget}
            </span>
          </div>

          {/* Beneficiaries */}
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1 font-medium">
              <Users size={16} className="text-blue-500" />
              Beneficiaries:
            </span>
            <span className="text-gray-700 dark:text-gray-300">
              {program.TargetBeneficiaries || "0"}
            </span>
          </div>

          {/* Status */}
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1 font-medium">
              <CheckCheck size={16} className="text-red-500" />
              Status:
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium min-w-[90px] text-center ${
                statusStyles[program.Status] || "bg-gray-400 text-white"
              }`}
            >
              {program.Status || "Unknown"}
            </span>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1 mb-2">
            <span className="flex items-center gap-1 font-medium">
              <Tag size={16} className="text-green-500" />
              Description:
            </span>

            <div className="max-h-24 overflow-y-auto border rounded p-2 bg-gray-50 dark:bg-gray-800 text-justify indent-6 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700">
              {program.Description || "N/A"}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}