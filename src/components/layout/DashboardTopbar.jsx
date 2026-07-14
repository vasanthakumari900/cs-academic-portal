import { FiLogOut, FiHome, FiMenu } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

export default function DashboardTopbar({ onMenuToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleLogout() {
    await logout();
    toast.success("Signed out successfully");
    navigate("/login");
  }

  const isOnDashboard = location.pathname === "/student/dashboard" || location.pathname === "/admin/dashboard" || location.pathname === "/faculty/dashboard";

  return (
    <header className="sticky top-0 z-30 border-b border-[#E5E7EB] bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button onClick={onMenuToggle} className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-all">
            <FiMenu size={20} />
          </button>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0F4C81] text-white text-xs font-bold shadow-sm">DG</span>
            <div className="hidden sm:block leading-tight">
              <p className="text-sm font-bold text-[#1F2937]">
                {user?.type === "faculty" ? "FACULTY PORTAL" : user?.type === "admin" ? "ADMIN PORTAL" : "STUDENT PORTAL"}
              </p>
            </div>
          </div>
          {user && (
            <div className="hidden md:block text-left border-l border-slate-200 pl-3">
              <p className="text-xs font-semibold text-[#1F2937] leading-tight">{user.name}</p>
              <p className="text-[10px] text-[#6B7280]">
                {user.type === "faculty"
                  ? "Faculty"
                  : user.type === "admin"
                  ? "Administrator"
                  : `${user.rollNumber || ""}${user.section ? ` · Sec ${user.section}` : ""}`}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!isOnDashboard && (
            <button onClick={() => { const base = user?.type === "faculty" ? "faculty" : user?.type === "admin" ? "admin" : "student"; navigate(`/${base}/dashboard`); }}
              className="group inline-flex items-center gap-1.5 rounded-lg bg-[#0F4C81] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#1E88E5] active:scale-[0.97]"
            ><FiHome size={14} /> Dashboard</button>
          )}
          <button onClick={handleLogout}
            className="group flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-all duration-200 hover:bg-red-50 hover:text-red-650 active:scale-95"
            aria-label="Log out" title="Sign out"
          ><FiLogOut size={16} className="transition-transform group-hover:-translate-x-0.5" /></button>
        </div>
      </div>
    </header>
  );
}
