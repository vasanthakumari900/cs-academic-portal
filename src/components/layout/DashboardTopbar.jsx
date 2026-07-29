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
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#021C4F] text-white text-xs font-bold shadow-sm">DG</span>
            <div className="hidden sm:block leading-tight">
              <p className="text-sm font-bold text-[#021C4F]">
                {user?.type === "faculty" ? "FACULTY PORTAL" : user?.type === "admin" ? "ADMIN PORTAL" : "STUDENT PORTAL"}
              </p>
            </div>
          </div>
          {user && (
            <div className="hidden md:block text-left border-l border-[#E5E7EB] pl-3">
              <p className="text-xs font-semibold text-[#021C4F] leading-tight">{user.name}</p>
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
              className="group inline-flex items-center gap-1.5 rounded-lg bg-[#021C4F] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#C50337] active:scale-[0.97]"
            ><FiHome size={14} /> Dashboard</button>
          )}
          <button onClick={handleLogout}
            className="group flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-all duration-200 hover:bg-red-50 hover:text-red-650 active:scale-95"
            aria-label="Log out" title="Sign out"
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor" className="transition-transform group-hover:-translate-x-0.5">
              <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
