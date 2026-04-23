import { useState, useEffect } from "react";
import { Plus, HandCoins, Trash2, X, ArrowLeft, BanknoteX } from "lucide-react";
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

  const [filter, setFilter] = useState("All");
  const [selectedSubsidy, setSelectedSubsidy] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const [confirmModal, setConfirmModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [loadingRow, setLoadingRow] = useState(null);

  // ================= LOAD =================
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

  // ================= SEARCH + FILTER (MATCH PROGRAMS PATTERN) =================
  const { search, setSearch, filteredData } = useTable({
    data: farmers,
    searchFields: ["FirstName", "LastName", "ContactNumber"],
    filterFn: (f) => {
      if (filter === "All") return true;
      if (filter === "Distributed") return !!f.IsDistributed;
      if (filter === "Pending") return !f.IsDistributed;
      return true;
    },
  });

  // ================= PAGINATION =================
  const { currentPage, setCurrentPage, currentItems, totalPages } =
    usePagination(filteredData, 10);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter, setCurrentPage]);

  // ================= ACTIONS =================
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

      // reload data
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

      // reload data
      await loadFarmersPerSubsidy(id);
      await loadSubsidy();

      setConfirmModal(false);
      setSelectedRow(null);
      setActionType(null);
    } finally {
      setLoadingRow(null);
    }
  };

  // ================= LOADING =================
  if (!selectedSubsidy) {
    return (
      <div className="p-6 text-gray-500 dark:text-gray-400">
        Loading subsidy...
      </div>
    );
  }

  const totalAmount = Number(selectedSubsidy.TotalAmount || 0);
  const distributed = Number(selectedSubsidy.TotalDistributed || 0);
  const remaining = totalAmount - distributed;

  // ================= TABLE =================
  const columns = [
    {
      key: "farmer",
      label: "Farmer",
      render: (f) => (
        <div className="font-medium text-gray-800 dark:text-gray-200">
          {f.FirstName} {f.LastName}
        </div>
      ),
    },
    {
      key: "ContactNumber",
      label: "Contact",
      render: (f) => (
        <span className="text-gray-700 dark:text-gray-300">
          {f.ContactNumber}
        </span>
      ),
    },
    {
      key: "Amount",
      label: "Amount",
      render: (f) => (
        <span className="text-green-700 dark:text-green-400 font-semibold">
          ₱ {Number(f.Amount || 0).toLocaleString()}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (f) =>
        f.IsDistributed ? (
          <span className="text-green-600 dark:text-green-400 font-medium">
            Distributed
          </span>
        ) : (
          <span className="text-yellow-600 dark:text-yellow-400 font-medium">
            Pending
          </span>
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
                className="bg-green-600 dark:bg-green-500 text-white px-2 py-1 rounded"
              >
                <HandCoins className="w-4 h-4" />
              </button>

              <button
                onClick={() => openDeleteModal(f)}
                className="bg-red-600 dark:bg-red-500 text-white px-2 py-1 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={() => openActionModal(f, "cancel")}
              className="bg-yellow-500 dark:bg-yellow-600 text-white px-2 py-1 rounded"
            >
              <BanknoteX className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="w-full min-h-screen p-4 space-y-6 bg-gray-100 dark:bg-gray-950">

      {/* BACK */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-300"
      >
        <ArrowLeft size={18} /> Back
      </button>

      
 {/* SUBSIDY INFO */}
      <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-md shadow-lg rounded-2xl p-6 border border-gray-200 dark:border-gray-800 space-y-6">

        <div className="flex items-start justify-between">

          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {selectedSubsidy.ProgramName}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Financial overview & distribution summary
            </p>
          </div>

<span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full bg-green-50 text-green-700 dark:bg-green-500/20 dark:text-green-400 border border-green-200 dark:border-green-500/30">
  <span className="w-2 h-2 rounded-full bg-green-500 dark:bg-green-400"></span>
  Active
</span>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">

          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Distribution Date
            </p>
            <p className="font-medium text-gray-800 dark:text-gray-200 mt-1">
              {selectedSubsidy.DistributionDate}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Total Budget
            </p>
            <p className="font-semibold text-gray-800 dark:text-gray-200 mt-1">
              ₱ {totalAmount.toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Farmers Benefited
            </p>
            <p className="font-semibold text-gray-800 dark:text-gray-200 mt-1">
              {selectedSubsidy.TotalFarmers}
            </p>
          </div>

        </div>

        <div className="border-t border-gray-200 dark:border-gray-700"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="bg-green-600 dark:bg-green-600 rounded-xl p-4">
            <p className="text-xs text-gray-100 dark:text-gray-100">
              Distributed Amount
            </p>
            <p className="text-xl font-bold text-gray-100 dark:text-gray-100 mt-1">
              ₱ {distributed.toLocaleString()}
            </p>
          </div>

          <div className="bg-red-500 dark:bg-red-800 rounded-xl p-4">
            <p className="text-xs text-gray-100 dark:text-gray-100">
              Remaining Balance
            </p>
            <p className="text-xl font-bold text-gray-100 dark:text-gray-100 mt-1">
              ₱ {remaining.toLocaleString()}
            </p>
          </div>

        </div>

      </div>


      {/* TABLE */}
      <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-md shadow-md rounded-xl p-6 space-y-4 border border-gray-200 dark:border-gray-800">

        <div className="flex justify-between">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            FARMERS DISTRIBUTION
          </h2>

<button
  onClick={() => setAddModal(true)}
  className="
    flex items-center gap-2
    bg-green-600 dark:bg-green-500
    text-white
    px-3 sm:px-4 py-2
    rounded-lg text-sm shadow
    hover:bg-green-700 dark:hover:bg-green-400
    transition-colors
  "
>
  <Plus className="w-4 h-4" />

  {/* TEXT ONLY ON SM+ */}
  <span className="hidden sm:inline">
    Add Farmer
  </span>
</button>
        </div>

        <DataTable
          columns={columns}
          data={currentItems}
          search={search}
          setSearch={setSearch}
          filters={
            <div className="flex gap-4 text-sm text-gray-700 dark:text-gray-300">
              {["All", "Pending", "Distributed"].map((item) => (
                <label key={item} className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    className="accent-green-600 dark:accent-green-400"
                    checked={filter === item}
                    onChange={() => setFilter(item)}
                  />
                  {item}
                </label>
              ))}
            </div>
          }
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