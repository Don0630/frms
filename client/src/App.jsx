// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import useDarkMode from "./hooks/useDarkMode";

import Sidebar from "./components/SideBar";
import Navbar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Pages
import Login from "./pages/Auth/Login"; 
import Dashboard from "./pages/Dashboard";
import Farmers from "./pages/Farmers";
import Crops from "./pages/Crops";
import Livestock from "./pages/Livestock";
import Programs from "./pages/Programs"; 
import Staffs from "./pages/Staffs";
import Subsidy from "./pages/Subsidy";
import Monitoring from "./pages/Monitoring";
import Users from "./pages/Users";
import Unauthorized from "./pages/Unauthorized.jsx";
import NotFound from "./pages/NotFound.jsx";
import SessionExpired from "./pages/SessionExpired.jsx";
import SubsidyDetails from "./pages/SubsidyDetails.jsx";
import { Outlet } from "react-router-dom";

function Layout({ sidebarOpen, setSidebarOpen, collapsed, setCollapsed, darkMode, setDarkMode }) {
  return (
    <div className="flex h-screen w-screen bg-gray-100 dark:bg-gray-950">
      <Sidebar collapsed={collapsed} />
      {sidebarOpen && (
        <div className="fixed inset-0 z-[1002] flex md:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-64 bg-white dark:bg-gray-900 shadow-lg z-50 transform transition-transform duration-300 ease-in-out">
            <Sidebar collapsed={false} mobile />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col">
        <Navbar
          setSidebarOpen={setSidebarOpen}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
        <div className="flex-1 overflow-y-auto p-4">
          {/* This will render the nested routes */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/sessionexpired" element={<SessionExpired />} /> 
        <Route path="*" element={<NotFound />} />

        {/* Protected layout */}
        <Route
          path="/"
          element={
            <Layout
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              collapsed={collapsed}
              setCollapsed={setCollapsed}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
          }
        >
          {/* Nested protected routes */}
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="farmers"
            element={
              <ProtectedRoute>
                <Farmers />
              </ProtectedRoute>
            }
          />
          <Route
            path="crops"
            element={
              <ProtectedRoute>
                <Crops />
              </ProtectedRoute>
            }
          />
          <Route
            path="livestock"
            element={
              <ProtectedRoute>
                <Livestock />
              </ProtectedRoute>
            }
          />
          <Route
            path="programs"
            element={
              <ProtectedRoute>
                <Programs />
              </ProtectedRoute>
            }
          />
          <Route
            path="subsidy"
            element={
              <ProtectedRoute>
                <Subsidy />
              </ProtectedRoute>
            }
          />
          <Route
            path="subsidydetails"
            element={
              <ProtectedRoute>
                <SubsidyDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="monitoring"
            element={
              <ProtectedRoute>
                <Monitoring />
              </ProtectedRoute>
            }
          />

          {/* Admin only */}
          <Route
            path="staffs"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <Staffs />
              </ProtectedRoute>
            }
          />
          <Route
            path="users"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <Users />
              </ProtectedRoute>
            }
          />

         
          
        </Route>
      </Routes>
    </Router>
  );
}

export default App;