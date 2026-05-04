import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const routeLabels = {
  dashboard: "Dashboard",
  farmers: "Farmers",
  crops: "Crops",
  livestock: "Livestock",
  programs: "Programs",
  subsidy: "Subsidy",
  monitoring: "Monitoring",
  staffs: "Agricultural Staffs",
  users: "System Users",
};

export default function Breadcrumbs() {
  const location = useLocation();

  const pathnames = location.pathname.split("/").filter(Boolean);

  const isNumeric = (value) =>
    !isNaN(value) && !isNaN(parseFloat(value));

  const lastSegment = pathnames[pathnames.length - 1];
  const pageTitle = isNumeric(lastSegment)
    ? "Details"
    : routeLabels[lastSegment] || "Page";

  return (
    <div className="flex items-center justify-between px-6 py-3">

      {/* LEFT: PAGE TITLE */}
      
      


      {/* RIGHT: BREADCRUMBS */}
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">

        {/* HOME */}
        <Link
          to="/dashboard"
          className="flex items-center gap-1 hover:text-green-600 transition-colors"
        >
          <Home size={16} />
          <span>Home</span>
        </Link>

        {pathnames.map((value, index) => {
          const to = "/" + pathnames.slice(0, index + 1).join("/");
          const isLast = index === pathnames.length - 1;

          const label = isNumeric(value)
            ? "Details"
            : routeLabels[value] || value;

          return (
            <React.Fragment key={to}>
              <ChevronRight size={14} />

              {isLast ? (
                <span className="font-medium text-gray-900 dark:text-white">
                  {label}
                </span>
              ) : (
                <Link
                  to={to}
                  className="hover:text-green-600 transition-colors"
                >
                  {label}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}