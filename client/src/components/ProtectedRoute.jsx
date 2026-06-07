import { Navigate, Outlet } from "react-router-dom";
import useProfile from "../hooks/useProfile";

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-200">
      <div className="flex flex-col items-center gap-4">

        {/* Spinner */}
        <div className="w-10 h-10 border-4 border-gray-200 dark:border-gray-700 border-t-green-600 dark:border-t-green-400 rounded-full animate-spin" />

        {/* Text */}
        <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
          Loading, please wait...
        </p>

      </div>
    </div>
  );
}

export default function ProtectedRoute({ children, allowedRoles }) {
  const { userQuery } = useProfile();
  const { data, isLoading, isError } = userQuery;
  const user = userQuery.data?.data?.user;

  if (isLoading) return <LoadingScreen />;
  if (isError || !user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.Role))
    return <Navigate to="/unauthorized" replace />;

  return children ?? <Outlet />;
}