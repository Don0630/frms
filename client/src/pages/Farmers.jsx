import { useState } from "react";
import { Plus, Mars, Venus, Edit, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

import useFarmer from "../hooks/useFarmer";
import useTable from "../hooks/useTable";
import usePagination from "../hooks/usePagination";

import DataTable from "../components/common/DataTable";
import Pagination from "../components/common/Pagination";

import AddFarmerModal from "../components/modals/AddFarmerModal";
import EditFarmerModal from "../components/modals/EditFarmerModal";

export default function Farmers() {
  const navigate = useNavigate();

  const [filter, setFilter] = useState("All");
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(null);

  // ✅ USE FARMER HOOK (PRO WAY)
  const {
    farmersQuery,
    createFarmerMutation,
    updateFarmerMutation,
  } = useFarmer();

  const farmers = farmersQuery.data?.data || [];

  // ================= TABLE FILTER =================
  const { search, setSearch, filteredData } = useTable({
    data: farmers,
    searchFields: ["FirstName", "MiddleName", "LastName"],
    filterFn: (item) =>
      filter === "All" ||
      item.Gender?.toLowerCase() === filter.toLowerCase(),
  });

  // ================= PAGINATION =================
  const { currentPage, setCurrentPage, currentItems, totalPages } =
    usePagination(filteredData, 10);

  const getGenderIcon = (gender) => {
    if (gender?.toLowerCase() === "male")
      return <Mars className="w-4 h-4 text-blue-500" />;
    if (gender?.toLowerCase() === "female")
      return <Venus className="w-4 h-4 text-pink-500" />;
    return null;
  };

  // ================= TABLE COLUMNS =================
  const columns = [
    {
      key: "name",
      label: "Name",
      render: (item) => (
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
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

  // ================= ERROR =================
  if (farmersQuery.isError) {
    return (
      <p className="p-4 text-red-500">
        {farmersQuery.error.message}
      </p>
    );
  }

  // ================= LOADING =================
  if (farmersQuery.isLoading) {
    return (
      <div className="w-full p-4">
        <div className="bg-white dark:bg-gray-900 p-6 rounded shadow animate-pulse">
          <div className="h-6 w-40 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

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
            className="flex items-center gap-2 bg-green-600 dark:bg-green-500 text-white px-3 sm:px-4 py-2 rounded-lg text-sm shadow hover:bg-green-700 dark:hover:bg-green-400"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Farmer</span>
          </button>
        </div>

        {/* TABLE */}
        <DataTable
          columns={columns}
          data={currentItems}
          search={search}
          setSearch={setSearch}
          filters={
            <div className="flex gap-4 text-sm">
              {["All", "Male", "Female"].map((item) => (
                <label key={item} className="flex items-center gap-1">
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

        {/* PAGINATION */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          currentItemsLength={currentItems.length}
          totalItemsLength={filteredData.length}
        />

      </div>

      {/* MODALS */}

      {addModal && (
        <AddFarmerModal
          onClose={() => setAddModal(false)}
          onSubmit={(data) =>
            createFarmerMutation.mutate(data, {
              onSuccess: () => setAddModal(false),
            })
          }
          loading={createFarmerMutation.isPending}
        />
      )}


      {editModal && (
        <EditFarmerModal
          selectedFarmer={editModal}
          onClose={() => setEditModal(null)}
          onSubmit={(data) =>
            updateFarmerMutation.mutate(
              {
                id: editModal.FarmerID,
                data,
              },
              {
                onSuccess: () => setEditModal(null),
              }
            )
          }
          loading={updateFarmerMutation.isPending}
        />
      )}

    </div>
  );
}