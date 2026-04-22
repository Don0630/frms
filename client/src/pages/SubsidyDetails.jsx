import { useState, useEffect } from "react";
import { Plus, Check, Trash2, X, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { useSubsidy } from "../context/SubsidyContext.jsx";

import useTable from "../hooks/useTable";
import usePagination from "../hooks/usePagination";

import DataTable from "../components/common/DataTable";
import Pagination from "../components/common/Pagination";

import AddFarmerSubsidyModal from "../components/modals/AddFarmerSubsidyModal";
import EditDistributionModal from "../components/modals/EditDistributionModal";
import DeleteDistributionModal from "../components/modals/DeleteDistributionModal";

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

  const [selectedSubsidy, setSelectedSubsidy] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const [confirmModal, setConfirmModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [loadingRow, setLoadingRow] = useState(null);

  // LOAD DATA
  useEffect(() => {
    loadSubsidy();
  }, []);

  useEffect(() => {
    if (!id) return;

    loadFarmersPerSubsidy(id);
    return () => clearFarmers();
  }, [id]);

  useEffect(() => {
    const found = subsidy?.find(
      (s) => String(s.DistributionID) === String(id)
    );
    setSelectedSubsidy(found || null);
  }, [subsidy, id]);

  // TABLE LOGIC
  const { search, setSearch, filteredData } = useTable({
    data: farmers,
    searchFields: ["FirstName", "LastName", "ContactNumber"],
  });

  const {
    currentPage,
    setCurrentPage,
    currentItems,
    totalPages,
  } = usePagination(filteredData, 10);

  // ✅ FIX: reset pagination properly
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filteredData, setCurrentPage]);

  // ACTIONS
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

  if (!selectedSubsidy) {
    return <div className="p-6 text-gray-500">Loading subsidy...</div>;
  }

  const totalAmount = Number(selectedSubsidy.TotalAmount || 0);
  const distributed = Number(selectedSubsidy.TotalDistributed || 0);
  const remaining = totalAmount - distributed;

  const columns = [
    {
      key: "farmer",
      label: "Farmer",
      render: (f) => (
        <div className="font-medium">
          {f.FirstName} {f.LastName}
        </div>
      ),
    },
    { key: "ContactNumber", label: "Contact" },
    {
      key: "Amount",
      label: "Amount",
      render: (f) => (
        <span className="text-green-700 font-semibold">
          ₱ {Number(f.Amount || 0).toLocaleString()}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (f) =>
        f.IsDistributed ? (
          <span className="text-green-600 font-medium">Distributed</span>
        ) : (
          <span className="text-yellow-600 font-medium">Pending</span>
        ),
    },
    {
      key: "actions",
      label: "",
      render: (f) => (
        <div className="flex justify-center gap-2">
          {!f.IsDistributed ? (
            <>
              <button
                onClick={() => openActionModal(f, "distribute")}
                className="bg-green-600 text-white px-2 py-1 rounded"
              >
                <Check className="w-3 h-3" />
              </button>

              <button
                onClick={() => openDeleteModal(f)}
                className="bg-red-600 text-white px-2 py-1 rounded"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </>
          ) : (
            <button
              onClick={() => openActionModal(f, "cancel")}
              className="bg-orange-600 text-white px-2 py-1 rounded"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="w-full min-h-screen p-4 space-y-6 bg-gray-100">

      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600"
        >
          <ArrowLeft size={18} /> Back
        </button>
      </div>

      {/* SUBSIDY INFO */}
{/* SUBSIDY INFO - CLEAN PRO SINGLE CARD */}
<div className="bg-white/60 backdrop-blur-md shadow-lg rounded-2xl p-6 border space-y-6">

  {/* HEADER */}
  <div className="flex items-start justify-between">

    <div>
      <h1 className="text-2xl font-bold text-gray-800">
        {selectedSubsidy.ProgramName}
      </h1>
      <p className="text-sm text-gray-500 mt-1">
        Financial overview & distribution summary
      </p>
    </div>

    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
      Active
    </span>

  </div>

  {/* MAIN INFO ROW */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">

    <div>
      <p className="text-xs text-gray-500">Distribution Date</p>
      <p className="font-medium text-gray-800 mt-1">
        {selectedSubsidy.DistributionDate}
      </p>
    </div>

    <div>
      <p className="text-xs text-gray-500">Total Budget</p>
      <p className="font-semibold text-gray-800 mt-1">
        ₱ {totalAmount.toLocaleString()}
      </p>
    </div>

    <div>
      <p className="text-xs text-gray-500">Farmers Benefited</p>
      <p className="font-semibold text-gray-800 mt-1">
        {selectedSubsidy.TotalFarmers}
      </p>
    </div>

  </div>

  {/* DIVIDER */}
  <div className="border-t"></div>

  {/* FINANCIAL SUMMARY (CLEAN GRID) */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

    {/* DISTRIBUTED */}
    <div className="bg-green-50 border border-green-100 rounded-xl p-4">
      <p className="text-xs text-gray-500">Distributed Amount</p>
      <p className="text-xl font-bold text-green-700 mt-1">
        ₱ {distributed.toLocaleString()}
      </p>
      <p className="text-xs text-gray-500 mt-2">
        Funds already released to beneficiaries
      </p>
    </div>

    {/* REMAINING */}
    <div className="bg-red-50 border border-red-100 rounded-xl p-4">
      <p className="text-xs text-gray-500">Remaining Balance</p>
      <p className="text-xl font-bold text-red-600 mt-1">
        ₱ {remaining.toLocaleString()}
      </p>
      <p className="text-xs text-gray-500 mt-2">
        Pending allocation for distribution
      </p>
    </div>

  </div>

</div>

      {/* TABLE */}
      <div className="bg-white/60 backdrop-blur-md shadow-md rounded-xl p-6 space-y-4">

        <div className="flex justify-between">
          <h2 className="text-lg font-semibold">
            FARMERS DISTRIBUTION
          </h2>

          <button
            onClick={() => setAddModal(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm shadow hover:bg-green-700"
          >
            <Plus className="w-4 h-4" /> Add Farmer
          </button>
        </div>

        <DataTable
          columns={columns}
          data={currentItems}
          search={search}
          setSearch={setSearch}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          currentItemsLength={currentItems.length}
          totalItemsLength={filteredData.length}
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