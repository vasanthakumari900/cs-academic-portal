// src/components/layout/Navbar.jsx
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import GlobalSearch from "./GlobalSearch";

const links = [
  { to: "/", label: "Home" },
  { to: "/e-content", label: "E Content" },
  { to: "/notes", label: "Lecture Notes" },
  { to: "/question-papers", label: "Question Papers" },
  { to: "/placements", label: "Placements" },
  { to: "/about", label: "About" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 text-white text-sm font-extrabold shadow-soft">
            DV
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-xs font-bold text-gray-800 tracking-tight">DDGDVC</span>
            <span className="text-[10px] text-gray-400 -mt-0.5">CS Academic Portal</span>
          </div>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <GlobalSearch />
          <div className="md:hidden">
            <GlobalSearch compact />
          </div>
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100"
          >
            {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>

          {user ? (
            <div className="hidden sm:flex items-center gap-3">
              <span className="text-xs font-semibold text-gray-500">
                Welcome, <span className="text-blue-700">{user.name}</span>
                {user.section && <span className="ml-1 text-[10px] font-medium text-gray-400">• Sec {user.section}</span>}
              </span>
              <Link to={user.type === "faculty" ? "/faculty/dashboard" : "/student/dashboard"} className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-2 text-xs font-semibold text-white shadow-soft hover:shadow-premium transition-all">
                Dashboard
              </Link>
            </div>
          ) : (
            <Link to="/login" className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-2 text-xs font-semibold text-white shadow-soft hover:shadow-premium transition-all">
              Login
            </Link>
          )}

          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-gray-100 lg:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                >
                  {l.label}
                </NavLink>
              ))}
              <Link to={user ? "/student/dashboard" : "/login"} className="mt-2 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-2 text-xs font-semibold text-white">
                {user ? "Dashboard" : "Login"}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
