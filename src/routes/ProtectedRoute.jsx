// src/routes/ProtectedRoute.jsx
// Route guard — checks that the user is authenticated and optionally has a required role.
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "../components/ui/LoadingScreen";

export default function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingScreen />;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role-based access control — redirect to student dashboard if the user
  // doesn't have the required role for this route tree.
  // Faculty members are also allowed on admin routes.
  const effectiveRoles = allowedRoles?.includes("admin")
    ? [...allowedRoles, "faculty"]
    : allowedRoles;
  if (effectiveRoles && !effectiveRoles.includes(user.type)) {
    const dest = user.type === "faculty" ? "/faculty/dashboard" : user.type === "admin" ? "/admin/dashboard" : "/student/dashboard";
    return <Navigate to={dest} replace />;
  }

  return <Outlet />;
}
