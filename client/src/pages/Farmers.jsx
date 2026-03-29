import { useState, useEffect } from "react";
import { Search, Save, Plus, Mars, Venus, CheckCircle , Edit, SlidersHorizontal, Settings, Info, User, Users, X, Mail, Phone, Calendar, MapPin, FileText, MapPinned, Ruler, Expand } from "lucide-react";
import { farmersData } from "../data/farmersData";

export default function Farmers() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [modalData, setModalData] = useState(null); // For modal

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter & Search
  const filtered = farmersData.filter((item) => {
    const matchSearch =
      item.firstName.toLowerCase().includes(search.toLowerCase()) ||
      item.lastName.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || item.status === filter;
    return matchSearch && matchFilter;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  // Status badge colors
  const getStatusColor = (status) => {
    switch (status) {
      case "Active": return "bg-green-600 text-white";
      case "Completed": return "bg-blue-900 text-white";
      case "Dropped": return "bg-red-600 text-white";
      case "N/A": return "bg-gray-400 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  // Gender icon helper
  const getGenderIcon = (gender) => {
    if (gender.toLowerCase() === "male") return <Venus className="w-4 h-4 text-blue-500 shrink-0" />;
    if (gender.toLowerCase() === "female") return <Mars className="w-4 h-4 text-pink-500 shrink-0" />;
    return <Users className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div className="w-full h-full p-4">
      <div className="w-full rounded-sm bg-white/30 backdrop-blur-sm shadow-md p-6">

        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
          <h2 className="text-xl font-semibold text-gray-700">ALL FARMERS</h2>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm shadow">
            <Plus className="w-4 h-4" /> Add New Farmer
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
          {["All", "Active", "Completed", "Dropped", "N/A"].map((item) => (
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
    <th className="py-3 px-2 text-left">Name</th>
    <th className="py-3 px-2 text-left">Farm Size</th>
    <th className="py-3 px-2 text-left">Farm Location</th>
    <th className="py-3 px-2 text-left">Program Status</th>
      
    <th className="py-3 px-2 text-center">
      <Settings className="text-gray-600 w-5 h-5 mx-auto" />
    </th> 
  </tr>
</thead>

<tbody>
  {currentItems.map((item, i) => (
    <tr key={i} className="border-t">

      <td className="py-2 px-2 flex items-center gap-1">
        {getGenderIcon(item.gender)}
        {item.firstName} {item.lastName}
              {/* Info button */}
        <button className="flex items-center gap-1 px-2 py-1 hover:bg-gray-200 rounded"
          onClick={() => setModalData(item)}
        >
          <Info className="w-4 h-4 text-blue-500" />
        </button>
      </td>

      <td>{item.farmSize} ha</td>
      <td>{item.farmLocation}</td>
      <td>
        <span className={`inline-flex justify-center items-center w-24 h-6 py-1 rounded-xl text-[10px] uppercase ${getStatusColor(item.status)}`}>{item.status}
        </span>
      </td>

 

 <td className="py-2 px-2 flex items-center justify-center gap-1">

  {/* Edit button */}
  <button className="flex bg-blue-600 text-white items-center px-2 py-1 hover:bg-blue-700 rounded">
    <Edit className="w-3 h-3" />
  </button>

  {/* Apply button */}
  <button
    disabled={item.status === "Active" || item.status === "Completed"}
    className="flex bg-green-600 text-white items-center px-2 py-1 rounded 
               hover:bg-green-700 
               disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <CheckCircle className="w-3 h-3" />
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
              onClick={() => setModalData(null)}
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-semibold mb-4">{modalData.firstName} {modalData.lastName}</h3>
            <div className="w-full h-px bg-gray-300 my-2"></div>
            <div className="grid grid-cols-1 gap-2 text-gray-700 text-xs">
              <div className="flex justify-between items-center mb-2"><span className="flex items-center gap-1"><Calendar size={16} className="text-green-500" /><strong>Date of Birth:</strong>
              </span> {modalData.dateOfBirth}</div>
              <div className="flex justify-between items-center mb-2"><span className="flex items-center gap-1"><MapPin size={16} className="text-blue-500" /><strong>Address:</strong>
              </span> {modalData.address}</div>
              <div className="flex justify-between items-center mb-2"><span className="flex items-center gap-1"><Phone size={16} className="text-red-500" /><strong>Contact No.:</strong>
              </span> {modalData.contactNumber}</div>
              <div className="flex justify-between items-center mb-2"><span className="flex items-center gap-1"><Mail size={16} className="text-purple-500" /><strong>Email:</strong>
              </span> {modalData.email}</div>
              <div className="flex justify-between items-center mb-2"><span className="flex items-center gap-1"><User size={16} className="text-orange-500" /><strong>Gender:</strong>
              </span> {modalData.gender}</div>
              <div className="flex justify-between items-center mb-2"><span className="flex items-center gap-1"><FileText size={16} className="text-yellow-500" /><strong>Program Status:</strong>
              </span> {modalData.status}</div>
              <div className="flex justify-between items-center mb-2"><span className="flex items-center gap-1"><MapPinned size={16} className="text-green-500" /><strong>Farm Location:</strong>
              </span> {modalData.farmLocation}</div>
              <div className="flex justify-between items-center mb-2"><span className="flex items-center gap-1"><Ruler size={16} className="text-cyan-500" /><strong>Farm Size:</strong>
              </span> {modalData.farmSize} ha</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}