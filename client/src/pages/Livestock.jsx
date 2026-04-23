import { useState, useEffect } from "react";
import { Plus, Info, Edit } from "lucide-react";

import { useLivestock } from "../context/LivestockContext.jsx";

import ViewLivestockModal from "../components/modals/ViewLivestockModal";
import AddLivestockModal from "../components/modals/AddLivestockModal";
import EditLivestockModal from "../components/modals/EditLivestockModal";

import useTable from "../hooks/useTable";
import usePagination from "../hooks/usePagination";

import DataTable from "../components/common/DataTable";
import Pagination from "../components/common/Pagination";

export default function Livestock() {
  const { livestock, loadLivestock, loading, error } = useLivestock();

  const [filter, setFilter] = useState("All");
  const [viewModal, setViewModal] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(null);

  useEffect(() => {
    loadLivestock();
  }, []);

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

  const columns = [
    { key: "Type", label: "Type" },

    {
      key: "Breed",
      label: "Breed",
      render: (item) => (
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
          {item.Breed}

          <button
            onClick={() => setViewModal(item)}
            className="hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded"
          >
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
            className="bg-blue-600 dark:bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700 dark:hover:bg-blue-400 transition-colors"
          >
            <Edit className="w-3 h-3" />
          </button>
        </div>
      ),
    },
  ];

  if (error)
    return (
      <p className="text-red-600 dark:text-red-400 p-4">
        Error: {error}
      </p>
    );

  return (
    <div className="w-full p-4">

      <div className="w-full rounded-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md p-6 space-y-4">

        {/* HEADER (MATCH STAFF STYLE) */}
        <div className="flex flex-wrap justify-between items-center gap-3">

          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            ALL LIVESTOCK
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

            <span className="hidden sm:inline">
              Add Livestock
            </span>
          </button>

        </div>

        {/* TABLE */}
        {loading ? (
          <p className="text-gray-700 dark:text-gray-300">
            Loading Livestock...
          </p>
        ) : (
          <>
            <DataTable
              columns={columns}
              data={currentItems}
              search={search}
              setSearch={setSearch}
              rightActions={
                <div className="flex items-center gap-4 text-sm text-gray-700 dark:text-gray-300">
                  {["All", "Cattle", "Poultry", "Swine", "Goat"].map(
                    (item) => (
                      <label
                        key={item}
                        className="flex items-center gap-1 cursor-pointer"
                      >
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

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
              currentItemsLength={currentItems.length}
              totalItemsLength={filteredData.length}
            />
          </>
        )}

      </div>

      {/* MODALS */}
      <ViewLivestockModal
        livestock={viewModal}
        onClose={() => setViewModal(null)}
      />

      {addModal && (
        <AddLivestockModal
          onClose={() => setAddModal(false)}
          onSuccess={loadLivestock}
        />
      )}

      {editModal && (
        <EditLivestockModal
          selectedLivestock={editModal}
          onClose={() => setEditModal(null)}
          onSuccess={loadLivestock}
        />
      )}

    </div>
  );
}