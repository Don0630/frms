import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Settings,
  Info,
  Edit,
  Venus,
  Mars,
  Users
} from "lucide-react";

import { useStaff } from "../context/StaffContext.jsx";

import useTable from "../hooks/useTable";
import usePagination from "../hooks/usePagination";

import DataTable from "../components/common/DataTable";
import Pagination from "../components/common/Pagination";

import AddStaffModal from "../components/modals/AddStaffModal";
import ViewStaffModal from "../components/modals/ViewStaffModal";
import RegisterUserModal from "../components/modals/RegisterUserModal";
import EditStaffModal from "../components/modals/EditStaffModal";

export default function Staff() {
  const { staff, loading, error, loadStaff } = useStaff();

  const [filter, setFilter] = useState("All");
  const [addModal, setAddModal] = useState(false);
  const [viewModal, setViewModal] = useState(null);
  const [userModal, setUserModal] = useState(null);
  const [editModal, setEditModal] = useState(null);

  // LOAD DATA
  useEffect(() => {
    loadStaff();
  }, []);

  // SEARCH + FILTER ONLY
  const {
    search,
    setSearch,
    filteredData,
  } = useTable({
    data: staff,
    searchFields: ["FirstName", "LastName"],
    filterFn: (item) => filter === "All" || item.Gender === filter,
  });

  // PAGINATION ONLY
  const {
    currentPage,
    setCurrentPage,
    currentItems,
    totalPages,
  } = usePagination(filteredData, 10);

  // GENDER ICON
  const getGenderIcon = (gender) => {
    if (gender?.toLowerCase() === "male")
      return <Mars className="w-4 h-4 text-blue-500" />;
    if (gender?.toLowerCase() === "female")
      return <Venus className="w-4 h-4 text-pink-500" />;
    return <Users className="w-4 h-4 text-gray-500" />;
  };

  // TABLE COLUMNS
  const columns = [
    {
      key: "name",
      label: "Name",
      render: (item) => (
        <div className="flex items-center gap-2">
          {getGenderIcon(item.Gender)}
          {item.FirstName} {item.LastName}

          <button
            onClick={() => setViewModal(item)}
            className="hover:bg-gray-200 p-1 rounded"
          >
            <Info className="w-4 h-4 text-blue-500" />
          </button>
        </div>
      )
    },
    { key: "Position", label: "Position" },
    { key: "Department", label: "Department" },
    { key: "ContactNumber", label: "Contact" },
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
        </div>
      )
    }
  ];

  if (error)
    return <p className="p-4 text-red-500">Error: {error}</p>;

  return (
    <div className="w-full h-full p-4">

      <div className="w-full rounded-sm bg-white/30 backdrop-blur-sm shadow-md p-6">

        {/* HEADER */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-4">

          <h2 className="text-xl font-semibold text-gray-700">
            ALL STAFF
          </h2>

          <button
            onClick={() => setAddModal(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm shadow"
          >
            <Plus className="w-4 h-4" /> Add Staff
          </button>

        </div>

        {/* TABLE */}
        {loading ? (
          <p className="p-4">Loading staff...</p>
        ) : (
          <>
            <DataTable
              columns={columns}
              data={currentItems}
              search={search}
              setSearch={setSearch}
              filters={
                <div className="flex gap-4 text-sm">
                  {["All", "Male", "Female"].map((item) => (
                    <label
                      key={item}
                      className="flex items-center gap-1 cursor-pointer"
                    >
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