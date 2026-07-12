import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FiHome, FiPlayCircle, FiBriefcase, FiGrid,
  FiStar, FiFileText, FiChevronRight, FiBookOpen, FiAward,
} from "react-icons/fi";

const cards = [
  { label: "Home", icon: FiHome, to: "/", gradient: "from-emerald-500 to-teal-600", desc: "Inspirational quotes & info" },
  { label: "Video Lectures", icon: FiPlayCircle, to: "/e-content", gradient: "from-indigo-600 to-violet-700", desc: "Year & subject-wise lectures" },
  { label: "Lecture Notes", icon: FiFileText, to: "/notes", gradient: "from-cyan-500 to-teal-600", desc: "Unit-wise PDF notes by subject" },
  { label: "Semester Question Papers", icon: FiGrid, to: "/question-papers", gradient: "from-rose-500 to-pink-600", desc: "Semester-wise past exam papers" },
  { label: "Placement Details", icon: FiBriefcase, to: "/placements", gradient: "from-amber-500 to-orange-600", desc: "Drives & opportunities" },
  { label: "CIA Question Papers", icon: FiAward, to: "/student/cia-question-papers", gradient: "from-amber-500 to-orange-600", desc: "CIA 1 & 2 question papers" },
];

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="mx-auto min-h-[70vh] max-w-4xl px-4 py-10 sm:px-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* Welcome Banner */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="group relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-700 to-purple-800 p-6 sm:p-8 shadow-[0_8px_32px_rgba(79,70,229,0.2)]"
        >
          <div className="absolute inset-0 bg-grid-subtle opacity-[0.08]" />
          <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-white/5 blur-[40px]" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-blue-200 uppercase tracking-[0.15em]">Welcome back</p>
              <h1 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">{user?.name || "Student"}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white/15 backdrop-blur-sm px-3 py-0.5 text-[11px] font-semibold text-blue-100 border border-white/10">{user?.rollNumber}</span>
                {user?.section && <span className="rounded-full bg-white/15 backdrop-blur-sm px-3 py-0.5 text-[11px] font-semibold text-blue-100 border border-white/10">Sec {user.section}</span>}
                {user?.year && <span className="rounded-full bg-white/15 backdrop-blur-sm px-3 py-0.5 text-[11px] font-semibold text-blue-100 border border-white/10">{user.year === 1 ? "First Year" : user.year === 2 ? "Second Year" : "Third Year"}</span>}
              </div>
            </div>
            <div className="hidden sm:flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md text-2xl font-bold text-white border border-white/10 shadow-md">
              {user?.name?.charAt(0) || "S"}
            </div>
          </div>
        </motion.div>

        {/* Navigation Cards */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="mb-5 text-center">
            <h2 className="font-display text-xl font-bold text-white">Quick Access</h2>
            <p className="mt-1 text-sm text-white/50">Navigate to any section</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {cards.map((card, i) => (
              <motion.button key={card.label}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.98 }}
                onClick={() => navigate(card.to)}
                className="group relative overflow-hidden rounded-2xl glass-card-hover transition-all duration-300 hover:shadow-xl hover:bg-white/90"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-tr from-transparent via-white/30 to-transparent pointer-events-none" />
                <div className="relative flex items-center gap-4 p-5">
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${card.gradient} text-white shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:scale-105`}>
                    <card.icon size={24} />
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <h3 className="font-display text-base font-bold text-white">{card.label}</h3>
                    <p className="mt-0.5 text-xs text-white/50">{card.desc}</p>
                  </div>
                  <FiChevronRight size={16} className="text-white/30 group-hover:text-blue-500 transition-all opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0" />
                </div>
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${card.gradient} scale-x-0 group-hover:scale-x-100 transition-transform origin-left`} />
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="mt-10 text-center text-[11px] text-white/40"
        >
          DDGD Vaishnav College · Department of Computer Science
        </motion.p>
      </motion.div>
    </div>
  );
}
