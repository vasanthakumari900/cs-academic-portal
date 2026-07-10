import { Link, useLocation } from "react-router-dom";
import { FiGrid, FiChevronRight, FiMenu, FiX, FiBookOpen, FiFileText, FiBriefcase, FiHome, FiSearch } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { to: "/", label: "Home", icon: FiHome },
  { to: "/e-content", label: "E-Content", icon: FiBookOpen },
  { to: "/notes", label: "Notes", icon: FiFileText },
  { to: "/question-papers", label: "Q Papers", icon: FiFileText },
  { to: "/placements", label: "Placements", icon: FiBriefcase },
  { to: "/about", label: "About", icon: FiGrid },
];

export default function Navbar() {
  const { user } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? "bg-[#0F172A]/80 backdrop-blur-xl shadow-lg border-b border-white/10"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="group flex items-center gap-2.5">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white text-sm font-extrabold shadow-lg transition-all duration-300 group-hover:shadow-indigo-500/30 group-hover:scale-105">
              DV
              <span className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 blur-sm -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </span>
            <div className="flex flex-col leading-tight">
              <span className={`text-xs font-bold tracking-tight transition-colors duration-500 ${scrolled ? 'text-white' : 'text-white'}`}>
                DDGDVC
              </span>
              <span className="text-[10px] -mt-0.5 text-white/60">
                CS Portal
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-3.5 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                  isActive(link.to)
                    ? "text-cyan-300 bg-white/10"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
                {isActive(link.to) && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-cyan-400"
                  />
                )}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/search"
              className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200"
              aria-label="Search"
            >
              <FiSearch size={16} />
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <span className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-white/60">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/20 to-violet-500/20 text-[9px] font-bold text-indigo-300">
                    {user.name?.charAt(0)}
                  </span>
                  <span className="text-white/70">
                    {user.name?.split(" ")[0]}
                    {user.section && <span className="text-white/40 ml-1">· Sec {user.section}</span>}
                  </span>
                </span>
                <Link
                  to="/student/dashboard"
                  className="group inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-indigo-500/30 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.97]"
                >
                  <FiGrid size={14} />
                  Dashboard
                  <FiChevronRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            ) : (
              <Link
                to="/login"
                className="group inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-indigo-500/30 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.97]"
              >
                Login
                <FiChevronRight size={12} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-white/60 hover:bg-white/10 transition-all"
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
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <div className="absolute top-16 left-0 right-0 mx-4 rounded-2xl bg-[#0F172A]/95 backdrop-blur-xl border border-white/10 shadow-xl overflow-hidden">
              <div className="p-3 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive(link.to)
                        ? "bg-white/10 text-cyan-300"
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <link.icon size={16} />
                    {link.label}
                  </Link>
                ))}
                <div className="h-px bg-white/10 my-2" />
                <Link
                  to="/search"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white/60 hover:bg-white/5 hover:text-white"
                >
                  <FiSearch size={16} />
                  Search
                </Link>
                {user && (
                  <Link
                    to="/student/dashboard"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-cyan-300 bg-white/10"
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
