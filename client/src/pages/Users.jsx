import { useState, useEffect } from "react";
import { Plus, Info, Edit, User } from "lucide-react";

import { useUser } from "../context/UserContext.jsx";
import ViewUserModal from "../components/modals/ViewUserModal.jsx";
import AddUserModal from "../components/modals/AddUserModal.jsx";

import useTable from "../hooks/useTable";
import usePagination from "../hooks/usePagination";

import DataTable from "../components/common/DataTable";
import Pagination from "../components/common/Pagination";

export default function Users() {
  const { users, loadUsers, loading, error } = useUser();

  const [filter, setFilter] = useState("All");
  const [viewModal, setViewModal] = useState(null);
  const [addModal, setAddModal] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const { search, setSearch, filteredData } = useTable({
    data: users,
    searchFields: ["FirstName", "LastName", "Username"],
    filterFn: (item) => filter === "All" || item.Role === filter,
  });

  const { currentPage, setCurrentPage, currentItems, totalPages } =
    usePagination(filteredData, 10);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter, filteredData, setCurrentPage]);

  const columns = [
    {
      key: "name",
      label: "Name",
      render: (item) => (
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
          <User className="w-4 h-4 text-blue-500" />
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
      key: "Username",
      label: "Username",
      render: (item) => (
        <span className="text-gray-700 dark:text-gray-300">
          {item.Username}
        </span>
      ),
    },
    {
      key: "Role",
      label: "Role",
      render: (item) => (
        <span className="text-gray-700 dark:text-gray-300">
          {item.Role}
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
      key: "Email",
      label: "Email",
      render: (item) => (
        <span className="text-gray-700 dark:text-gray-300">
          {item.Email}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      render: () => (
        <div className="flex justify-center">
          <button className="bg-blue-600 dark:bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700 dark:hover:bg-blue-400 transition-colors">
            <Edit className="w-3 h-3" />
          </button>
        </div>
      ),
    },
  ];

  if (error)
    return (
      <p className="text-red-600 dark:text-red-400 p-4">
        Error: {error}
      </p>
    );

  return (
    <div className="w-full p-4">
      <div className="w-full rounded-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md p-6">

        {/* HEADER */}
        <div className="flex flex-wrap justify-between items-center gap-3">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            ALL USERS
          </h2>

          <button
            className="flex items-center gap-2 bg-green-600 dark:bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 dark:hover:bg-green-400 transition-colors"
            onClick={() => setAddModal(true)}
          >
            <Plus className="w-4 h-4" /> Add User
          </button>
        </div>

        {/* TABLE */}
        {loading ? (
          <p className="text-gray-700 dark:text-gray-300">
            Loading users...
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
                  {["All", "Admin", "Staff"].map((item) => (
                    <label key={item} className="flex items-center gap-1">
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
      {viewModal && (
        <ViewUserModal
          user={viewModal}
          onClose={() => setViewModal(null)}
        />
      )}

      {addModal && (
        <AddUserModal
          onClose={() => setAddModal(false)}
          onSuccess={loadUsers}
        />
      )}
    </div>
  );
}