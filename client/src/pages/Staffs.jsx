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

  useEffect(() => {
    loadStaff();
  }, []);

  const { search, setSearch, filteredData } = useTable({
    data: staff,
    searchFields: ["FirstName", "LastName"],
    filterFn: (item) => filter === "All" || item.Gender === filter,
  });

  const { currentPage, setCurrentPage, currentItems, totalPages } =
    usePagination(filteredData, 10);

  const getGenderIcon = (gender) => {
    if (gender?.toLowerCase() === "male")
      return <Mars className="w-4 h-4 text-blue-500" />;
    if (gender?.toLowerCase() === "female")
      return <Venus className="w-4 h-4 text-pink-500" />;
    return <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />;
  };

  const columns = [
    {
      key: "name",
      label: "Name",
      render: (item) => (
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
          {getGenderIcon(item.Gender)}
          {item.FirstName} {item.LastName}

          <button
            onClick={() => setViewModal(item)}
            className="hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded"
          >
            <Info className="w-4 h-4 text-blue-500" />
          </button>
        </div>
      ),
    },
    {
      key: "Position",
      label: "Position",
      render: (item) => (
        <span className="text-gray-700 dark:text-gray-300">
          {item.Position}
        </span>
      ),
    },
    {
      key: "Department",
      label: "Department",
      render: (item) => (
        <span className="text-gray-700 dark:text-gray-300">
          {item.Department}
        </span>
      ),
    },
    {
      key: "ContactNumber",
      label: "Contact",
      render: (item) => (
        <span className="text-gray-700 dark:text-gray-300">
          {item.ContactNumber}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (item) => (
        <div className="flex justify-center gap-1">
          <button
            onClick={() => setEditModal(item)}
            className="bg-blue-600 dark:bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700 dark:hover:bg-blue-400 transition-colors"
          >
            <Edit className="w-3 h-3" />
          </button>
        </div>
      ),
    },
  ];

  if (error)
    return (
      <p className="p-4 text-red-600 dark:text-red-400">
        Error: {error}
      </p>
    );

  return (
    <div className="w-full p-4">

      <div className="w-full rounded-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md p-6">

        {/* HEADER */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-4">

          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            ALL STAFF
          </h2>

          <button
            onClick={() => setAddModal(true)}
            className="flex items-center gap-2 bg-green-600 dark:bg-green-500 text-white px-4 py-2 rounded-lg text-sm shadow hover:bg-green-700 dark:hover:bg-green-400 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Staff
          </button>

        </div>

        {/* TABLE */}
        {loading ? (
          <p className="text-gray-700 dark:text-gray-300 p-4">
            Loading staff...
          </p>
        ) : (
          <>
            <DataTable
              columns={columns}
              data={currentItems}
              search={search}
              setSearch={setSearch}
              filters={
                <div className="flex gap-4 text-sm text-gray-700 dark:text-gray-300">
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

      {/* MODALS (unchanged) */}
      <ViewStaffModal data={viewModal} onClose={() => setViewModal(null)} />

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