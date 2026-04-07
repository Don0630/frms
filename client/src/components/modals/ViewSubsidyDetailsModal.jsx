// src/components/modals/ViewSubsidyDetailsModal.jsx
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
    clearFarmers
  } = useSubsidyDetails();


  const [showAddFarmerSubsidyModal, setShowAddFarmerSubsidyModal] = useState(false);

const openAddFarmerSubsidyModal = () => setShowAddFarmerSubsidyModal(true);
const closeAddFarmerSubsidyModal = () => setShowAddFarmerSubsidyModal(false);

  useEffect(() => {
    if (distribution) {
      loadFarmersPerSubsidy(distribution.DistributionID);
    }
    return () => clearFarmers();
  }, [distribution]);

  if (!distribution) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-5xl p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-500 hover:text-gray-800 transition"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Subsidy Distribution Details</h2>
          <p className="text-gray-500 mt-1 text-sm">
            View and manage farmers for this subsidy program.
          </p>
        </div>

        {/* Distribution Info */}
        <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-lg border">
          <div>
            <p className="text-gray-600 font-medium">Program</p>
            <p className="text-gray-800">{distribution.ProgramName}</p>
          </div>
          <div>
            <p className="text-gray-600 font-medium">Total Distributed</p>
            <p className="text-gray-800">₱ {Number(distribution.TotalDistributed).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-600 font-medium">Distribution Date</p>
            <p className="text-gray-800">{distribution.DistributionDate}</p>
          </div>
          <div>
            <p className="text-gray-600 font-medium">Remarks</p>
            <p className="text-gray-800">{distribution.Remarks || "None"}</p>
          </div>
        </div>

        {/* Add Farmer Button */}
<div className="flex justify-end mb-4">
  <button
    onClick={openAddFarmerSubsidyModal}
    className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
  >
    <Plus className="w-4 h-4" /> Add Farmer
  </button>
</div>

        {/* Farmers Table */}
        <div className="overflow-x-auto rounded-lg border shadow-sm">
          {farmersLoading ? (
            <p className="text-center text-gray-500 py-4">Loading farmers...</p>
          ) : farmersError ? (
            <p className="text-center text-red-500 py-4">{farmersError}</p>
          ) : (
            <table className="w-full min-w-[600px] text-sm">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="py-3 px-4 text-left">Farmer Name</th>
                  <th className="py-3 px-4 text-left">Contact</th>
                  <th className="py-3 px-4 text-left">Amount Received</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {farmers.length > 0 ? (
                  farmers.map((farmer, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition">
                      <td className="py-3 px-4 font-medium text-gray-800">{farmer.FirstName} {farmer.LastName}</td>
                      <td className="py-3 px-4 text-gray-600">{farmer.ContactNumber || farmer.Email}</td>
                      <td className="py-3 px-4 text-gray-800">₱ {Number(farmer.Amount).toLocaleString()}</td>
                      <td className="py-3 px-4 flex justify-center gap-2">
                        <button className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition text-xs">
                          <DollarSign className="w-3 h-3" /> Distribute
                        </button>
  
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-gray-500">
                      No farmers found for this distribution.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>


{showAddFarmerSubsidyModal && (
  <AddFarmerSubsidyModal
    distributionID={distribution.DistributionID}
    onClose={closeAddFarmerSubsidyModal}
  />
)}



      </div>
    </div>
  );
}