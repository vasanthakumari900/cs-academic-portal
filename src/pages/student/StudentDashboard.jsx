import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FiHome, FiPlayCircle, FiBriefcase, FiGrid,
  FiStar, FiFileText, FiChevronRight, FiBookOpen, FiAward,
} from "react-icons/fi";

const cards = [
  { label: "Home", icon: FiHome, to: "/", bg: "bg-[#0F4C81]", desc: "Inspirational quotes & info" },
  { label: "Video Lectures", icon: FiPlayCircle, to: "/e-content", bg: "bg-[#0F4C81]", desc: "Year & subject-wise lectures" },
  { label: "Lecture Notes", icon: FiFileText, to: "/notes", bg: "bg-[#0F4C81]", desc: "Unit-wise PDF notes by subject" },
  { label: "Semester Question Papers", icon: FiGrid, to: "/question-papers", bg: "bg-[#0F4C81]", desc: "Semester-wise past exam papers" },
  { label: "Placement Details", icon: FiBriefcase, to: "/placements", bg: "bg-[#0F4C81]", desc: "Drives & opportunities" },
  { label: "CIA Question Papers", icon: FiAward, to: "/student/cia-question-papers", bg: "bg-[#0F4C81]", desc: "CIA 1 & 2 question papers" },
];

export default function StudentDashboard() {
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
              <p className="text-xs font-semibold text-blue-200 uppercase tracking-[0.15em]">Welcome back</p>
              <h1 className="mt-1 font-sans text-2xl font-bold text-white sm:text-3xl">{user?.name || "Student"}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded bg-white/10 px-3 py-0.5 text-[11px] font-semibold text-blue-100 border border-white/15">{user?.rollNumber}</span>
                {user?.section && <span className="rounded bg-white/10 px-3 py-0.5 text-[11px] font-semibold text-blue-100 border border-white/15">Sec {user.section}</span>}
                {user?.year && <span className="rounded bg-white/10 px-3 py-0.5 text-[11px] font-semibold text-blue-100 border border-white/15">{user.year === 1 ? "First Year" : user.year === 2 ? "Second Year" : "Third Year"}</span>}
              </div>
            </div>
            <div className="hidden sm:flex h-16 w-16 items-center justify-center rounded-lg bg-white/10 text-2xl font-bold text-white border border-white/15 shadow-sm">
              {user?.name?.charAt(0) || "S"}
            </div>
          </div>
        </motion.div>

        {/* Navigation Cards */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="mb-5 text-center">
            <h2 className="font-sans text-xl font-bold text-[#0F4C81]">Quick Access</h2>
            <p className="mt-1 text-sm text-[#6B7280]">Navigate to any section of the academic portal</p>
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
          Dwaraka Doss Goverdhan Doss Vaishnav College · Department of Computer Science
        </motion.p>
      </motion.div>
    </div>
  );
}
