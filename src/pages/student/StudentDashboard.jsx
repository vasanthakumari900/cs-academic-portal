// src/pages/student/StudentDashboard.jsx
// Student dashboard — clean centered cards, no sidebar
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FiHome, FiPlayCircle, FiBriefcase, FiGrid,
  FiStar, FiFileText,
} from "react-icons/fi";

const cards = [
  {
    label: "Home",
    icon: FiHome,
    to: "/",
    gradient: "from-emerald-500 to-teal-600",
    lightBg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    desc: "Inspirational quotes & info",
  },
  {
    label: "Video Lectures",
    icon: FiPlayCircle,
    to: "/e-content",
    gradient: "from-blue-500 to-indigo-600",
    lightBg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    desc: "Year & subject-wise lectures",
  },
  {
    label: "Lecture Notes",
    icon: FiFileText,
    to: "/notes",
    gradient: "from-cyan-500 to-teal-600",
    lightBg: "bg-cyan-50",
    text: "text-cyan-700",
    border: "border-cyan-200",
    desc: "Unit-wise PDF notes by subject",
  },
  {
    label: "Previous Year\nQuestion Papers",
    icon: FiGrid,
    to: "/question-papers",
    gradient: "from-rose-500 to-pink-600",
    lightBg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    desc: "Practice with past papers",
  },
  {
    label: "Placement Details",
    icon: FiBriefcase,
    to: "/placements",
    gradient: "from-amber-500 to-orange-600",
    lightBg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    desc: "Drives & opportunities",
  },
];

const quoteOfDay = {
  text: "The beautiful thing about learning is that nobody can take it away from you.",
  author: "B.B. King",
};

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="mx-auto min-h-[70vh] max-w-4xl px-4 py-12 sm:px-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 p-6 text-white shadow-premium sm:p-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-blue-200 uppercase tracking-wider">Welcome</p>
            <h1 className="mt-1 font-display text-xl font-bold sm:text-2xl">
              {user?.name || "Student"}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-blue-100">
              <span className="rounded-full bg-white/15 px-3 py-0.5 font-semibold">
                {user?.rollNumber}
              </span>
              {user?.section && (
                <span className="rounded-full bg-white/15 px-3 py-0.5 font-semibold">
                  Sec {user.section}
                </span>
              )}
              {user?.year && (
                <span className="rounded-full bg-white/15 px-3 py-0.5 font-semibold">
                  Year {user.year}
                </span>
              )}
            </div>
          </div>
          <div className="hidden sm:flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-2xl font-bold backdrop-blur-sm">
            {user?.name?.charAt(0) || "S"}
          </div>
        </div>
      </motion.div>

      {/* Quote */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 flex items-start gap-3 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0 text-indigo-400"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
        <div>
          <p className="text-sm italic text-gray-600">&ldquo;{quoteOfDay.text}&rdquo;</p>
          <p className="mt-0.5 text-xs font-semibold text-indigo-500">— {quoteOfDay.author}</p>
        </div>
      </motion.div>

      {/* Navigation Cards */}
      <h2 className="mb-4 text-center font-display text-lg font-bold text-gray-800">
        Quick Access
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {cards.map((card, i) => (
          <motion.button
            key={card.label}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.08 }}
            whileHover={{ scale: 1.02, y: -3 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(card.to)}
            className={`group relative overflow-hidden rounded-xl border ${card.border} bg-white p-5 text-left shadow-soft hover:shadow-premium transition-all`}
          >
            <div className={`absolute inset-0 ${card.lightBg} opacity-30 group-hover:opacity-60 transition-opacity`} />
            <div className="relative flex items-center gap-4">
              <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${card.gradient} text-white shadow-md`}>
                <card.icon size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className={`text-base font-bold ${card.text} whitespace-pre-line leading-snug`}>
                  {card.label}
                </h3>
                <p className="mt-0.5 text-xs text-gray-400">{card.desc}</p>
              </div>
            </div>
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient} scale-x-0 group-hover:scale-x-100 transition-transform origin-left`} />
          </motion.button>
        ))}
      </div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-10 text-center text-[11px] text-gray-400"
      >
        DDGD Vaishnav College · Department of Computer Science
      </motion.p>
    </div>
  );
}
