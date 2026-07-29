import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiHome, FiActivity, FiLogOut } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

export default function StudentTopbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = user?.rollNumber === "24E3006" || user?.role === "admin" || user?.type === "admin";

  async function handleLogout() {
    await logout();
    toast.success("Signed out successfully");
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Top Left Corner: DDGDVC STUDENT PORTAL */}
        <Link to="/student/dashboard" className="flex items-center gap-3 group shrink-0">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#021C4F] text-white text-xs font-black shadow-sm group-hover:bg-[#C50337] transition-all">
            DG
          </span>
          <div className="leading-tight">
            <p className="text-sm sm:text-base font-extrabold text-[#021C4F] tracking-wide group-hover:text-[#C50337] transition-colors">
              DDGDVC STUDENT PORTAL
            </p>
            <p className="text-[10px] font-semibold text-slate-500">
              Department of Computer Science
            </p>
          </div>
        </Link>

        {/* Top Right Corner: Dashboard Button & Sign Out */}
        <div className="flex items-center gap-2.5">
          {/* Admin Exclusive: Student Activity Button */}
          {isAdmin && (
            <button
              onClick={() => navigate("/admin/student-activity")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs sm:text-sm font-bold shadow-sm transition-all active:scale-95 ${
                location.pathname === "/admin/student-activity"
                  ? "bg-[#C50337] text-white ring-2 ring-[#C50337]/40"
                  : "bg-rose-50 text-[#C50337] hover:bg-[#C50337] hover:text-white border border-rose-200"
              }`}
              title="Student Activity Monitoring"
            >
              <FiActivity size={15} />
              <span>Student Activity</span>
            </button>
          )}

          {/* Dashboard Option Button on Top Right Corner */}
          <button
            onClick={() => navigate("/student/dashboard")}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs sm:text-sm font-bold shadow-sm transition-all active:scale-95 ${
              location.pathname === "/student/dashboard"
                ? "bg-[#021C4F] text-white ring-2 ring-[#C50337]/40"
                : "bg-[#021C4F] text-white hover:bg-[#C50337]"
            }`}
            title="Dashboard"
          >
            <FiHome size={15} />
            <span>Dashboard</span>
          </button>

          {/* Sign Out Button */}
          <button
            onClick={handleLogout}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-red-50 hover:text-[#C50337] transition-all border border-slate-200"
            title="Sign out"
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
              <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
