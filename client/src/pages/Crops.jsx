import { useState, useEffect } from "react";
import { showErrorToast, showSuccessToast } from "../utils/toastUtility";
import { Plus, Info, Edit, CloudRain, Sun, CalendarDays } from "lucide-react";

import {
 pageButtonPrimary
} from "../components/common/PageUI";

import useCrop from "../hooks/useCrop";
import useTable from "../hooks/useTable";
import usePagination from "../hooks/usePagination";

import DataTable from "../components/common/DataTable";
import Pagination from "../components/common/Pagination";
import TablePageSkeleton from "../components/skeletons/TablePageSkeleton";
 
import AddCropModal from "../components/modals/AddCropModal";
import EditCropModal from "../components/modals/EditCropModal";

export default function Crops() {
  const {
    cropsQuery,
    createCropMutation,
    updateCropMutation,
  } = useCrop();

  const crop = cropsQuery.data?.data || [];

  const [filter, setFilter] = useState("All"); 
  const [showAddModal, setShowAddModal] = useState(false);
  const [editModal, setEditModal] = useState(null);

  const { search, setSearch, filteredData } = useTable({
    data: crop,
    searchFields: ["CropName"],
    filterFn: (item) =>
      filter === "All" || item.Category === filter,
  });

  const { currentPage, setCurrentPage, currentItems, totalPages } =
    usePagination(filteredData, 10);


// ================= ERROR =================
useEffect(() => {
  if (cropsQuery.isError) {
    const code = cropsQuery.error?.response?.data?.code;
    const message = cropsQuery.error?.response?.data?.message;

    if (code === "NOT_FOUND") return;
    showErrorToast(message);
  }
}, [cropsQuery.isError]);


  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter]);

  const categories = ["All", ...new Set(crop.map((c) => c.Category))];


  const getSeasonIcon = (season) => {
    if (season?.toLowerCase() === "wet")
      return <CloudRain className="w-4 h-4 text-blue-500" />;
    if (season?.toLowerCase() === "dry")
      return <Sun className="w-4 h-4 text-yellow-500" />;
    return <CalendarDays className="w-4 h-4 text-green-500 dark:text-green-400" />;
  };



  const columns = [
    {
      key: "CropName",
      label: "Crop Name",
      render: (item) => (
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
          {item.CropName}

         
        </div>
      ),
    },
    {
      key: "Category",
      label: "Category",
      render: (item) => (
        <span className="text-gray-700 dark:text-gray-300">
          {item.Category}
        </span>
      ),
    },
    {
      key: "Season",
      label: "Season",
      render: (item) => (
        <span className="text-gray-700 dark:text-gray-300">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
          {getSeasonIcon(item.Season)} {item.Season}
        </div>
        </span>
      ),
    },
    {
      key: "AverageYieldPerHectare",
      label: "Yield (ha)",
      render: (item) => (
        <span className="text-green-600 dark:text-green-500 font-medium">
          {item.AverageYieldPerHectare}
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
 if (cropsQuery.isLoading) {
  return <TablePageSkeleton />;
}


 
  return (
    <div className="w-full px-4">

      <div className="w-full rounded-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md p-6 space-y-4">

        {/* HEADER */}
        <div className="flex flex-wrap justify-between items-center gap-3">

          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            ALL CROPS
          </h2>

          <button
            onClick={() => setShowAddModal(true)}
            className={pageButtonPrimary}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Crop</span>
          </button>

        </div>

        {/* TABLE */}
        <DataTable
          columns={columns}
          data={currentItems}
          search={search}
          setSearch={setSearch}
          filters={
            <div className="flex gap-4 text-sm text-gray-700 dark:text-gray-300">
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

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          currentItemsLength={currentItems.length}
          totalItemsLength={filteredData.length}
        />

      </div>

      {/* MODALS */}
 

{showAddModal && (
  <AddCropModal
    onClose={() => setShowAddModal(false)}
    onSubmit={(data) =>
      createCropMutation.mutateAsync(data).then((res) => {
        setShowAddModal(false);
        showSuccessToast(res.message);
      }).catch((error) => {
        throw error;
      })
    }
    loading={createCropMutation.isPending}
  />
)}

{editModal && (
  <EditCropModal
    selectedCrop={editModal}
    onClose={() => setEditModal(null)}
    onSubmit={(data) =>
      updateCropMutation.mutateAsync({ id: editModal.CropID, data }).then((res) => {
        setEditModal(null);
        showSuccessToast(res.message);
      }).catch((error) => {
        throw error;
      })
    }
    loading={updateCropMutation.isPending}
  />
)}

    </div>
  );
}