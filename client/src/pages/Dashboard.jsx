import { Users, UserCheck, User, Calendar } from "lucide-react";
import useFarmer from "../hooks/useFarmer";

export default function FarmersDashboard() {
  const { farmersQuery } = useFarmer();

  const farmers = farmersQuery.data?.data || [];

  const total = farmers.length;
  const male = farmers.filter(f => f.Gender?.toLowerCase() === "male").length;
  const female = farmers.filter(f => f.Gender?.toLowerCase() === "female").length;

  const latest = [...farmers]
    .sort((a, b) => new Date(b.RegistrationDate) - new Date(a.RegistrationDate))
    .slice(0, 5);

  return (
    <div className="w-full px-4">
    <div className="w-full rounded-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md p-6 space-y-4">

      {/* HEADER */}
        {/* HEADER */}
        <div className="flex flex-wrap justify-between items-center gap-3">

          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            DASHBOARD
          </h2>

        </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded shadow">
          <div className="flex items-center gap-3">
            <Users className="text-green-600" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Farmers</p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded shadow">
          <div className="flex items-center gap-3">
            <User className="text-blue-600" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Male Farmers</p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{male}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded shadow">
          <div className="flex items-center gap-3">
            <UserCheck className="text-pink-600" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Female Farmers</p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{female}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded shadow">
          <div className="flex items-center gap-3">
            <Calendar className="text-purple-600" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Latest Entry</p>
              <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
                {latest[0]?.RegistrationDate || "N/A"}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* LATEST FARMERS TABLE */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded shadow p-4">

        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
          Recently Added Farmers
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">

            <thead className="border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300">
              <tr>
                <th className="py-2">Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {latest.map((f) => (
                <tr
                  key={f.FarmerID}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="py-2 font-medium text-gray-800 dark:text-gray-100">
                    {f.FirstName} {f.LastName}
                  </td>
                  <td className="text-gray-700 dark:text-gray-300">{f.Email}</td>
                  <td className="text-gray-700 dark:text-gray-300">{f.ContactNumber}</td>
                  <td className="text-gray-700 dark:text-gray-300">{f.RegistrationDate}</td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>

    </div>
  </div>
  );
}