import { Outlet, useLocation, useNavigate } from "react-router-dom";
import StudentTopbar from "../components/layout/StudentTopbar";
import Footer from "../components/layout/Footer";
import { FiArrowLeft } from "react-icons/fi";

export default function StudentLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === "/student/dashboard";

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      <StudentTopbar />
      <main className="relative z-10 flex-1">
        {/* Left Side Back Button (<- Back) for Every Sub-Page (Notes, Videos, Papers, etc.) */}
        {!isDashboard && (
          <div className="mx-auto max-w-6xl px-4 pt-6 pb-2 sm:px-6 lg:px-8 text-left">
            <button
              onClick={() => navigate("/student/dashboard")}
              className="group inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs sm:text-sm font-bold text-[#021C4F] shadow-sm transition-all hover:bg-[#021C4F] hover:text-white active:scale-95 border border-slate-200"
              title="Back to Dashboard"
            >
              <FiArrowLeft size={18} className="transition-transform group-hover:-translate-x-1 text-[#C50337] group-hover:text-white" />
              <span>Back</span>
            </button>
          </div>
        )}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
