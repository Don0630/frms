import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  SlidersHorizontal,
  Settings,
  Info,
  X,
  Edit,
  PhilippinePeso,
  Tag,
  Calendar,
  Users
} from "lucide-react";

import { programsData } from "../data/programsData";

export default function Programs() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [modalData, setModalData] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter & Search
  const filtered = programsData.filter((item) => {
    const matchSearch =
      item.programName.toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      filter === "All" || item.status === filter;

    return matchSearch && matchFilter;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="w-full h-full p-4">
      <div className="w-full rounded-sm bg-white/30 backdrop-blur-sm shadow-md p-6">

        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
          <h2 className="text-xl font-semibold text-gray-700">ALL PROGRAMS</h2>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm shadow">
            <Plus className="w-4 h-4" /> Add New Program
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-2 items-center mb-3">
          <div className="flex items-center border rounded-lg px-3 py-2 bg-white w-64">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search program..."
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

        {/* Filter */}
        <div className="flex gap-4 text-sm mb-4">
          {["All", "Ongoing", "Completed", "Upcoming"].map((item) => (
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
                <th className="py-3 px-2 text-left">Program</th>
                <th className="py-3 px-2 text-left">Start</th>
                <th className="py-3 px-2 text-left">End</th>
                <th className="py-3 px-2 text-left">Budget</th>
                <th className="py-3 px-2 text-left">Status</th>
                <th className="py-3 px-2 text-center">
                  <Settings className="w-5 h-5 mx-auto" />
                </th>
              </tr>
            </thead>

            <tbody>
              {currentItems.map((item, i) => (
                <tr key={i} className="border-t">
                  <td className="py-2 px-2 flex items-center gap-1">
                    {item.programName}
                    <button
                      onClick={() => setModalData(item)}
                      className="hover:bg-gray-200 p-1 rounded"
                    >
                      <Info className="w-4 h-4 text-blue-500" />
                    </button>
                  </td>

                  <td className="py-2 px-2">{item.startDate}</td>
                  <td className="py-2 px-2">{item.endDate}</td>
                  <td className="py-2 px-2">₱ {item.budget.toLocaleString()}</td>
                  <td className="py-2 px-2">{item.status}</td>

                  <td className="py-2 px-2 flex justify-center">
                    <button className="bg-blue-600 text-white px-2 py-1 rounded">
                      <Edit className="w-3 h-3" />
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
            Showing {currentItems.length} of {filtered.length} programs
          </span>

          <div className="flex gap-2">
            <button
              className="px-3 py-1 bg-gray-200 rounded"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
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
              className="px-3 py-1 bg-gray-200 rounded"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg p-6 w-96 relative">
            <button
              className="absolute top-3 right-3"
              onClick={() => setModalData(null)}
            >
              <X />
            </button>

            <h3 className="font-semibold text-lg mb-2">
              {modalData.programName}
            </h3>

            <div className="h-px bg-gray-300 my-2"></div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <Tag size={14} /> Description
                </span>
                {modalData.description}
              </div>

              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <Calendar size={14} /> Duration
                </span>
                {modalData.startDate} → {modalData.endDate}
              </div>

              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <PhilippinePeso size={14} /> Budget
                </span>
                ₱ {modalData.budget.toLocaleString()}
              </div>

              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <Users size={14} /> Beneficiaries
                </span>
                {modalData.targetBeneficiaries}
              </div>

              <div className="flex justify-between">
                <span>Status</span>
                {modalData.status}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}