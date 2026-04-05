import { X, Tag, Calendar, PhilippinePeso, Users, Circle } from "lucide-react";

export default function ViewProgramModal({ program, onClose }) {
  if (!program) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg p-6 w-96 relative shadow-lg">
        <button
          className="absolute top-3 right-3"
          onClick={onClose}
        >
          <X />
        </button>

        <h3 className="font-semibold text-lg mb-2">
          {program.ProgramName}
        </h3>

        <div className="h-px bg-gray-300 my-2"></div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="flex items-center gap-1">
              <Tag size={16} className="text-green-500" /> Description
            </span>
            {program.Description}
          </div>

          <div className="flex justify-between">
            <span className="flex items-center gap-1">
              <Calendar size={16} className="text-yellow-500" /> Duration
            </span>
            {program.StartDate} → {program.EndDate}
          </div>

          <div className="flex justify-between">
            <span className="flex items-center gap-1">
              <PhilippinePeso size={16} className="text-purple-500" /> Budget
            </span>
            ₱ {Number(program.Budget).toLocaleString()}
          </div>

          <div className="flex justify-between">
            <span className="flex items-center gap-1">
              <Users size={16} className="text-blue-500" /> Beneficiaries
            </span>
            {program.TargetBeneficiaries}
          </div>
 
        </div>
      </div>
    </div>
  );
}