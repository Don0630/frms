import { useState, useEffect } from "react"; 
import { Plus, Mars, Venus, Edit, Eye, Users, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom"; 
import { showErrorToast, showSuccessToast } from "../utils/toastUtility";
import { formatDateNumeric } from "../utils/pageUtility";

import {
  pageButtonPrimary
} from "../components/common/PageUI";

import useFarmer from "../hooks/useFarmer";
import useTable from "../hooks/useTable";
import usePagination from "../hooks/usePagination";

import DataTable from "../components/common/DataTable";
import Pagination from "../components/common/Pagination";
import TablePageSkeleton from "../components/skeletons/TablePageSkeleton";

import AddFarmerModal from "../components/modals/AddFarmerModal";
import EditFarmerModal from "../components/modals/EditFarmerModal";
import DeleteFarmerModal from "../components/modals/DeleteFarmerModal";

export default function Farmers() {
  const navigate = useNavigate();

  const [filter, setFilter] = useState("All");
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);

  // ================= QUERY + MUTATION =================
  const { farmersQuery, createFarmerMutation, updateFarmerMutation, deleteFarmerMutation } = useFarmer();


  // ================= DATA =================
  const farmers = farmersQuery.data?.data || [];


  // ================= TABLE FILTER =================
  const { search, setSearch, filteredData } = useTable({
    data: farmers,
    searchFields: ["FirstName", "MiddleName", "LastName"],
    filterFn: (item) =>
      filter === "All" ||
      item.Gender?.toLowerCase() === filter.toLowerCase(),
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
  if (farmersQuery.isError) {
    const code = farmersQuery.error?.response?.data?.code;
    const message = farmersQuery.error?.response?.data?.message;

    if (code === "NOT_FOUND") return;
    showErrorToast(message);
  }
}, [farmersQuery.isError]);


  const getGenderIcon = (gender) => {
    if (gender?.toLowerCase() === "male")
      return <Mars className="w-4 h-4 text-blue-500" />;
    if (gender?.toLowerCase() === "female")
      return <Venus className="w-4 h-4 text-pink-500" />;
    return <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />;
  };


  // ================= TABLE COLUMNS =================
  const columns = [
    {
      key: "name",
      label: "Name",
      render: (item) => (
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
          {getGenderIcon(item.Gender)}
          {item.FirstName} {item.MiddleName ? `${item.MiddleName[0]}.` : ""} {item.LastName}
        </div>
      ),
    },
    { key: "Email", label: "Email" },
    { key: "ContactNumber", label: "Contact No." },
    {
      key: "RegistrationDate",
      label: "Registration Date",
      render: (item) => (
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
          {formatDateNumeric (item.RegistrationDate)} 
        </div>
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
          <button
            onClick={() => navigate(`/farmers/${item.FarmerID}`)}
            className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
          >
            <Eye className="w-3 h-3" />
          </button>
        </div>
      ),
    },
  ];


    // ================= LOADING =================
    if (farmersQuery.isLoading) return <TablePageSkeleton />;



  return (
    <div className="w-full px-4">

      <div className="w-full rounded-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md p-6 space-y-4">

        {/* HEADER */}
        <div className="flex flex-wrap justify-between items-center gap-3">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            ALL FARMERS
          </h2>

          <button
            onClick={() => setAddModal(true)}
            className={pageButtonPrimary}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Farmer</span>
          </button>
        </div>

        {/* TABLE */}
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

        {/* PAGINATION */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          currentItemsLength={currentItems.length}
          totalItemsLength={filteredData.length}
        />

      </div>

      {/* MODALS */}

{addModal && (
  <AddFarmerModal
    onClose={() => setAddModal(false)}
    loading={createFarmerMutation.isPending}
    onSubmit={(data) =>
      createFarmerMutation.mutateAsync(data)
        .then((res) => { setAddModal(false); showSuccessToast(res.message); })
    }
  />
)}

{editModal && (
  <EditFarmerModal
    selectedFarmer={editModal}
    onClose={() => setEditModal(null)}
    loading={updateFarmerMutation.isPending}
    onSubmit={(data) =>
      updateFarmerMutation.mutateAsync({ id: editModal.FarmerID, data })
        .then((res) => { setEditModal(null); showSuccessToast(res.message); })
    }
  />
)}

{deleteModal && (
  <DeleteFarmerModal
    farmer={deleteModal}
    onClose={() => setDeleteModal(null)}
    loading={deleteFarmerMutation.isPending}
    onConfirm={() =>
      deleteFarmerMutation.mutateAsync(deleteModal.FarmerID)
        .then((res) => { setDeleteModal(null); showSuccessToast(res.message); })
        .catch(() => {})
    }
  /> 
)}

    </div>
  );
}