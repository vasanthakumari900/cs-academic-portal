// src/components/layout/Navbar.jsx
// Minimal navbar — logo + Dashboard button at top right for logged-in users
import { Link } from "react-router-dom";
import { FiGrid } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 text-white text-sm font-extrabold shadow-soft">
            DV
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-xs font-bold text-gray-800 tracking-tight">DDGDVC</span>
            <span className="text-[10px] text-gray-400 -mt-0.5">CS Academic Portal</span>
          </div>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:block text-[11px] font-medium text-gray-400">
                {user.name}
                {user.section && <span className="ml-1">· Sec {user.section}</span>}
              </span>
              <Link
                to="/student/dashboard"
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-2 text-xs font-semibold text-white shadow-soft hover:shadow-premium transition-all"
              >
                <FiGrid size={14} />
                Dashboard
              </Link>
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-2 text-xs font-semibold text-white shadow-soft hover:shadow-premium transition-all"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
