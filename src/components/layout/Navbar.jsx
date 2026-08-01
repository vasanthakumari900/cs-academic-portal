// src/components/layout/Navbar.jsx
import { Link, useLocation } from "react-router-dom";
import { FiGrid, FiChevronRight, FiMenu, FiX, FiBookOpen, FiFileText, FiBriefcase, FiHome, FiSearch, FiAward, FiInfo, FiExternalLink } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { to: "/", label: "HOME", icon: FiHome },
  { to: "/e-content", label: "E-CONTENT", icon: FiBookOpen },
  { to: "/notes", label: "NOTES", icon: FiFileText },
  { to: "/question-papers", label: "Q PAPERS", icon: FiFileText },
  { to: "/cia-question-papers", label: "CIA PAPERS", icon: FiAward },
  { to: "/placements", label: "PLACEMENTS", icon: FiBriefcase },
  { to: "/about", label: "ABOUT US", icon: FiInfo },
];

export default function Navbar() {
  const { user } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const getDashboardPath = (user) => {
    if (!user) return "/login";
    if (user.type === "faculty" || user.role === "faculty") return "/faculty/dashboard";
    if (user.type === "admin" || user.role === "admin") return "/admin/dashboard";
    return "/student/dashboard";
  };

  const getHomePath = (user) => {
    if (user?.type === "faculty" || user?.role === "faculty") return "/faculty/dashboard";
    return "/";
  };

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 bg-[#7F011F]/95 backdrop-blur-md border-b-4 border-[#F5EBD0] shadow-2xl transition-all"
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6 lg:px-8">
          
          {/* Creative Logo Emblem */}
          <Link to={getHomePath(user)} className="group flex items-center gap-3">
            <span className="relative flex flex-col items-center justify-center rounded-xl bg-[#F5EBD0] text-[#7F011F] shadow-lg px-3.5 py-1.5 transition-transform group-hover:scale-105 border-2 border-[#E6DAB8]">
              <span className="text-[11px] font-black leading-tight tracking-widest uppercase">DDGDVC</span>
              <span className="text-[8px] font-extrabold leading-tight text-[#C50337] uppercase tracking-wider">CS PORTAL</span>
            </span>
          </Link>

          {/* Desktop Creative Nav Links (All Uppercase) */}
          <div className="hidden md:flex items-center gap-1.5 bg-black/20 p-1.5 rounded-2xl border border-white/10 shadow-inner">
            {navLinks.map((link) => {
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-3.5 py-2 text-xs font-black tracking-wider rounded-xl transition-all duration-200 uppercase flex items-center gap-1.5 ${
                    active
                      ? "text-[#7F011F] bg-[#F5EBD0] shadow-md scale-105 font-black"
                      : "text-white/90 hover:text-white hover:bg-white/15"
                  }`}
                >
                  <link.icon size={13} className={active ? "text-[#7F011F]" : "text-amber-300"} />
                  <span>{link.label}</span>
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute -bottom-1 left-2 right-2 h-1 rounded-full bg-[#C50337]"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right User / Login Section */}
          <div className="flex items-center gap-2.5">
            {/* Vaishnav LMS Button */}
            <a
              href="https://dgvc.in/lms/login.php"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 px-3.5 py-2 text-xs font-black text-slate-900 shadow-md transition-all border border-amber-300 uppercase tracking-wider active:scale-95 hover:scale-105"
            >
              <FiExternalLink size={14} className="text-[#021C4F]" />
              <span>VAISHNAV LMS</span>
            </a>

            <Link
              to="/search"
              className="p-2 rounded-xl text-white/90 hover:text-white hover:bg-white/15 transition-all shadow-sm"
              aria-label="Search"
            >
              <FiSearch size={17} />
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <span className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold text-white/95 bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F5EBD0] text-[10px] font-black text-[#7F011F]">
                    {user.name?.charAt(0)}
                  </span>
                  <span className="text-white font-black tracking-wide uppercase">
                    {user.name?.split(" ")[0]}
                    {user.section && <span className="text-amber-300 ml-1">· Sec {user.section}</span>}
                  </span>
                </span>
                <Link
                  to={getDashboardPath(user)}
                  className="group inline-flex items-center gap-1.5 rounded-xl bg-[#F5EBD0] hover:bg-amber-300 px-4 py-2 text-xs font-black text-[#7F011F] shadow-lg transition-all active:scale-95 border border-[#E6DAB8] uppercase tracking-wider"
                >
                  <FiGrid size={14} />
                  <span>DASHBOARD</span>
                  <FiChevronRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            ) : (
              <Link
                to="/login"
                className="group inline-flex items-center gap-1.5 rounded-xl bg-[#F5EBD0] hover:bg-amber-300 px-5 py-2 text-xs font-black text-[#7F011F] shadow-lg transition-all active:scale-95 border border-[#E6DAB8] uppercase tracking-wider"
              >
                <span>LOGIN</span>
                <FiChevronRight size={12} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl text-white/90 hover:bg-white/15 transition-all"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setMobileOpen(false)} />
            <div className="absolute top-16 left-0 right-0 mx-4 rounded-2xl bg-[#7F011F] border-2 border-[#F5EBD0] shadow-2xl overflow-hidden">
              <div className="p-3 space-y-1.5 text-left">
                {navLinks.map((link) => {
                  const active = isActive(link.to);
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black tracking-wider transition-all uppercase ${
                        active
                          ? "bg-[#F5EBD0] text-[#7F011F] font-black shadow-md"
                          : "text-white/90 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <link.icon size={16} className={active ? "text-[#7F011F]" : "text-amber-300"} />
                      {link.label}
                    </Link>
                  );
                })}
                <div className="h-px bg-white/15 my-2" />
                <a
                  href="https://dgvc.in/lms/login.php"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black tracking-wider text-slate-900 bg-amber-400 hover:bg-amber-300 uppercase shadow-md"
                >
                  <FiExternalLink size={16} />
                  VAISHNAV LMS PORTAL
                </a>
                <Link
                  to="/search"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black tracking-wider text-white/90 hover:bg-white/10 uppercase"
                >
                  <FiSearch size={16} className="text-amber-300" />
                  SEARCH
                </Link>
                {user && (
                  <Link
                    to={getDashboardPath(user)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black tracking-wider text-[#7F011F] bg-[#F5EBD0] uppercase shadow-md"
                  >
                    <FiGrid size={16} />
                    DASHBOARD
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
