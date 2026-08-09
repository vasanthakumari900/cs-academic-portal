// src/components/layout/Navbar.jsx
import { Link, useLocation } from "react-router-dom";
import { 
  FiGrid, 
  FiMenu, 
  FiX, 
  FiSearch, 
  FiUser, 
  FiChevronDown, 
  FiLogOut, 
  FiBookmark,
  FiExternalLink
} from "react-icons/fi";
import { FaGraduationCap } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import csPortalLogo from "../../assets/cs-portal-logo-transparent.png";
import collegeLogo from "../../assets/college-logo.jpg";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/notes", label: "Notes" },
  { to: "/e-content", label: "E-Content" },
  { to: "/question-papers", label: "Q Papers" },
  { to: "/cia-question-papers", label: "CIA Papers" },
  { to: "/placements", label: "Placements" },
  { to: "/about", label: "About Us" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoModalOpen, setLogoModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  const getDashboardPath = (u) => {
    if (!u) return "/login";
    if (u.type === "faculty" || u.role === "faculty") return "/faculty/dashboard";
    if (u.type === "admin" || u.role === "admin") return "/admin/dashboard";
    return "/student/dashboard";
  };

  const getHomePath = (u) => {
    if (u?.type === "faculty" || u?.role === "faculty") return "/faculty/dashboard";
    return "/";
  };

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  // Click outside listener for profile dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const formatName = (nameStr) => {
    if (!nameStr) return "Mega Nathan";
    return nameStr
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const displayName = user ? formatName(user.name) : "Mega Nathan";

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-2 sm:px-4 py-2 transition-all">
        <div className="mx-auto max-w-[1440px] bg-white/95 dark:bg-teal-950/95 backdrop-blur-md rounded-2xl shadow-neu-raised border-t-4 border-[#0D9488] border-x border-b border-[#5EEAD4]/40 dark:border-teal-800 px-[clamp(0.75rem,3vw,1.5rem)] py-[clamp(0.375rem,1vw,0.5rem)] flex items-center justify-between gap-3 sm:gap-4">
          
          {/* Left Brand: 3D CS Academic Portal Emblem */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <button
              onClick={() => setLogoModalOpen(true)}
              className="cursor-pointer focus:outline-none group p-0.5 rounded-xl hover:scale-105 transition-transform shrink-0"
              title="Click to view CS Portal Emblem in full screen"
            >
              <img
                src={csPortalLogo}
                alt="CS Academic Portal Logo"
                style={{ height: 'clamp(2.5rem, 6vw, 5rem)' }}
                className="w-auto object-contain rounded-xl shadow-md border-2 border-[#D97706] shrink-0"
              />
            </button>
            
            <Link to={getHomePath(user)} className="flex flex-col leading-none shrink-0 group cursor-pointer">
              <span style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.25rem)' }} className="font-black text-[#0D9488] dark:text-[#2DD4BF] tracking-tight group-hover:text-[#0F766E] transition-colors font-mono">DDGDVC</span>
              <span className="text-[10px] sm:text-[11px] font-bold text-[#64748B] dark:text-[#5EEAD4]/80 mt-0.5 tracking-wide">CS Portal</span>
            </Link>
          </div>

          {/* Center Nav Links (Horizontal single line, no wrapping) */}
          <nav className="hidden xl:flex items-center gap-[clamp(1rem,2vw,2rem)] shrink-0">
            {navLinks.map((link) => {
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative py-1 text-sm font-semibold whitespace-nowrap transition-colors duration-150 cursor-pointer ${
                    active
                      ? "text-[#0D9488] dark:text-[#2DD4BF] font-bold"
                      : "text-[#134E4A] dark:text-[#CCFBF1] hover:text-[#0D9488] dark:hover:text-[#2DD4BF]"
                  }`}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="active-nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-[2.5px] bg-[#D97706] rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Control Section */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            
            {/* Search Button */}
            <Link
              to="/search"
              className="flex items-center justify-center w-9 h-9 rounded-xl border border-[#5EEAD4] dark:border-teal-800 text-[#134E4A] dark:text-[#CCFBF1] hover:text-[#0D9488] hover:bg-[#CCFBF1]/50 dark:hover:bg-teal-900/50 transition-colors shadow-2xs shrink-0 cursor-pointer"
              title="Search"
              aria-label="Search"
            >
              <FiSearch className="w-4 h-4" />
            </Link>

            {/* Vaishnav LMS Button */}
            <a
              href="https://dgvc.in/lms/login.php"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-[#D97706] hover:bg-[#B45309] active:scale-98 px-3.5 py-2 text-xs font-bold text-white uppercase tracking-wider shadow-neu-raised transition-all border border-amber-400/40 shrink-0 whitespace-nowrap cursor-pointer font-mono"
            >
              <FaGraduationCap className="w-4 h-4 text-white" />
              <span>VAISHNAV LMS</span>
            </a>

            {/* Dashboard Button */}
            <Link
              to={getDashboardPath(user)}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] active:scale-98 px-3.5 py-2 text-xs font-bold text-white uppercase tracking-wider shadow-neu-raised transition-all border border-[#0D9488] shrink-0 whitespace-nowrap cursor-pointer font-mono"
            >
              <FiGrid className="w-3.5 h-3.5 text-white" />
              <span>DASHBOARD</span>
            </Link>

            {/* Profile Dropdown */}
            <div className="relative shrink-0" ref={dropdownRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-1.5 p-1 pl-1.5 pr-2 rounded-full hover:bg-[#CCFBF1]/50 dark:hover:bg-teal-900/50 transition-colors cursor-pointer shrink-0 max-w-[120px] sm:max-w-[180px]"
                aria-label="User menu"
              >
                <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-[#0D9488] text-[#0D9488] bg-[#CCFBF1]/50 overflow-hidden shrink-0">
                  {user?.photoUrl ? (
                    <img src={user.photoUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <FiUser className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                  )}
                </div>
                <span className="hidden md:inline-block text-xs font-bold text-[#134E4A] dark:text-[#CCFBF1] tracking-tight truncate max-w-[clamp(60px,8vw,120px)]">
                  {displayName}
                </span>
                <FiChevronDown className={`w-3.5 h-3.5 text-[#64748B] dark:text-[#5EEAD4] shrink-0 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Profile Dropdown Panel */}
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-teal-950 p-2 shadow-neu-raised-lg border border-[#5EEAD4]/50 dark:border-teal-800 text-[#134E4A] dark:text-[#CCFBF1] z-50"
                  >
                    {user ? (
                      <>
                        <div className="px-3 py-2 border-b border-[#5EEAD4]/30 dark:border-teal-800 mb-1">
                          <p className="text-xs font-bold text-[#0D9488] dark:text-[#2DD4BF] truncate">{user.name}</p>
                          <p className="text-[11px] text-[#64748B] dark:text-[#5EEAD4]/80 truncate mt-0.5 font-mono">
                            {user.rollNumber ? `Roll: ${user.rollNumber}` : user.type?.toUpperCase() || "USER"}
                          </p>
                        </div>
                        <Link
                          to="/student/profile"
                          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#134E4A] dark:text-[#CCFBF1] hover:bg-[#CCFBF1]/30 dark:hover:bg-teal-900/50 hover:text-[#0D9488] rounded-xl transition-colors cursor-pointer"
                        >
                          <FiUser size={14} /> Profile Details
                        </Link>
                        <div className="h-px bg-[#5EEAD4]/30 dark:bg-teal-800 my-1" />
                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#DC2626] hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                        >
                          <FiLogOut size={14} /> Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="px-3 py-2 border-b border-[#5EEAD4]/30 dark:border-teal-800 mb-1">
                          <p className="text-xs font-bold text-[#134E4A] dark:text-[#CCFBF1]">Welcome Guest</p>
                          <p className="text-[11px] text-[#64748B] dark:text-[#5EEAD4]/80 mt-0.5">Access your CS Academic Portal</p>
                        </div>
                        <Link
                          to="/login"
                          className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-white bg-[#0D9488] hover:bg-[#0F766E] rounded-xl transition-colors cursor-pointer"
                        >
                          Login to Portal
                        </Link>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="xl:hidden p-2 rounded-xl border border-[#5EEAD4] dark:border-teal-800 text-[#134E4A] dark:text-[#CCFBF1] hover:bg-[#CCFBF1]/50 dark:hover:bg-teal-900/50 transition-colors shrink-0 cursor-pointer"
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>

          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-40 xl:hidden"
          >
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setMobileOpen(false)} />
            <div style={{ top: 'clamp(4.5rem, 10vw, 6rem)' }} className="absolute left-3 right-3 rounded-2xl bg-white dark:bg-slate-900 border border-[#99F6E4] dark:border-slate-800 shadow-2xl overflow-hidden p-3 text-slate-800 dark:text-slate-200">
              <div className="space-y-1">
                {navLinks.map((link) => {
                  const active = isActive(link.to);
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                        active
                          ? "bg-[#CCFBF1]/40 text-[#0D9488] font-bold border-l-4 border-[#D97706]"
                          : "text-slate-700 hover:bg-[#CCFBF1]/20"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              <div className="h-px bg-[#99F6E4]/50 my-3" />

              <div className="space-y-2">
                <a
                  href="https://dgvc.in/lms/login.php"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#D97706] text-xs font-bold text-white uppercase tracking-wider shadow-2xs"
                >
                  <FaGraduationCap className="w-4 h-4" />
                  VAISHNAV LMS
                </a>

                <Link
                  to={getDashboardPath(user)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#0D9488] text-xs font-bold text-white uppercase tracking-wider shadow-2xs"
                >
                  <FiGrid className="w-4 h-4" />
                  DASHBOARD
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Screen Logo Viewer Modal */}
      <AnimatePresence>
        {logoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 sm:p-8"
            onClick={() => setLogoModalOpen(false)}
          >
            {/* Close Button */}
            <button
              onClick={() => setLogoModalOpen(false)}
              className="absolute top-5 right-5 p-3 rounded-full bg-white/10 text-white hover:bg-[#DC2626] hover:scale-110 transition-all cursor-pointer z-10"
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
                className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border-2 border-[#0D9488]/30 bg-[#F0FDFA] p-4"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
