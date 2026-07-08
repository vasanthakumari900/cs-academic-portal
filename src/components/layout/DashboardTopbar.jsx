// src/components/layout/DashboardTopbar.jsx
// Minimal top bar — welcome message + dashboard button at top right
import { FiLogOut, FiGrid } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

export default function DashboardTopbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleLogout() {
    await logout();
    toast.success("Signed out");
    navigate("/login");
  }

  const isOnDashboard = location.pathname === "/student/dashboard";

  return (
    <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Left: Logo + Welcome */}
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-xs font-bold shadow-soft">
            DV
          </span>
          {user && (
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-gray-800 leading-tight">
                {user.name}
              </p>
              <p className="text-[10px] text-gray-400 -mt-0.5">
                {user.rollNumber}{user.section ? ` · Sec ${user.section}` : ""}
              </p>
            </div>
          )}
        </div>

        {/* Right: Dashboard button + Logout */}
        <div className="flex items-center gap-2">
          {!isOnDashboard && (
            <button
              onClick={() => navigate("/student/dashboard")}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-2 text-xs font-semibold text-white shadow-soft hover:shadow-premium transition-all"
            >
              <FiGrid size={14} />
              Dashboard
            </button>
          )}
          <button
            onClick={handleLogout}
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
            aria-label="Log out"
          >
            <FiLogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
