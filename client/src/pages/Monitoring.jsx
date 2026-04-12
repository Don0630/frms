import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  SlidersHorizontal,
  Settings,
  Info,
  Mars,
  Venus,
  Users
} from "lucide-react";

import { useMonitoring } from "../context/MonitoringContext";
import ViewMonitoringModal from "../components/modals/ViewMonitoringModal";
import AddMonitoringModal from "../components/modals/AddMonitoringModal";

export default function Monitoring() {
  const { monitoring, loadMonitoring, loading, error } = useMonitoring();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All"); // Gender filter
  const [viewModal, setViewModal] = useState(null);
  const [addMonitoringModal, setAddMonitoringModal] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Load API data
  useEffect(() => {
    loadMonitoring();
  }, []);

  // Filter & Search
  const filtered = monitoring.filter((item) => {
    const searchValue = search.toLowerCase();
    const matchSearch =
      `${item.FirstName || ""} ${item.LastName || ""}`
        .toLowerCase()
        .includes(searchValue) ||
      (item.CropName && item.CropName.toLowerCase().includes(searchValue)) ||
      (item.Breed && item.Breed.toLowerCase().includes(searchValue));

    const matchFilter =
      filter === "All" || item.Gender?.toLowerCase() === filter.toLowerCase();

    return matchSearch && matchFilter;
  });

  // Reset page on search/filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  // Gender icon
  const getGenderIcon = (gender) => {
    if (gender?.toLowerCase() === "male")
      return <Mars className="w-4 h-4 text-blue-500" />;
    if (gender?.toLowerCase() === "female")
      return <Venus className="w-4 h-4 text-pink-500" />;
    return <Users className="w-4 h-4 text-gray-500" />;
  };

  // if (loading) return <div className="p-4">Loading monitoring records...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="w-full h-full p-4">
      <div className="w-full rounded-sm bg-white/30 backdrop-blur-sm shadow-md p-6">

        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            MONITORING RECORDS
          </h2>
<button
  onClick={() => setAddMonitoringModal(true)}
  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm shadow"
>
  <Plus className="w-4 h-4" /> New Report
</button>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-2 items-center mb-3">
          <div className="flex items-center border rounded-lg px-3 py-2 bg-white w-64">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search farmer, crop, livestock..."
              className="ml-2 outline-none text-sm w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button className="flex items-center gap-1 px-3 py-2 border rounded-lg bg-white text-sm">
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>

          <button className="flex items-center gap-1 px-3 py-2 border rounded-lg bg-white text-sm">
            <Settings className="w-4 h-4" /> Configurations
          </button>
        </div>

        {/* Gender Filter */}
        <div className="flex gap-4 text-sm mb-4">
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

        {/* Table */}
        <div className="w-full border rounded-lg overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="py-3 px-2 text-left">Farmer</th>
                <th className="py-3 px-2 text-left">Crop</th>
                <th className="py-3 px-2 text-left">Livestock</th>
                <th className="py-3 px-2 text-left">Production</th>
                <th className="py-3 px-2 text-left">Date</th>
                <th className="py-3 px-2 text-center">
                  <Settings className="w-5 h-5 mx-auto" />
                </th>
              </tr>
            </thead>

            <tbody>
              {currentItems.map((item, i) => (
                <tr key={i} className="border-t">
                  
                  {/* Farmer Name with gender icon */}
                  <td className="py-2 px-2 flex items-center gap-2">
                    {getGenderIcon(item.Gender)}
                    {item.FirstName ? `${item.FirstName} ${item.LastName}` : "N/A"}
                  </td>

                  <td className="py-2 px-2">{item.CropName || "-"}</td>
                  <td className="py-2 px-2">{item.Breed || "-"}</td>
                  <td className="py-2 px-2">{item.ProductionVolume}</td>
                  <td className="py-2 px-2">{item.ReportDate}</td>

                  <td className="py-2 px-2 flex justify-center">
                    <button
                      onClick={() => setViewModal(item)}
                      className="hover:bg-gray-200 p-1 rounded"
                    >
                      <Info className="w-4 h-4 text-blue-500" />
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
          <span>
            Showing {currentItems.length} of {filtered.length} records
          </span>

          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <ViewMonitoringModal
        monitoring={viewModal}
        onClose={() => setViewModal(null)}
      />

      {addMonitoringModal && (
        <AddMonitoringModal
          onClose={() => setAddMonitoringModal(false)}
          onSuccess={() => loadMonitoring()} // reload data after add
        />
      )}


    </div>
  );
}