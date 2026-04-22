import { useState, useEffect } from "react";
import { Plus, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSubsidy } from "../context/SubsidyContext";

import AddSubsidyModal from "../components/modals/AddSubsidyModal";

import useTable from "../hooks/useTable";
import usePagination from "../hooks/usePagination";

import DataTable from "../components/common/DataTable";
import Pagination from "../components/common/Pagination";

export default function Subsidy() {
  const { subsidy, loadSubsidy, error } = useSubsidy();
  const navigate = useNavigate();

  const [addSubsidyModal, setAddSubsidyModal] = useState(false);

  useEffect(() => {
    loadSubsidy();
  }, []);

  // SEARCH ONLY
  const { search, setSearch, filteredData } = useTable({
    data: subsidy,
    searchFields: ["ProgramName", "Remarks"],
  });

  // PAGINATION ONLY
  const {
    currentItems,
    currentPage,
    setCurrentPage,
    totalPages,
  } = usePagination(filteredData, 10);

  // reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const columns = [
    { key: "ProgramName", label: "Program" },

    {
      key: "TotalAmount",
      label: "Total Amount",
      render: (item) => `₱ ${Number(item.TotalAmount).toLocaleString()}`,
    },

    { key: "DistributionDate", label: "Date" },

    {
      key: "TotalDistributed",
      label: "Distributed",
      render: (item) =>
        `₱ ${Number(item.TotalDistributed || 0).toLocaleString()}`,
    },

    { key: "TotalFarmers", label: "Farmers" },

    { key: "Remarks", label: "Remarks" },

    {
      key: "actions",
      label: "",
      render: (item) => (
        <div className="flex justify-center">
          <button
            onClick={() =>
              navigate(`/subsidydetails/${item.DistributionID}`)
            }
            className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
          >
            <Eye className="w-3 h-3" />
          </button>
        </div>
      ),
    },
  ];

  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="w-full p-4">

      <div className="w-full rounded-sm bg-white/30 backdrop-blur-sm shadow-md p-6 space-y-4">

        <div className="flex flex-wrap justify-between items-center gap-3">
          <h2 className="text-xl font-semibold text-gray-700">
            SUBSIDY RECORDS
          </h2>

          <button
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm shadow hover:bg-green-700"
            onClick={() => setAddSubsidyModal(true)}
          >
            <Plus className="w-4 h-4" /> Add Subsidy
          </button>
        </div>

        <DataTable
          columns={columns}
          data={currentItems}
          search={search}
          setSearch={setSearch}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          currentItemsLength={currentItems.length}
          totalItemsLength={filteredData.length}
        />

      </div>

      {addSubsidyModal && (
        <AddSubsidyModal
          onClose={() => setAddSubsidyModal(false)}
          onSuccess={() => {
            setAddSubsidyModal(false);
            loadSubsidy();
          }}
        />
      )}
    </div>
  );
}