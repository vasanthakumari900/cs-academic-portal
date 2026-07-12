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
          "fixed inset-y-0 left-0 z-40 w-64 shrink-0 border-r border-white/5 bg-[#0B0F19] shadow-lg transition-transform duration-300 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-20 items-center gap-3.5 border-b border-white/5 px-6">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white text-base font-extrabold shadow-md">DV</span>
            <div className="flex flex-col leading-tight">
              <span className="text-base font-bold text-white tracking-wide">DDGDVC</span>
              <span className="text-xs text-white/50 mt-0.5">Portal</span>
            </div>
          </Link>
        </div>

        <nav className="flex flex-col gap-2 p-4">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to.endsWith("dashboard")} onClick={onClose}
              className={({ isActive }) =>
                classNames(
                  "group flex items-center gap-4.5 rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all duration-200",
                  isActive
                    ? "bg-[#4F46E5] text-white shadow-[0_4px_20px_rgba(79,70,229,0.25)]"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )
              }
            >
              {renderIcon(label, Icon)}
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5 bg-[#0B0F19]">
          <Link to="/"
            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold text-white/50 hover:text-indigo-400 hover:bg-white/5 transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Back to Home
          </Link>
        </div>
      </motion.aside>
    </>
  );
}
