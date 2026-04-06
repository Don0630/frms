import { X, Tag, BarChart3, PhilippinePeso } from "lucide-react";

export default function ViewLivestockModal({ livestock, onClose }) {
  if (!livestock) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg p-6 w-96 relative shadow-lg">
        <button
          className="absolute top-3 right-3"
          onClick={onClose}
        >
          <X />
        </button>

        <h3 className="font-semibold text-lg mb-2">{livestock.Breed}</h3>
        <div className="h-px bg-gray-300 my-2"></div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="flex items-center gap-1">
              <Tag size={16} className="text-red-500" /> Type
            </span>
            {livestock.Type}
          </div>

          <div className="flex justify-between">
            <span className="flex items-center gap-1">
              <BarChart3 size={16} className="text-green-500"/> Average Production
            </span>
            {livestock.AverageProduction}
          </div>

          <div className="flex justify-between">
            <span className="flex items-center gap-1">
              <PhilippinePeso size={16} className="text-purple-500"/> Price
            </span>
            ₱ {livestock.MarketPrice}
          </div>
        </div>
      </div>
    </div>
  );
}