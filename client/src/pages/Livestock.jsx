import { useState } from "react";
import { Plus, Info, Edit } from "lucide-react";

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

  const livestock = livestockQuery.data?.data || [];

  // ================= FILTER + SEARCH =================
  const { search, setSearch, filteredData } = useTable({
    data: livestock,
    searchFields: ["Breed", "Type"],
    filterFn: (item) =>
      filter === "All" || item.Type === filter,
  });

  // ================= PAGINATION =================
  const {
    currentPage,
    setCurrentPage,
    currentItems,
    totalPages,
  } = usePagination(filteredData, 10);

  // reset page when filter/search changes
  useState(() => {
    setCurrentPage(1);
  }, [search, filter]);

  // ================= TABLE COLUMNS =================
  const columns = [
    { key: "Type", label: "Type" },

    {
      key: "Breed",
      label: "Breed",
      render: (item) => (
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
          {item.Breed}

          <button onClick={() => setViewModal(item)}>
            <Info className="w-4 h-4 text-blue-500" />
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
  if (livestockQuery.isLoading) {
    return <TablePageSkeleton />;
  }

  // ================= ERROR =================
  if (livestockQuery.isError) {
    return (
      <p className="p-4 text-red-500">
        {livestockQuery.error.message}
      </p>
    );
  }

  return (
    <div className="w-full min-h-screen p-4 bg-gray-100 dark:bg-gray-950">

      <div className="w-full rounded-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md p-6 space-y-4">

        {/* HEADER */}
        <div className="flex justify-between items-center">

          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            ALL LIVESTOCK
          </h2>

           <button
            onClick={() => setAddModal(true)}
            className="flex items-center gap-2 bg-green-600 dark:bg-green-500 text-white px-3 sm:px-4 py-2 rounded-lg text-sm shadow hover:bg-green-700 dark:hover:bg-green-400"
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
            createLivestockMutation.mutate(data, {
              onSuccess: () => setAddModal(false),
            })
          }
          loading={createLivestockMutation.isPending}
        />
      )}

      {/* EDIT (FARMER PATTERN STYLE FIX) */}
      {editModal && (
        <EditLivestockModal
          selectedLivestock={editModal}
          onClose={() => setEditModal(null)}
          onSubmit={(data) =>
            updateLivestockMutation.mutate(
              {
                id: editModal.LivestockID,
                data,
              },
              {
                onSuccess: () => setEditModal(null),
              }
            )
          }
          loading={updateLivestockMutation.isPending}
        />
      )}

    </div>
  );
}