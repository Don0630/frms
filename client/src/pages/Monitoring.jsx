import { useState, useEffect } from "react";
import { Plus, Users, Mars, Venus, Edit, Trash2 } from "lucide-react";
import { pageButtonPrimary } from "../components/common/PageUI";
import { showErrorToast, showSuccessToast } from "../utils/toastUtility";
import { formatDateNumeric } from "../utils/pageUtility";

import useMonitoring from "../hooks/useMonitoring";

import AddMonitoringModal from "../components/modals/AddMonitoringModal";
import EditMonitoringModal from "../components/modals/EditMonitoringModal";
import DeleteMonitoringModal from "../components/modals/DeleteMonitoringModal";

import useTable from "../hooks/useTable";
import usePagination from "../hooks/usePagination";

import DataTable from "../components/common/DataTable";
import Pagination from "../components/common/Pagination";
import TablePageSkeleton from "../components/skeletons/TablePageSkeleton";

export default function Monitoring() {
  const {
    monitoringQuery,
    createMonitoringMutation,
    updateMonitoringMutation,
    deleteMonitoringMutation,
  } = useMonitoring();

  const monitoring = monitoringQuery.data?.data || [];

  const [filter, setFilter] = useState("All");
  const [addMonitoringModal, setAddMonitoringModal] = useState(false);
  const [editMonitoringModal, setEditMonitoringModal] = useState(null);
  const [deleteMonitoringModal, setDeleteMonitoringModal] = useState(null);

  const { search, setSearch, filteredData } = useTable({
    data: monitoring,
    searchFields: ["FirstName", "LastName", "CropName", "Breed"],
    filterFn: (item) => filter === "All" || item.Gender?.toLowerCase() === filter.toLowerCase(),
  });

  const { currentPage, setCurrentPage, currentItems, totalPages } =
    usePagination(filteredData, 10);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter, setCurrentPage]);

  useEffect(() => {
    if (monitoringQuery.isError) {
      const code = monitoringQuery.error?.response?.data?.code;
      const message = monitoringQuery.error?.response?.data?.message;
      if (code === "NOT_FOUND") return;
      showErrorToast(message);
    }
  }, [monitoringQuery.isError]);

  const getGenderIcon = (gender) => {
    if (gender?.toLowerCase() === "male") return <Mars className="w-4 h-4 text-blue-500" />;
    if (gender?.toLowerCase() === "female") return <Venus className="w-4 h-4 text-pink-500" />;
    return <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />;
  };

  const columns = [
    {
      key: "farmer",
      label: "Farmer",
      render: (item) => (
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
          {getGenderIcon(item.Gender)}
          {item.FirstName} {item.MiddleName ? `${item.MiddleName[0]}.` : ""} {item.LastName}
        </div>
      ),
    },
    {
      key: "CropName",
      label: "Crop",
      render: (item) => <span>{item.CropName || "-"}</span>,
    },
    {
      key: "Breed",
      label: "Livestock",
      render: (item) => <span>{item.Breed || "-"}</span>,
    },
    {
      key: "ProductionVolume",
      label: "Production",
      render: (item) => <span>{item.ProductionVolume || "-"}</span>,
    },
    {
      key: "ReportDate",
      label: "Date",
      render: (item) => <span>{formatDateNumeric(item.ReportDate)}</span>,
    },
    {
      key: "actions",
      label: "",
      render: (item) => (
        <div className="flex justify-center gap-1">
          <button
            onClick={() => setEditMonitoringModal(item)}
            className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
          >
            <Edit className="w-3 h-3" />
          </button>
          <button
            onClick={() => setDeleteMonitoringModal(item)}
            className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      ),
    },
  ];

  if (monitoringQuery.isLoading) return <TablePageSkeleton />;

  return (
    <div className="w-full px-4">
      <div className="w-full rounded-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md p-6 space-y-4">

        <div className="flex flex-wrap justify-between items-center gap-3">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            MONITORING RECORDS
          </h2>
          <button onClick={() => setAddMonitoringModal(true)} className={pageButtonPrimary}>
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Report</span>
          </button>
        </div>

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

      {/* ADD MODAL */}
      {addMonitoringModal && (
        <AddMonitoringModal
          onClose={() => setAddMonitoringModal(false)}
          loading={createMonitoringMutation.isPending}
          onSubmit={(data) =>
            createMonitoringMutation.mutateAsync(data)
              .then((res) => { setAddMonitoringModal(false); showSuccessToast(res.message); })
          }
        />
      )}

      {/* EDIT MODAL */}
      {editMonitoringModal && (
        <EditMonitoringModal
          monitoring={editMonitoringModal}
          onClose={() => setEditMonitoringModal(null)}
          loading={updateMonitoringMutation.isPending}
          onSubmit={(data) =>
            updateMonitoringMutation.mutateAsync({ id: editMonitoringModal.ReportID, data })
              .then((res) => { setEditMonitoringModal(null); showSuccessToast(res.message); })
          }
        />
      )}

      {/* DELETE MODAL */}
      {deleteMonitoringModal && (
        <DeleteMonitoringModal
          monitoring={deleteMonitoringModal}
          onClose={() => setDeleteMonitoringModal(null)}
          loading={deleteMonitoringMutation.isPending}
          onConfirm={() =>
            deleteMonitoringMutation.mutateAsync(deleteMonitoringModal.ReportID)
              .then((res) => { setDeleteMonitoringModal(null); showSuccessToast(res.message); })
              .catch(() => {})
          }
        />
      )}

    </div>
  );
}