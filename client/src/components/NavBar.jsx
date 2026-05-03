import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Sun, Moon, Maximize, User } from "lucide-react";
import { useLogout } from "../hooks/useAuth";

export default function Navbar({
  setSidebarOpen,
  collapsed,
  setCollapsed,
  darkMode,
  setDarkMode,
}) {
  const navigate = useNavigate();
  const logoutMutation = useLogout();

  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef();

  // Always get fresh user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  const buttonClasses =
    "p-2 rounded-lg transition-colors duration-200 " +
    "text-gray-500 hover:text-gray-700 hover:bg-gray-100 " +
    "dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800";

  // Fullscreen toggle
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // Logout
  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate("/login");
      },
      onError: (err) => {
        console.error("Logout failed:", err);
      },
    });
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      
      {/* LEFT */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            if (window.innerWidth < 768) {
              setSidebarOpen(true);
            } else {
              setCollapsed(!collapsed);
            }
          }}
          className={buttonClasses}
        >
          <Menu size={18} />
        </button>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2 sm:gap-4">

        {/* Fullscreen */}
        <button onClick={toggleFullScreen} className={buttonClasses}>
          <Maximize size={18} />
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode((prev) => !prev)}
          className={buttonClasses}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Profile */}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setOpenMenu((prev) => !prev)}
            className={`${buttonClasses} flex items-center justify-center`}
          >
            <User size={18} />
          </button>

          {/* Dropdown */}
          <div
            className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg z-50 transition-all duration-200
            bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700
            ${
              openMenu
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95 pointer-events-none"
            }`}
          >
            {/* User Info */}
            <div className="px-4 py-2 text-xs border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400">
              {user?.Username || "Guest"} • {user?.Role || "No role"}
            </div>

            <Link
              to="/profile"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Profile
            </Link>

            <Link
              to="/settings"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Settings
            </Link>

            {user?.Role === "Admin" && (
              <Link
                to="/users"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Users
              </Link>
            )}

            {(user?.Role === "Staff" || user?.Role === "Admin") && (
              <Link
                to="/staffs"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Staffs
              </Link>
            )}

            {/* Logout */}
            <button
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
            >
              {logoutMutation.isPending ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}