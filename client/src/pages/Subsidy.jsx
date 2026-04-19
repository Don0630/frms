import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  SlidersHorizontal,
  Settings,
  Info,
  Eye
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSubsidy } from "../context/SubsidyContext"; 
import AddSubsidyModal from "../components/modals/AddSubsidyModal";

export default function Subsidy() {
  const { subsidy, loadSubsidy, error } = useSubsidy();
  const navigate = useNavigate();
  const [search, setSearch] = useState(""); 
  const [addSubsidyModal, setAddSubsidyModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadSubsidy();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const filtered = subsidy.filter((item) =>
    item.ProgramName?.toLowerCase().includes(search.toLowerCase()) ||
    item.Remarks?.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

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
            onClick={() => setAddSubsidyModal(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
          >
            <Plus className="w-4 h-4" /> Add Subsidy
          </button>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-wrap gap-2 items-center mb-3">
          <div className="flex items-center border rounded-lg px-3 py-2 bg-white w-64">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search program or remarks..."
              className="ml-2 outline-none text-sm w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button className="flex items-center gap-1 px-3 py-2 border rounded-lg bg-white text-sm">
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>

          <button className="flex items-center gap-1 px-3 py-2 border rounded-lg bg-white text-sm">
            <Settings className="w-4 h-4" /> Configurations
          </button>
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

                  {/* PROGRAM + INFO BUTTON */}
                    <td className="py-2 px-2 flex items-center gap-1">
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

                  {/* EMPTY ACTION COLUMN (keeps alignment clean) */}
<td className="px-2 py-2 text-center">
 <button
  onClick={() => navigate(`/subsidydetails/${item.DistributionID}`)}
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
        <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
          <span>
            Showing {currentItems.length} of {filtered.length} records
          </span>

          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
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
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              Next
            </button>
          </div>
        </div>

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