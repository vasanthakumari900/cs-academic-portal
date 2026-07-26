// src/components/placements/NotificationsTab.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { FiBell, FiCheckCircle, FiClock, FiAlertCircle, FiCheck } from "react-icons/fi";
import { PLACEMENT_NOTIFICATIONS } from "../../utils/placementMockData";

export default function NotificationsTab() {
  const [notifs, setNotifs] = useState(PLACEMENT_NOTIFICATIONS);
  const [filterCategory, setFilterCategory] = useState("All");

  function handleMarkAllRead() {
    setNotifs(notifs.map((n) => ({ ...n, unread: false })));
  }

  function handleToggleRead(id) {
    setNotifs(
      notifs.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    );
  }

  const filteredNotifs = notifs.filter(
    (n) => filterCategory === "All" || n.category === filterCategory
  );

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FiBell className="text-[#C50337]" /> Placement Notifications & Announcement Center
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time notifications for new company drives, registration deadlines, interview slots, and training sessions.
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all shrink-0"
        >
          Mark All as Read
        </button>
      </div>

      {/* Categories Filter */}
      <div className="flex flex-wrap gap-2">
        {["All", "New Companies", "Registration Deadlines", "Interview Schedule", "Results"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
              filterCategory === cat
                ? "bg-[#0F4C81] text-white shadow-sm"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Feed List */}
      <div className="space-y-3">
        {filteredNotifs.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => handleToggleRead(n.id)}
            className={`cursor-pointer rounded-2xl border p-5 transition-all space-y-2 flex items-start justify-between gap-4 ${
              n.unread
                ? "border-[#0F4C81]/40 bg-white dark:bg-slate-900 shadow-sm"
                : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 opacity-75"
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {n.unread && <span className="h-2 w-2 rounded-full bg-[#C50337]" />}
                <span className="rounded-md bg-[#0F4C81]/10 text-[#0F4C81] dark:bg-sky-950 dark:text-sky-300 px-2 py-0.5 text-[10px] font-bold">
                  {n.category}
                </span>
                {n.urgent && (
                  <span className="rounded-md bg-rose-500/10 text-rose-600 px-2 py-0.5 text-[10px] font-bold">
                    Urgent
                  </span>
                )}
                <span className="text-[10px] text-slate-400">{n.date}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{n.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{n.details}</p>
            </div>

            <button className="text-slate-400 hover:text-slate-600 shrink-0">
              {n.unread ? <FiCheckCircle size={18} className="text-[#0F4C81]" /> : <FiCheck size={18} />}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
