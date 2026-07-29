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

  // Role-based access control — redirect if the user doesn't have the required role.
  // 24E3006 and admin roles have full access to admin routes.
  const userRole = user.role || user.type;
  const isAdminUser = userRole === "admin" || user.rollNumber === "24E3006" || user.type === "admin";

  if (allowedRoles) {
    if (allowedRoles.includes("admin") && isAdminUser) {
      return <Outlet />;
    }

    const effectiveRoles = allowedRoles.includes("admin")
      ? [...allowedRoles, "faculty"]
      : allowedRoles;

    if (!effectiveRoles.includes(user.type) && !effectiveRoles.includes(userRole) && !isAdminUser) {
      const dest = isAdminUser ? "/admin/dashboard" : user.type === "faculty" ? "/faculty/dashboard" : "/student/dashboard";
      return <Navigate to={dest} replace />;
    }
  }

  return <Outlet />;
}
