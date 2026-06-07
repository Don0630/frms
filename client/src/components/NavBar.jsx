import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, Sun, Moon, Maximize, Users, UserCircle, Lock, LogOut, BadgeCheck } from "lucide-react";
import useProfile from "../hooks/useProfile";
import useAuth from "../hooks/useAuth";

export default function Navbar({ setSidebarOpen, collapsed, setCollapsed, darkMode, setDarkMode, }) {
const { userQuery } = useProfile();
const { logoutMutation } = useAuth();
const user = userQuery.data?.data?.user;
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef();

  // ================= CLICK OUTSIDE CLOSE =================
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onError: (err) => console.error("Logout failed:", err),
    });
  };

  const isSuperAdminOrAdmin = user?.Role === "SuperAdmin" || user?.Role === "Admin";

  const initials = user
    ? `${user.FirstName?.[0] ?? ""}${user.LastName?.[0] ?? ""}`.toUpperCase()
    : "?";

  const btnClass =
    "flex items-center justify-center w-[34px] h-[34px] rounded-lg border-none bg-transparent cursor-pointer text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 transition-colors";

  const linkClass =
    "flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors";

  const close = () => setOpenMenu(false);

  return (
    <div className="flex items-center justify-between px-5 py-2 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">

      {/* LEFT */}
      <div className="flex items-center gap-3">
        <button
          className={btnClass}
          onClick={() => {
            if (window.innerWidth < 768) setSidebarOpen(true);
            else setCollapsed(!collapsed);
          }}
        >
          <Menu size={18} />
        </button>
        <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
          FRMS <span className="text-gray-400 font-normal"></span>
        </span>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-1">

        <button className={btnClass} onClick={toggleFullScreen}>
          <Maximize size={18} />
        </button>

        <button className={btnClass} onClick={() => setDarkMode((prev) => !prev)}>
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-2" />

        {/* AVATAR */}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setOpenMenu((prev) => !prev)}
            className="w-[32px] h-[32px] rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-xs font-medium flex items-center justify-center border border-gray-200 dark:border-gray-700 cursor-pointer"
          >
            {initials}
          </button>

          {/* DROPDOWN */}
          {openMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 overflow-hidden z-50">

              {/* USER INFO */}
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                  {user?.FirstName} {user?.LastName}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{user?.Email}</p>
                <span className="inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                  {user?.Role}
                </span>
              </div>

              {/* MENU ITEMS */}
              <Link to="/profile" className={linkClass} onClick={close}>
                <UserCircle size={15} className="text-gray-400" /> My profile
              </Link>
              <Link to="/settings" className={linkClass} onClick={close}>
                <Lock size={15} className="text-gray-400" /> Change password
              </Link>

              {isSuperAdminOrAdmin && (
                <div className="border-t border-gray-100 dark:border-gray-800">
                  <Link to="/users" className={linkClass} onClick={close}>
                    <Users size={15} className="text-gray-400" /> Users
                  </Link>
                  <Link to="/staffs" className={linkClass} onClick={close}>
                    <BadgeCheck size={15} className="text-gray-400" /> Staffs
                  </Link>
                </div>
              )}

              {/* LOGOUT */}
              <div className="border-t border-gray-100 dark:border-gray-800">
                <button
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  <LogOut size={15} /> {logoutMutation.isPending ? "Logging out..." : "Log out"}
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}