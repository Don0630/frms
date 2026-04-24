import { useState } from "react";
import { Plus, Info, Edit, User, Trash2 } from "lucide-react";

import useUsers from "../hooks/useUsers";

import ViewUserModal from "../components/modals/ViewUserModal.jsx";
import AddUserModal from "../components/modals/AddUserModal.jsx";
import EditUserModal from "../components/modals/EditUserModal.jsx";
import DeleteUserModal from "../components/modals/DeleteUserModal.jsx";

import useTable from "../hooks/useTable";
import usePagination from "../hooks/usePagination";

import DataTable from "../components/common/DataTable";
import Pagination from "../components/common/Pagination";

export default function Users() {
  const [filter, setFilter] = useState("All");
  const [viewModal, setViewModal] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);

  // ✅ ONLY CHANGE: data comes from hook now
  const {
    usersQuery,
    createUser,
    updateUserMutation,
    deleteUserMutation,
  } = useUsers();

  const users = usersQuery.data?.data || [];

  const { search, setSearch, filteredData } = useTable({
    data: users,
    searchFields: ["FirstName", "LastName", "Username"],
    filterFn: (item) => filter === "All" || item.Role === filter,
  });

  const { currentPage, setCurrentPage, currentItems, totalPages } =
    usePagination(filteredData, 10);

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
      render: (item) => (
        <div className="flex justify-center gap-1">
          <button
            onClick={() => setEditModal(item)}
            className="bg-blue-600 dark:bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700 dark:hover:bg-blue-400 transition-colors"
          >
            <Edit className="w-3 h-3" />
          </button>

          <button
            onClick={() => setDeleteModal(item)}
            className="bg-red-600 dark:bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700 dark:hover:bg-red-400 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      ),
    },
  ];

  // LOADING (UNCHANGED STYLE PRESERVED)
  if (usersQuery.isLoading) {
    return (
      <div className="w-full p-4">
        <div className="bg-white dark:bg-gray-900 p-6 rounded shadow animate-pulse">
          <div className="h-6 w-40 bg-gray-300 dark:bg-gray-700 mb-4 rounded"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (usersQuery.isError) {
    return (
      <p className="text-red-600 dark:text-red-400 p-4">
        Error: {usersQuery.error.message}
      </p>
    );
  }

  return (
    <div className="w-full p-4">

      <div className="w-full rounded-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md p-6">

        {/* HEADER (UNCHANGED) */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-4">

          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            ALL USERS
          </h2>

          <button
            onClick={() => setAddModal(true)}
            className="flex items-center gap-2 bg-green-600 dark:bg-green-500 text-white px-3 sm:px-4 py-2 rounded-lg text-sm shadow hover:bg-green-700 dark:hover:bg-green-400"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add User</span>
          </button>

        </div>

        {/* TABLE (UNCHANGED) */}
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

      </div>

      {/* MODALS (UNCHANGED STRUCTURE) */}
      {viewModal && (
        <ViewUserModal
          user={viewModal}
          onClose={() => setViewModal(null)}
        />
      )}

      {addModal && (
        <AddUserModal
          onClose={() => setAddModal(false)}
          onSuccess={() => {
            usersQuery.refetch();
            setAddModal(false);
          }}
        />
      )}

      {editModal && (
        <EditUserModal
          user={editModal}
          onClose={() => setEditModal(null)}
          onSave={(data) =>
            updateUserMutation.mutate({
              id: editModal.UserID,
              data,
            })
          }
          loading={updateUserMutation.isPending}
        />
      )}

{deleteModal && (
  <DeleteUserModal
    user={deleteModal}
    onClose={() => setDeleteModal(null)}
    onConfirm={() =>
      deleteUserMutation.mutate(deleteModal.UserID, {
        onSuccess: () => {
          setDeleteModal(null); // ✅ CLOSE MODAL AFTER SUCCESS
        },
      })
    }
    loading={deleteUserMutation.isPending}
  />
)}

    </div>
  );
}