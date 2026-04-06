import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  SlidersHorizontal,
  Settings,
  Info,
  X,
  PhilippinePeso,
  Calendar,
  FileText,
  Mars,
  Venus,
  Users
} from "lucide-react";

import { useSubsidy } from "../context/SubsidyContext";
import ViewSubsidyModal from "../components/modals/ViewSubsidyModal";

export default function Subsidy() {
  const { subsidy, loadSubsidy, loading, error } = useSubsidy();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All"); // Gender filter
  const [modalData, setModalData] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Load data
  useEffect(() => {
    loadSubsidy();
  }, []);

  // Filter & Search
  const filtered = subsidy.filter((item) => {
    const matchSearch =
      item.FarmerName?.toLowerCase().includes(search.toLowerCase()) ||
      item.ProgramName?.toLowerCase().includes(search.toLowerCase());

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

  // if (loading) return <p className="p-4">Loading subsidy records...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="w-full h-full p-4">
      <div className="w-full rounded-sm bg-white/30 backdrop-blur-sm shadow-md p-6">

        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
          <h2 className="text-xl font-semibold text-gray-700">SUBSIDY RECORDS</h2>
          <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm shadow">
            <Plus className="w-4 h-4" /> Add Subsidy
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-2 items-center mb-3">
          <div className="flex items-center border rounded-lg px-3 py-2 bg-white w-64">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search farmer or program..."
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
                <th className="py-3 px-2 text-left">Program</th>
                <th className="py-3 px-2 text-left">Amount</th>
                <th className="py-3 px-2 text-left">Date</th>
                <th className="py-3 px-2 text-center">
                  <Settings className="w-5 h-5 mx-auto" />
                </th>
              </tr>
            </thead>

            <tbody>
              {currentItems.map((item, i) => (
                <tr key={i} className="border-t">
                  <td className="py-2 px-2 flex items-center gap-2">
                    {getGenderIcon(item.Gender)}
                    {item.FirstName} {item.LastName}
                  </td>
                  <td className="py-2 px-2">{item.ProgramName}</td>
                  <td className="py-2 px-2">₱ {Number(item.Amount).toLocaleString()}</td>
                  <td className="py-2 px-2">{item.DistributionDate}</td>
                  <td className="py-2 px-2 flex justify-center">
                    <button
                      onClick={() => setModalData(item)}
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
                  currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
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

      {/* View Modal */}
      <ViewSubsidyModal
        subsidy={modalData}
        onClose={() => setModalData(null)}
      />
    </div>
  );
}