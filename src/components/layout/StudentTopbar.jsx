// src/components/layout/StudentTopbar.jsx
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiHome, FiAward } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

export default function StudentTopbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleLogout() {
    await logout();
    toast.success("Signed out successfully");
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-30 border-b-4 border-[#F5EBD0] bg-[#7F011F] text-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2.5 sm:px-6 lg:px-8">
        {/* Top Left Corner: DDGDVC STUDENT PORTAL */}
        <Link to="/student/dashboard" className="flex items-center gap-2 group shrink min-w-0">
          <span className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#F5EBD0] text-[#7F011F] text-xs font-black shadow-md group-hover:scale-105 transition-all border border-[#E6DAB8] shrink-0">
            DG
          </span>
          <div className="leading-tight text-left min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <p className="text-xs sm:text-base font-extrabold text-white tracking-wide group-hover:text-[#F5EBD0] transition-colors truncate">
                DDGDVC STUDENT PORTAL
              </p>
              <span className="hidden md:inline-flex items-center gap-1 bg-[#F5EBD0] text-[#7F011F] text-[9px] font-black px-1.5 py-0.5 rounded uppercase shrink-0">
                <FiAward size={10} /> CS DEPT
              </span>
            </div>
            <p className="text-[9px] sm:text-[10px] font-semibold text-[#F5EBD0]/90 truncate hidden xs:block">
              Department of Computer Science
            </p>
          </div>
        </Link>

        {/* Top Right Corner: Dashboard Button & Sign Out */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-2">
          <button
            onClick={() => navigate("/student/dashboard")}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 sm:px-4 min-h-[40px] sm:min-h-[44px] text-xs font-extrabold shadow-md transition-all active:scale-95 ${
              location.pathname === "/student/dashboard"
                ? "bg-[#F5EBD0] text-[#7F011F] ring-2 ring-white"
                : "bg-white/10 text-white hover:bg-[#F5EBD0] hover:text-[#7F011F] border border-white/20"
            }`}
            title="Dashboard"
          >
            <FiHome size={15} />
            <span className="hidden sm:inline">Dashboard</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl text-white/90 bg-white/10 hover:bg-rose-700 hover:text-white transition-all border border-white/20 min-h-[40px] sm:min-h-[44px] shrink-0"
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
