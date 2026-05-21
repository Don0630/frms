import { useState, useEffect } from "react";
import { showErrorToast, showSuccessToast } from "../utils/toastUtility";
import { Plus, Info, Edit } from "lucide-react";

import {
 pageButtonPrimary
} from "../components/common/PageUI";

import useLivestock from "../hooks/useLivestock";

import ViewLivestockModal from "../components/modals/ViewLivestockModal";
import AddLivestockModal from "../components/modals/AddLivestockModal";
import EditLivestockModal from "../components/modals/EditLivestockModal";

import useTable from "../hooks/useTable";
import usePagination from "../hooks/usePagination";

import DataTable from "../components/common/DataTable";
import Pagination from "../components/common/Pagination";
import TablePageSkeleton from "../components/skeletons/TablePageSkeleton";

export default function Livestock() {
  const [filter, setFilter] = useState("All");
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [viewModal, setViewModal] = useState(null);

  // ================= USE LIVESTOCK HOOK =================
  const {
    livestockQuery,
    createLivestockMutation,
    updateLivestockMutation,
  } = useLivestock();

  // ================= DATA =================
  const livestock = livestockQuery.data?.data || [];

  // ================= TABLE FILTER  =================
  const { search, setSearch, filteredData } = useTable({
    data: livestock,
    searchFields: ["Breed", "Type"],
    filterFn: (item) =>
      filter === "All" || item.Type === filter,
  });

  // ================= PAGINATION =================
  const { currentPage, setCurrentPage, currentItems, totalPages } 
  = usePagination(filteredData, 10);

  // ================= RESET PAGE =================
useEffect(() => {
  setCurrentPage(1);
}, [search, filter]);


// ================= ERROR =================
useEffect(() => {
  if (livestockQuery.isError) {
    const code = livestockQuery.error?.response?.data?.code;
    const message = livestockQuery.error?.response?.data?.message;

    if (code === "NOT_FOUND") return;
    showErrorToast(message);
  }
}, [livestockQuery.isError]);


  // ================= TABLE COLUMNS =================
  const columns = [
    { key: "Type", label: "Type" },

    {
      key: "Breed",
      label: "Breed",
      render: (item) => (
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
          {item.Breed}

          <button onClick={() => setViewModal(item)} className="hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded">
            <Info className="w-4 h-4 text-green-600 dark:text-green-400" />
          </button>
        </div>
      ),
    },

    {
      key: "AverageProduction",
      label: "Avg Production",
      render: (item) => (
        <span className="text-gray-700 dark:text-gray-300">
          {item.AverageProduction}
        </span>
      ),
    },

    {
      key: "MarketPrice",
      label: "Price",
      render: (item) => (
        <span className="text-gray-700 dark:text-gray-300">
          ₱ {item.MarketPrice}
        </span>
      ),
    },

    {
      key: "actions",
      label: "",
      render: (item) => (
        <div className="flex justify-center">
          <button
            onClick={() => setEditModal(item)}
            className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
          >
            <Edit className="w-3 h-3" />
          </button>
        </div>
      ),
    },
  ];

  // ================= LOADING =================
  if (livestockQuery.isLoading) return <TablePageSkeleton />;


  return (
    <div className="w-full px-4">

      <div className="w-full rounded-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md p-6 space-y-4">

        {/* HEADER */}
        <div className="flex justify-between items-center">

          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            ALL LIVESTOCK
          </h2>

           <button
            onClick={() => setAddModal(true)}
            className={pageButtonPrimary}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Livestock</span>
          </button>

        </div>

        {/* TABLE */}
        <DataTable
          columns={columns}
          data={currentItems}
          search={search}
          setSearch={setSearch}
          filters={
            <div className="flex gap-4 text-sm">
              {["All", "Cattle", "Poultry", "Swine", "Goat"].map(
                (item) => (
                  <label key={item} className="flex items-center gap-1">
                    <input
                      type="radio"
                      className="accent-green-600 dark:accent-green-400"
                      checked={filter === item}
                      onChange={() => setFilter(item)}
                    />
                    {item}
                  </label>
                )
              )}
            </div>
          }
        />

        {/* PAGINATION */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          currentItemsLength={currentItems.length}
          totalItemsLength={filteredData.length}
        />

      </div>

      {/* ================= MODALS ================= */}

      {/* VIEW */}
      {viewModal && (
        <ViewLivestockModal
          livestock={viewModal}
          onClose={() => setViewModal(null)}
        />
      )}

{/* ADD */}
{addModal && (
  <AddLivestockModal
    onClose={() => setAddModal(false)}
    onSubmit={(data) =>
      createLivestockMutation.mutateAsync(data).then((res) => {
        setAddModal(false);
        showSuccessToast(res.message);
      }).catch((error) => {
        throw error;
      })
    }
    loading={createLivestockMutation.isPending}
  />
)}

{/* EDIT */}
{editModal && (
  <EditLivestockModal
    selectedLivestock={editModal}
    onClose={() => setEditModal(null)}
    onSubmit={(data) =>
      updateLivestockMutation.mutateAsync({ id: editModal.LivestockID, data }).then((res) => {
        setEditModal(null);
        showSuccessToast(res.message);
      }).catch((error) => {
        throw error;
      })
    }
    loading={updateLivestockMutation.isPending}
  />
)}

    </div>
  );
}