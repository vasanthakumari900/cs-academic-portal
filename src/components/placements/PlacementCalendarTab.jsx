// src/components/placements/PlacementCalendarTab.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiFilter,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { PLACEMENT_CALENDAR_EVENTS } from "../../utils/placementMockData";

export default function PlacementCalendarTab() {
  const [selectedType, setSelectedType] = useState("All");

  const eventTypes = [
    "All",
    "Company Visit",
    "Placement Training",
    "Workshop",
    "Seminars",
    "Mock Interview",
    "Registration Deadline",
  ];

  const filteredEvents = PLACEMENT_CALENDAR_EVENTS.filter(
    (ev) => selectedType === "All" || ev.type === selectedType
  );

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FiCalendar className="text-[#0F4C81] dark:text-sky-400" /> Placement Schedule & Activity Calendar
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track company visit dates, training bootcamps, workshops, seminars, mock interviews, and deadlines.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5">
          {eventTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                selectedType === type
                  ? "bg-[#0F4C81] text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Agenda Events List */}
      <div className="space-y-4">
        {filteredEvents.map((ev) => (
          <motion.div
            key={ev.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-[#0F4C81]/40 transition-all"
          >
            <div className="flex items-start gap-4">
              {/* Date Box */}
              <div className="flex flex-col items-center justify-center rounded-xl bg-gradient-to-br from-[#021C4F] to-[#0F4C81] p-3 text-white w-16 shrink-0 shadow-md">
                <span className="text-xs uppercase font-bold text-white/80">
                  {new Date(ev.date).toLocaleString("default", { month: "short" })}
                </span>
                <span className="text-xl font-extrabold text-white">
                  {new Date(ev.date).getDate()}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-extrabold text-white ${
                      ev.type === "Company Visit"
                        ? "bg-[#C50337]"
                        : ev.type === "Registration Deadline"
                        ? "bg-amber-600"
                        : "bg-[#0F4C81]"
                    }`}
                  >
                    {ev.type}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Date: {ev.date}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{ev.title}</h3>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <FiClock size={13} className="text-slate-400" /> {ev.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiMapPin size={13} className="text-slate-400" /> {ev.venue}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => alert(`Added "${ev.title}" on ${ev.date} to personal calendar.`)}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all shrink-0"
            >
              + Add to Reminder
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
