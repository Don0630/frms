import { useState, useEffect } from "react";
import { useCrop } from "../context/CropContext.jsx";
import { Search, Plus, SlidersHorizontal, Settings, Info, Edit } from "lucide-react";

import useTable from "../hooks/useTable";
import usePagination from "../hooks/usePagination";

import DataTable from "../components/common/DataTable";
import Pagination from "../components/common/Pagination";

import ViewCropModal from "../components/modals/ViewCropModal";
import AddCropModal from "../components/modals/AddCropModal";
import EditCropModal from "../components/modals/EditCropModal";

export default function Crops() {
  const { crop, loadCrop, error, loading } = useCrop();

  const [filter, setFilter] = useState("All");
  const [viewModal, setViewModal] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editModal, setEditModal] = useState(null);

  useEffect(() => {
    loadCrop();
  }, []);

  // TABLE LOGIC
  const { search, setSearch, filteredData } = useTable({
    data: crop,
    searchFields: ["CropName"],
    filterFn: (item) =>
      filter === "All" || item.Category === filter,
  });

  const { currentPage, setCurrentPage, currentItems, totalPages } =
    usePagination(filteredData, 10);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter, setCurrentPage]);

  const categories = ["All", ...new Set(crop.map((c) => c.Category))];

  // TABLE COLUMNS
  const columns = [
    {
      key: "CropName",
      label: "Crop Name",
      render: (item) => (
        <div className="flex items-center gap-2">
          {item.CropName}
          <button onClick={() => setViewModal(item)}>
            <Info className="w-4 h-4 text-blue-500" />
          </button>
        </div>
      ),
    },
    { key: "Category", label: "Category" },
    { key: "Season", label: "Season" },
    { key: "AverageYieldPerHectare", label: "Yield (ha)" },
    {
      key: "MarketPrice",
      label: "Price",
      render: (item) => `₱ ${item.MarketPrice}`,
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

  if (error) return <p className="text-red-500 p-4">Error: {error}</p>;

return (
  <div className="w-full p-4 bg-gray-50 dark:bg-gray-950 min-h-screen">

    <div className="w-full rounded-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md p-6 space-y-4">

      {/* HEADER */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          ALL CROPS
        </h2>

        <button
          className="flex items-center gap-2 bg-green-600 dark:bg-green-500 text-white px-4 py-2 rounded-lg text-sm shadow hover:bg-green-700 dark:hover:bg-green-400 transition-colors"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="w-4 h-4" /> Add New Crop
        </button>
      </div>

    {/* TABLE */}
{loading ? (
  <p className="text-gray-700 dark:text-gray-300">Loading Crops...</p>
) : (
  <DataTable
    columns={columns}
    data={currentItems}
    search={search}
    setSearch={setSearch}
    filters={
      <div className="flex gap-4 text-sm items-center text-gray-700 dark:text-gray-300">
        {categories.map((item) => (
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
        ))}
      </div>
    }
  />
)}

      {/* PAGINATION */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        currentItemsLength={currentItems.length}
        totalItemsLength={filteredData.length}
      />

    </div>

    {/* MODALS */}
    {viewModal && (
      <ViewCropModal
        crop={viewModal}
        onClose={() => setViewModal(null)}
      />
    )}

    {showAddModal && (
      <AddCropModal
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          loadCrop();
          setShowAddModal(false);
        }}
      />
    )}

    {editModal && (
      <EditCropModal
        selectedCrop={editModal}
        onClose={() => setEditModal(null)}
        onSuccess={() => {
          loadCrop();
          setEditModal(null);
        }}
      />
    )}
  </div>
);
}