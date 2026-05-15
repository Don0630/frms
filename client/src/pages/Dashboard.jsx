import { Users, UserCheck, User, Sprout, PawPrint, ClipboardList, BookOpen, Gift, UserCog, TrendingUp, Calendar, Wallet, MapPin } from "lucide-react";
import { formatDateNumeric } from "../utils/pageUtility";
import useFarmer from "../hooks/useFarmer";
import useMonitoring from "../hooks/useMonitoring";
import useCrop from "../hooks/useCrop";
import useLivestock from "../hooks/useLivestock";
import useProgram from "../hooks/useProgram";
import useSubsidy from "../hooks/useSubsidy";
import useUser from "../hooks/useUser";
import useStaff from "../hooks/useStaff";

export default function FarmersDashboard() {
  const { farmersQuery } = useFarmer();
  const { monitoringQuery } = useMonitoring();
  const { cropsQuery } = useCrop();
  const { livestockQuery } = useLivestock();
  const { programsQuery } = useProgram();
  const { subsidyQuery } = useSubsidy();
  const { usersQuery } = useUser();
  const { staffsQuery } = useStaff();

  // ================= DATA =================
  const farmers = farmersQuery.data?.data || [];
  const monitoring = monitoringQuery.data?.data || [];
  const crops = cropsQuery.data?.data || [];
  const livestock = livestockQuery.data?.data || [];
  const programs = programsQuery.data?.data || [];
  const subsidies = subsidyQuery.data?.data || [];
  const users = usersQuery.data?.data || [];
  const staff = staffsQuery.data?.data || [];

  // ================= FARMER STATS =================
  const totalFarmers = farmers.length;
  const maleFarmers = farmers.filter(f => f.Gender?.toLowerCase() === "male").length;
  const femaleFarmers = farmers.filter(f => f.Gender?.toLowerCase() === "female").length;

  // ================= MUNICIPALITY BREAKDOWN =================
  const municipalityMap = farmers.reduce((acc, f) => {
    const key = f.Municipality || "Unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const topMunicipalities = Object.entries(municipalityMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // ================= MONITORING STATS =================
  const totalProduction = monitoring.reduce((sum, m) => sum + (Number(m.ProductionVolume) || 0), 0);

  const cropFreq = monitoring.reduce((acc, m) => {
    if (m.CropName) acc[m.CropName] = (acc[m.CropName] || 0) + 1;
    return acc;
  }, {});
  const topCrop = Object.entries(cropFreq).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  const livestockFreq = monitoring.reduce((acc, m) => {
    if (m.Breed) acc[m.Breed] = (acc[m.Breed] || 0) + 1;
    return acc;
  }, {});
  const topLivestock = Object.entries(livestockFreq).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  // ================= SUBSIDY STATS =================
  const totalSubsidyAmount = subsidies.reduce((sum, s) => sum + (Number(s.TotalAmount) || 0), 0);
  const totalDistributed = subsidies.reduce((sum, s) => sum + (Number(s.DistributedAmount) || 0), 0);
  const totalRemaining = totalSubsidyAmount - totalDistributed;

  // ================= RECENT =================
  const recentFarmers = [...farmers]
    .sort((a, b) => new Date(b.RegistrationDate) - new Date(a.RegistrationDate))
    .slice(0, 5);

  const recentMonitoring = [...monitoring]
    .sort((a, b) => new Date(b.ReportDate) - new Date(a.ReportDate))
    .slice(0, 5);

  // ================= STAT CARDS =================
  const statCards = [
    { label: "Total Farmers", value: totalFarmers, icon: Users, color: "text-green-600", bg: "bg-green-50 dark:bg-green-900/20" },
    { label: "Male Farmers", value: maleFarmers, icon: User, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: "Female Farmers", value: femaleFarmers, icon: UserCheck, color: "text-pink-600", bg: "bg-pink-50 dark:bg-pink-900/20" },
    { label: "Monitoring Reports", value: monitoring.length, icon: ClipboardList, color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-900/20" },
    { label: "Crops", value: crops.length, icon: Sprout, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { label: "Livestock", value: livestock.length, icon: PawPrint, color: "text-yellow-600", bg: "bg-yellow-50 dark:bg-yellow-900/20" },
    { label: "Programs", value: programs.length, icon: BookOpen, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20" },
    { label: "Subsidies", value: subsidies.length, icon: Gift, color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20" },
    { label: "Users", value: users.length, icon: UserCog, color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
    { label: "Staff", value: staff.length, icon: TrendingUp, color: "text-teal-600", bg: "bg-teal-50 dark:bg-teal-900/20" },
  ];

  return (
    <div className="w-full px-4">
      <div className="w-full rounded-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md p-6 space-y-6">

        {/* HEADER */}
        <div className="flex flex-wrap justify-between items-center gap-3">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">DASHBOARD</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {new Date().toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" })}
          </span>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {statCards.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded shadow">
              <div className={`w-8 h-8 rounded flex items-center justify-center mb-2 ${bg}`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* AGGREGATE HIGHLIGHTS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

          <div className="border border-gray-200 dark:border-gray-800 rounded shadow p-4 space-y-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Production Volume</p>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-100">{totalProduction.toLocaleString()}</p>
            <p className="text-xs text-gray-400">across all monitoring reports</p>
          </div>

          <div className="border border-gray-200 dark:border-gray-800 rounded shadow p-4 space-y-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">Top Crop Reported</p>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{topCrop}</p>
            <p className="text-xs text-gray-400">most frequent in monitoring</p>
          </div>

          <div className="border border-gray-200 dark:border-gray-800 rounded shadow p-4 space-y-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">Top Livestock Reported</p>
            <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">{topLivestock}</p>
            <p className="text-xs text-gray-400">most frequent in monitoring</p>
          </div>

          <div className="border border-gray-200 dark:border-gray-800 rounded shadow p-4 space-y-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">Subsidy Remaining Balance</p>
            <p className="text-xl font-bold text-red-600 dark:text-red-400">₱{totalRemaining.toLocaleString()}</p>
            <p className="text-xs text-gray-400">₱{totalDistributed.toLocaleString()} distributed of ₱{totalSubsidyAmount.toLocaleString()}</p>
          </div>

        </div>

        {/* GENDER BAR + MUNICIPALITY BREAKDOWN */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* GENDER BREAKDOWN */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded shadow p-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Farmer Gender Breakdown
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-xs text-blue-600 w-10 text-right">{maleFarmers}</span>
              <div className="flex-1 h-3 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden">
                <div className="h-full flex">
                  {totalFarmers > 0 && (
                    <>
                      <div className="bg-blue-500 h-full transition-all" style={{ width: `${(maleFarmers / totalFarmers) * 100}%` }} />
                      <div className="bg-pink-400 h-full transition-all" style={{ width: `${(femaleFarmers / totalFarmers) * 100}%` }} />
                    </>
                  )}
                </div>
              </div>
              <span className="text-xs text-pink-600 w-10">{femaleFarmers}</span>
            </div>
            <div className="flex gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Male
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-pink-400 inline-block" /> Female
              </span>
            </div>
          </div>

          {/* TOP MUNICIPALITIES */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded shadow p-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-1">
              <MapPin className="w-4 h-4 text-green-600" /> Top Municipalities
            </h3>
            <div className="space-y-2">
              {topMunicipalities.length === 0 ? (
                <p className="text-xs text-gray-400">No data yet</p>
              ) : topMunicipalities.map(([municipality, count]) => (
                <div key={municipality} className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 dark:text-gray-400 w-32 truncate">{municipality}</span>
                  <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden">
                    <div className="bg-green-500 h-full transition-all" style={{ width: `${(count / totalFarmers) * 100}%` }} />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 w-6 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* BOTTOM TABLES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* RECENT FARMERS */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded shadow p-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Recently Added Farmers</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-xs">
                  <tr>
                    <th className="pb-2">Name</th>
                    <th className="pb-2">Municipality</th>
                    <th className="pb-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentFarmers.length === 0 ? (
                    <tr><td colSpan={3} className="py-4 text-center text-gray-400 text-xs">No farmers yet</td></tr>
                  ) : recentFarmers.map((f) => (
                    <tr key={f.FarmerID} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-2 font-medium text-gray-800 dark:text-gray-100">{f.FirstName} {f.LastName}</td>
                      <td className="text-gray-600 dark:text-gray-400 text-xs">{f.Municipality || "-"}</td>
                      <td className="text-gray-600 dark:text-gray-400 text-xs">{formatDateNumeric(f.RegistrationDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* RECENT MONITORING */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded shadow p-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Recent Monitoring Reports</h3>
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
                    <tr><td colSpan={4} className="py-4 text-center text-gray-400 text-xs">No reports yet</td></tr>
                  ) : recentMonitoring.map((m) => (
                    <tr key={m.ReportID} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-2 font-medium text-gray-800 dark:text-gray-100">{m.FirstName} {m.LastName}</td>
                      <td className="text-gray-600 dark:text-gray-400 text-xs">{m.CropName || m.Breed || "-"}</td>
                      <td className="text-gray-600 dark:text-gray-400 text-xs">{m.ProductionVolume || "-"}</td>
                      <td className="text-gray-600 dark:text-gray-400 text-xs">{formatDateNumeric(m.ReportDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* SUBSIDY SUMMARY */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded shadow p-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-1">
            <Wallet className="w-4 h-4 text-red-600" /> Subsidy Overview
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-xs">
                <tr>
                  <th className="pb-2">Program</th>
                  <th className="pb-2">Total Amount</th>
                  <th className="pb-2">Distributed</th>
                  <th className="pb-2">Remaining</th>
                  <th className="pb-2">Distribution Date</th>
                </tr>
              </thead>
              <tbody>
                {subsidies.length === 0 ? (
                  <tr><td colSpan={5} className="py-4 text-center text-gray-400 text-xs">No subsidies yet</td></tr>
                ) : subsidies.slice(0, 5).map((s) => (
                  <tr key={s.DistributionID} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-2 font-medium text-gray-800 dark:text-gray-100">{s.ProgramName || "-"}</td>
                    <td className="text-gray-600 dark:text-gray-400 text-xs">₱{Number(s.TotalAmount || 0).toLocaleString()}</td>
                    <td className="text-green-600 dark:text-green-400 text-xs">₱{Number(s.DistributedAmount || 0).toLocaleString()}</td>
                    <td className="text-red-600 dark:text-red-400 text-xs">₱{(Number(s.TotalAmount || 0) - Number(s.DistributedAmount || 0)).toLocaleString()}</td>
                    <td className="text-gray-600 dark:text-gray-400 text-xs">{formatDateNumeric(s.DistributionDate)}</td>
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
