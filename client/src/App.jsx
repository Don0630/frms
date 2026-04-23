// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useState } from "react";
import useDarkMode from "./hooks/useDarkMode";

import Sidebar from "./components/SideBar";
import Navbar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Pages
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/Dashboard";
import Farmers from "./pages/Farmers";
import FarmerDetails from "./pages/FarmerDetails";
import Crops from "./pages/Crops";
import Livestock from "./pages/Livestock";
import Programs from "./pages/Programs";
import Staffs from "./pages/Staffs";
import Subsidy from "./pages/Subsidy";
import SubsidyDetails from "./pages/SubsidyDetails";
import Monitoring from "./pages/Monitoring";
import Users from "./pages/Users";
import Unauthorized from "./pages/Unauthorized.jsx";
import NotFound from "./pages/NotFound.jsx";
import SessionExpired from "./pages/SessionExpired.jsx";

/* ================= LAYOUT ================= */
function Layout({
  sidebarOpen,
  setSidebarOpen,
  collapsed,
  setCollapsed,
  darkMode,
  setDarkMode,
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-100 dark:bg-gray-950">

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar collapsed={collapsed} />
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-[1002] flex md:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-64 bg-white dark:bg-gray-900 shadow-lg z-50">
            <Sidebar collapsed={false} mobile />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          setSidebarOpen={setSidebarOpen}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

/* ================= APP ================= */
function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();

  return (
    <Router>
      <Routes>

        {/* ================= PUBLIC ================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/sessionexpired" element={<SessionExpired />} />

        {/* ================= PROTECTED (NO LAYOUT) ================= */}
        <Route
          path="/farmerdetails/:id"
          element={
            <ProtectedRoute>
              <FarmerDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/subsidydetails/:id"
          element={
            <ProtectedRoute>
              <SubsidyDetails />
            </ProtectedRoute>
          }
        />

        {/* ================= PROTECTED LAYOUT ================= */}
        <Route
          element={
            <ProtectedRoute>
              <Layout
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
            </ProtectedRoute>
          }
        >
          {/* Default inside layout */}
          <Route index element={<Navigate to="/dashboard" replace />} />

          {/* MAIN PAGES */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/farmers" element={<Farmers />} />
          <Route path="/crops" element={<Crops />} />
          <Route path="/livestock" element={<Livestock />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/subsidy" element={<Subsidy />} />
          <Route path="/monitoring" element={<Monitoring />} />

          {/* ADMIN ONLY */}
          <Route
            path="/staffs"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <Staffs />
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <Users />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
  );
}

export default App;