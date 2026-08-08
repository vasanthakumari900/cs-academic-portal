import { Outlet, useLocation, useNavigate } from "react-router-dom";
import StudentTopbar from "../components/layout/StudentTopbar";
import Footer from "../components/layout/Footer";
import { FiArrowLeft } from "react-icons/fi";

export default function StudentLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === "/student/dashboard";

  return (
    <div className="flex min-h-screen flex-col bg-[#F5EBD0] text-[#7F011F]">
      <StudentTopbar />
      <main className="relative z-10 flex-1">
        {/* Left Side Back Button (<- Back) for Every Sub-Page (Notes, Videos, Papers, etc.) */}
        {!isDashboard && (
          <div className="mx-auto max-w-6xl px-4 pt-6 pb-2 sm:px-6 lg:px-8 text-left">
            <button
              onClick={() => navigate("/student/dashboard")}
              className="group inline-flex items-center gap-2.5 rounded-xl bg-white px-5 py-2.5 text-sm sm:text-base font-extrabold text-[#7F011F] shadow-md transition-all hover:bg-[#7F011F] hover:text-white hover:shadow-lg hover:scale-105 active:scale-95 border-2 border-[#E6DAB8]"
              title="Back to Dashboard"
            >
              <FiArrowLeft size={22} className="transition-transform group-hover:-translate-x-1 text-[#7F011F] group-hover:text-white" />
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
