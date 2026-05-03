import { useState } from "react";
import { Plus, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
 pageButtonPrimary
} from "../components/common/PageUI";

import useSubsidy from "../hooks/useSubsidy";

import AddSubsidyModal from "../components/modals/AddSubsidyModal";

import useTable from "../hooks/useTable";
import usePagination from "../hooks/usePagination";

import DataTable from "../components/common/DataTable";
import Pagination from "../components/common/Pagination";
import TablePageSkeleton from "../components/skeletons/TablePageSkeleton";

export default function Subsidy() {
  const navigate = useNavigate();

  const [addSubsidyModal, setAddSubsidyModal] =
    useState(false);

  // ================= HOOK =================
  const { subsidyQuery, createSubsidyMutation } =
    useSubsidy();

  const subsidy = subsidyQuery.data?.data || [];

  // ================= TABLE =================
  const { search, setSearch, filteredData } =
    useTable({
      data: subsidy,
      searchFields: ["ProgramName", "Remarks"],
    });

  // ================= PAGINATION =================
  const {
    currentItems,
    currentPage,
    setCurrentPage,
    totalPages,
  } = usePagination(filteredData, 10);

  // reset page on search
  useState(() => {
    setCurrentPage(1);
  }, [search]);

  // ================= COLUMNS =================
  const columns = [
    {
      key: "ProgramName",
      label: "Program",
    },

    {
      key: "TotalAmount",
      label: "Total Amount",
      render: (item) =>
        `₱ ${Number(
          item.TotalAmount || 0
        ).toLocaleString()}`,
    },

    {
      key: "DistributionDate",
      label: "Date",
    },

    {
      key: "TotalDistributed",
      label: "Distributed",
      render: (item) =>
        `₱ ${Number(
          item.TotalDistributed || 0
        ).toLocaleString()}`,
    },

    {
      key: "TotalFarmers",
      label: "Farmers",
    },

    {
      key: "Remarks",
      label: "Remarks",
    },

    {
      key: "actions",
      label: "",
      render: (item) => (
        <div className="flex justify-center">
          <button
            onClick={() =>
              navigate(
                `/subsidy/${item.DistributionID}`
              )
            }
            className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
          >
            <Eye className="w-3 h-3" />
          </button>
        </div>
      ),
    },
  ];

  // ================= LOADING =================
  if (subsidyQuery.isLoading) {
    return <TablePageSkeleton />;
  }

  // ================= ERROR =================
  if (subsidyQuery.isError) {
    return (
      <p className="p-4 text-red-500">
        {subsidyQuery.error.message}
      </p>
    );
  }

  return (
    <div className="w-full px-4">
      <div className="w-full rounded-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md p-6 space-y-4">

        {/* HEADER */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            SUBSIDY RECORDS
          </h2>

          <button
            onClick={() => setAddSubsidyModal(true)}
            className={pageButtonPrimary}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">
              Add Subsidy
            </span>
          </button>
        </div>

        {/* TABLE */}
        <DataTable
          columns={columns}
          data={currentItems}
          search={search}
          setSearch={setSearch}
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

      {/* MODAL */}
      {addSubsidyModal && (
        <AddSubsidyModal
          onClose={() => setAddSubsidyModal(false)}
          onSubmit={(data) =>
            createSubsidyMutation.mutate(data, {
              onSuccess: () =>
                setAddSubsidyModal(false),
            })
          }
          loading={
            createSubsidyMutation.isPending
          }
        />
      )}
    </div>
  );
}