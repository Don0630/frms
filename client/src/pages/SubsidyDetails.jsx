import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSubsidy } from "../context/SubsidyContext.jsx";
import AddFarmerSubsidyModal from "../components/modals/AddFarmerSubsidyModal";

import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Users,
  CheckCircle2,
  Plus,
} from "lucide-react";

export default function SubsidyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    subsidy,
    loadSubsidy,
    farmers,
    loadFarmersPerSubsidy,
    clearFarmers,
  } = useSubsidy();

  const [selectedSubsidy, setSelectedSubsidy] = useState(null);
  const [addModal, setAddModal] = useState(false);

  // ================= LOAD SUBSIDY =================
  useEffect(() => {
    loadSubsidy();
  }, []);

  // ================= LOAD FARMERS =================
  useEffect(() => {
    if (!id) return;

    loadFarmersPerSubsidy(id);

    return () => clearFarmers(); // prevent stale data
  }, [id]);

  // ================= FIND SUBSIDY =================
  useEffect(() => {
    if (!subsidy?.length) return;

    const found = subsidy.find(
      (s) => String(s.DistributionID) === String(id)
    );

    setSelectedSubsidy(found || null);
  }, [subsidy, id]);

  // ================= LOADING GUARD =================
  if (!selectedSubsidy) {
    return (
      <div className="p-6 text-gray-500">
        Loading subsidy...
      </div>
    );
  }

  // ================= CALCULATIONS =================
  const totalAmount = Number(selectedSubsidy.TotalAmount || 0);
  const distributed = Number(selectedSubsidy.TotalDistributed || 0);
  const remaining = totalAmount - distributed;

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">

      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-black"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <span className="text-sm text-gray-500">
          Subsidy Dashboard
        </span>

      </div>

      {/* ================= SUBSIDY CARD ================= */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">

        <h1 className="text-2xl font-bold text-gray-800">
          {selectedSubsidy.ProgramName}
        </h1>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <Calendar className="text-green-500" size={18} />
            <div>
              <p className="text-gray-500">Distribution Date</p>
              <p className="font-medium text-gray-800">
                {selectedSubsidy.DistributionDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <DollarSign className="text-blue-500" size={18} />
            <div>
              <p className="text-gray-500">Total Amount</p>
              <p className="font-semibold text-gray-800">
                ₱ {totalAmount.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <Users className="text-purple-500" size={18} />
            <div>
              <p className="text-gray-500">Farmers</p>
              <p className="font-semibold text-gray-800">
                {selectedSubsidy.TotalFarmers || 0}
              </p>
            </div>
          </div>

        </div>

        {/* SUMMARY */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="p-5 rounded-xl bg-green-50 border border-green-100">
            <p className="text-gray-500 text-sm">Distributed</p>
            <p className="text-2xl font-bold text-green-700">
              ₱ {distributed.toLocaleString()}
            </p>
          </div>

          <div className="p-5 rounded-xl bg-yellow-50 border border-yellow-100">
            <p className="text-gray-500 text-sm">Remaining</p>
            <p className="text-2xl font-bold text-yellow-700">
              ₱ {remaining.toLocaleString()}
            </p>
          </div>

        </div>
      </div>

      {/* ================= FARMERS CARD ================= */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">

          <div className="flex items-center gap-2">
            <Users className="text-green-600" size={18} />
            <h2 className="text-lg font-semibold text-gray-800">
              Farmers Distribution
            </h2>
          </div>

          <button
            onClick={() => setAddModal(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm"
          >
            <Plus size={16} />
            Add Farmer
          </button>

        </div>

        {/* TABLE */}
        {farmers.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No farmers assigned yet.
          </p>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="p-3">Farmer</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>

              <tbody>
                {farmers.map((f) => (
                  <tr
                    key={f.FarmerID}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="p-3 font-medium text-gray-800">
                      {f.FirstName} {f.LastName}
                    </td>

                    <td className="p-3 text-gray-600">
                      {f.ContactNumber || "N/A"}
                    </td>

                    <td className="p-3 font-semibold text-green-700">
                      ₱ {Number(f.Amount || 0).toLocaleString()}
                    </td>

                    <td className="p-3 text-center">
                      {f.IsDistributed ? (
                        <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                          <CheckCircle2 size={14} />
                          Distributed
                        </span>
                      ) : (
                        <span className="text-yellow-600 font-medium">
                          Pending
                        </span>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        )}
      </div>

      {/* ================= MODAL ================= */}
      {addModal && (
        <AddFarmerSubsidyModal
          distributionID={id}
          onClose={() => setAddModal(false)}
          onSuccess={() => {
            loadFarmersPerSubsidy(id);
            loadSubsidy();
          }}
        />
      )}

    </div>
  );
}