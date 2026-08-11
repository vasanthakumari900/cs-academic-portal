import { NavLink, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { classNames } from "../../utils/helpers";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar({ items, open, onClose }) {
  const { user } = useAuth();

  const getHomeTarget = () => {
    if (user?.type === "faculty" || user?.role === "faculty") return "/faculty/dashboard";
    if (user?.type === "admin" || user?.role === "admin") return "/admin/dashboard";
    return "/student/dashboard";
  };

  const renderIcon = (label, Icon) => {
    if (label === "Question Papers") {
      return (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      );
    }
    return <Icon size={20} />;
  };

  return (
    <>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-30 bg-[#190B13]/60 backdrop-blur-sm lg:hidden" onClick={onClose} />
      )}

      <motion.aside
        initial={false}
        animate={{ x: 0 }}
        style={{ width: 'clamp(240px, 75vw, 288px)' }}
        className={classNames(
          "fixed inset-y-0 left-0 z-40 shrink-0 bg-gradient-to-b from-[#3A101A] via-[#4A1620] to-[#250A11] shadow-[2px_0_24px_rgba(28,10,16,0.25)] transition-transform duration-300 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-20 items-center gap-3.5 border-b border-white/10 px-6">
          <Link to={getHomeTarget()} className="flex items-center gap-3 cursor-pointer min-w-0">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-b from-[#E08813] to-[#D97706] text-white text-base font-black shadow-md font-heading shrink-0">DV</span>
            <div className="flex flex-col leading-tight min-w-0">
              <span className="text-base font-extrabold text-white tracking-wide font-heading truncate">DDGDVC</span>
              <span className="text-xs text-[#F4C266] mt-0.5 font-medium truncate">CS Academic Portal</span>
            </div>
          </Link>
        </div>

        <nav className="flex flex-col gap-1.5 p-4">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to.endsWith("dashboard")} onClick={onClose}
              className={({ isActive }) =>
                classNames(
                  "group flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 cursor-pointer truncate",
                  isActive
                    ? "bg-white/15 text-white shadow-sm border-l-[3px] border-[#F4C266] font-bold pl-3.5"
                    : "text-[#EDC8D0] hover:bg-white/10 hover:text-white"
                )
              }
            >
              {renderIcon(label, Icon)}
              <span className="truncate">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-[#250A11]/60 backdrop-blur-sm">
          <Link to={getHomeTarget()}
            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-[clamp(0.65rem,1.5vw,0.75rem)] font-semibold text-[#EDC8D0] hover:text-white hover:bg-white/10 transition-all cursor-pointer truncate"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <span className="truncate">{user?.type === "faculty" || user?.role === "faculty" ? "Back to Faculty Dashboard" : "Back to Home"}</span>
          </Link>
        </div>
      </motion.aside>
    </>
  );
}
