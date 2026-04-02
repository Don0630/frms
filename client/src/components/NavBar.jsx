import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Menu, Sun, Moon, Maximize, User } from "lucide-react";

export default function Navbar({
  setSidebarOpen,
  collapsed,
  setCollapsed,
  darkMode,
  setDarkMode,
}) {
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef();

  const user = JSON.parse(localStorage.getItem("user"));

  const buttonClasses =
    "p-2 bg-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none cursor-pointer";

  // ✅ Fullscreen toggle
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-900 shadow">
      
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
      <div className="flex items-center gap-4">
        
        {/* Fullscreen */}
        <button onClick={toggleFullScreen} className={buttonClasses}>
          <Maximize size={20} />
        </button>

        {/* Dark Mode */}
        <button onClick={() => setDarkMode(!darkMode)} className={buttonClasses}>
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* PROFILE DROPDOWN */}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setOpenMenu((prev) => !prev)}
            className={buttonClasses}
          >
            <User size={20} />
          </button>

          {/* Dropdown */}
          <div
            className={`absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 transform transition-all duration-200 ${
              openMenu
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95 pointer-events-none"
            }`}
          >
            {/* User Info */}
            <div className="px-4 py-2 border-b text-xs text-gray-500 dark:text-gray-400">
              {user?.username || "Guest"}
            </div>

            {/* Menu Items */}
            <Link
              to="/profile"
              onClick={() => setOpenMenu(false)}
              className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Profile
            </Link>

            <Link
              to="/settings"
              onClick={() => setOpenMenu(false)}
              className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Settings
            </Link>

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Logout
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}