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
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0F172A]/80 backdrop-blur-xl shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button onClick={onMenuToggle} className="lg:hidden p-1.5 rounded-lg text-white/50 hover:bg-white/10 hover:text-white transition-all">
            <FiMenu size={20} />
          </button>
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white text-xs font-bold shadow-md">DV</span>
          {user && (
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-white leading-tight">{user.name}</p>
              <p className="text-[10px] text-white/50 -mt-0.5">
                {user.rollNumber}{user.section ? ` · Sec ${user.section}` : ""}{user.type === "faculty" ? ` · ${user.subject}` : ""}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!isOnDashboard && (
            <button onClick={() => { const base = user?.type === "faculty" ? "faculty" : user?.type === "admin" ? "admin" : "student"; navigate(`/${base}/dashboard`); }}
              className="group inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-md transition-all duration-300 hover:shadow-indigo-500/30 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.97]"
            ><FiHome size={14} /> Dashboard</button>
          )}
          <button onClick={handleLogout}
            className="group flex h-9 w-9 items-center justify-center rounded-xl text-white/40 transition-all duration-200 hover:bg-red-500/20 hover:text-red-300 hover:shadow-sm active:scale-95"
            aria-label="Log out" title="Sign out"
          ><FiLogOut size={16} className="transition-transform group-hover:-translate-x-0.5" /></button>
        </div>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />
    </header>
  );
}
