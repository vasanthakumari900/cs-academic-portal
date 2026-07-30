// src/components/layout/DashboardTopbar.jsx
import { FiHome, FiMenu } from "react-icons/fi";
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
    <header className="sticky top-0 z-30 border-b-4 border-[#F5EBD0] bg-[#7F011F] text-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2.5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5">
          <button onClick={onMenuToggle} className="lg:hidden p-2 rounded-xl text-white/90 hover:bg-white/10 hover:text-white transition-all min-h-[44px] min-w-[44px] flex items-center justify-center">
            <FiMenu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F5EBD0] text-[#7F011F] text-xs font-black shadow-md shrink-0 border border-[#E6DAB8]">DG</span>
            <div className="hidden xs:block leading-tight text-left">
              <p className="text-xs sm:text-sm font-black text-white tracking-wide">
                {user?.type === "faculty" ? "FACULTY PORTAL" : user?.type === "admin" ? "ADMIN PORTAL" : "STUDENT PORTAL"}
              </p>
            </div>
          </div>
          {user && (
            <div className="hidden md:block text-left border-l border-white/20 pl-3">
              <p className="text-xs font-bold text-white leading-tight">{user.name}</p>
              <p className="text-[10px] text-[#F5EBD0]/90 font-medium">
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
              className="group inline-flex items-center gap-1.5 rounded-xl bg-[#F5EBD0] hover:bg-[#EBDCAE] px-3.5 py-2 min-h-[44px] text-xs font-black text-[#7F011F] shadow-md transition-all active:scale-[0.97] border border-[#E6DAB8]"
            >
              <FiHome size={14} />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
          )}
          <button onClick={handleLogout}
            className="group flex h-11 w-11 items-center justify-center rounded-xl text-white/90 bg-white/10 transition-all duration-200 hover:bg-rose-700 hover:text-white active:scale-95 border border-white/20 min-h-[44px]"
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
