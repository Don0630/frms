import { useEffect, useState } from "react";
import { X, Plus, DollarSign } from "lucide-react";
import { useSubsidyDetails } from "../../context/SubsidyDetailsContext.jsx";
import AddFarmerSubsidyModal from "./AddFarmerSubsidyModal.jsx";

export default function ViewSubsidyDetailsModal({ distribution, onClose }) {
  const {
    farmers,
    farmersLoading,
    farmersError,
    loadFarmersPerSubsidy,
    clearFarmers,
    updateDistributeSubsidy,
  } = useSubsidyDetails();

  const [openAdd, setOpenAdd] = useState(false);

  useEffect(() => {
    if (!distribution?.DistributionID) return;

    loadFarmersPerSubsidy(distribution.DistributionID);

    return () => clearFarmers();
  }, [distribution?.DistributionID]);

  if (!distribution) return null;

  // ✅ TOTAL AMOUNT (FROM DB OR COMPUTED — choose one)
  const totalAmount = Number(distribution?.TotalAmount || 0);

  // ✅ DISTRIBUTED (REACTIVE FROM FARMERS STATE)
  const totalDistributed = farmers.reduce((sum, f) => {
    return Number(f.IsDistributed) === 1
      ? sum + Number(f.Amount || 0)
      : sum;
  }, 0);

  // ✅ REMAINING
  const remaining = totalAmount - totalDistributed;

  // ✅ SAFE DISTRIBUTE HANDLER
  const handleDistribute = async (DistributionDetailsID) => {
    if (!DistributionDetailsID) {
      console.error("❌ Missing DistributionDetailsID");
      return;
    }

    try {
      await updateDistributeSubsidy(DistributionDetailsID, {
        IsDistributed: 1,
      });

      // refresh farmers (triggers UI update)
      await loadFarmersPerSubsidy(distribution.DistributionID);
    } catch (err) {
      console.error("❌ Failed to distribute:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Subsidy Overview
            </h2>
            <p className="text-sm text-gray-500">
              Manage distribution and farmer allocations
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-6 overflow-y-auto">

          {/* ✅ STATS (NOW REACTIVE) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              label="Total Amount"
              value={`₱ ${totalAmount.toLocaleString()}`}
              color="text-gray-800"
            />

            <StatCard
              label="Distributed"
              value={`₱ ${totalDistributed.toLocaleString()}`}
              color="text-green-600"
            />

            <StatCard
              label="Remaining"
              value={`₱ ${remaining.toLocaleString()}`}
              color={remaining > 0 ? "text-orange-600" : "text-gray-400"}
            />
          </div>

          {/* INFO */}
          <div className="bg-gray-50 border rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <Info label="Program" value={distribution?.ProgramName} />
            <Info label="Date" value={distribution?.DistributionDate} />
            <Info label="Remarks" value={distribution?.Remarks || "None"} />
          </div>

          {/* ACTION */}
          <div className="flex justify-end">
            <button
              onClick={() => setOpenAdd(true)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl shadow"
            >
              <Plus className="w-4 h-4" />
              Add Farmer
            </button>
          </div>

          {/* TABLE */}
          <div className="border rounded-xl overflow-hidden">
            {farmersLoading ? (
              <State text="Loading farmers..." />
            ) : farmersError ? (
              <State text={farmersError} error />
            ) : farmers.length === 0 ? (
              <State text="No farmers assigned yet." />
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-xs uppercase text-gray-600">
                  <tr>
                    <th className="p-3 text-left">Farmer</th>
                    <th className="p-3 text-left">Contact</th>
                    <th className="p-3 text-left">Amount</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {farmers.map((f) => {
                    const isDistributed = Number(f.IsDistributed) === 1;

                    return (
                      <tr
                        key={f.DistributionDetailsID}
                        className="border-t hover:bg-gray-50"
                      >
                        <td className="p-3 font-medium">
                          {f.FirstName} {f.LastName}
                        </td>

                        <td className="p-3 text-gray-600">
                          {f.ContactNumber || f.Email}
                        </td>

                        <td className="p-3 font-semibold">
                          ₱ {Number(f.Amount || 0).toLocaleString()}
                        </td>

                        <td className="p-3 text-center">
                          <button
                            onClick={() =>
                              handleDistribute(f.DistributionDetailsID)
                            }
                            disabled={isDistributed}
                            className={`inline-flex items-center gap-1 px-3 py-1 text-xs rounded-lg ${
                              isDistributed
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 text-white"
                            }`}
                          >
                            <DollarSign className="w-3 h-3" />
                            {isDistributed ? "Distributed" : "Distribute"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* MODAL */}
        {openAdd && (
          <AddFarmerSubsidyModal
            distributionID={distribution.DistributionID}
            onClose={() => setOpenAdd(false)}
            onSuccess={() =>
              loadFarmersPerSubsidy(distribution.DistributionID)
            }
          />
        )}
      </div>
    </div>
  );
}

/* UI COMPONENTS */

function StatCard({ label, value, color }) {
  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-lg font-bold ${color}`}>{value}</p>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-gray-500 text-xs">{label}</p>
      <p className="font-medium text-gray-800">{value}</p>
    </div>
  );
}

function State({ text, error }) {
  return (
    <div
      className={`p-6 text-center text-sm ${
        error ? "text-red-500" : "text-gray-500"
      }`}
    >
      {text}
    </div>
  );
}