import { useState, useEffect } from "react";
import {
  Plus,
  HandCoins,
  Trash2,
  ArrowLeft,
  BanknoteX,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { useSubsidyDetails } from "../hooks/useSubsidyDetails";
import { useDistribution } from "../hooks/useDistribution";

import useTable from "../hooks/useTable";
import usePagination from "../hooks/usePagination";

import DataTable from "../components/common/DataTable";
import Pagination from "../components/common/Pagination";

import AddDistributionModal from "../components/modals/AddDistributionModal";
import ActionDistributionModal from "../components/modals/ActionDistributionModal";
import DeleteDistributionModal from "../components/modals/DeleteDistributionModal";

export default function SubsidyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // QUERY
  const { data, isLoading, isError } =
    useSubsidyDetails(id);

  // MUTATIONS
  const {
    createDistributionMutation,
    updateDistributionMutation,
    deleteDistributionMutation,
  } = useDistribution(id);

  // NORMALIZE
  const selectedSubsidy = data?.data ?? data ?? null;

  const farmers = selectedSubsidy?.Farmers ?? [];

  // UI STATE
  const [filter, setFilter] = useState("All");
  const [addModal, setAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [actionModal, setActionModal] = useState(null); 
  const [actionType, setActionType] = useState(null);

  // SEARCH + FILTER
  const {
    search,
    setSearch,
    filteredData,
  } = useTable({
    data: farmers,
    searchFields: [
      "FirstName",
      "LastName",
      "ContactNumber",
    ],
    filterFn: (f) => {
      if (filter === "All") return true;
      if (filter === "Distributed")
        return !!f.IsDistributed;
      if (filter === "Pending")
        return !f.IsDistributed;
      return true;
    },
  });

  // PAGINATION
  const {
    currentPage,
    setCurrentPage,
    currentItems,
    totalPages,
  } = usePagination(filteredData, 10);

  // RESET PAGE
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter, setCurrentPage]);

  

  // ================= LOADING =================
  if (isLoading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950">
      
      <div className="flex flex-col items-center gap-3">

        {/* Spinner */}
        <div className="w-10 h-10 border-4 border-gray-300 dark:border-gray-700 border-t-green-500 rounded-full animate-spin" />

        {/* Text */}
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Loading farmer details...
        </p>

      </div>

    </div>
  );
}

  // ERROR
  if (isError || !selectedSubsidy) {
    return (
      <div className="p-6 text-red-500">
        Subsidy not found
      </div>
    );
  }

  // COMPUTED VALUES
  const totalAmount = Number(
    selectedSubsidy.TotalAmount || 0
  );

  const distributed = farmers.reduce(
    (sum, farmer) =>
      farmer.IsDistributed
        ? sum + Number(farmer.Amount || 0)
        : sum,
    0
  );

  const remaining =
    totalAmount - distributed;

  const totalFarmers =
    farmers.length;

  // TABLE COLUMNS
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
    },
    {
      key: "Amount",
      label: "Amount",
      render: (f) => (
        <span className="text-green-700 dark:text-green-400 font-semibold">
          ₱ {Number(
            f.Amount || 0
          ).toLocaleString()}
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
                onClick={() => {
                  setActionModal(f);
                  setActionType("distribute");
                }}
                className="bg-green-600 text-white px-2 py-1 rounded"
              >
                <HandCoins className="w-3 h-3" />
              </button>

              <button
                onClick={() =>
                  setDeleteModal(f)
                }
                className="bg-red-600 text-white px-2 py-1 rounded"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </>
          ) : (
            <button
                onClick={() => {
                  setActionModal(f);
                  setActionType("cancel");
                }}
                className="bg-yellow-500 text-white px-2 py-1 rounded"
              >
                <BanknoteX className="w-3 h-3" />
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

        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {selectedSubsidy.ProgramName}
          </h1>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Financial overview &
            distribution summary
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">

          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Distribution Date
            </p>
            <p className="font-medium text-gray-800 dark:text-gray-200 mt-1">
              {
                selectedSubsidy.DistributionDate
              }
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
              {totalFarmers}
            </p>
          </div>

        </div>

        <div className="border-t border-gray-200 dark:border-gray-700" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="bg-green-600 rounded-xl p-4">
            <p className="text-xs text-white">
              Distributed Amount
            </p>
            <p className="text-xl font-bold text-white mt-1">
              ₱ {distributed.toLocaleString()}
            </p>
          </div>

          <div className="bg-red-500 rounded-xl p-4">
            <p className="text-xs text-white">
              Remaining Balance
            </p>
            <p className="text-xl font-bold text-white mt-1">
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
            onClick={() =>
              setAddModal(true)
            }
            className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg text-sm"
          >
            <Plus className="w-4 h-4" />
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
            <div className="flex gap-4 text-sm">
              {[
                "All",
                "Pending",
                "Distributed",
              ].map((item) => (
                <label
                  key={item}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  <input
                    type="radio"
                    checked={
                      filter === item
                    }
                    onChange={() =>
                      setFilter(item)
                    }
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
          currentItemsLength={
            currentItems.length
          }
          totalItemsLength={
            filteredData.length
          }
        />
      </div>

      {/* MODALS */}
    {addModal && (
  <AddDistributionModal
    distributionID={id}
    loading={createDistributionMutation.isPending}
    onClose={() => setAddModal(false)}
    onSubmit={(form) =>
      createDistributionMutation.mutate(
        {
          DistributionID: id,
          ...form,
        },
        {
          onSuccess: () => setAddModal(false),
        }
      )
    }
  />
)}


 {actionModal && (
  <ActionDistributionModal
    selectedDistribution={actionModal}
    actionType={actionType}
    onClose={() => {
      setActionModal(null);
      setActionType(null);
    }}
    loading={updateDistributionMutation.isPending}
    onConfirm={() =>
      updateDistributionMutation.mutate(
        {
          id: actionModal.DistributionDetailsID,
          data: {
            IsDistributed: actionType === "distribute" ? 1 : 0,
          },
        },
        {
          onSuccess: () => {
            setActionModal(null);
            setActionType(null);
          },
        }
      )
    }
  />
)}

   {/* DELETE MODAL */}
{deleteModal && (
  <DeleteDistributionModal
    distribution={deleteModal}
    loading={deleteDistributionMutation.isPending}
    onClose={() => setDeleteModal(null)}
    onConfirm={() =>
      deleteDistributionMutation.mutate(
        deleteModal.DistributionDetailsID,
        {
          onSuccess: () => {
            setDeleteModal(null); 
          },
        }
      )
    }
  />
)}


    </div>
  );
}