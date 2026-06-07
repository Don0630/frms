import { Users, BookOpen, Gift, UserCog, TrendingUp, Calendar, Wallet, MapPin, } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, } from "recharts";
import { formatDateNumeric } from "../utils/pageUtility";
import useDashboard from "../hooks/useDashboard";
import useMonitoring from "../hooks/useMonitoring";

export default function FarmersDashboard() {
  const { dashboardQuery } = useDashboard();
  const { monitoringQuery } = useMonitoring();

  // ================= DATA =================
  const summary = dashboardQuery.data?.data || {};
  const monitoring = monitoringQuery.data?.data || [];

  // ================= DESTRUCTURE SUMMARY =================
  const {
    totalFarmers = 0,
    totalPrograms = 0,
    activePrograms = 0,
    totalDistributions = 0,
    totalSubsidyAmount = 0,
    totalDistributed = 0,
    totalRemaining = 0,
    totalBeneficiaries = 0,
    activeParticipants = 0,
    totalReports = 0,
    totalUsers = 0,
    totalStaff = 0,
  } = summary;

  // ================= MONITORING DERIVED STATS =================
  const totalProduction = monitoring.reduce(
    (sum, m) => sum + (Number(m.ProductionVolume) || 0),
    0
  );

  const cropFreq = monitoring.reduce((acc, m) => {
    if (m.CropName) acc[m.CropName] = (acc[m.CropName] || 0) + 1;
    return acc;
  }, {});
  const topCrop =
    Object.entries(cropFreq).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  const livestockFreq = monitoring.reduce((acc, m) => {
    if (m.Breed) acc[m.Breed] = (acc[m.Breed] || 0) + 1;
    return acc;
  }, {});
  const topLivestock =
    Object.entries(livestockFreq).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  // ================= RECENT MONITORING =================
  const recentMonitoring = [...monitoring]
    .sort((a, b) => new Date(b.ReportDate) - new Date(a.ReportDate))
    .slice(0, 5);

  // ================= CHART DATA =================
  const dateMap = monitoring.reduce((acc, m) => {
    const date = m.ReportDate ? m.ReportDate.slice(0, 10) : null;
    if (!date) return acc;
    acc[date] = (acc[date] || 0) + (Number(m.ProductionVolume) || 0);
    return acc;
  }, {});

  const chartData = Object.entries(dateMap)
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .map(([date, volume]) => ({
      date: new Date(date).toLocaleDateString("en-PH", {
        month: "short",
        day: "numeric",
      }),
      Production: volume,
    }));

  // ================= STAT CARDS =================
  const statCards = [
    {
      label: "Total Farmers",
      value: totalFarmers,
      icon: Users,
      cardbg: "bg-green-500",
    },
    {
      label: "Programs",
      value: totalPrograms,
      icon: BookOpen,
      cardbg: "bg-blue-500",
    },
    {
      label: "Subsidies",
      value: totalDistributions,
      icon: Gift,
      cardbg: "bg-purple-500",
    },
    {
      label: "Users",
      value: totalUsers,
      icon: UserCog,
      cardbg: "bg-red-500",
    },
    {
      label: "Staff",
      value: totalStaff,
      icon: TrendingUp,
      cardbg: "bg-orange-500",
    },
  ];

  // ================= LOADING / ERROR STATES =================
  const isLoading = dashboardQuery.isLoading || monitoringQuery.isLoading;
  const isError = dashboardQuery.isError || monitoringQuery.isError;

  if (isLoading) {
    return (
      <div className="w-full px-4">
        <div className="w-full rounded-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md p-6">
          <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
            Loading dashboard...
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full px-4">
        <div className="w-full rounded-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md p-6">
          <div className="flex items-center justify-center h-48 text-red-400 text-sm">
            Failed to load dashboard data. Please try again.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4">
      <div className="w-full rounded-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md p-6 space-y-6">

        {/* HEADER */}
        <div className="flex flex-wrap justify-between items-center gap-3">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            DASHBOARD
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {new Date().toLocaleDateString("en-PH", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {statCards.map(({ label, value, icon: Icon, cardbg }) => (
            <div
              key={label}
              className={`${cardbg} border border-gray-200 dark:border-gray-800 p-4 rounded-xl shadow`}
            >
              <div className="w-8 h-8 rounded flex items-center justify-center mb-2">
                <Icon className="w-4 h-4 text-gray-100" />
              </div>
              <p className="text-2xl font-bold text-gray-100">{value}</p>
              <p className="text-xs text-gray-100 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* MONITORING LINE CHART */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded shadow p-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-blue-500" /> Production Volume
            Over Time
          </h3>
          {chartData.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-gray-400 text-xs">
              No monitoring data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  className="dark:stroke-gray-700"
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => v.toLocaleString()}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  }}
                  formatter={(value) => [
                    value.toLocaleString(),
                    "Production Volume",
                  ]}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line
                  type="monotone"
                  dataKey="Production"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#10b981", strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: "#059669" }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* AGGREGATE HIGHLIGHTS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="border border-gray-200 dark:border-gray-800 rounded shadow p-4 space-y-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Total Production Volume
            </p>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
              {totalProduction.toLocaleString()}
            </p>
            <p className="text-xs text-gray-400">across all monitoring reports</p>
          </div>

          <div className="border border-gray-200 dark:border-gray-800 rounded shadow p-4 space-y-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Top Crop Reported
            </p>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {topCrop}
            </p>
            <p className="text-xs text-gray-400">most frequent in monitoring</p>
          </div>

          <div className="border border-gray-200 dark:border-gray-800 rounded shadow p-4 space-y-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Top Livestock Reported
            </p>
            <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
              {topLivestock}
            </p>
            <p className="text-xs text-gray-400">most frequent in monitoring</p>
          </div>

          <div className="border border-gray-200 dark:border-gray-800 rounded shadow p-4 space-y-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Subsidy Remaining Balance
            </p>
            <p className="text-xl font-bold text-red-600 dark:text-red-400">
              ₱{Number(totalRemaining).toLocaleString()}
            </p>
            <p className="text-xs text-gray-400">
              ₱{Number(totalDistributed).toLocaleString()} distributed of ₱
              {Number(totalSubsidyAmount).toLocaleString()}
            </p>
          </div>
        </div>

        {/* EXTRA SUMMARY HIGHLIGHTS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="border border-gray-200 dark:border-gray-800 rounded shadow p-4 space-y-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Active Programs
            </p>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {activePrograms}
            </p>
            <p className="text-xs text-gray-400">of {totalPrograms} total programs</p>
          </div>

          <div className="border border-gray-200 dark:border-gray-800 rounded shadow p-4 space-y-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Active Participants
            </p>
            <p className="text-xl font-bold text-green-600 dark:text-green-400">
              {activeParticipants}
            </p>
            <p className="text-xs text-gray-400">enrolled in active programs</p>
          </div>

          <div className="border border-gray-200 dark:border-gray-800 rounded shadow p-4 space-y-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Total Beneficiaries
            </p>
            <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
              {totalBeneficiaries}
            </p>
            <p className="text-xs text-gray-400">received subsidy distributions</p>
          </div>

          <div className="border border-gray-200 dark:border-gray-800 rounded shadow p-4 space-y-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Monitoring Reports
            </p>
            <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
              {totalReports}
            </p>
            <p className="text-xs text-gray-400">total submitted reports</p>
          </div>
        </div>

        {/* RECENT MONITORING */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded shadow p-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Recent Monitoring Reports
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-xs">
                <tr>
                  <th className="pb-2">Farmer</th>
                  <th className="pb-2">Crop / Livestock</th>
                  <th className="pb-2">Production</th>
                  <th className="pb-2">Report Date</th>
                </tr>
              </thead>
              <tbody>
                {recentMonitoring.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-4 text-center text-gray-400 text-xs"
                    >
                      No reports yet
                    </td>
                  </tr>
                ) : (
                  recentMonitoring.map((m) => (
                    <tr
                      key={m.ReportID}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="py-2 font-medium text-gray-800 dark:text-gray-100">
                        {m.FirstName} {m.LastName}
                      </td>
                      <td className="text-gray-600 dark:text-gray-400 text-xs">
                        {m.CropName || m.Breed || "-"}
                      </td>
                      <td className="text-gray-600 dark:text-gray-400 text-xs">
                        {m.ProductionVolume || "-"}
                      </td>
                      <td className="text-gray-600 dark:text-gray-400 text-xs">
                        {formatDateNumeric(m.ReportDate)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* SUBSIDY SUMMARY */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded shadow p-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-1">
            <Wallet className="w-4 h-4 text-red-600" /> Subsidy Overview
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Total Budget
              </p>
              <p className="text-lg font-bold text-gray-800 dark:text-gray-100">
                ₱{Number(totalSubsidyAmount).toLocaleString()}
              </p>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Distributed
              </p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">
                ₱{Number(totalDistributed).toLocaleString()}
              </p>
            </div>
            <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Remaining
              </p>
              <p className="text-lg font-bold text-red-600 dark:text-red-400">
                ₱{Number(totalRemaining).toLocaleString()}
              </p>
            </div>
          </div>
          {/* Distribution progress bar */}
          {totalSubsidyAmount > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>Distribution progress</span>
                <span>
                  {((totalDistributed / totalSubsidyAmount) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all"
                  style={{
                    width: `${Math.min(
                      (totalDistributed / totalSubsidyAmount) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
