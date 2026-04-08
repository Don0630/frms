import { useState, useEffect } from "react";
import { 
  Search, Plus, SlidersHorizontal, Settings, Info, Edit
} from "lucide-react";
import { useLivestock } from "../context/LivestockContext.jsx";
import ViewLivestockModal from "../components/modals/ViewLivestockModal";
import AddLivestockModal from "../components/modals/AddLivestockModal";

export default function Livestock() {
  const { livestock, loadLivestock, loading, error } = useLivestock(); // Use context
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [viewModal, setViewModal] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Load livestock on mount
  useEffect(() => {
    loadLivestock();
  }, []);

  // Filter & Search
  const filtered = livestock.filter((item) => {
    const matchSearch = item.Breed?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || item.Type === filter;
    return matchSearch && matchFilter;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  // if (loading) return <p>Loading livestock...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="w-full h-full p-4">
      <div className="w-full rounded-sm bg-white/30 backdrop-blur-sm shadow-md p-6">

        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
          <h2 className="text-xl font-semibold text-gray-700">ALL LIVESTOCK</h2>
          <button
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm shadow"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-4 h-4" /> Add New Livestock
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-2 items-center mb-3">
          <div className="flex items-center border rounded-lg px-3 py-2 bg-white w-64">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search breed..."
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

        {/* Filter Buttons */}
        <div className="flex gap-4 text-sm mb-4">
          {["All", "Cattle", "Poultry", "Swine", "Goat"].map((item) => (
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
                <th className="py-3 px-2 text-left">Type</th>
                <th className="py-3 px-2 text-left">Breed</th>
                <th className="py-3 px-2 text-left">Average Production</th>
                <th className="py-3 px-2 text-left">Price</th>
                <th className="py-3 px-2 text-center">
                  <Settings className="text-gray-600 w-5 h-5 mx-auto" />
                </th>
              </tr>
            </thead>

            <tbody>
              {currentItems.map((item, i) => (
                <tr key={i} className="border-t">
                  <td className="py-2 px-2">{item.Type}</td>
                  <td className="py-2 px-2 flex items-center gap-1">
                    {item.Breed}
                    <button 
                      className="flex items-center gap-1 px-2 py-1 hover:bg-gray-200 rounded"
                      onClick={() => setViewModal(item)}
                    >
                      <Info className="w-4 h-4 text-blue-500" />
                    </button>
                  </td>
                  <td className="py-2 px-2">{item.AverageProduction}</td>
                  <td className="py-2 px-2">₱ {item.MarketPrice}</td>
                  <td className="py-2 px-2 flex items-center justify-center gap-1">
                    <button className="flex bg-blue-600 text-white items-center px-2 py-1 hover:bg-blue-700 rounded">
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
            Showing {currentItems.length} of {filtered.length} livestock
          </span>

          <div className="flex gap-2">
            <button
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              >
                {i + 1}
              </button>
            ))}

            <button
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <ViewLivestockModal
        livestock={viewModal}
        onClose={() => setViewModal(null)}
      />

      {showAddModal && (
        <AddLivestockModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => loadLivestock()} // Refresh list after adding
        />
      )}
      
    </div>
  );
}