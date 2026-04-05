import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  SlidersHorizontal,
  Settings,
  Info,
  Edit,
  UserCog,
  Venus,
  Mars,
  Users
} from "lucide-react";

import { useStaff } from "../context/StaffContext.jsx";
import AddStaffModal from "../components/modals/AddStaffModal";
import ViewStaffModal from "../components/modals/ViewStaffModal";
import RegisterUserModal from "../components/modals/RegisterUserModal";
import EditStaffModal from "../components/modals/EditStaffModal";

export default function Staff() {
  const { staff, loading, error, loadStaff } = useStaff();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [addModal, setAddModal] = useState(false);
  const [viewModal, setViewModal] = useState(null);
  const [userModal, setUserModal] = useState(null);
  const [editModal, setEditModal] = useState(null); 

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadStaff();
  }, []);

  // ✅ Filter & Search (FIXED)
  const filtered = staff.filter((item) => {
    const matchSearch =
      item.FirstName.toLowerCase().includes(search.toLowerCase()) ||
      item.LastName.toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      filter === "All" || item.Gender === filter;

    return matchSearch && matchFilter;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  // ✅ Gender Icon (FIXED)
  const getGenderIcon = (gender) => {
    if (gender?.toLowerCase() === "male")
      return <Mars className="w-4 h-4 text-blue-500" />;
    if (gender?.toLowerCase() === "female")
      return <Venus className="w-4 h-4 text-pink-500" />;
    return <Users className="w-4 h-4 text-gray-500" />;
  };

  // if (loading) return <p className="p-4">Loading staff...</p>;
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;

  return (
    <div className="w-full h-full p-4">
      <div className="w-full rounded-sm bg-white/30 backdrop-blur-sm shadow-md p-6">

        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
          <h2 className="text-xl font-semibold text-gray-700">ALL STAFF</h2>
<button
  onClick={() => setAddModal(true)}
  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm shadow"
>
  <Plus className="w-4 h-4" /> Add Staff
</button>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-2 items-center mb-3">
          <div className="flex items-center border rounded-lg px-3 py-2 bg-white w-64">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search staff..."
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
                <th className="py-3 px-2 text-left">Name</th>
                <th className="py-3 px-2 text-left">Position</th>
                <th className="py-3 px-2 text-left">Department</th>
                <th className="py-3 px-2 text-left">Contact</th>
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

                    <button
                      onClick={() => setViewModal(item)}
                      className="hover:bg-gray-200 p-1 rounded"
                    >
                      <Info className="w-4 h-4 text-blue-500" />
                    </button>
                  </td>

                  <td className="py-2 px-2">{item.Position}</td>
                  <td className="py-2 px-2">{item.Department}</td>
                  <td className="py-2 px-2">{item.ContactNumber}</td>

                  <td className="py-2 px-2 flex justify-center gap-1">
                    <button onClick={() => setEditModal(item)} // set the staff to edit
                      className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700">
                      <Edit className="w-3 h-3" />
                    </button>

{/*                    <button
                      disabled={item.IsUser === 1}
                      onClick={() => setUserModal(item)}
                      className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 disabled:opacity-50">
                      <UserCog className="w-3 h-3" />
                    </button>*/}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
          <span>
            Showing {currentItems.length} of {filtered.length} staff
          </span>

          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
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
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ViewStaffModal
        data={viewModal}
        onClose={() => setViewModal(null)}
      />

      <RegisterUserModal
        data={userModal}
        onClose={() => setUserModal(null)}
        onSuccess={loadStaff}
      />

  {addModal && (
    <AddStaffModal
      onClose={() => setAddModal(false)}
      onSuccess={loadStaff}
    />
  )}

  {editModal && (
    <EditStaffModal
      data={editModal}
      onClose={() => setEditModal(null)}
      onSuccess={loadStaff}
    />
  )}

    </div>
  );
}