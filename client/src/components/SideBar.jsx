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
      `}
      style={{ boxShadow: "4px 0 10px rgba(0, 0, 0, 0.15)" }}
    >
      {/* HEADER */}
      <div
        className={`flex items-center px-4 py-2 border-b dark:border-gray-700
        ${collapsed ? "justify-center" : "gap-6"}`}
      >
        <img
          src={logo}
          alt="Logo"
          className="w-9 h-9 object-contain rounded-full"
        />

        <h1
          className={`
            text-sm font-bold text-gray-600 dark:text-white whitespace-nowrap
            transition-opacity duration-200
            ${collapsed ? "opacity-0" : "opacity-100"}
          `}
        >
          MONITORING SYSTEM
        </h1>
      </div>

      {/* MENU */}
      <nav className="flex-1 p-2">
        {menuItems
          .filter((item) => !item.roles || item.roles.includes(user?.Role))
          .map((item, idx) => (
            <div key={idx}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `
                  flex items-center rounded text-sm font-semibold no-underline
                  transition-colors duration-200

                  /* 🔥 FIX: force consistent icon alignment */
                  ${collapsed ? "justify-center py-3" : "gap-4 p-4"}

                  ${
                    isActive
                      ? "bg-green-500 text-white shadow-md"
                      : "text-gray-600 dark:text-gray-400 hover:bg-green-600 hover:text-white"
                  }
                  `
                }
              >
                {/* 🔥 FIX: icon wrapper ensures stability */}
                <div className="flex items-center justify-center w-6 h-6 shrink-0">
                  {item.icon}
                </div>

                {/* TEXT ONLY (no layout shift) */}
                <span
                  className={`
                    whitespace-nowrap
                    transition-opacity duration-150
                    ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}
                  `}
                >
                  {item.name}
                </span>
              </NavLink>

              {item.name === "Livestock" && (
                <div className="my-2 border-t border-gray-300 dark:border-gray-700" />
              )}
            </div>
          ))}
      </nav>
    </div>
  );
}