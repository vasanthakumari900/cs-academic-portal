// src/components/layout/Navbar.jsx
import { Link, useLocation } from "react-router-dom";
import { FiGrid, FiChevronRight, FiMenu, FiX, FiBookOpen, FiFileText, FiBriefcase, FiHome, FiSearch, FiAward } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { to: "/", label: "Home", icon: FiHome },
  { to: "/e-content", label: "E-Content", icon: FiBookOpen },
  { to: "/notes", label: "Notes", icon: FiFileText },
  { to: "/question-papers", label: "Q Papers", icon: FiFileText },
  { to: "/cia-question-papers", label: "CIA Papers", icon: FiAward },
  { to: "/placements", label: "Placements", icon: FiBriefcase },
  { to: "/about", label: "About", icon: FiGrid },
];

export default function Navbar() {
  const { user } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const getDashboardPath = (user) => {
    if (!user) return "/login";
    if (user.type === "faculty") return "/faculty/dashboard";
    if (user.type === "admin") return "/admin/dashboard";
    return "/student/dashboard";
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
        className="fixed top-0 left-0 right-0 z-40 bg-[#7F011F] border-b-4 border-[#F5EBD0] shadow-md"
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="group flex items-center gap-2.5">
            <span className="relative flex flex-col items-center justify-center rounded-xl bg-[#F5EBD0] text-[#7F011F] shadow-md px-3.5 py-1.5 transition-all group-hover:scale-105 border border-[#E6DAB8]">
              <span className="text-[11px] font-black leading-tight tracking-wider">DDGDVC</span>
              <span className="text-[8px] font-extrabold leading-tight text-[#7F011F] uppercase">CS PORTAL</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-3.5 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
                  isActive(link.to)
                    ? "text-[#7F011F] bg-[#F5EBD0] shadow-sm font-black"
                    : "text-white/90 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
                {isActive(link.to) && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-[#7F011F]"
                  />
                )}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/search"
              className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
              aria-label="Search"
            >
              <FiSearch size={16} />
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <span className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-white/90">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F5EBD0] text-[10px] font-black text-[#7F011F]">
                    {user.name?.charAt(0)}
                  </span>
                  <span className="text-white font-semibold">
                    {user.name?.split(" ")[0]}
                    {user.section && <span className="text-[#F5EBD0]/80 ml-1">· Sec {user.section}</span>}
                  </span>
                </span>
                <Link
                  to={getDashboardPath(user)}
                  className="group inline-flex items-center gap-1.5 rounded-xl bg-[#F5EBD0] hover:bg-[#EBDCAE] px-4 py-2 text-xs font-black text-[#7F011F] shadow-md transition-all active:scale-[0.97] border border-[#E6DAB8]"
                >
                  <FiGrid size={14} />
                  Dashboard
                  <FiChevronRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            ) : (
              <Link
                to="/login"
                className="group inline-flex items-center gap-1.5 rounded-xl bg-[#F5EBD0] hover:bg-[#EBDCAE] px-5 py-2.5 text-xs font-black text-[#7F011F] shadow-md transition-all active:scale-[0.97] border border-[#E6DAB8]"
              >
                Login
                <FiChevronRight size={12} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-white/90 hover:bg-white/10 transition-all"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-30 md:hidden"
          >
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
            <div className="absolute top-16 left-0 right-0 mx-4 rounded-xl bg-[#7F011F] border-2 border-[#F5EBD0] shadow-2xl overflow-hidden">
              <div className="p-3 space-y-1 text-left">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                      isActive(link.to)
                        ? "bg-[#F5EBD0] text-[#7F011F] font-black"
                        : "text-white/90 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <link.icon size={16} />
                    {link.label}
                  </Link>
                ))}
                <div className="h-px bg-white/10 my-2" />
                <Link
                  to="/search"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold text-white/90 hover:bg-white/10 hover:text-white"
                >
                  <FiSearch size={16} />
                  Search
                </Link>
                {user && (
                  <Link
                    to={getDashboardPath(user)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-black text-[#7F011F] bg-[#F5EBD0]"
                  >
                    <FiGrid size={16} />
                    Dashboard
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
