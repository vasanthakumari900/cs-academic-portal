import { NavLink, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { classNames } from "../../utils/helpers";

export default function Sidebar({ items, open, onClose }) {
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
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden" onClick={onClose} />
      )}

      <motion.aside
        initial={false}
        animate={{ x: 0 }}
        className={classNames(
          "fixed inset-y-0 left-0 z-40 w-64 shrink-0 border-r border-white/10 bg-[#0F4C81] shadow-md transition-transform duration-300 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-20 items-center gap-3.5 border-b border-white/10 px-6">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#1E88E5] text-white text-base font-extrabold shadow-sm">DV</span>
            <div className="flex flex-col leading-tight">
              <span className="text-base font-bold text-white tracking-wide">DDGDVC</span>
              <span className="text-xs text-white/70 mt-0.5">Portal</span>
            </div>
          </Link>
        </div>

        <nav className="flex flex-col gap-2 p-4">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to.endsWith("dashboard")} onClick={onClose}
              className={({ isActive }) =>
                classNames(
                  "group flex items-center gap-4.5 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all duration-200",
                  isActive
                    ? "bg-[#1E88E5] text-white shadow-sm"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                )
              }
            >
              {renderIcon(label, Icon)}
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-[#0F4C81]">
          <Link to="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Back to Home
          </Link>
        </div>
      </motion.aside>
    </>
  );
}
