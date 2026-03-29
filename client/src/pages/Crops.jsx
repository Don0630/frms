import { useState, useEffect } from "react";
import {   Search,
  Plus,
  SlidersHorizontal,
  Settings,
  Info,
  X,
  Edit,
  CheckCircle,
  Leaf,
  Apple,
  Carrot,
  Tag,
  CloudSun,
  BarChart3,
  Wheat,
  PhilippinePeso} from "lucide-react";
import { cropsData } from "../data/cropsData";

export default function Farmers() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [modalData, setModalData] = useState(null); // For modal

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter & Search
  const filtered = cropsData.filter((item) => {
    const matchSearch =
      item.cropName.toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      filter === "All" || item.category === filter;

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
          <h2 className="text-xl font-semibold text-gray-700">ALL CROPS</h2>
          <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm shadow">
            <Plus className="w-4 h-4" /> Add New Crops
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-2 items-center mb-3">
          <div className="flex items-center border rounded-lg px-3 py-2 bg-white w-64">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search name..."
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
          {["All", "Grains", "Fruits", "Vegetables"].map((item) => (
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
      <div className="w-full border rounded-lg">
          <table className="w-full text-xs sm:text-sm">
   <thead className="bg-gray-100 text-gray-600">
  <tr>
    <th className="py-3 px-2 text-left">Crop Name</th> 
    <th className="py-3 px-2 text-left">Category</th>
    <th className="py-3 px-2 text-left">Season</th>
    <th className="py-3 px-2 text-left">Yield (ha)</th>
    <th className="py-3 px-2 text-left">Price</th>
    <th className="py-3 px-2 text-center">
      <Settings className="text-gray-600 w-5 h-5 mx-auto" />
    </th> 
  </tr>
</thead>

<tbody>
  {currentItems.map((item, i) => (
    <tr key={i} className="border-t">

        <td className="py-2 px-2 flex items-center gap-1"> 
        {item.cropName} 
              {/* Info button */}
        <button className="flex items-center gap-1 px-2 py-1 hover:bg-gray-200 rounded"
          onClick={() => setModalData(item)}
        >
          <Info className="w-4 h-4 text-blue-500" />
        </button>
      </td>     
 <td>{item.category}</td>
                  <td>{item.season}</td>
                  <td>{item.averageYieldPerHectare}</td>
                  <td>₱ {item.marketPrice}</td>

 <td className="py-2 px-2 flex items-center justify-center gap-1">

  {/* Edit button */}
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
            Showing {currentItems.length} of {filtered.length} farmers
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
              {modalData.cropName} 
            </h3>

            <div className="h-px bg-gray-300 my-2"></div>

            <div className="space-y-2 text-xs">

              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <Tag size={16} className="text-red-500" /> Category
                </span>
                {modalData.category}
              </div>

              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <CloudSun size={16} className="text-blue-500" /> Season
                </span>
                {modalData.season}
              </div>

              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <BarChart3 size={16} className="text-green-500" /> Yield
                </span>
                {modalData.averageYieldPerHectare}
              </div>

              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <PhilippinePeso size={16} className="text-purple-500" /> Price
                </span>
                ₱ {modalData.marketPrice}
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}