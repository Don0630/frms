import { useState, useEffect } from "react";
import { showErrorToast, showSuccessToast } from "../utils/toastUtility";
import { Plus, Edit, Trash2 } from "lucide-react";

import { pageButtonPrimary } from "../components/common/PageUI";

import useLivestock from "../hooks/useLivestock";

import AddLivestockModal from "../components/modals/AddLivestockModal";
import EditLivestockModal from "../components/modals/EditLivestockModal";
import DeleteLivestockModal from "../components/modals/DeleteLivestockModal";

import useTable from "../hooks/useTable";
import usePagination from "../hooks/usePagination";

import DataTable from "../components/common/DataTable";
import Pagination from "../components/common/Pagination";
import TablePageSkeleton from "../components/skeletons/TablePageSkeleton";

export default function Livestock() {
  const [filter, setFilter] = useState("All");
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);

  const {
    livestockQuery,
    createLivestockMutation,
    updateLivestockMutation,
    deleteLivestockMutation,
  } = useLivestock();

  const livestock = livestockQuery.data?.data || [];

  const { search, setSearch, filteredData } = useTable({
    data: livestock,
    searchFields: ["Breed", "Type"],
    filterFn: (item) => filter === "All" || item.Type === filter,
  });

  const { currentPage, setCurrentPage, currentItems, totalPages } =
    usePagination(filteredData, 10);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter]);

  useEffect(() => {
    if (livestockQuery.isError) {
      const code = livestockQuery.error?.response?.data?.code;
      const message = livestockQuery.error?.response?.data?.message;
      if (code === "NOT_FOUND") return;
      showErrorToast(message);
    }
  }, [livestockQuery.isError]);

  const columns = [
    { key: "Type", label: "Type" },
    {
      key: "Breed",
      label: "Breed",
      render: (item) => (
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
          {item.Breed}
        </div>
      ),
    },
    {
      key: "AverageProduction",
      label: "Avg Production",
      render: (item) => (
        <span className="text-green-600 dark:text-green-500 font-medium">
          {item.AverageProduction}
        </span>
      ),
    },
    {
      key: "MarketPrice",
      label: "Price",
      render: (item) => (
        <span className="text-green-600 dark:text-green-500 font-medium">
          ₱ {item.MarketPrice}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (item) => (
        <div className="flex justify-center gap-1">
          <button
            onClick={() => setEditModal(item)}
            className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
          >
            <Edit className="w-3 h-3" />
          </button>
          <button
            onClick={() => setDeleteModal(item)}
            className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      ),
    },
  ];

  if (livestockQuery.isLoading) return <TablePageSkeleton />;

  return (
    <div className="w-full px-4">
      <div className="w-full rounded-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md p-6 space-y-4">

        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            ALL LIVESTOCK
          </h2>
          <button onClick={() => setAddModal(true)} className={pageButtonPrimary}>
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Livestock</span>
          </button>
        </div>

        <DataTable
          columns={columns}
          data={currentItems}
          search={search}
          setSearch={setSearch}
          filters={
            <div className="flex gap-4 text-sm">
              {["All", "Cattle", "Poultry", "Swine", "Goat"].map((item) => (
                <label key={item} className="flex items-center gap-1">
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

      {/* ADD */}
      {addModal && (
        <AddLivestockModal
          onClose={() => setAddModal(false)}
          loading={createLivestockMutation.isPending}
          onSubmit={(data) =>
            createLivestockMutation.mutateAsync(data)
              .then((res) => { setAddModal(false); showSuccessToast(res.message); })
          }
        />
      )}

      {/* EDIT */}
      {editModal && (
        <EditLivestockModal
          selectedLivestock={editModal}
          onClose={() => setEditModal(null)}
          loading={updateLivestockMutation.isPending}
          onSubmit={(data) =>
            updateLivestockMutation.mutateAsync({ id: editModal.LivestockID, data })
              .then((res) => { setEditModal(null); showSuccessToast(res.message); })
          }
        />
      )}

      {/* DELETE */}
      {deleteModal && (
        <DeleteLivestockModal
          livestock={deleteModal}
          onClose={() => setDeleteModal(null)}
          loading={deleteLivestockMutation.isPending}
          onConfirm={() =>
            deleteLivestockMutation.mutateAsync(deleteModal.LivestockID)
              .then((res) => { setDeleteModal(null); showSuccessToast(res.message); })
              .catch(() => {})
          }
        />
      )}

    </div>
  );
}