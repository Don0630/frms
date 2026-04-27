import { useState, useEffect } from "react";
import { Plus, Info, Edit } from "lucide-react";

import useProgram from "../hooks/useProgram";

import ViewProgramModal from "../components/modals/ViewProgramModal";
import AddProgramModal from "../components/modals/AddProgramModal";
import EditProgramModal from "../components/modals/EditProgramModal";

import useTable from "../hooks/useTable";
import usePagination from "../hooks/usePagination";

import DataTable from "../components/common/DataTable";
import Pagination from "../components/common/Pagination";
import TablePageSkeleton from "../components/skeletons/TablePageSkeleton";

export default function Programs() {
  const [filter, setFilter] = useState("All");
  const [viewModal, setViewModal] = useState(null);
  const [addProgramModal, setAddProgramModal] = useState(false);
  const [editModal, setEditModal] = useState(null);

  // ================= PROGRAM HOOK =================
  const {
    programsQuery,
    createProgramMutation,
    updateProgramMutation,
  } = useProgram();

  const program = programsQuery.data?.data || [];

  // ================= TABLE FILTER =================
  const { search, setSearch, filteredData } = useTable({
    data: program,
    searchFields: ["ProgramName"],
    filterFn: (item) =>
      filter === "All" || item.Status === filter,
  });

  // ================= PAGINATION =================
  const {
    currentPage,
    setCurrentPage,
    currentItems,
    totalPages,
  } = usePagination(filteredData, 10);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter, setCurrentPage]);

  // ================= TABLE COLUMNS =================
  const columns = [
    {
      key: "ProgramName",
      label: "Program",
      render: (item) => (
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
          {item.ProgramName}

          <button
            onClick={() => setViewModal(item)}
            className="hover:bg-gray-200 dark:hover:bg-gray-700 p-1 rounded"
          >
            <Info className="w-4 h-4 text-blue-500" />
          </button>
        </div>
      ),
    },

    { key: "StartDate", label: "Start" },

    { key: "EndDate", label: "End" },

    {
      key: "Budget",
      label: "Budget",
      render: (item) =>
        `₱ ${Number(item.Budget || 0).toLocaleString()}`,
    },

    {
      key: "Status",
      label: "Status",
      render: (item) => (
        <span
          className={`px-2 py-1 rounded text-white text-xs ${
            item.Status === "Active"
              ? "bg-green-600"
              : item.Status === "Completed"
              ? "bg-blue-600"
              : item.Status === "Dropped"
              ? "bg-red-600"
              : "bg-gray-400"
          }`}
        >
          {item.Status}
        </span>
      ),
    },

    {
      key: "actions",
      label: "",
      render: (item) => (
        <div className="flex justify-center">
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

  // ================= ERROR =================
  if (programsQuery.isError) {
    return (
      <div className="p-4 text-red-600 dark:text-red-400">
        {programsQuery.error.message}
      </div>
    );
  }

  // ================= LOADING =================
  if (programsQuery.isLoading) {
    return <TablePageSkeleton />;
  }

  return (
    <div className="w-full min-h-screen p-4 bg-gray-100 dark:bg-gray-950">

      <div className="w-full rounded-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md p-6">

        {/* HEADER */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-4">

          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            ALL PROGRAMS
          </h2>

          <button
            onClick={() => setAddProgramModal(true)}
            className="flex items-center gap-2 bg-green-600 dark:bg-green-500 text-white px-3 sm:px-4 py-2 rounded-lg text-sm shadow hover:bg-green-700 dark:hover:bg-green-400"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">
              Add Program
            </span>
          </button>

        </div>

        {/* TABLE */}
        <DataTable
          columns={columns}
          data={currentItems}
          search={search}
          setSearch={setSearch}
          filters={
            <div className="flex gap-4 text-sm text-gray-700 dark:text-gray-300">
              {["All", "Active", "Completed", "Dropped"].map(
                (item) => (
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
                )
              )}
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

      {/* VIEW */}
      {viewModal && (
        <ViewProgramModal
          program={viewModal}
          onClose={() => setViewModal(null)}
        />
      )}

      {/* ADD */}
      {addProgramModal && (
        <AddProgramModal
          onClose={() => setAddProgramModal(false)}
          onSubmit={(data) =>
            createProgramMutation.mutate(data, {
              onSuccess: () => setAddProgramModal(false),
            })
          }
          loading={createProgramMutation.isPending}
        />
      )}

      {/* EDIT */}
      {editModal && (
        <EditProgramModal
          selectedProgram={editModal}
          onClose={() => setEditModal(null)}
          onSubmit={(data) =>
            updateProgramMutation.mutate(
              {
                id: editModal.ProgramID,
                data,
              },
              {
                onSuccess: () => setEditModal(null),
              }
            )
          }
          loading={updateProgramMutation.isPending}
        />
      )}

    </div>
  );
}