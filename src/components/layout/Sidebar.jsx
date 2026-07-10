import { NavLink, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { classNames } from "../../utils/helpers";

export default function Sidebar({ items, open, onClose }) {
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
          "fixed inset-y-0 left-0 z-40 w-64 shrink-0 border-r border-white/10 bg-[#0F172A]/95 backdrop-blur-xl shadow-lg transition-transform duration-300 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b border-white/10 px-5">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white text-xs font-extrabold shadow-md">DV</span>
            <div className="flex flex-col leading-tight">
              <span className="text-xs font-bold text-white">DDGDVC</span>
              <span className="text-[10px] text-white/50 -mt-0.5">Portal</span>
            </div>
          </Link>
        </div>

        <nav className="flex flex-col gap-1 p-3">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to.endsWith("dashboard")} onClick={onClose}
              className={({ isActive }) =>
                classNames(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                )
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <Link to="/"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-white/50 hover:text-cyan-300 hover:bg-white/10 transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Back to Home
          </Link>
        </div>
      </motion.aside>
    </>
  );
}
