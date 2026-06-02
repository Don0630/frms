import { useState, useEffect } from "react";
import { showErrorToast, showSuccessToast } from "../utils/toastUtility";
import { Plus, Info, Edit, User, Trash2 } from "lucide-react";


import {
 pageButtonPrimary
} from "../components/common/PageUI";

import useUser from "../hooks/useUser";
 
import AddUserModal from "../components/modals/AddUserModal.jsx";
import EditUserModal from "../components/modals/EditUserModal.jsx";
import DeleteUserModal from "../components/modals/DeleteUserModal.jsx";

import useTable from "../hooks/useTable";
import usePagination from "../hooks/usePagination";

import DataTable from "../components/common/DataTable";
import Pagination from "../components/common/Pagination";
import TablePageSkeleton from "../components/skeletons/TablePageSkeleton";

export default function Users() {


  // ================= QUERY + MUTATION =================
  const {
    usersQuery,
    createUserMutation,
    updateUserMutation,
    deleteUserMutation,
  } = useUser();

  // ================= DATA =================
const users = usersQuery.data?.data || [];

// ================= UI STATE =================
  const [filter, setFilter] = useState("All"); 
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);


  // ================= TABLE FILTER =================
  const { search, setSearch, filteredData } = useTable({
    data: users,
    searchFields: ["FirstName", "MiddleName", "LastName", "Username"],
    filterFn: (item) => filter === "All" || item.Role === filter,
  });

  // ================= PAGINATION =================
  const { currentPage, setCurrentPage, currentItems, totalPages } =
    usePagination(filteredData, 10);

  // ================= RESET PAGE =================
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter, setCurrentPage]);


// ================= ERROR =================
useEffect(() => {
  if (usersQuery.isError) {
    const code = usersQuery.error?.response?.data?.code;
    const message = usersQuery.error?.response?.data?.message;

    if (code === "NOT_FOUND") return;
    showErrorToast(message);
  }
}, [usersQuery.isError]);

  const columns = [
    {
      key: "name",
      label: "Name",
      render: (item) => (
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
          <User className="w-4 h-4 text-blue-500" />
          {item.FirstName} {item.MiddleName ? `${item.MiddleName[0]}.` : ""} {item.LastName}
 
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
 
  if (usersQuery.isLoading) return <TablePageSkeleton />;
 
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
 
{/* ADD */}
{addModal && (
  <AddUserModal
    onClose={() => setAddModal(false)}
    loading={createUserMutation.isPending}
    onSubmit={(data) =>
      createUserMutation.mutateAsync(data)
      .then((res) => { setAddModal(false); showSuccessToast(res.message); })
    }
  />
)}

{/* EDIT */}
{editModal && (
  <EditUserModal
    selectedUser={editModal}
    onClose={() => setEditModal(null)}
    loading={updateUserMutation.isPending}
    onSubmit={(data) =>
      updateUserMutation.mutateAsync({ id: editModal.UserID, data})
        .then((res) => { setEditModal(null); showSuccessToast(res.message); })
    }
  />
)}

{/* DELETE */}
{deleteModal && (
  <DeleteUserModal
    user={deleteModal}
    onClose={() => setDeleteModal(null)}
    loading={deleteUserMutation.isPending}
    onConfirm={() =>
      deleteUserMutation.mutateAsync(deleteModal.UserID)
      .then((res) => { setDeleteModal(null); showSuccessToast(res.message); })
      .catch(() => {})
    }
  />
)}

    </div>
  );
}