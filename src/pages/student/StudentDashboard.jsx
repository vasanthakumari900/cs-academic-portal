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
                  {user.year === 1 ? "First Year" : user.year === 2 ? "Second Year" : "Third Year"}
                </span>
              )}
            </div>
          </div>
          <div className="hidden sm:flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-2xl font-bold backdrop-blur-sm">
            {user?.name?.charAt(0) || "S"}
          </div>
        </div>
      </motion.div>

      {/* Academic portal image */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 overflow-hidden rounded-xl"
      >
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1000&q=80"
            alt="Students collaborating on academic work"
            className="h-48 w-full object-cover rounded-xl sm:h-56"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-transparent to-indigo-600/20 rounded-xl" />
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
