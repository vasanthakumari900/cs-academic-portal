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
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const getDashboardPath = (user) => {
    if (!user) return "/login";
    if (user.type === "faculty") return "/faculty/dashboard";
    if (user.type === "admin") return "/admin/dashboard";
    return "/student/dashboard";
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        className="fixed top-0 left-0 right-0 z-40 bg-[#0F4C81] border-b border-[#0A3356] shadow-md"
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="group flex items-center gap-2.5">
            <span className="relative flex flex-col items-center justify-center rounded-lg bg-[#1E88E5] text-white shadow-sm px-3.5 py-1.5 transition-all">
              <span className="text-[11px] font-extrabold leading-tight">DDGDVC</span>
              <span className="text-[8px] font-semibold leading-tight text-white/85">CS PORTAL</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-3.5 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                  isActive(link.to)
                    ? "text-white bg-[#1E88E5]"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
                {isActive(link.to) && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-white"
                  />
                )}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/search"
              className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
              aria-label="Search"
            >
              <FiSearch size={16} />
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <span className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-white/85">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1E88E5] text-[9px] font-bold text-white">
                    {user.name?.charAt(0)}
                  </span>
                  <span className="text-white/85">
                    {user.name?.split(" ")[0]}
                    {user.section && <span className="text-white/50 ml-1">· Sec {user.section}</span>}
                  </span>
                </span>
                <Link
                  to={getDashboardPath(user)}
                  className="group inline-flex items-center gap-1.5 rounded-lg bg-[#1E88E5] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#1565C0] active:scale-[0.97]"
                >
                  <FiGrid size={14} />
                  Dashboard
                  <FiChevronRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            ) : (
              <Link
                to="/login"
                className="group inline-flex items-center gap-1.5 rounded-lg bg-[#1E88E5] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#1565C0] active:scale-[0.97]"
              >
                Login
                <FiChevronRight size={12} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-white/80 hover:bg-white/10 transition-all"
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
            <div className="absolute top-16 left-0 right-0 mx-4 rounded-xl bg-[#0F4C81] border border-[#0A3356] shadow-xl overflow-hidden">
              <div className="p-3 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                      isActive(link.to)
                        ? "bg-[#1E88E5] text-white"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <link.icon size={16} />
                    {link.label}
                  </Link>
                ))}
                <div className="h-px bg-white/10 my-2" />
                <Link
                  to="/search"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white"
                >
                  <FiSearch size={16} />
                  Search
                </Link>
                {user && (
                  <Link
                    to={getDashboardPath(user)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-white bg-[#1E88E5]"
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
