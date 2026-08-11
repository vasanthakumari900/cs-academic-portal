// src/components/layout/DashboardTopbar.jsx
import { FiHome, FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import csPortalLogo from "../../assets/cs-portal-logo-transparent.png";

export default function DashboardTopbar({ onMenuToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [logoModalOpen, setLogoModalOpen] = useState(false);

  async function handleLogout() {
    await logout();
    toast.success("Signed out successfully");
    navigate("/login");
  }

  const isOnDashboard = location.pathname === "/student/dashboard" || location.pathname === "/admin/dashboard" || location.pathname === "/faculty/dashboard";

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#FBF7F2]/85 dark:bg-[#190B13]/85 backdrop-blur-xl border-b border-[#F0E2E6]/70 dark:border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-[clamp(0.75rem,3vw,2rem)] py-[clamp(0.5rem,1.5vw,0.75rem)]">
          <div className="flex items-center gap-2.5">
            <button onClick={onMenuToggle} className="lg:hidden p-2 rounded-xl text-[#4A1620] dark:text-[#F3E4E8] hover:bg-[#F6E4E8]/70 dark:hover:bg-white/10 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer">
              <FiMenu size={22} />
            </button>
            <div className="flex items-center gap-2">
              {/* 3D CS Portal Emblem */}
              <button
                onClick={() => setLogoModalOpen(true)}
                style={{ height:'clamp(2.5rem,6vw,4rem)', width:'clamp(2.5rem,6vw,4rem)' }}
                className="flex items-center justify-center rounded-xl bg-[#FBF7F2] shadow-md shrink-0 border-2 border-[#D97706] overflow-hidden cursor-pointer hover:scale-105 transition-transform p-0.5"
                title="Click to view logo in full screen"
              >
                <img src={csPortalLogo} alt="CS Academic Portal Logo" className="h-full w-full object-contain rounded-lg" />
              </button>

              <div className="hidden sm:block leading-tight text-left">
                <p style={{ fontSize: 'clamp(0.65rem,1.5vw,0.875rem)' }} className="font-black text-[#4A1620] dark:text-[#F3E4E8] tracking-wide font-heading">
                  {user?.type === "faculty" ? "FACULTY PORTAL" : user?.type === "admin" ? "ADMIN PORTAL" : "STUDENT PORTAL"}
                </p>
                <p className="text-[10px] font-semibold text-[#B45309] dark:text-[#F4C266] font-mono tracking-wider uppercase">
                  Dept. of Computer Science
                </p>
              </div>
            </div>
            {user && (
              <div className="hidden md:block text-left border-l border-[#F0E2E6] dark:border-white/10 pl-3 max-w-[clamp(100px,15vw,200px)] truncate">
                <p className="text-xs font-bold text-[#2A0D13] dark:text-[#F0E2E6] leading-tight truncate font-heading">{user.name}</p>
                <p className="text-[10px] text-[#9C6D7F] dark:text-[#D9C2CA] font-medium font-mono truncate">
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
                className="group inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-b from-[#E08813] to-[#D97706] hover:from-[#F4C266] hover:to-[#E08813] px-3.5 py-2 min-h-[44px] text-xs font-bold text-white shadow-[0_1px_2px_rgba(28,10,16,0.2),0_4px_14px_rgba(217,119,6,0.3)] transition-all active:scale-[0.98] border border-[#F4C266]/50 cursor-pointer font-heading"
              >
                <FiHome size={14} />
                <span className="hidden sm:inline">Dashboard</span>
              </button>
            )}
            <button onClick={handleLogout}
              className="group flex h-11 w-11 items-center justify-center rounded-xl text-[#4A1620] dark:text-[#F3E4E8] bg-[#F6E4E8]/70 dark:bg-white/10 transition-all duration-200 hover:bg-[#DC2626] hover:text-white active:scale-95 border border-[#F0E2E6] dark:border-white/10 min-h-[44px] cursor-pointer"
              aria-label="Log out" title="Sign out"
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor" className="transition-transform group-hover:-translate-x-0.5">
                <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Full Screen Logo Viewer Modal */}
      <AnimatePresence>
        {logoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#190B13]/90 backdrop-blur-md p-4 sm:p-8"
            onClick={() => setLogoModalOpen(false)}
          >
            {/* Close Button */}
            <button
              onClick={() => setLogoModalOpen(false)}
              className="absolute top-5 right-5 p-3 rounded-full bg-white/10 text-white hover:bg-red-600 hover:scale-110 transition-all cursor-pointer z-10"
              title="Close Full Screen"
            >
              <FiX size={26} />
            </button>

            {/* Modal Image */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative flex flex-col items-center justify-center max-w-4xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={csPortalLogo}
                alt="CS Academic Portal Logo Full View"
                className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border-2 border-[#D97706]/40 bg-[#FBF7F2] p-4"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
