import { useState } from "react";
import toast from "react-hot-toast";
import { Plus, Info, Edit, User, Trash2 } from "lucide-react";


import {
 pageButtonPrimary
} from "../components/common/PageUI";

import useUser from "../hooks/useUser";

import ViewUserModal from "../components/modals/ViewUserModal.jsx";
import AddUserModal from "../components/modals/AddUserModal.jsx";
import EditUserModal from "../components/modals/EditUserModal.jsx";
import DeleteUserModal from "../components/modals/DeleteUserModal.jsx";

import useTable from "../hooks/useTable";
import usePagination from "../hooks/usePagination";

import DataTable from "../components/common/DataTable";
import Pagination from "../components/common/Pagination";
import TablePageSkeleton from "../components/skeletons/TablePageSkeleton";

export default function Users() {
  const [filter, setFilter] = useState("All");
  const [viewModal, setViewModal] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);

  // ✅ ONLY CHANGE: data comes from hook now
  const {
    usersQuery,
    createUserMutation,
    updateUserMutation,
    deleteUserMutation,
  } = useUser();


const users = usersQuery.data?.data || [];

  const { search, setSearch, filteredData } = useTable({
    data: users,
    searchFields: ["FirstName", "MiddleName", "LastName", "Username"],
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
          {item.FirstName} {item.MiddleName ? `${item.MiddleName[0]}.` : ""} {item.LastName}

          <button
            onClick={() => setViewModal(item)}
            className="hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded"
          >
            <Info className="w-4 h-4 text-green-600 dark:text-green-400" />

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
            className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
          >
            <Edit className="w-3 h-3" />
          </button>

          <button
            onClick={() => setDeleteModal(item)}
            className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      ),
    },
  ];

  // LOADING (UNCHANGED STYLE PRESERVED)
  if (usersQuery.isLoading) {
  return <TablePageSkeleton />;
}



  if (usersQuery.isError) {
    return (
      <p className="text-red-600 dark:text-red-400 p-4">
        Error: {usersQuery.error.message}
      </p>
    );
  }

  return (
    <div className="w-full px-4">
      <div className="w-full rounded-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md p-6 space-y-4">

        {/* HEADER (UNCHANGED) */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-4">

          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            ALL USERS
          </h2>

          <button
            onClick={() => setAddModal(true)}
            className={pageButtonPrimary}
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

{/* ADD */}
{addModal && (
  <AddUserModal
    onClose={() => setAddModal(false)}
    onSubmit={(data) =>
      createUserMutation.mutateAsync(data)
        .then((res) => {
          setAddModal(false);
          toast.success(res.message);
        })
        .catch((error) => {
          throw error;
        })
    }
    loading={createUserMutation.isPending}
  />
)}

{/* EDIT */}
{editModal && (
  <EditUserModal
    selectedUser={editModal}
    onClose={() => setEditModal(null)}
    onSubmit={(data) =>
      updateUserMutation.mutateAsync({ id: editModal.UserID, data })
        .then((res) => {
          setEditModal(null);
          toast.success(res.message);
        })
        .catch((error) => {
          throw error;
        })
    }
    loading={updateUserMutation.isPending}
  />
)}

{/* DELETE */}
{deleteModal && (
  <DeleteUserModal
    user={deleteModal}
    onClose={() => setDeleteModal(null)}
    onConfirm={() =>
      deleteUserMutation.mutateAsync(deleteModal.UserID)
        .then((res) => {
          setDeleteModal(null);
          toast.success(res.message);
        })
        .catch(() => {
          toast.error("Failed to delete user. Please try again.");
        })
    }
    loading={deleteUserMutation.isPending}
  />
)}

    </div>
  );
}