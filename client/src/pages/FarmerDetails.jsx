import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFarmer } from "../context/FarmerContext.jsx";
import {
  MapPin,
  Phone,
  Mail,
  User,
  Plus,
  ArrowLeft,
  Calendar,
  Edit,
  Trash2,
  Layers
} from "lucide-react";

import AddFarmModal from "../components/modals/AddFarmModal";
import EditFarmModal from "../components/modals/EditFarmModal";
import DeleteFarmModal from "../components/modals/DeleteFarmModal";

export default function FarmerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { farmer, loadFarmer, deleteFarm } = useFarmer();

  const [selectedFarmer, setSelectedFarmer] = useState(null);

  const [addFarmModal, setAddFarmModal] = useState(false);
  const [editFarmModal, setEditFarmModal] = useState(null);

  const [deleteFarmModal, setDeleteFarmModal] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Load farmers
  useEffect(() => {
    if (!farmer.length) loadFarmer();
  }, [farmer]);

  // Find selected farmer
  useEffect(() => {
    const found = farmer.find((f) => f.FarmerID == id);
    setSelectedFarmer(found || null);
  }, [farmer, id]);

  if (!selectedFarmer) {
    return <div className="p-6 text-gray-500">Loading farmer details...</div>;
  }

  const farms = selectedFarmer.Farms || [];

  const fullName = `${selectedFarmer.FirstName} ${selectedFarmer.MiddleName || ""} ${selectedFarmer.LastName}`;

  return (
    <>
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

        {/* BACK */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-black"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* FARMER INFO */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h1 className="text-2xl font-bold text-gray-800">{fullName}</h1>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">

            <div className="flex items-center gap-2">
              <User size={16} className="text-orange-500" />
              {selectedFarmer.Gender}
            </div>

            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-blue-500" />
              {selectedFarmer.Barangay}, {selectedFarmer.Municipality}, {selectedFarmer.Province}
            </div>

            <div className="flex items-center gap-2">
              <Phone size={16} className="text-red-500" />
              {selectedFarmer.ContactNumber}
            </div>

            <div className="flex items-center gap-2">
              <Mail size={16} className="text-purple-500" />
              {selectedFarmer.Email}
            </div>

            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-green-500" />
              {selectedFarmer.RegistrationDate}
            </div>

          </div>
        </div>

        {/* FARMS */}
        <div className="bg-white rounded-2xl shadow p-6">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center gap-2">
              <Layers size={18} className="text-green-600" />
              <h2 className="text-lg font-semibold">Farms</h2>
            </div>

            <button
              onClick={() => setAddFarmModal(true)}
              className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700"
            >
              <Plus size={16} />
              Add Farm
            </button>
          </div>

          {/* TABLE */}
          {farms.length === 0 ? (
            <p className="text-gray-500 text-sm">No farms registered yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border rounded-lg overflow-hidden">

                <thead className="bg-gray-100 text-gray-600 text-left">
                  <tr>
                    <th className="p-3">Location</th>
                    <th className="p-3">Size</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {farms.map((farm) => (
                    <tr key={farm.FarmID} className="border-t hover:bg-gray-50">

                      {/* LOCATION */}
                      <td className="p-3">
                        <p className="font-medium text-gray-800">
                          {farm.FarmBarangay}
                        </p>
                        <p className="text-xs text-gray-500">
                          {farm.FarmMunicipality}, {farm.FarmProvince}
                        </p>
                      </td>

                      {/* SIZE */}
                      <td className="p-3 font-semibold text-green-700">
                        {farm.FarmSize} ha
                      </td>

                      {/* ACTIONS */}
                      <td className="p-3">
                        <div className="flex justify-center gap-2">

                          {/* EDIT */}
                          <button
                            onClick={() => setEditFarmModal(farm)}
                            className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                          >
                            <Edit className="w-3 h-3" />
                          </button>

                          {/* DELETE */}
                          <button
                            onClick={() => setDeleteFarmModal(farm)}
                            className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}
        </div>
      </div>

      {/* ADD FARM MODAL */}
      {addFarmModal && (
        <AddFarmModal
          farmer={selectedFarmer}
          onClose={() => setAddFarmModal(false)}
          onSuccess={() => {
            loadFarmer();
            setAddFarmModal(false);
          }}
        />
      )}

      {/* EDIT FARM MODAL */}
      {editFarmModal && (
        <EditFarmModal
          selectedFarm={{
            ...editFarmModal,
            FarmerID: selectedFarmer.FarmerID,
          }}
          onClose={() => setEditFarmModal(null)}
          onSuccess={() => {
            loadFarmer();
            setEditFarmModal(null);
          }}
        />
      )}

      {/* DELETE FARM MODAL */}
      {deleteFarmModal && (
        <DeleteFarmModal
          open={true}
          title="Delete Farm"
          message={`Are you sure you want to delete the farm in ${deleteFarmModal.FarmBarangay}?`}
          loading={deleting}
          onCancel={() => setDeleteFarmModal(null)}
          onConfirm={async () => {
            try {
              setDeleting(true);
              await deleteFarm(deleteFarmModal.FarmID);
              setDeleteFarmModal(null);
              loadFarmer();
            } catch (err) {
              alert("Failed to delete farm");
            } finally {
              setDeleting(false);
            }
          }}
        />
      )}
    </>
  );
}