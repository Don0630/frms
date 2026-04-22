import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSubsidy } from "../context/SubsidyContext.jsx";
import useDebounce from "../hooks/useDebounce";
import usePagination from "../hooks/usePagination";
import Pagination from "../components/common/Pagination";

import AddFarmerSubsidyModal from "../components/modals/AddFarmerSubsidyModal";
import EditDistributionModal from "../components/modals/EditDistributionModal";
import DeleteDistributionModal from "../components/modals/DeleteDistributionModal";

import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Users,
  Plus,
  Search,
  Check,
  Trash2,
  X,
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
    updateDistribution,
    deleteDistribution,
  } = useSubsidy();

  // ---------------- STATE ----------------
  const [selectedSubsidy, setSelectedSubsidy] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const [loadingRow, setLoadingRow] = useState(null);

  const [confirmModal, setConfirmModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [actionType, setActionType] = useState(null);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const [currentPage, setCurrentPage] = useState(1);

  // ---------------- LOAD DATA ----------------
  useEffect(() => {
    loadSubsidy();
  }, []);

  useEffect(() => {
    if (!id) return;

    loadFarmersPerSubsidy(id);
    return () => clearFarmers();
  }, [id]);

  // ---------------- SELECT SUBSIDY ----------------
  useEffect(() => {
    if (!subsidy?.length) return;

    const found = subsidy.find(
      (s) => String(s.DistributionID) === String(id)
    );

    setSelectedSubsidy(found || null);
  }, [subsidy, id]);

  // ---------------- RESET PAGE ----------------
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, farmers]);

  // ---------------- FILTER ----------------
  const filteredFarmers = farmers.filter((f) =>
    `${f.FirstName} ${f.LastName}`
      .toLowerCase()
      .includes(debouncedSearch.toLowerCase()) ||
    f.ContactNumber?.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  // ---------------- PAGINATION ----------------
  const { currentItems, totalPages } = usePagination(
    filteredFarmers,
    10,
    currentPage,
    setCurrentPage
  );

  if (!selectedSubsidy) {
    return <div className="p-6 text-gray-500">Loading subsidy...</div>;
  }

  // ---------------- CALCULATIONS ----------------
  const totalAmount = Number(selectedSubsidy.TotalAmount || 0);
  const distributed = Number(selectedSubsidy.TotalDistributed || 0);
  const remaining = totalAmount - distributed;

  // ---------------- ACTIONS ----------------
  const openActionModal = (f, type) => {
    setSelectedRow(f);
    setActionType(type);
    setConfirmModal(true);
  };

  const openDeleteModal = (f) => {
    setSelectedRow(f);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedRow) return;

    try {
      setLoadingRow(selectedRow.DistributionDetailsID);

      await deleteDistribution(selectedRow.DistributionDetailsID);
      await loadFarmersPerSubsidy(id);
      await loadSubsidy();

      setDeleteModal(false);
      setSelectedRow(null);
    } finally {
      setLoadingRow(null);
    }
  };

  const handleConfirm = async () => {
    if (!selectedRow) return;

    try {
      setLoadingRow(selectedRow.DistributionDetailsID);

      await updateDistribution({
        DistributionDetailsID: selectedRow.DistributionDetailsID,
        IsDistributed: actionType === "distribute" ? 1 : 0,
      });

      await loadFarmersPerSubsidy(id);
      await loadSubsidy();

      setConfirmModal(false);
      setSelectedRow(null);
      setActionType(null);
    } finally {
      setLoadingRow(null);
    }
  };

  return (
    <div className="w-full min-h-screen p-4 space-y-6 bg-gray-100">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-black"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <span className="text-sm text-gray-500">Subsidy Details</span>
      </div>

      {/* SUBSIDY CARD */}
      <div className="w-full bg-white/40 backdrop-blur-md shadow-md rounded-xl p-6 border space-y-4">

        <h1 className="text-2xl font-bold text-gray-800">
          {selectedSubsidy.ProgramName}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">

          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
            <Calendar className="text-green-600" size={18} />
            <div>
              <p className="text-gray-500">Distribution Date</p>
              <p className="font-medium">{selectedSubsidy.DistributionDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
            <DollarSign className="text-blue-600" size={18} />
            <div>
              <p className="text-gray-500">Total Amount</p>
              <p className="font-semibold">₱ {totalAmount.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
            <Users className="text-purple-600" size={18} />
            <div>
              <p className="text-gray-500">Farmers</p>
              <p className="font-semibold">{selectedSubsidy.TotalFarmers || 0}</p>
            </div>
          </div>

        </div>

        {/* SUMMARY */}
        <div className="grid grid-cols-2 gap-4">

          <div className="p-5 rounded-lg bg-green-50 border">
            <p className="text-sm text-gray-500">Distributed</p>
            <p className="text-2xl font-bold text-green-700">
              ₱ {distributed.toLocaleString()}
            </p>
          </div>

          <div className="p-5 rounded-lg bg-yellow-50 border">
            <p className="text-sm text-gray-500">Remaining</p>
            <p className="text-2xl font-bold text-yellow-700">
              ₱ {remaining.toLocaleString()}
            </p>
          </div>

        </div>
      </div>

      {/* FARMERS CARD */}
      <div className="w-full bg-white/40 backdrop-blur-md shadow-md rounded-xl p-6 space-y-4">

        {/* HEADER */}
        <div className="flex items-center justify-between">

          <h2 className="text-lg font-semibold text-gray-700">
            FARMERS DISTRIBUTION
          </h2>

          <button
            onClick={() => setAddModal(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
          >
            <Plus size={16} />
            Add Farmer
          </button>

        </div>

        {/* SEARCH */}
        <div className="flex items-center border rounded-lg px-3 py-2 bg-white w-64">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search farmer..."
            className="ml-2 outline-none text-sm w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* TABLE */}
 {/* TABLE */}
<div className="border rounded-lg bg-white overflow-x-auto">

  <table className="w-full min-w-[700px] text-sm">

    <thead className="bg-gray-100 text-gray-600">
      <tr>
        <th className="py-3 px-2 text-left">Farmer</th>
        <th className="py-3 px-2 text-left">Contact</th>
        <th className="py-3 px-2 text-left">Amount</th>
        <th className="py-3 px-2 text-left">Status</th>
        <th className="py-3 px-2 text-center">Action</th>
      </tr>
    </thead>

   <tbody>
  {currentItems.length === 0 ? (
    <tr>
      <td
        colSpan={5}
        className="text-center py-6 text-gray-500"
      >
        No farmers found.
      </td>
    </tr>
  ) : (
    currentItems.map((f) => (
      <tr
        key={f.DistributionDetailsID}
        className="border-t hover:bg-gray-50"
      >

        <td className="py-2 px-2 font-medium">
          {f.FirstName} {f.LastName}
        </td>

        <td className="py-2 px-2 text-gray-600">
          {f.ContactNumber || "N/A"}
        </td>

        <td className="py-2 px-2 text-green-700 font-semibold">
          ₱ {Number(f.Amount || 0).toLocaleString()}
        </td>

        <td className="py-2 px-2">
          {f.IsDistributed ? (
            <span className="text-green-600 font-medium">
              Distributed
            </span>
          ) : (
            <span className="text-yellow-600 font-medium">
              Pending
            </span>
          )}
        </td>

        <td className="py-2 px-2">
          <div className="flex justify-center gap-2">

            {!f.IsDistributed ? (
              <>
                <button
                  onClick={() => openActionModal(f, "distribute")}
                  className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                >
                  <Check className="w-3 h-3" />
                </button>

                <button
                  onClick={() => openDeleteModal(f)}
                  className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </>
            ) : (
              <button
                onClick={() => openActionModal(f, "cancel")}
                className="bg-orange-600 text-white px-2 py-1 rounded hover:bg-orange-700"
              >
                <X className="w-3 h-3" />
              </button>
            )}

          </div>
        </td>

      </tr>
    ))
  )}
</tbody>

  </table>
</div>

        {/* PAGINATION */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          currentItemsLength={currentItems.length}
          totalItemsLength={filteredFarmers.length}
        />

      </div>

      {/* MODALS */}
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

      <EditDistributionModal
        open={confirmModal}
        type={actionType}
        onCancel={() => setConfirmModal(false)}
        onConfirm={handleConfirm}
      />

      <DeleteDistributionModal
        open={deleteModal}
        onCancel={() => setDeleteModal(false)}
        onConfirm={handleDelete}
      />

    </div>
  );
}