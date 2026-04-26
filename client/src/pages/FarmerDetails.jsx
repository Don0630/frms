import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useFarmerDetails } from "../hooks/useFarmerDetails";
import { useFarm } from "../hooks/useFarm";

import useTable from "../hooks/useTable";
import usePagination from "../hooks/usePagination";

import {
  MapPin,
  Phone,
  Mail,
  User,
  ArrowLeft,
  Calendar,
  Layers,
  Trash2,
  Edit,
  Plus,
} from "lucide-react";

import DataTable from "../components/common/DataTable";
import Pagination from "../components/common/Pagination";

import AddFarmModal from "../components/modals/AddFarmModal";
import EditFarmModal from "../components/modals/EditFarmModal";
import DeleteFarmModal from "../components/modals/DeleteFarmModal";

export default function FarmerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ================= DATA =================
  const { data, isLoading, isError } = useFarmerDetails(id);

  // ================= FARM MUTATIONS =================
  const {
    createFarmMutation,
    updateFarmMutation,
    deleteFarmMutation,
  } = useFarm(id);

  // ================= MODALS =================
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);

  // ================= NORMALIZE =================
  const farmer = data?.data ?? data ?? null;
  const farms = farmer?.Farms ?? [];

  // ================= TABLE =================
  const { search, setSearch, filteredData } = useTable({
    data: farms,
    searchFields: ["FarmBarangay", "FarmMunicipality", "FarmProvince"],
  });

  // ================= PAGINATION =================
  const { currentPage, setCurrentPage, currentItems, totalPages } =
    usePagination(filteredData, 5);

  // ================= LOADING =================
  if (isLoading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950">
      
      <div className="flex flex-col items-center gap-3">

        {/* Spinner */}
        <div className="w-10 h-10 border-4 border-gray-300 dark:border-gray-700 border-t-green-500 rounded-full animate-spin" />

        {/* Text */}
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Loading farmer details...
        </p>

      </div>

    </div>
  );
}

  // ================= ERROR =================
  if (isError || !farmer) {
    return <div className="p-4 text-red-500">Farmer not found</div>;
  }

  const fullName =
    `${farmer.FirstName} ${farmer.MiddleName || ""} ${farmer.LastName}`.trim();

  // ================= COLUMNS =================
  const columns = [
    {
      key: "location",
      label: "Location",
      render: (item) => (
        <div className="text-gray-800 dark:text-gray-200">
          <div className="font-medium">{item.FarmBarangay}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {item.FarmMunicipality}, {item.FarmProvince}
          </div>
        </div>
      ),
    },
    {
      key: "size",
      label: "Size",
      render: (item) => (
        <span className="text-green-700 dark:text-green-400 font-semibold">
          {item.FarmSize} ha
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
            className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
          >
            <Edit className="w-3 h-3" />
          </button>

          <button
            onClick={() => setDeleteModal(item)}
            className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="p-6 space-y-6 bg-gray-100 dark:bg-gray-950 min-h-screen text-gray-900 dark:text-gray-100">

        {/* BACK */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* FARMER INFO */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow border border-gray-200 dark:border-gray-800">
          <h1 className="text-2xl font-bold">{fullName}</h1>

          <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">

            <div className="flex items-center gap-2">
              <User size={14} />
              {farmer.Gender}
            </div>

            <div className="flex items-center gap-2">
              <MapPin size={14} />
              {farmer.Barangay}, {farmer.Municipality}
            </div>

            <div className="flex items-center gap-2">
              <Phone size={14} />
              {farmer.ContactNumber}
            </div>

            <div className="flex items-center gap-2">
              <Mail size={14} />
              {farmer.Email}
            </div>

            <div className="flex items-center gap-2">
              <Calendar size={14} />
              {farmer.RegistrationDate}
            </div>

          </div>
        </div>

        {/* FARMS TABLE */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow border border-gray-200 dark:border-gray-800">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <Layers size={16} />
              Farms
            </h2>

            <button
              onClick={() => setAddModal(true)}
              className="flex items-center gap-2 bg-green-600 dark:bg-green-500 text-white px-3 sm:px-4 py-2 rounded-lg text-sm shadow hover:bg-green-700 dark:hover:bg-green-400"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Farm</span>
            </button>
          </div>

          {/* TABLE */}
          <DataTable
            columns={columns}
            data={currentItems}
            search={search}
            setSearch={setSearch}
            emptyText="No farms registered yet"
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
      </div>

      {/* ================= MODALS ================= */}

      {addModal && (
        <AddFarmModal
          farmer={farmer}
          onClose={() => setAddModal(false)}
          loading={createFarmMutation.isPending}
          onSubmit={(data) =>
            createFarmMutation.mutate(
              {
                FarmerID: farmer.FarmerID,
                ...data,
              },
              {
                onSuccess: () => setAddModal(false),
              }
            )
          }
        />
      )}

   {editModal && (
  <EditFarmModal
    selectedFarm={editModal}
    onClose={() => setEditModal(null)}
    loading={updateFarmMutation.isPending}
    onSubmit={(form) =>
      updateFarmMutation.mutate(
        {
          id: editModal.FarmID,
          data: form,
        },
        {
          onSuccess: () => setEditModal(null),
        }
      )
    }
  />
)}

     {deleteModal && (
  <DeleteFarmModal
    farm={deleteModal}
    loading={deleteFarmMutation.isPending}
    onClose={() => setDeleteModal(null)}
    onConfirm={() =>
      deleteFarmMutation.mutate(deleteModal.FarmID, {
        onSuccess: () => setDeleteModal(null),
      })
    }
  />
)}
    </>
  );
}