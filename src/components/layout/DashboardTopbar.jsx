// src/components/layout/DashboardTopbar.jsx
import { FiMenu, FiMoon, FiSun, FiLogOut } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import NotificationPanel from "./NotificationPanel";
import { initials } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function DashboardTopbar({ onMenuClick, title }) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    toast.success("Signed out");
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-maroon/10 bg-white/85 px-4 backdrop-blur-xl dark:border-gold/10 dark:bg-dark-surface/85 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-dark hover:bg-slate-100 dark:text-white dark:hover:bg-white/10 lg:hidden"
        >
          <FiMenu size={20} />
        </button>
        <h1 className="font-display text-lg font-bold text-dark dark:text-white">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 hover:bg-maroon/5 dark:text-slate-300 dark:hover:bg-white/10"
        >
          {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>          <NotificationPanel />
        <span className="hidden sm:block text-xs font-medium text-slate-500 dark:text-slate-400">
          Welcome, <span className="text-maroon dark:text-gold font-semibold">{user?.name || user?.rollNumber}</span>
          {user?.section && <span className="ml-1 text-[10px] font-medium text-slate-400 dark:text-slate-500">• Sec {user.section}</span>}
        </span>
        <div className="mx-1 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-maroon to-gold text-xs font-bold text-white">
          {initials(user?.name || user?.rollNumber?.[0] || "U")}
        </div>
        <button
          onClick={handleLogout}
          className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 hover:bg-danger/10 hover:text-danger dark:text-slate-300"
          aria-label="Log out"
        >
          <FiLogOut size={18} />
        </button>
      </div>
    </header>
  );
}
