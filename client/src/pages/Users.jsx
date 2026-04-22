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

  // TABLE LOGIC (search + filter)
  const { search, setSearch, filteredData } = useTable({
    data: users,
    searchFields: ["FirstName", "LastName", "Username"],
    filterFn: (item) => filter === "All" || item.Role === filter,
  });

  // PAGINATION
  const {
    currentPage,
    setCurrentPage,
    currentItems,
    totalPages,
  } = usePagination(filteredData, 10);

  // RESET PAGE ON CHANGE (IMPORTANT FIX)
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter, filteredData, setCurrentPage]);

  const columns = [
    {
      key: "name",
      label: "Name",
      render: (item) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-blue-500" />
          {item.FirstName} {item.LastName}

          <button
            onClick={() => setViewModal(item)}
            className="hover:bg-gray-200 p-1 rounded"
          >
            <Info className="w-4 h-4 text-blue-500" />
          </button>
        </div>
      ),
    },
    { key: "Username", label: "Username" },
    { key: "Role", label: "Role" },
    { key: "ContactNumber", label: "Contact" },
    { key: "Email", label: "Email" },
    {
      key: "actions",
      label: "",
      render: () => (
        <div className="flex justify-center">
          <button className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700">
            <Edit className="w-3 h-3" />
          </button>
        </div>
      ),
    },
  ];

  if (error)
    return <p className="text-red-500 p-4">Error: {error}</p>;

  return (
    <div className="w-full p-4">
      <div className="w-full bg-white/30 backdrop-blur-sm shadow-md rounded-lg p-6 flex flex-col gap-4">

        {/* HEADER */}
        <div className="flex flex-wrap justify-between items-center gap-3">
          <h2 className="text-xl font-semibold text-gray-700">
            ALL USERS
          </h2>

          <button
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
            onClick={() => setAddModal(true)}
          >
            <Plus className="w-4 h-4" /> Add User
          </button>
        </div>

        {/* TABLE */}
        {loading ? (
          <p>Loading users...</p>
        ) : (
          <>
            <DataTable
              columns={columns}
              data={currentItems}
              search={search}
              setSearch={setSearch}
              filters={
                <div className="flex gap-4 text-sm">
                  {["All", "Admin", "Staff"].map((item) => (
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
        <ViewUserModal user={viewModal} onClose={() => setViewModal(null)} />
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