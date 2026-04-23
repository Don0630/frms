import { useState, useEffect } from "react";
import { Search, Plus, Mars, Venus, Settings, Edit, Eye, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useFarmer } from "../context/FarmerContext.jsx";
import AddFarmerModal from "../components/modals/AddFarmerModal.jsx";
import EditFarmerModal from "../components/modals/EditFarmerModal";

import useTable from "../hooks/useTable";
import usePagination from "../hooks/usePagination";

import DataTable from "../components/common/DataTable";
import Pagination from "../components/common/Pagination";

export default function Farmers() {
  const { farmer, loadFarmer, loading, error } = useFarmer();
  const navigate = useNavigate();

  const [filter, setFilter] = useState("All");
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(null);

  useEffect(() => {
    loadFarmer();
  }, []);

  // reset page when filters change
  const { search, setSearch, filteredData } = useTable({
    data: farmer,
    searchFields: ["FirstName", "LastName"],
    filterFn: (item) =>
      filter === "All" ||
      item.Gender?.toLowerCase() === filter.toLowerCase(),
  });

  const { currentPage, setCurrentPage, currentItems, totalPages } =
    usePagination(filteredData, 10);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter, setCurrentPage]);

  const getGenderIcon = (gender) => {
    if (gender?.toLowerCase() === "male")
      return <Mars className="w-4 h-4 text-blue-500" />;
    if (gender?.toLowerCase() === "female")
      return <Venus className="w-4 h-4 text-pink-500" />;
    return null;
  };

  // TABLE COLUMNS
  const columns = [
    {
      key: "name",
      label: "Name",
      render: (item) => (
        <div className="flex items-center gap-2">
          {getGenderIcon(item.Gender)}
          {item.FirstName} {item.MiddleName}. {item.LastName}
        </div>
      ),
    },
    { key: "Email", label: "Email" },
    { key: "ContactNumber", label: "Contact No." },
    { key: "RegistrationDate", label: "Registration Date" },
    {
      key: "actions",
      label: "",
      render: (item) => (
        <div className="flex justify-center gap-1">
          <button
            onClick={() => setEditModal(item)}
            className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
          >
            <Edit className="w-3 h-3" />
          </button>

          <button
            onClick={() => navigate(`/farmerdetails/${item.FarmerID}`)}
            className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
          >
            <Eye className="w-3 h-3" />
          </button>
        </div>
      ),
    },
  ];

  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
  <div className="w-full min-h-screen p-4 bg-gray-100 dark:bg-gray-950">

    <div className="w-full rounded-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md p-6 space-y-4">

      {/* HEADER */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          ALL FARMERS
        </h2>

<button
  onClick={() => setAddModal(true)}
  className="
    flex items-center gap-2
    bg-green-600 dark:bg-green-500
    text-white
    px-3 sm:px-4 py-2
    rounded-lg text-sm shadow
    hover:bg-green-700 dark:hover:bg-green-400
    transition-colors
  "
>
  <Plus className="w-4 h-4" />

  {/* TEXT ONLY ON SM AND ABOVE */}
  <span className="hidden sm:inline">
    Add Farmer
  </span>
</button>
      </div>

      {/* TABLE */}
      {loading ? (
        <p className="text-gray-700 dark:text-gray-300">Loading Farmers...</p>
      ) : (
        <>
          <DataTable
            columns={columns}
            data={currentItems}
            search={search}
            setSearch={setSearch}
            filters={
              <div className="flex gap-4 text-sm items-center text-gray-700 dark:text-gray-300">
                {["All", "Male", "Female"].map((item) => (
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
        </>
      )}
    </div>

    {/* MODALS */}
    {addModal && (
      <AddFarmerModal
        onClose={() => setAddModal(false)}
        onSuccess={loadFarmer}
      />
    )}

    {editModal && (
      <EditFarmerModal
        selectedFarmer={editModal}
        onClose={() => setEditModal(null)}
        onSuccess={loadFarmer}
      />
    )}
  </div>
);
}