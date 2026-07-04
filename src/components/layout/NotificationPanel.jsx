// src/components/layout/NotificationPanel.jsx
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiBell, FiCheck } from "react-icons/fi";
import { useNotifications } from "../../hooks/useNotifications";
import { formatDate } from "../../utils/helpers";

const typeColors = {
  info: "bg-maroon/10 text-maroon dark:text-gold",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
};

export default function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const { notifications, unreadCount, readOne, readAll } = useNotifications();

  useEffect(() => {
    function handleClick(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-600 hover:bg-maroon/5 dark:text-slate-300 dark:hover:bg-white/10"
        aria-label="Notifications"
      >
        <FiBell size={18} />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            className="absolute right-0 top-11 z-50 w-80 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-elevated dark:border-slate-700/80 dark:bg-dark-card/95"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
              <h3 className="text-sm font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <button onClick={readAll} className="flex items-center gap-1 text-xs text-maroon dark:text-gold hover:underline">
                  <FiCheck size={12} /> Mark all read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-slate-400">No notifications yet</p>
              ) : (
                notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => !n.read && readOne(n.id)}
                    className={`w-full border-b border-slate-50 px-4 py-3 text-left transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-white/5 ${!n.read ? "bg-maroon/5" : ""}`}
                  >
                    <div className="flex items-start gap-2">
                      <span className={`mt-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${typeColors[n.type] || typeColors.info}`}>
                        {n.type}
                      </span>
                      {!n.read && <span className="mt-1 h-2 w-2 rounded-full bg-maroon dark:bg-gold" />}
                    </div>
                    <p className="mt-1 text-sm font-medium">{n.title}</p>
                    <p className="text-xs text-slate-500">{n.message}</p>
                    <p className="mt-1 text-[10px] text-slate-400">{formatDate(n.createdAt)}</p>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
