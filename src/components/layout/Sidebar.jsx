// src/components/layout/Sidebar.jsx
import { NavLink, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { classNames } from "../../utils/helpers";

export default function Sidebar({ items, open, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <motion.aside
        initial={false}
        animate={{ x: 0 }}
        className={classNames(
          "fixed inset-y-0 left-0 z-40 w-64 shrink-0 border-r border-maroon/10 bg-white/95 transition-transform duration-300 dark:border-gold/10 dark:bg-dark-surface/95 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-5 dark:border-slate-800">
          <Link to="/" className="flex items-center gap-2 font-display text-base font-extrabold text-dark dark:text-white/90">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-maroon to-gold text-white text-sm font-extrabold">
              DV
            </span>
            <div className="flex flex-col leading-tight">
              <span className="text-xs font-bold">DDGDVC</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 -mt-0.5">Portal</span>
            </div>
          </Link>
        </div>

        <nav className="flex flex-col gap-1 p-3">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to.endsWith("dashboard")}
              onClick={onClose}
              className={({ isActive }) =>
                classNames(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-gradient-to-r from-maroon to-gold text-white shadow-glow"
                    : "text-slate-600 hover:bg-maroon/5 dark:text-slate-300 dark:hover:bg-white/10"
                )
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </motion.aside>
    </>
  );
}
