import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

export default function ProtectedRoute({ children, role }) {
  const { data: user, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: () => {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    },
    staleTime: 1000 * 60 * 5,
  });

  // 🟡 IMPORTANT: wait until auth is ready
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // ❌ not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ❌ role mismatch
  if (role && user.Role !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  // ✅ allow access
  return children;
}