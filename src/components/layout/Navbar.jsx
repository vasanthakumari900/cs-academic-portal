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
  FiExternalLink
} from "react-icons/fi";
import { FaGraduationCap } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import csPortalLogo from "../../assets/cs-portal-logo-transparent.png";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/notes", label: "Notes" },
  { to: "/e-content", label: "E-Content" },
  { to: "/college-calendar", label: "Calendar" },
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

  const userRole = user?.type || user?.role || "guest";

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-2 sm:px-4 py-2 transition-all">
        <div className="mx-auto max-w-[1440px] bg-white/90 dark:bg-[#190B13]/90 backdrop-blur-xl rounded-2xl shadow-[0_1px_2px_rgba(28,10,16,0.04),0_8px_28px_rgba(28,10,16,0.08)] border border-[#F0E2E6]/80 dark:border-white/10 px-[clamp(0.75rem,3vw,1.5rem)] py-[clamp(0.375rem,1vw,0.5rem)] flex items-center justify-between gap-3 sm:gap-4">
          
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
                style={{ height: 'clamp(2rem, 5vw, 3.5rem)' }}
                className="w-auto object-contain rounded-xl shadow-md border-2 border-[#D97706] shrink-0 bg-[#FBF7F2]"
              />
            </button>
            
            <Link to={getHomePath(user)} className="flex flex-col leading-none shrink-0 group cursor-pointer">
              <span style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.25rem)' }} className="font-black text-[#4A1620] dark:text-[#F3E4E8] tracking-tight group-hover:text-[#7E2238] dark:group-hover:text-[#F4C266] transition-colors font-heading">
                DDGDVC
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold text-[#9C6D7F] dark:text-[#D9C2CA] mt-0.5 tracking-widest uppercase">
                CS Portal
              </span>
            </Link>
          </div>

          {/* Center Nav Links (Horizontal single line, no wrapping) */}
          <nav className="hidden lg:flex items-center gap-[clamp(0.5rem,1.5vw,1.5rem)] shrink-0">
            {navLinks.map((link) => {
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative py-1 text-sm font-semibold whitespace-nowrap transition-colors duration-150 cursor-pointer ${
                    active
                      ? "text-[#4A1620] dark:text-[#F4C266] font-bold"
                      : "text-[#7C4B5E] dark:text-[#D9C2CA] hover:text-[#4A1620] dark:hover:text-[#F3E4E8]"
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
              className="flex items-center justify-center w-9 h-9 rounded-xl border border-[#EDC8D0] dark:border-white/15 text-[#7C4B5E] dark:text-[#D9C2CA] hover:text-[#4A1620] hover:bg-[#F6E4E8]/60 dark:hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
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
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-b from-[#E08813] to-[#D97706] hover:from-[#F4C266] hover:to-[#E08813] active:scale-98 px-3.5 py-2 text-xs font-bold text-white uppercase tracking-wider shadow-[0_1px_2px_rgba(28,10,16,0.2),0_4px_14px_rgba(217,119,6,0.3)] transition-all border border-[#F4C266]/50 shrink-0 whitespace-nowrap cursor-pointer font-heading"
            >
              <FaGraduationCap className="w-4 h-4 text-white" />
              <span>VAISHNAV LMS</span>
            </a>

            {/* Dashboard Button */}
            <Link
              to={getDashboardPath(user)}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-[#4A1620] hover:bg-[#61182A] active:scale-98 px-3.5 py-2 text-xs font-bold text-white uppercase tracking-wider shadow-[0_1px_2px_rgba(28,10,16,0.2),0_4px_14px_rgba(74,22,32,0.3)] transition-all border border-[#C96A7E]/40 shrink-0 whitespace-nowrap cursor-pointer font-heading"
            >
              <FiGrid className="w-3.5 h-3.5 text-white" />
              <span>DASHBOARD</span>
            </Link>

            {/* Profile Dropdown */}
            <div className="relative shrink-0" ref={dropdownRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-1.5 p-1 pl-1.5 pr-2 rounded-full hover:bg-[#F6E4E8]/60 dark:hover:bg-white/10 transition-colors cursor-pointer shrink-0 max-w-[120px] sm:max-w-[180px]"
                aria-label="User menu"
              >
                <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-[#D97706] text-[#4A1620] bg-[#FCEED0] overflow-hidden shrink-0">
                  {user?.photoUrl ? (
                    <img src={user.photoUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <FiUser className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                  )}
                </div>
                <span className="hidden md:inline-block text-xs font-bold text-[#4A1620] dark:text-[#F3E4E8] tracking-tight truncate max-w-[clamp(60px,8vw,120px)]">
                  {displayName}
                </span>
                <FiChevronDown className={`w-3.5 h-3.5 text-[#9C6D7F] dark:text-[#D9C2CA] shrink-0 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Profile Dropdown Panel */}
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-60 rounded-2xl bg-white dark:bg-[#22101A] p-2 shadow-[0_2px_4px_rgba(28,10,16,0.05),0_12px_36px_rgba(28,10,16,0.14)] border border-[#F0E2E6]/80 dark:border-white/10 text-[#2A0D13] dark:text-[#F0E2E6] z-50"
                  >
                    {user ? (
                      <>
                        <div className="px-3 py-2 border-b border-[#F0E2E6]/70 dark:border-white/10 mb-1">
                          <p className="text-xs font-bold text-[#4A1620] dark:text-[#F4C266] truncate font-heading">{user.name}</p>
                          <p className="text-[11px] text-[#9C6D7F] dark:text-[#D9C2CA] truncate mt-0.5 font-mono">
                            {user.rollNumber ? `Roll: ${user.rollNumber}` : userRole.toUpperCase() || "USER"}
                          </p>
                        </div>
                        <Link
                          to="/student/profile"
                          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#2A0D13] dark:text-[#F0E2E6] hover:bg-[#F6E4E8]/60 dark:hover:bg-white/10 hover:text-[#4A1620] rounded-xl transition-colors cursor-pointer"
                        >
                          <FiUser size={14} /> Profile Details
                        </Link>
                        <div className="h-px bg-[#F0E2E6]/70 dark:bg-white/10 my-1" />
                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#DC2626] hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                        >
                          <FiLogOut size={14} /> Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="px-3 py-2 border-b border-[#F0E2E6]/70 dark:border-white/10 mb-1">
                          <p className="text-xs font-bold text-[#4A1620] dark:text-[#F3E4E8] font-heading">Welcome Guest</p>
                          <p className="text-[11px] text-[#9C6D7F] dark:text-[#D9C2CA] mt-0.5">Access your CS Academic Portal</p>
                        </div>
                        <Link
                          to="/login"
                          className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-white bg-[#4A1620] hover:bg-[#61182A] rounded-xl transition-colors cursor-pointer"
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
              className="lg:hidden p-2 rounded-xl border border-[#EDC8D0] dark:border-white/15 text-[#4A1620] dark:text-[#F3E4E8] hover:bg-[#F6E4E8]/60 dark:hover:bg-white/10 transition-colors shrink-0 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-[#190B13]/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              style={{ top: 'clamp(4.5rem, 10vw, 6rem)' }}
              className="absolute right-3 left-3 rounded-2xl bg-white dark:bg-[#22101A] border border-[#F0E2E6]/80 dark:border-white/10 shadow-2xl overflow-hidden p-3 text-[#2A0D13] dark:text-[#F0E2E6]"
            >
              <div className="space-y-1">
                {navLinks.map((link) => {
                  const active = isActive(link.to);
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                        active
                          ? "bg-[#F6E4E8]/70 dark:bg-white/10 text-[#4A1620] dark:text-[#F4C266] font-bold border-l-4 border-[#D97706]"
                          : "text-[#2A0D13]/80 dark:text-[#F0E2E6]/80 hover:bg-[#F6E4E8]/50 dark:hover:bg-white/5"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              <div className="h-px bg-[#F0E2E6]/70 dark:bg-white/10 my-3" />

              <div className="space-y-2">
                <a
                  href="https://dgvc.in/lms/login.php"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-b from-[#E08813] to-[#D97706] text-xs font-bold text-white uppercase tracking-wider shadow-sm"
                >
                  <FaGraduationCap className="w-4 h-4" />
                  VAISHNAV LMS
                </a>

                <Link
                  to={getDashboardPath(user)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#4A1620] text-xs font-bold text-white uppercase tracking-wider shadow-sm"
                >
                  <FiGrid className="w-4 h-4" />
                  DASHBOARD
                </Link>
              </div>
            </motion.div>
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
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#190B13]/90 backdrop-blur-md p-4 sm:p-8"
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
                className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border-2 border-[#D97706]/40 bg-[#FBF7F2] p-4"
              />
              <p className="mt-4 text-xs text-white/70 flex items-center gap-1.5 font-heading tracking-wide">
                <FiExternalLink className="hidden" />
                DDGDVC · CS Academic Portal
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
