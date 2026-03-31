import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import useDarkMode from "./hooks/useDarkMode";
import Sidebar from "./components/SideBar";
import Navbar from "./components/NavBar";
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

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();

  return (
    <Router>
      <Routes>
        {/* Login page without sidebar/navbar */}
        <Route path="/" element={<Login />} />

        {/* Protected pages with layout */}
        <Route
          path="/*"
          element={
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
                  <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="farmers" element={<Farmers />} />
                    <Route path="crops" element={<Crops />} />
                    <Route path="livestock" element={<Livestock />} />
                    <Route path="programs" element={<Programs />} />
                    <Route path="staffs" element={<Staffs />} />
                    <Route path="subsidy" element={<Subsidy />} />
                    <Route path="monitoring" element={<Monitoring />} />
                    <Route path="users" element={<Users />} />
                  </Routes>
                </div>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
