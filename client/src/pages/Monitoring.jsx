import { useState, useEffect } from "react";
import { Search, Plus, SlidersHorizontal, Settings, Info, Mars, Venus, Users } from "lucide-react";

import { useMonitoring } from "../context/MonitoringContext";
import ViewMonitoringModal from "../components/modals/ViewMonitoringModal";
import AddMonitoringModal from "../components/modals/AddMonitoringModal";

import useTable from "../hooks/useTable";
import usePagination from "../hooks/usePagination";

import DataTable from "../components/common/DataTable";
import Pagination from "../components/common/Pagination";

export default function Monitoring() {
  const { monitoring, loadMonitoring, loading, error } = useMonitoring();

  const [filter, setFilter] = useState("All");
  const [viewModal, setViewModal] = useState(null);
  const [addMonitoringModal, setAddMonitoringModal] = useState(false);

  useEffect(() => {
    loadMonitoring();
  }, []);

  const { search, setSearch, filteredData } = useTable({
    data: monitoring,
    searchFields: ["FirstName", "LastName", "CropName", "Breed"],
    filterFn: (item) =>
      filter === "All" || item.Gender?.toLowerCase() === filter.toLowerCase(),
  });

  const { currentPage, setCurrentPage, currentItems, totalPages } =
    usePagination(filteredData, 10);

  const getGenderIcon = (gender) => {
    if (gender?.toLowerCase() === "male")
      return <Mars className="w-4 h-4 text-blue-500" />;
    if (gender?.toLowerCase() === "female")
      return <Venus className="w-4 h-4 text-pink-500" />;
    return <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />;
  };

  const columns = [
    {
      key: "farmer",
      label: "Farmer",
      render: (item) => (
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
          {getGenderIcon(item.Gender)}
          {item.FirstName ? `${item.FirstName} ${item.LastName}` : "N/A"}
        </div>
      ),
    },
    {
      key: "CropName",
      label: "Crop",
      render: (i) => (
        <span className="text-gray-700 dark:text-gray-300">
          {i.CropName || "-"}
        </span>
      ),
    },
    {
      key: "Breed",
      label: "Livestock",
      render: (i) => (
        <span className="text-gray-700 dark:text-gray-300">
          {i.Breed || "-"}
        </span>
      ),
    },
    {
      key: "ProductionVolume",
      label: "Production",
      render: (i) => (
        <span className="text-gray-700 dark:text-gray-300">
          {i.ProductionVolume || "-"}
        </span>
      ),
    },
    {
      key: "ReportDate",
      label: "Date",
      render: (i) => (
        <span className="text-gray-700 dark:text-gray-300">
          {i.ReportDate || "-"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (item) => (
        <div className="flex justify-center">
          <button
            onClick={() => setViewModal(item)}
            className="hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded"
          >
            <Info className="w-4 h-4 text-blue-500" />
          </button>
        </div>
      ),
    },
  ];

  if (error)
    return (
      <div className="p-4 text-red-600 dark:text-red-400">
        {error}
      </div>
    );

  return (
    <div className="w-full p-4">

     <div className="w-full rounded-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md p-6">

        {/* HEADER */}
        <div className="flex flex-wrap justify-between items-center gap-3">

          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            MONITORING RECORDS
          </h2>

          <button
            onClick={() => setAddMonitoringModal(true)}
            className="flex items-center gap-2 bg-green-600 dark:bg-green-500 text-white px-4 py-2 rounded-lg text-sm shadow hover:bg-green-700 dark:hover:bg-green-400 transition-colors"
          >
            <Plus className="w-4 h-4" /> New Report
          </button>

        </div>

        {/* TABLE */}
        {loading ? (
          <p className="text-gray-700 dark:text-gray-300">
            Loading monitoring records...
          </p>
        ) : (
          <>
            <DataTable
              columns={columns}
              data={currentItems}
              search={search}
              setSearch={setSearch}
              filters={
                <div className="flex gap-4 text-sm text-gray-700 dark:text-gray-300 items-center">
                  {["All", "Male", "Female"].map((item) => (
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
          </>
        )}

      </div>

      {/* MODALS */}
      <ViewMonitoringModal
        monitoring={viewModal}
        onClose={() => setViewModal(null)}
      />

      {addMonitoringModal && (
        <AddMonitoringModal
          onClose={() => setAddMonitoringModal(false)}
          onSuccess={loadMonitoring}
        />
      )}
    </div>
  );
}