import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSubsidy } from "../context/SubsidyContext.jsx";
import AddFarmerSubsidyModal from "../components/modals/AddFarmerSubsidyModal";

import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Users,
  CheckCircle2,
  Plus,
  Search,
} from "lucide-react";

export default function SubsidyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    subsidy,
    loadSubsidy,
    farmers,
    loadFarmersPerSubsidy,
    clearFarmers,
    updateDistributeSubsidy,
  } = useSubsidy();

  const [selectedSubsidy, setSelectedSubsidy] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [loadingRow, setLoadingRow] = useState(null);

  // SEARCH + PAGINATION
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // LOAD DATA
  useEffect(() => {
    loadSubsidy();
  }, []);

  useEffect(() => {
    if (!id) return;

    loadFarmersPerSubsidy(id);
    return () => clearFarmers();
  }, [id]);

  // FIND SUBSIDY
  useEffect(() => {
    if (!subsidy?.length) return;

    const found = subsidy.find(
      (s) => String(s.DistributionID) === String(id)
    );

    setSelectedSubsidy(found || null);
  }, [subsidy, id]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, farmers]);

  if (!selectedSubsidy) {
    return <div className="p-6 text-gray-500">Loading subsidy...</div>;
  }

  const totalAmount = Number(selectedSubsidy.TotalAmount || 0);
  const distributed = Number(selectedSubsidy.TotalDistributed || 0);
  const remaining = totalAmount - distributed;

  // FILTER
  const filteredFarmers = farmers.filter((f) =>
    `${f.FirstName} ${f.LastName}`.toLowerCase().includes(search.toLowerCase()) ||
    f.ContactNumber?.toLowerCase().includes(search.toLowerCase())
  );

  // PAGINATION
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFarmers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredFarmers.length / itemsPerPage);

  // DISTRIBUTE
  const handleDistribute = async (f) => {
    try {
      setLoadingRow(f.DistributionDetailsID);

      await updateDistributeSubsidy(f.DistributionDetailsID, {
        IsDistributed: 1,
      });

      await loadFarmersPerSubsidy(id);
    } finally {
      setLoadingRow(null);
    }
  };

  return (
    <div className="w-full min-h-screen p-4 space-y-6 bg-gray-100">

      {/* BACK HEADER */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-black"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <span className="text-sm text-gray-500">
          Subsidy Details
        </span>
      </div>

      {/* SUBSIDY CARD */}
      <div className="w-full bg-white/40 backdrop-blur-md shadow-md rounded-xl p-6 border">

        <h1 className="text-2xl font-bold text-gray-800">
          {selectedSubsidy.ProgramName}
        </h1>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">

          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
            <Calendar className="text-green-600" size={18} />
            <div>
              <p className="text-gray-500">Distribution Date</p>
              <p className="font-medium">{selectedSubsidy.DistributionDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
            <DollarSign className="text-blue-600" size={18} />
            <div>
              <p className="text-gray-500">Total Amount</p>
              <p className="font-semibold">₱ {totalAmount.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
            <Users className="text-purple-600" size={18} />
            <div>
              <p className="text-gray-500">Farmers</p>
              <p className="font-semibold">{selectedSubsidy.TotalFarmers || 0}</p>
            </div>
          </div>

        </div>

        {/* SUMMARY */}
        <div className="mt-6 grid grid-cols-2 gap-4">

          <div className="p-5 rounded-lg bg-green-50 border">
            <p className="text-sm text-gray-500">Distributed</p>
            <p className="text-2xl font-bold text-green-700">
              ₱ {distributed.toLocaleString()}
            </p>
          </div>

          <div className="p-5 rounded-lg bg-yellow-50 border">
            <p className="text-sm text-gray-500">Remaining</p>
            <p className="text-2xl font-bold text-yellow-700">
              ₱ {remaining.toLocaleString()}
            </p>
          </div>

        </div>
      </div>

      {/* FARMERS TABLE (FIXED DESIGN) */}
      <div className="w-full bg-white/30 backdrop-blur-sm shadow-md p-6 rounded-sm">

        {/* HEADER */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Users className="text-green-600" size={18} />
            <h2 className="text-xl font-semibold text-gray-700">
              FARMERS DISTRIBUTION
            </h2>
          </div>

          <button
            onClick={() => setAddModal(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
          >
            <Plus className="w-4 h-4" />
            Add Farmer
          </button>
        </div>

        {/* CONTROLS (SEPARATE ROW LIKE SUBSIDY PAGE) */}
        <div className="flex flex-wrap gap-2 items-center mb-3">
          <div className="flex items-center border rounded-lg px-3 py-2 bg-white w-64">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search farmer..."
              className="ml-2 outline-none text-sm w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="w-full border rounded-lg overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">

            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="py-3 px-2 text-left">Farmer</th>
                <th className="py-3 px-2 text-left">Contact</th>
                <th className="py-3 px-2 text-left">Amount</th>
                <th className="py-3 px-2 text-center">Status</th>
                <th className="py-3 px-2 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {currentItems.map((f) => (
                <tr key={f.DistributionDetailsID} className="border-t hover:bg-gray-50">

                  <td className="py-2 px-2 font-medium">
                    {f.FirstName} {f.LastName}
                  </td>

                  <td className="py-2 px-2 text-gray-600">
                    {f.ContactNumber || "N/A"}
                  </td>

                  <td className="py-2 px-2 font-semibold text-green-700">
                    ₱ {Number(f.Amount || 0).toLocaleString()}
                  </td>

                  <td className="py-2 px-2 text-center">
                    {f.IsDistributed ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                        <CheckCircle2 size={12} className="inline mr-1" />
                        Distributed
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                        Pending
                      </span>
                    )}
                  </td>

                  <td className="py-2 px-2 text-center">
                    <button
                      disabled={f.IsDistributed || loadingRow === f.DistributionDetailsID}
                      onClick={() => handleDistribute(f)}
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        f.IsDistributed
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      {loadingRow === f.DistributionDetailsID
                        ? "Saving..."
                        : f.IsDistributed
                        ? "Done"
                        : "Distribute"}
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
          <span>
            Showing {currentItems.length} of {filteredFarmers.length}
          </span>

          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? "bg-green-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              Next
            </button>
          </div>
        </div>

      </div>

      {/* MODAL */}
      {addModal && (
        <AddFarmerSubsidyModal
          distributionID={id}
          onClose={() => setAddModal(false)}
          onSuccess={() => {
            loadFarmersPerSubsidy(id);
            loadSubsidy();
          }}
        />
      )}

    </div>
  );
}