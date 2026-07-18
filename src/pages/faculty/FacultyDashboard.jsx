import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FiHome, FiPlayCircle, FiGrid,
  FiFileText, FiChevronRight, FiUser, FiAward,
} from "react-icons/fi";

const cards = [
  { label: "Upload Notes", icon: FiFileText, to: "/faculty/notes", bg: "bg-[#0F4C81]", desc: "Upload lecture notes by subject" },
  { label: "Video Lectures", icon: FiPlayCircle, to: "/faculty/videos", bg: "bg-[#0F4C81]", desc: "Upload video lectures by subject" },
  { label: "Upload Semester Question Papers", icon: FiGrid, to: "/faculty/question-papers", bg: "bg-[#0F4C81]", desc: "Upload semester question papers" },
  { label: "Upload CIA Papers", icon: FiAward, to: "/faculty/cia-papers", bg: "bg-[#0F4C81]", desc: "Upload CIA question papers for all years" },
];

export default function FacultyDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="mx-auto min-h-[70vh] max-w-4xl px-4 py-10 sm:px-6 bg-[#F8FAFC]">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* Welcome Banner */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="group relative mb-8 overflow-hidden rounded-xl bg-[#0F4C81] p-6 sm:p-8 shadow-sm border border-[#0F4C81]/10 text-left"
        >
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-blue-200 uppercase tracking-[0.15em]">Faculty Portal</p>
              <h1 className="mt-1 font-sans text-2xl font-bold text-white sm:text-3xl">Welcome, {user?.name || "Faculty"}</h1>
              <p className="mt-2 text-sm text-blue-100/80">Upload and manage academic content for your subjects</p>
            </div>
            <div className="hidden sm:flex h-16 w-16 items-center justify-center rounded-lg bg-white/10 text-2xl font-bold text-white border border-white/15 shadow-sm">
              <FiUser size={28} />
            </div>
          </div>
        </motion.div>

        {/* Navigation Cards */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="mb-5 text-center">
            <h2 className="font-sans text-xl font-bold text-[#0F4C81]">Quick Actions</h2>
            <p className="mt-1 text-sm text-[#6B7280]">Upload and manage academic content</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {cards.map((card, i) => (
              <motion.button key={card.label}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}
                onClick={() => navigate(card.to)}
                className="group relative overflow-hidden rounded-xl bg-white border border-[#E5E7EB] shadow-sm transition-all duration-300 hover:shadow-sm hover:border-[#1E88E5]/40"
              >
                <div className="relative flex items-center gap-4 p-5">
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-lg ${card.bg} text-white shadow-sm transition-all`}>
                    <card.icon size={24} />
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <h3 className="font-sans text-base font-bold text-[#0F4C81]">{card.label}</h3>
                    <p className="mt-0.5 text-xs text-[#6B7280]">{card.desc}</p>
                  </div>
                  <FiChevronRight size={16} className="text-slate-400 group-hover:text-[#1E88E5] transition-all" />
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="mt-10 text-center text-[11px] text-[#6B7280]"
        >
          Dwaraka Doss Goverdhan Doss Vaishnav College · Department of Computer Science · Faculty Portal
        </motion.p>
      </motion.div>
    </div>
  );
}
