import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Sun, Moon, Maximize, User } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar({
  setSidebarOpen,
  collapsed,
  setCollapsed,
  darkMode,
  setDarkMode,
}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef();

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
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

        {/* Dark Mode */}
        <button onClick={() => setDarkMode(!darkMode)} className={buttonClasses}>
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* PROFILE */}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setOpenMenu((prev) => !prev)}
            className={`${buttonClasses} flex items-center justify-center`}
          >
            <User size={18} />
          </button>

          {/* Dropdown */}
          <div
            className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg z-50 transform transition-all duration-200
            bg-white dark:bg-gray-900
            border border-gray-200 dark:border-gray-700
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

            {/* Links */}
            <Link
              to="/profile"
              onClick={() => setOpenMenu(false)}
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Profile
            </Link>

            <Link
              to="/settings"
              onClick={() => setOpenMenu(false)}
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Settings
            </Link>

            {/* Role-based */}
            {user?.Role === "Admin" && (
              <Link
                to="/users"
                onClick={() => setOpenMenu(false)}
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                Users
              </Link>
            )}

            {(user?.Role === "Staff" || user?.Role === "Admin") && (
              <Link
                to="/staffs"
                onClick={() => setOpenMenu(false)}
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                Staffs
              </Link>
            )}

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
            >
              Logout
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}