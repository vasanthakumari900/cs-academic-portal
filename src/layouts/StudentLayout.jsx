import { Outlet, useLocation, useNavigate } from "react-router-dom";
import StudentTopbar from "../components/layout/StudentTopbar";
import Footer from "../components/layout/Footer";
import FocusStudio from "../components/common/FocusStudio";
import { FiArrowLeft } from "react-icons/fi";

export default function StudentLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === "/student/dashboard";

  return (
    <div className="flex min-h-screen flex-col bg-[#FBF7F2] dark:bg-[#190B13] text-[#2A0D13] dark:text-[#F0E2E6]">
      <StudentTopbar />
      <FocusStudio />
      <main className="relative z-10 flex-1">
        {/* Left Side Back Button (<- Back) for Every Sub-Page (Notes, Videos, Papers, etc.) */}
        {!isDashboard && (
          <div className="mx-auto max-w-6xl px-4 pt-6 pb-2 sm:px-6 lg:px-8 text-left">
            <button
              onClick={() => navigate("/student/dashboard")}
              className="group inline-flex items-center gap-2.5 rounded-xl bg-white dark:bg-[#22101A] px-5 py-2.5 text-sm sm:text-base font-extrabold text-[#4A1620] dark:text-[#F3E4E8] shadow-[0_1px_2px_rgba(28,10,16,0.04),0_4px_16px_rgba(28,10,16,0.06)] transition-all hover:bg-[#4A1620] hover:text-white hover:shadow-[0_2px_4px_rgba(28,10,16,0.05),0_10px_32px_rgba(74,22,32,0.25)] hover:scale-[1.02] active:scale-95 border border-[#F0E2E6] dark:border-white/10 cursor-pointer"
              title="Back to Dashboard"
            >
              <FiArrowLeft size={22} className="transition-transform group-hover:-translate-x-1 text-[#4A1620] dark:text-[#F3E4E8] group-hover:text-white" />
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
