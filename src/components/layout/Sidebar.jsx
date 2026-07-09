// src/components/layout/Sidebar.jsx
// Premium glass sidebar.
import { NavLink, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { classNames } from "../../utils/helpers";

export default function Sidebar({ items, open, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <motion.aside
        initial={false}
        animate={{ x: 0 }}
        className={classNames(
          "fixed inset-y-0 left-0 z-40 w-64 shrink-0 border-r border-white/10 bg-white/80 backdrop-blur-glass-lg shadow-glass-lg transition-transform duration-300 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b border-gray-100 px-5">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-sm font-extrabold shadow-soft">
              DV
            </span>
            <div className="flex flex-col leading-tight">
              <span className="text-xs font-bold text-gray-900">DDGDVC</span>
              <span className="text-[10px] text-gray-500 -mt-0.5">Portal</span>
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
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-soft"
                    : "text-gray-600 hover:bg-blue-50/50 hover:text-blue-700"
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
