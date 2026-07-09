// src/components/layout/Navbar.jsx
// Premium navbar — transparent on top, glass on scroll.
import { Link } from "react-router-dom";
import { FiGrid, FiChevronRight } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? "bg-white/80 backdrop-blur-glass-lg shadow-glass border-b border-white/20"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-sm font-extrabold shadow-soft transition-all duration-300 group-hover:shadow-neon-primary group-hover:scale-105">
            DV
            <span className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-blue-600/20 to-indigo-700/20 blur-sm -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </span>
          <div className="flex flex-col leading-tight">
            <span className={`text-xs font-bold tracking-tight transition-colors duration-500 ${scrolled ? 'text-gray-900' : 'text-white'}`}>
              DDGDVC
            </span>
            <span className={`text-[10px] -mt-0.5 transition-colors duration-500 ${scrolled ? 'text-gray-500' : 'text-white/70'}`}>
              CS Academic Portal
            </span>
          </div>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-[9px] font-bold text-blue-700">
                  {user.name?.charAt(0)}
                </span>
                <span className={`transition-colors duration-500 ${scrolled ? 'text-gray-500' : 'text-white/80'}`}>
                  {user.name}
                  {user.section && <span className="text-gray-400">· Sec {user.section}</span>}
                </span>
              </span>
              <Link
                to="/student/dashboard"
                className="group inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-2 text-xs font-semibold text-white shadow-soft transition-all duration-300 hover:shadow-neon-primary hover:from-blue-500 hover:to-indigo-600 active:scale-[0.97]"
              >
                <FiGrid size={14} />
                Dashboard
                <FiChevronRight size={12} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          ) : (
            <Link
              to="/login"
              className="group inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 px-5 py-2.5 text-xs font-semibold text-white shadow-soft transition-all duration-300 hover:shadow-neon-primary hover:from-blue-500 hover:to-indigo-600 active:scale-[0.97]"
            >
              Login
              <FiChevronRight size={12} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
