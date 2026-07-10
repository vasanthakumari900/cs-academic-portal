// src/components/layout/NotificationPanel.jsx
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiBell, FiCheck } from "react-icons/fi";
import { useNotifications } from "../../hooks/useNotifications";
import { formatDate } from "../../utils/helpers";

const typeColors = {
  info: "bg-indigo-500/20 text-indigo-300",
  success: "bg-emerald-500/20 text-emerald-300",
  warning: "bg-amber-500/20 text-amber-300",
  danger: "bg-red-500/20 text-red-300",
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
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-white/50 hover:bg-white/10 hover:text-white transition-all"
        aria-label="Notifications"
      >
        <FiBell size={18} />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
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
            className="absolute right-0 top-11 z-50 w-80 overflow-hidden rounded-2xl border border-white/10 bg-[#0F172A]/95 backdrop-blur-xl shadow-glass-xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <h3 className="text-sm font-semibold text-white">Notifications</h3>
              {unreadCount > 0 && (
                <button onClick={readAll} className="flex items-center gap-1 text-xs text-cyan-400 hover:underline">
                  <FiCheck size={12} /> Mark all read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-white/40">No notifications yet</p>
              ) : (
                notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => !n.read && readOne(n.id)}
                    className={`w-full border-b border-white/10 px-4 py-3 text-left transition-colors hover:bg-white/5 ${!n.read ? "bg-blue-500/5" : ""}`}
                  >
                    <div className="flex items-start gap-2">
                      <span className={`mt-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${typeColors[n.type] || typeColors.info}`}>
                        {n.type}
                      </span>
                      {!n.read && <span className="mt-1 h-2 w-2 rounded-full bg-cyan-400" />}
                    </div>
                    <p className="mt-1 text-sm font-medium text-white">{n.title}</p>
                    <p className="text-xs text-white/50">{n.message}</p>
                    <p className="mt-1 text-[10px] text-white/40">{formatDate(n.createdAt)}</p>
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
