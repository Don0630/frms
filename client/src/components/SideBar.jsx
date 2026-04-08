import { NavLink } from "react-router-dom";
import {
  Home,
  BarChart2,
  Map,
  UserCog,
  Users,
  Sprout,
  Activity,
  FileText,
  Building,
  Briefcase,
  Clipboard,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import logo from "../assets/logo.png";

const menuItems = [
  { name: "Dashboard", icon: <Home size={20} />, path: "/dashboard" },
  { name: "Farmers", icon: <Users size={20} />, path: "/farmers" },
  { name: "Crops", icon: <Sprout size={20} />, path: "/crops" },
  { name: "Livestock", icon: <Activity size={20} />, path: "/livestock" },
  { name: "Programs & Subsidies", icon: <FileText size={20} />, path: "/programs" },
 
  {
    name: "Subsidy Distribution",
    icon: <Briefcase size={20} />,
    path: "/subsidy",
  },
  {
    name: "Subsidy Details",
    icon: <Briefcase size={20} />,
    path: "/subsidydetails",
  },
  {
    name: "Reports & Monitoring",
    icon: <Clipboard size={20} />,
    path: "/monitoring",
  },
   {
    name: "Agricultural Staffs",
    icon: <Users size={20} />,
    path: "/staffs",
    roles: ["Admin", "staff"], // ✅ only admin & staff
  },
  {
    name: "System Users",
    icon: <UserCog size={20} />,
    path: "/users",
    roles: ["Admin"], // ✅ only admin
  },
];

export default function Sidebar({ collapsed, mobile = false }) {
  const { user } = useAuth(); // get current logged-in user

  return (
    <div
      className={`${mobile ? "flex" : "hidden md:flex"} flex-col h-full 
      bg-white dark:bg-gray-900 transition-all duration-300 
      ${collapsed ? "w-20" : "w-64"} flex-shrink-0 relative z-40`}
      style={{ boxShadow: "4px 0 10px rgba(0, 0, 0, 0.15)" }}
    >
      {/* Header */}
      <div
        className={`flex items-center ${
          collapsed ? "justify-center" : "gap-6"
        } px-4 py-2 border-b dark:border-gray-700`}
      >
        <img
          src={logo}
          alt="Logo"
          className="w-9 h-9 object-contain rounded-full"
          style={{ boxShadow: "0 6px 12px rgba(0, 0, 0, 0.5)" }}
        />
        {!collapsed && (
          <h1 className="text-sm font-bold text-gray-600 dark:text-white whitespace-nowrap cursor-default">
            MONITORING SYSTEM
          </h1>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 p-2">
        {menuItems
          .filter((item) => {
            // ✅ filter by role if roles property exists
            if (!item.roles) return true; // no roles = everyone
            return item.roles.includes(user?.Role);
          })
          .map((item, idx) => (
            <div key={idx}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center rounded transition text-sm font-semibold no-underline ${
                    collapsed ? "justify-center p-3" : "gap-4 p-4"
                  } ${
                    isActive
                      ? "bg-green-500 text-white visited:text-white hover:bg-green-600 hover:text-white font-semibold shadow-md"
                      : "text-gray-600 dark:text-gray-400 hover:bg-green-600 dark:hover:bg-green-600 hover:text-white dark:hover:text-white"
                  }`
                }
              >
                {item.icon}
                {!collapsed && <span>{item.name}</span>}
              </NavLink>

              {/* Divider after "Livestock" */}
              {item.name === "Livestock" && (
                <div className="my-2 border-t border-gray-300 dark:border-gray-700" />
              )}
            </div>
          ))}
      </nav>
    </div>
  );
}