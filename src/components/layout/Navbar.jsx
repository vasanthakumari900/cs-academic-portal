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
        <div className="mx-auto max-w-[1440px] bg-white/95 backdrop-blur-md rounded-2xl shadow-md border-t-4 border-[#7F011F] border-x border-b border-gray-100 px-3 sm:px-6 py-2 flex items-center justify-between gap-3 sm:gap-4">
          
          {/* Left Brand CS Academic Portal Logo */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <button
              onClick={() => setLogoModalOpen(true)}
              className="cursor-pointer focus:outline-none group p-1 rounded-xl hover:bg-[#F5EBD0]/50 transition-colors"
              title="Click to view logo in full screen"
            >
              <img
                src={csPortalLogo}
                alt="CS Academic Portal Logo"
                className="h-14 sm:h-16 md:h-20 w-auto object-contain transition-transform group-hover:scale-105 shrink-0 drop-shadow-sm"
              />
            </button>
            
            <Link to={getHomePath(user)} className="flex flex-col leading-none shrink-0 group">
              <span className="text-lg sm:text-xl font-black text-[#7F011F] tracking-tight group-hover:text-[#680119] transition-colors">DDGDVC</span>
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 mt-0.5 tracking-wide">CS Portal</span>
            </Link>
          </div>

          {/* Center Nav Links (Horizontal single line, no wrapping) */}
          <nav className="hidden xl:flex items-center gap-6 xl:gap-8 shrink-0">
            {navLinks.map((link) => {
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative py-1 text-sm font-semibold whitespace-nowrap transition-colors duration-150 ${
                    active
                      ? "text-[#7F011F] font-bold"
                      : "text-slate-700 hover:text-[#7F011F]"
                  }`}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="active-nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-[2.5px] bg-[#7F011F] rounded-full"
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
              className="flex items-center justify-center w-9 h-9 rounded-xl border border-gray-200 text-slate-600 hover:text-[#7F011F] hover:bg-gray-50 transition-colors shadow-2xs shrink-0"
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
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-[#EBB328] hover:bg-[#d9a11f] active:scale-97 px-3.5 py-2 text-xs font-bold text-slate-900 uppercase tracking-wider shadow-2xs transition-all border border-amber-300/40 shrink-0 whitespace-nowrap"
            >
              <FaGraduationCap className="w-4 h-4 text-slate-900" />
              <span>VAISHNAV LMS</span>
            </a>

            {/* Dashboard Button */}
            <Link
              to={getDashboardPath(user)}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-[#7F011F] hover:bg-[#680119] active:scale-97 px-3.5 py-2 text-xs font-bold text-white uppercase tracking-wider shadow-2xs transition-all border border-[#7F011F] shrink-0 whitespace-nowrap"
            >
              <FiGrid className="w-3.5 h-3.5 text-white" />
              <span>DASHBOARD</span>
            </Link>

            {/* Profile Dropdown */}
            <div className="relative shrink-0" ref={dropdownRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full hover:bg-gray-100/80 transition-colors cursor-pointer shrink-0"
                aria-label="User menu"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-[#7F011F] text-[#7F011F] bg-rose-50/50 overflow-hidden shrink-0">
                  {user?.photoUrl ? (
                    <img src={user.photoUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <FiUser className="w-4 h-4 stroke-[2.5]" />
                  )}
                </div>
                <span className="hidden md:inline-block text-xs font-bold text-slate-800 tracking-tight whitespace-nowrap">
                  {displayName}
                </span>
                <FiChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Profile Dropdown Panel */}
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-white p-2 shadow-xl border border-gray-100 text-slate-800 z-50"
                  >
                    {user ? (
                      <>
                        <div className="px-3 py-2 border-b border-gray-100 mb-1">
                          <p className="text-xs font-bold text-[#7F011F] truncate">{user.name}</p>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {user.rollNumber ? `Roll: ${user.rollNumber}` : user.type?.toUpperCase() || "USER"}
                          </p>
                        </div>
                        <Link
                          to="/student/profile"
                          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-rose-50 hover:text-[#7F011F] rounded-xl transition-colors"
                        >
                          <FiUser size={14} /> Profile Details
                        </Link>
                        <div className="h-px bg-gray-100 my-1" />
                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        >
                          <FiLogOut size={14} /> Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="px-3 py-2 border-b border-gray-100 mb-1">
                          <p className="text-xs font-bold text-slate-800">Welcome Guest</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">Access your CS Academic Portal</p>
                        </div>
                        <Link
                          to="/login"
                          className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-white bg-[#7F011F] hover:bg-[#680119] rounded-xl transition-colors"
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
              className="xl:hidden p-2 rounded-xl border border-gray-200 text-slate-700 hover:bg-gray-50 transition-colors shrink-0"
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
            <div className="absolute top-20 left-3 right-3 rounded-2xl bg-white border border-gray-100 shadow-2xl overflow-hidden p-3 text-slate-800">
              <div className="space-y-1">
                {navLinks.map((link) => {
                  const active = isActive(link.to);
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`flex items-center px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                        active
                          ? "bg-rose-50 text-[#7F011F] font-bold"
                          : "text-slate-700 hover:bg-gray-50"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              <div className="h-px bg-gray-100 my-3" />

              <div className="space-y-2">
                <a
                  href="https://dgvc.in/lms/login.php"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#EBB328] text-xs font-bold text-slate-900 uppercase tracking-wider shadow-2xs"
                >
                  <FaGraduationCap className="w-4 h-4" />
                  VAISHNAV LMS
                </a>

                <Link
                  to={getDashboardPath(user)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#7F011F] text-xs font-bold text-white uppercase tracking-wider shadow-2xs"
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
              className="absolute top-5 right-5 p-3 rounded-full bg-white/10 text-white hover:bg-rose-600 hover:scale-110 transition-all cursor-pointer z-10"
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
                className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border-2 border-[#7F011F]/30 bg-[#FAF7F2] p-4"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


