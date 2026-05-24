import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { Plus, Eye, Edit, Info } from "lucide-react"; 
import { useNavigate } from "react-router-dom";
import { formatDateNumeric } from "../utils/pageUtility";

import { pageButtonPrimary } from "../components/common/PageUI";
import useSubsidy from "../hooks/useSubsidy";
 
import AddSubsidyModal from "../components/modals/AddSubsidyModal";
import EditSubsidyModal from "../components/modals/EditSubsidyModal";

import useTable from "../hooks/useTable";
import usePagination from "../hooks/usePagination";
import DataTable from "../components/common/DataTable";
import Pagination from "../components/common/Pagination";
import TablePageSkeleton from "../components/skeletons/TablePageSkeleton";
import { showSuccessToast } from "../utils/toastUtility";

export default function Subsidy() {
  const navigate = useNavigate();
 
  const [addSubsidyModal, setAddSubsidyModal] = useState(false);
  const [editModal, setEditModal] = useState(null);

  // ================= HOOK =================
  const { subsidyQuery, createSubsidyMutation, updateSubsidyMutation } = useSubsidy();

  const subsidy = subsidyQuery.data?.data || [];

  // ================= TABLE =================
  const { search, setSearch, filteredData } = useTable({
    data: subsidy,
    searchFields: ["ProgramName", "Remarks"],
  });

  // ================= PAGINATION =================
  const { currentItems, currentPage, setCurrentPage, totalPages } = usePagination(filteredData, 10);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

// ================= ERROR =================
useEffect(() => {
  if (subsidyQuery.isError) {
    const code = subsidyQuery.error?.response?.data?.code;
    const message = subsidyQuery.error?.response?.data?.message;

    if (code === "NOT_FOUND") return;
    showErrorToast(message);
  }
}, [subsidyQuery.isError]);

  // ================= COLUMNS =================
  const columns = [
    { key: "ProgramName", label: "Program"
    },
    {
      key: "TotalAmount",
      label: "Total Amount",
      render: (item) => `₱ ${Number(item.TotalAmount || 0).toLocaleString()}`,
    },
    { key: "DistributionDate", 
      label: "Date",
      render: (item) => `${formatDateNumeric(item.DistributionDate)}`,
    },
    {
      key: "TotalDistributed",
      label: "Distributed",
      render: (item) => `₱ ${Number(item.TotalDistributed || 0).toLocaleString()}`,
    },
    { key: "TotalFarmers", label: "Farmers" },
    { key: "Remarks", label: "Remarks" },
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
            onClick={() => navigate(`/subsidy/${item.DistributionID}`)}
            className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
          >
            <Eye className="w-3 h-3" />
          </button>
        </div>
      ),
    },
  ];

  // ================= LOADING =================
  if (subsidyQuery.isLoading) return <TablePageSkeleton />;
 
  return (
    <div className="w-full px-4">
      <div className="w-full rounded-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md p-6 space-y-4">

        {/* HEADER */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            SUBSIDY RECORDS
          </h2>
          <button onClick={() => setAddSubsidyModal(true)} className={pageButtonPrimary}>
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Subsidy</span>
          </button>
        </div>

        {/* TABLE */}
        <DataTable columns={columns} data={currentItems} search={search} setSearch={setSearch} />

        {/* PAGINATION */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          currentItemsLength={currentItems.length}
          totalItemsLength={filteredData.length}
        />
      </div>


 
{/* ADD MODAL */}
{addSubsidyModal && (
  <AddSubsidyModal
    onClose={() => setAddSubsidyModal(false)}
    loading={createSubsidyMutation.isPending}
    onSubmit={(data) =>
      createSubsidyMutation.mutate(data, {
        onSuccess: (res) => { setAddSubsidyModal(false); showSuccessToast(res.message); }
      })
    }
  />
)}

{/* EDIT MODAL */}
{editModal && (
  <EditSubsidyModal
    selectedSubsidy={editModal}
    onClose={() => setEditModal(null)}
    loading={updateSubsidyMutation.isPending}
    onSubmit={(data) =>
      updateSubsidyMutation.mutate({ id: editModal.DistributionID, data }, {
        onSuccess: (res) => { setEditModal(null); showSuccessToast(res.message); }
      })
    }
  />
)}

    </div>
  );
}