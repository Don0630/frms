import { useState } from "react";
import {
  Users,
  PhilippinePeso,
  Plus,
  Settings
} from "lucide-react";

export default function ProgramDetails() {

  // 🟢 RAW PROGRAM DATA
  const program = {
    ProgramID: 1,
    ProgramName: "Livestock Development",
    Description: "Support farmers with livestock breeding and care programs.",
    Budget: 500000
  };

  // 🟢 RAW FARMERS
  const farmers = [
    { FarmerID: 1, FirstName: "Juan", LastName: "Dela Cruz", FarmLocation: "Quezon City" },
    { FarmerID: 2, FirstName: "Maria", LastName: "Santos", FarmLocation: "Cebu City" },
    { FarmerID: 3, FirstName: "Pedro", LastName: "Garcia", FarmLocation: "Davao City" },
    { FarmerID: 4, FirstName: "Ana", LastName: "Reyes", FarmLocation: "Baguio" }
  ];

  // 🟢 Assigned farmers (default = all)
  const [assignedFarmers] = useState(farmers);

  // 🟢 Subsidy state
  const [amounts, setAmounts] = useState({});
  const [records, setRecords] = useState([]);

  const [activeTab, setActiveTab] = useState("farmers");

  // Handle amount input
  const handleAmountChange = (farmerId, value) => {
    setAmounts((prev) => ({
      ...prev,
      [farmerId]: value
    }));
  };

  // Distribute subsidy
  const handleDistribute = (farmer) => {
    const amount = amounts[farmer.FarmerID];

    if (!amount) return alert("Enter amount");

    const newRecord = {
      FarmerID: farmer.FarmerID,
      Name: `${farmer.FirstName} ${farmer.LastName}`,
      Amount: Number(amount)
    };

    setRecords((prev) => [...prev, newRecord]);

    // clear input
    setAmounts((prev) => ({
      ...prev,
      [farmer.FarmerID]: ""
    }));
  };

  // Budget calculation
  const totalDistributed = records.reduce(
    (sum, r) => sum + r.Amount,
    0
  );

  const remaining = program.Budget - totalDistributed;

  return (
    <div className="w-full h-full p-4">
      <div className="bg-white/30 backdrop-blur-sm shadow-md p-6 rounded-sm">

        {/* HEADER */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            {program.ProgramName}
          </h2>

          <p className="text-sm text-gray-600">
            {program.Description}
          </p>

          {/* Budget Info */}
          <div className="mt-3 text-sm">
            <p>Budget: ₱{program.Budget.toLocaleString()}</p>
            <p>Distributed: ₱{totalDistributed.toLocaleString()}</p>
            <p className="text-green-600 font-semibold">
              Remaining: ₱{remaining.toLocaleString()}
            </p>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-4 border-b mb-4">
          <button
            onClick={() => setActiveTab("farmers")}
            className={`pb-2 ${
              activeTab === "farmers"
                ? "border-b-2 border-blue-500 text-blue-500"
                : ""
            }`}
          >
            <Users className="inline w-4 h-4 mr-1" />
            Farmers
          </button>

          <button
            onClick={() => setActiveTab("subsidy")}
            className={`pb-2 ${
              activeTab === "subsidy"
                ? "border-b-2 border-green-500 text-green-500"
                : ""
            }`}
          >
            <PhilippinePeso className="inline w-4 h-4 mr-1" />
            Subsidy
          </button>
        </div>

        {/* FARMERS TAB */}
        {activeTab === "farmers" && (
          <div>

            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-gray-600">
                Assigned Farmers
              </h3>

              <button
                onClick={() => alert("Assign Farmer Modal soon")}
                className="flex items-center gap-2 bg-green-600 text-white px-3 py-1 rounded text-sm"
              >
                <Plus className="w-4 h-4" /> Assign Farmer
              </button>
            </div>

            <div className="border rounded-lg overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    <th className="py-2 px-2 text-left">Name</th>
                    <th className="py-2 px-2 text-left">Location</th>
                  </tr>
                </thead>

                <tbody>
                  {assignedFarmers.map((f) => (
                    <tr key={f.FarmerID} className="border-t">
                      <td className="py-2 px-2">
                        {f.FirstName} {f.LastName}
                      </td>
                      <td className="py-2 px-2">
                        {f.FarmLocation}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* SUBSIDY TAB */}
        {activeTab === "subsidy" && (
          <div>

            <h3 className="text-sm font-semibold text-gray-600 mb-3">
              Distribute Subsidy
            </h3>

            <div className="border rounded-lg overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    <th className="py-2 px-2 text-left">Farmer</th>
                    <th className="py-2 px-2 text-left">Amount</th>
                    <th className="py-2 px-2 text-center">
                      <Settings className="w-4 h-4 mx-auto" />
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {assignedFarmers.map((f) => (
                    <tr key={f.FarmerID} className="border-t">

                      <td className="py-2 px-2">
                        {f.FirstName} {f.LastName}
                      </td>

                      <td className="py-2 px-2">
                        <input
                          type="number"
                          placeholder="Enter amount"
                          className="border px-2 py-1 rounded w-32"
                          value={amounts[f.FarmerID] || ""}
                          onChange={(e) =>
                            handleAmountChange(
                              f.FarmerID,
                              e.target.value
                            )
                          }
                        />
                      </td>

                      <td className="py-2 px-2 text-center">
                        <button
                          onClick={() => handleDistribute(f)}
                          className="bg-green-600 text-white px-2 py-1 rounded text-xs"
                        >
                          Distribute
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}