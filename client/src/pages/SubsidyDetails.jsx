import { useState, useEffect } from "react";
import {
  Plus,
  HandCoins,
  Trash2, 
  BanknoteX,
  Mars, Venus, Users, ArrowLeft
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "../utils/toastUtility";
import { formatDateNumeric } from "../utils/pageUtility";

import {
 pageButtonPrimary, pageButtonGhost
} from "../components/common/PageUI";

import { useSubsidyDetails } from "../hooks/useSubsidyDetails";
import { useDistribution } from "../hooks/useDistribution";

import useTable from "../hooks/useTable";
import usePagination from "../hooks/usePagination";

import DataTable from "../components/common/DataTable";
import Pagination from "../components/common/Pagination";

import AddDistributionModal from "../components/modals/AddDistributionModal";
import ActionDistributionModal from "../components/modals/ActionDistributionModal";
import DeleteDistributionModal from "../components/modals/DeleteDistributionModal";
import TablePageSkeleton from "../components/skeletons/TablePageSkeleton";

export default function SubsidyDetails() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [filter, setFilter] = useState("All");
  const [addModal, setAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [actionModal, setActionModal] = useState(null); 
  const [actionType, setActionType] = useState(null);

 // ================= DATA =================
  const subsidyDetailsQuery = useSubsidyDetails(id);
  const { createDistributionMutation, 
          updateDistributionMutation, 
          deleteDistributionMutation,
  } = useDistribution(id);
  
  const subsidy = subsidyDetailsQuery?.data?.data ?? null;
  const farmers = subsidy?.Farmers ?? [];
  
  const totalAmount = Number(subsidy?.TotalAmount || 0);
  const distributed = Number(subsidy?.DistributedAmount || 0);
  const remaining = Number(subsidy?.RemainingBalance || 0);
  const unassigned = Number(subsidy?.UnassignedAmount || 0);
  const totalFarmers = subsidy?.TotalFarmers;

 // ================= TABLE =================
  const { search, setSearch, filteredData } = useTable({
    data: farmers,
    searchFields: ["FirstName", "LastName", "ContactNumber"],
    filterFn: (f) => {
      if (filter === "All") return true;
      if (filter === "Distributed")
        return !!f.IsDistributed;
      if (filter === "Pending")
        return !f.IsDistributed;
      return true;
    },
  });

// ================= PAGINATION =================
  const { currentPage, setCurrentPage, currentItems, totalPages } = 
  usePagination(filteredData, 10);
 
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter, setCurrentPage]);

  // ================= ERROR =================
useEffect(() => {
  if (subsidyDetailsQuery.isError) {
    const code = subsidyDetailsQuery.error?.response?.data?.code;
    const message = subsidyDetailsQuery.error?.response?.data?.message;

    if (code === "NOT_FOUND") return;
    showErrorToast(message);
  }
}, [subsidyDetailsQuery.isError]);

  const getGenderIcon = (gender) => {
  if (gender?.toLowerCase() === "male")
    return <Mars className="w-4 h-4 text-blue-500" />;
  if (gender?.toLowerCase() === "female")
      return <Venus className="w-4 h-4 text-pink-500" />;
    return <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />;
  };

  // TABLE COLUMNS
  const columns = [
    {
      key: "farmer",
      label: "Farmer",
      render: (f) => (
<div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
  {getGenderIcon(f.Gender)}
  {f.FirstName} {f.MiddleName ? `${f.MiddleName[0]}.` : ""} {f.LastName}
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
                className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
              >
                <HandCoins className="w-3 h-3" />
              </button>

              <button
                onClick={() =>
                  setDeleteModal(f)
                }
                className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
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
                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
              >
                <BanknoteX className="w-3 h-3" />
              </button>
          )}
        </div>
      ),
    },
  ];


// ================= LOADING =================
  if (subsidyDetailsQuery.isLoading) return <TablePageSkeleton />;


  return (
    <div className="w-full px-4">
      <div className="w-full rounded-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md p-6 space-y-4">

  <div className="flex justify-between items-start">
  <div>
    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
      {subsidy.ProgramName}
    </h1>
    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
      Financial overview & distribution summary
    </p>
  </div>
  <button onClick={() => navigate(-1)} className={pageButtonGhost}>
    <ArrowLeft className="w-4 h-4" />
    <span className="hidden sm:inline">Back</span>
  </button>
</div>
 

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">

          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Distribution Date
            </p>
            <p className="font-medium text-gray-800 dark:text-gray-200 mt-1">
              {
                formatDateNumeric(subsidy.DistributionDate)
              }
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          
          <div className="bg-blue-500 rounded-xl p-4">
            <p className="text-xs text-white">
              Total Amount
            </p>
            <p className="text-xl font-bold text-white mt-1">
              ₱ {totalAmount.toLocaleString()}
            </p>
          </div>

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

          <div className="bg-orange-500 rounded-xl p-4">
            <p className="text-xs text-white">
              Unassigned Amount
            </p>
            <p className="text-xl font-bold text-white mt-1">
              ₱ {unassigned.toLocaleString()}
            </p>
          </div>

        </div>
      </div>

      {/* TABLE */} 
      <div className="w-full rounded-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md p-6 space-y-4">

        <div className="flex justify-between">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            FARMERS DISTRIBUTION
          </h2>

          <button
            onClick={() =>
              setAddModal(true)
            }
            className={pageButtonPrimary}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">
              Add Distribution
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
                    className="accent-green-600 dark:accent-green-400"
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

{/* ADD MODAL */}
{addModal && (
  <AddDistributionModal
    distributionID={id}
    loading={createDistributionMutation.isPending}
    remainingAmount={subsidy.UnassignedAmount}
    onClose={() => setAddModal(false)}
    onSubmit={(form) =>
      createDistributionMutation.mutateAsync({
        DistributionID: id,
        ...form,
      }).then((res) => {
        setAddModal(false);
        showSuccessToast(res.message);
      }).catch((error) => {
        throw error;
      })
    }
  />
)}

{/* ADD MODAL */}
{addModal && (
  <AddDistributionModal
    distributionID={id}
    loading={createDistributionMutation.isPending}
    remainingAmount={subsidy.UnassignedAmount}
    onClose={() => setAddModal(false)}
    onSubmit={(form) =>
      createDistributionMutation.mutate({ DistributionID: id, ...form }, {
        onSuccess: (res) => { setAddModal(false); showSuccessToast(res.message); }
      })
    }
  />
)}

{/* ACTION MODAL */}
{actionModal && (
  <ActionDistributionModal
    selectedDistribution={actionModal}
    actionType={actionType}
    onClose={() => { setActionModal(null); setActionType(null); }}
    loading={updateDistributionMutation.isPending}
    onConfirm={() =>
      updateDistributionMutation.mutate({
        id: actionModal.DistributionDetailsID,
        data: { IsDistributed: actionType === "distribute" ? 1 : 0 },
      }, {
        onSuccess: () => {
          setActionModal(null);
          setActionType(null);
          showSuccessToast(
            actionType === "distribute"
              ? "Subsidy distributed successfully!"
              : "Distribution cancelled successfully!"
          );
        }
      })
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
      deleteDistributionMutation.mutate(deleteModal.DistributionDetailsID, {
        onSuccess: (res) => { setDeleteModal(null); showSuccessToast(res.message); }
      })
    }
  />
)}

    </div>
  );
}
