import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  // Wait until AuthContext finishes loading
  if (loading) return null; // or a spinner

  if (!user) return <Navigate to="/login" replace />;

  // Role-based access
  if (role && user.Role !== role) return <Navigate to="/dashboard" replace />;

  return children;
}