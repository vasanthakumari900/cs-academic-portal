import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FiHome, FiPlayCircle, FiBriefcase, FiGrid,
  FiFileText, FiChevronRight, FiBookOpen, FiUploadCloud, FiUser,
} from "react-icons/fi";

const cards = [
  { label: "Upload Notes", icon: FiFileText, to: "/faculty/notes", gradient: "from-cyan-500 to-teal-600", desc: "Upload lecture notes by subject" },
  { label: "Upload Videos", icon: FiPlayCircle, to: "/faculty/videos", gradient: "from-indigo-600 to-violet-700", desc: "Upload video lectures by subject" },
  { label: "Upload Question Papers", icon: FiGrid, to: "/faculty/question-papers", gradient: "from-rose-500 to-pink-600", desc: "Upload question papers by subject" },
];

export default function FacultyDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="mx-auto min-h-[70vh] max-w-4xl px-4 py-10 sm:px-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* Welcome Banner */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="group relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 p-6 sm:p-8 shadow-[0_8px_32px_rgba(16,185,129,0.2)]"
        >
          <div className="absolute inset-0 bg-grid-subtle opacity-[0.08]" />
          <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-white/5 blur-[40px]" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-emerald-200 uppercase tracking-[0.15em]">Faculty Portal</p>
              <h1 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">Welcome, {user?.name || "Faculty"}</h1>
              <p className="mt-2 text-sm text-emerald-100/70">Upload and manage academic content for your subjects</p>
            </div>
            <div className="hidden sm:flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md text-2xl font-bold text-white border border-white/10 shadow-md">
              <FiUser size={28} />
            </div>
          </div>
        </motion.div>

        {/* Navigation Cards */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="mb-5 text-center">
            <h2 className="font-display text-xl font-bold text-white">Quick Actions</h2>
            <p className="mt-1 text-sm text-white/50">Upload and manage academic content</p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {cards.map((card, i) => (
              <motion.button key={card.label}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                whileHover={{ y: -4, scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => navigate(card.to)}
                className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-md transition-all duration-300 hover:shadow-xl hover:bg-white/10 text-left h-full flex flex-col w-full"
              >
                <div className="relative flex flex-col items-center p-6 text-center h-full justify-between w-full flex-1">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${card.gradient} text-white shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:scale-105`}>
                    <card.icon size={24} />
                  </div>
                  <div className="mt-4 flex-1">
                    <h3 className="font-display text-base font-bold text-white group-hover:text-emerald-400 transition-colors">{card.label}</h3>
                    <p className="mt-1.5 text-xs text-white/50 leading-relaxed">{card.desc}</p>
                  </div>
                  <div className="mt-5 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 transition-all opacity-80 group-hover:opacity-100">
                    Manage Section <FiChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${card.gradient} scale-x-0 group-hover:scale-x-100 transition-transform origin-left`} />
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="mt-10 text-center text-[11px] text-white/40"
        >
          DDGD Vaishnav College · Department of Computer Science · Faculty Portal
        </motion.p>
      </motion.div>
    </div>
  );
}
