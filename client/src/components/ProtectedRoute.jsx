import { Navigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

export default function ProtectedRoute({ children, role }) {
  const queryClient = useQueryClient();

  // first check React Query cache
  let user = queryClient.getQueryData(["authUser"]);

  // fallback to localStorage after refresh
  if (!user) {
    const storedUser = localStorage.getItem("user");
    user = storedUser ? JSON.parse(storedUser) : null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.Role !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}