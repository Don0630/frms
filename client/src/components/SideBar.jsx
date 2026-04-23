import { NavLink } from "react-router-dom";
import {
  Home,
  Users,
  Sprout,
  Activity,
  FileText,
  UserCog,
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
  { name: "Subsidy Distribution", icon: <Briefcase size={20} />, path: "/subsidy" },
  { name: "Reports & Monitoring", icon: <Clipboard size={20} />, path: "/monitoring" },
  {
    name: "Agricultural Staffs",
    icon: <Users size={20} />,
    path: "/staffs",
    roles: ["Admin", "staff"],
  },
  {
    name: "System Users",
    icon: <UserCog size={20} />,
    path: "/users",
    roles: ["Admin"],
  },
];

export default function Sidebar({ collapsed, mobile = false }) {
  const { user } = useAuth();

  return (
    <div
      className={`
        ${mobile ? "flex" : "hidden md:flex"}
        flex-col h-full
        bg-white dark:bg-gray-900
        transition-[width] duration-300 ease-in-out
        ${collapsed ? "w-20" : "w-64"}
        flex-shrink-0 relative z-40 overflow-hidden
        border-r border-gray-200 dark:border-gray-800
      `}
    >
      {/* HEADER */}
      <div
        className={`
          flex items-center px-4 py-3
          border-b border-gray-200 dark:border-gray-800
          ${collapsed ? "justify-center" : "gap-3"}
        `}
      >
        <img
          src={logo}
          alt="Logo"
          className="w-7 h-7 object-contain rounded-full"
        />

        <h1
          className={`
            text-sm font-bold whitespace-nowrap
            text-gray-800 dark:text-gray-100
            transition-opacity duration-200
            ${collapsed ? "opacity-0 w-0" : "opacity-100"}
          `}
        >
          MONITORING SYSTEM
        </h1>
      </div>

      {/* MENU */}
      <nav className="flex-1 p-2 space-y-1">
        {menuItems
          .filter((item) => !item.roles || item.roles.includes(user?.Role))
          .map((item, idx) => (
            <div key={idx}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `
                  flex items-center rounded-md text-sm font-medium
                  transition-colors duration-200

                  ${collapsed ? "justify-center py-3" : "gap-4 px-4 py-3"}

                  ${
                    isActive
                      ? "bg-green-600 text-white shadow-sm"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }
                  `
                }
              >
                <div className="flex items-center justify-center w-6 h-6 shrink-0">
                  {item.icon}
                </div>

                <span
                  className={`
                    whitespace-nowrap transition-all duration-150
                    ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}
                  `}
                >
                  {item.name}
                </span>
              </NavLink>

              {item.name === "Livestock" && (
                <div className="my-2 border-t border-gray-200 dark:border-gray-800" />
              )}
            </div>
          ))}
      </nav>
    </div>
  );
}