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

  // TABLE LOGIC
  const { search, setSearch, filteredData } = useTable({
    data: monitoring,
    searchFields: ["FirstName", "LastName", "CropName", "Breed"],
    filterFn: (item) =>
      filter === "All" || item.Gender?.toLowerCase() === filter.toLowerCase(),
  });

  const { currentPage, setCurrentPage, currentItems, totalPages } =
    usePagination(filteredData, 10);

  // ICON
  const getGenderIcon = (gender) => {
    if (gender?.toLowerCase() === "male")
      return <Mars className="w-4 h-4 text-blue-500" />;
    if (gender?.toLowerCase() === "female")
      return <Venus className="w-4 h-4 text-pink-500" />;
    return <Users className="w-4 h-4 text-gray-500" />;
  };

  // COLUMNS
  const columns = [
    {
      key: "farmer",
      label: "Farmer",
      render: (item) => (
        <div className="flex items-center gap-2">
          {getGenderIcon(item.Gender)}
          {item.FirstName ? `${item.FirstName} ${item.LastName}` : "N/A"}
        </div>
      ),
    },
    { key: "CropName", label: "Crop", render: (i) => i.CropName || "-" },
    { key: "Breed", label: "Livestock", render: (i) => i.Breed || "-" },
    { key: "ProductionVolume", label: "Production" },
    { key: "ReportDate", label: "Date" },
    {
      key: "actions",
      label: "",
      render: (item) => (
        <div className="flex justify-center">
          <button
            onClick={() => setViewModal(item)}
            className="hover:bg-gray-200 p-1 rounded"
          >
            <Info className="w-4 h-4 text-blue-500" />
          </button>
        </div>
      ),
    },
  ];

  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="w-full min-h-screen p-4 bg-gray-100">

      <div className="w-full bg-white/40 backdrop-blur-md shadow-md rounded-xl p-6 flex flex-col gap-4">

        {/* HEADER */}
        <div className="flex flex-wrap justify-between items-center gap-3">
          <h2 className="text-xl font-semibold text-gray-700">
            MONITORING RECORDS
          </h2>

          <button
            onClick={() => setAddMonitoringModal(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm shadow hover:bg-green-700"
          >
            <Plus className="w-4 h-4" /> New Report
          </button>
        </div>

        {/* TABLE */}
        {loading ? (
          <p>Loading monitoring records...</p>
        ) : (
          <>
            <DataTable
              columns={columns}
              data={currentItems}
              search={search}
              setSearch={setSearch}
              filters={
                <div className="flex gap-4 text-sm items-center">
                  {["All", "Male", "Female"].map((item) => (
                    <label key={item} className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
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