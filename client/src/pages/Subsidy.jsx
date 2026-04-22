import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  SlidersHorizontal,
  Settings,
  Eye
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSubsidy } from "../context/SubsidyContext";
import AddSubsidyModal from "../components/modals/AddSubsidyModal";
import usePagination from "../hooks/usePagination";
import useDebounce from "../hooks/useDebounce";
import Pagination from "../components/common/Pagination";

export default function Subsidy() {
  const { subsidy, loadSubsidy, error } = useSubsidy();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [addSubsidyModal, setAddSubsidyModal] = useState(false);

  // 🔥 debounce search input
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    loadSubsidy();
  }, []);

  // 🔍 FILTER using debounced value
  const filtered = subsidy.filter((item) =>
    item.ProgramName?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    item.Remarks?.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  // 📄 pagination hook
  const {
    currentItems,
    currentPage,
    setCurrentPage,
    totalPages
  } = usePagination(filtered, 10);

  // reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="w-full h-full p-4">
      <div className="w-full rounded-sm bg-white/30 backdrop-blur-sm shadow-md p-6">

        {/* HEADER */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
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

        {/* SEARCH */}
        <div className="flex items-center border rounded-lg px-3 py-2 bg-white w-64 mb-3">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search program or remarks..."
            className="ml-2 outline-none text-sm w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* TABLE */}
        <div className="w-full border rounded-lg overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">

            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="py-3 px-2 text-left">Program</th>
                <th className="py-3 px-2 text-left">Total Amount</th>
                <th className="py-3 px-2 text-left">Date</th>
                <th className="py-3 px-2 text-left">Total Distributed</th>
                <th className="py-3 px-2 text-left">Total Farmers</th>
                <th className="py-3 px-2 text-left">Remarks</th>
                <th className="py-3 px-2 text-center">
                  <Settings className="w-5 h-5 mx-auto" />
                </th>
              </tr>
            </thead>

            <tbody>
              {currentItems.map((item, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">

                  <td className="py-2 px-2">
                    {item.ProgramName}
                  </td>

                  <td className="py-2 px-2">
                    ₱ {Number(item.TotalAmount).toLocaleString()}
                  </td>

                  <td className="py-2 px-2">
                    {item.DistributionDate}
                  </td>

                  <td className="py-2 px-2 text-green-600 font-medium">
                    ₱ {Number(item.TotalDistributed || 0).toLocaleString()}
                  </td>

                  <td className="py-2 px-2">
                    {item.TotalFarmers || 0}
                  </td>

                  <td className="py-2 px-2">
                    {item.Remarks}
                  </td>

                  <td className="px-2 py-2 text-center">
                    <button
                      onClick={() =>
                        navigate(`/subsidydetails/${item.DistributionID}`)
                      }
                      className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                    >
                      <Eye className="w-3 h-3" />
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {/* PAGINATION */}
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  setCurrentPage={setCurrentPage}
  currentItemsLength={currentItems.length}
  totalItemsLength={filtered.length}
/>

      </div>

      {/* MODAL */}
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