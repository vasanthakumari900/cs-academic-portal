// src/pages/student/StudentDashboard.jsx
// Premium student dashboard — glass cards, animated welcome, quick navigation
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FiHome, FiPlayCircle, FiBriefcase, FiGrid,
  FiStar, FiFileText, FiChevronRight,
} from "react-icons/fi";

const cards = [
  {
    label: "Home",
    icon: FiHome,
    to: "/",
    gradient: "from-emerald-500 to-teal-600",
    desc: "Inspirational quotes & info",
  },
  {
    label: "Video Lectures",
    icon: FiPlayCircle,
    to: "/e-content",
    gradient: "from-blue-600 to-indigo-700",
    desc: "Year & subject-wise lectures",
  },
  {
    label: "Lecture Notes",
    icon: FiFileText,
    to: "/notes",
    gradient: "from-cyan-500 to-teal-600",
    desc: "Unit-wise PDF notes by subject",
  },
  {
    label: "Question Papers",
    icon: FiGrid,
    to: "/question-papers",
    gradient: "from-rose-500 to-pink-600",
    desc: "Practice with past papers",
  },
  {
    label: "Placement Details",
    icon: FiBriefcase,
    to: "/placements",
    gradient: "from-amber-500 to-orange-600",
    desc: "Drives & opportunities",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="mx-auto min-h-[70vh] max-w-4xl px-4 py-10 sm:px-6">
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        {/* Welcome Banner - Premium Glass */}
        <motion.div variants={itemVariants} className="group relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 p-6 sm:p-8 shadow-premium-lg">
          {/* Subtle pattern */}
          <div className="absolute inset-0 bg-grid-subtle opacity-[0.08]" />
          <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-white/5 blur-[40px]" />
          
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-blue-200 uppercase tracking-[0.15em]">Welcome back</p>
              <h1 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
                {user?.name || "Student"}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white/15 backdrop-blur-sm px-3 py-0.5 text-[11px] font-semibold text-blue-100 border border-white/10">
                  {user?.rollNumber}
                </span>
                {user?.section && (
                  <span className="rounded-full bg-white/15 backdrop-blur-sm px-3 py-0.5 text-[11px] font-semibold text-blue-100 border border-white/10">
                    Sec {user.section}
                  </span>
                )}
                {user?.year && (
                  <span className="rounded-full bg-white/15 backdrop-blur-sm px-3 py-0.5 text-[11px] font-semibold text-blue-100 border border-white/10">
                    {user.year === 1 ? "First Year" : user.year === 2 ? "Second Year" : "Third Year"}
                  </span>
                )}
              </div>
            </div>
            <div className="hidden sm:flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md text-2xl font-bold text-white border border-white/10 shadow-soft">
              {user?.name?.charAt(0) || "S"}
            </div>
          </div>
        </motion.div>

        {/* Hero Image - Glass Framed */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="group relative overflow-hidden rounded-2xl glass-card-strong p-1">
            <div className="relative overflow-hidden rounded-xl">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1000&q=80"
                alt="Students collaborating"
                className="h-48 w-full object-cover sm:h-56 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-indigo-600/10" />
            </div>
          </div>
        </motion.div>

        {/* Navigation Cards */}
        <motion.div variants={itemVariants}>
          <div className="mb-5 text-center">
            <h2 className="font-display text-xl font-bold text-gray-900">Quick Access</h2>
            <p className="mt-1 text-sm text-gray-500">Navigate to any section</p>
          </div>

          <motion.div variants={containerVariants} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {cards.map((card, i) => (
              <motion.button
                key={card.label}
                variants={itemVariants}
                whileHover={{ y: -4, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(card.to)}
                className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-glass border border-white/30 shadow-glass transition-all duration-300 hover:shadow-glass-lg hover:bg-white/90"
              >
                {/* Glass shine */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-tr from-transparent via-white/30 to-transparent pointer-events-none" />
                
                <div className="relative flex items-center gap-4 p-5">
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${card.gradient} text-white shadow-soft transition-all duration-300 group-hover:shadow-md group-hover:scale-105`}>
                    <card.icon size={24} />
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <h3 className="font-display text-base font-bold text-gray-900">
                      {card.label}
                    </h3>
                    <p className="mt-0.5 text-xs text-gray-500">{card.desc}</p>
                  </div>
                  <FiChevronRight size={16} className="text-gray-300 group-hover:text-blue-500 transition-all opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0" />
                </div>
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${card.gradient} scale-x-0 group-hover:scale-x-100 transition-transform origin-left`} />
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.p
          variants={itemVariants}
          className="mt-10 text-center text-[11px] text-gray-400"
        >
          DDGD Vaishnav College · Department of Computer Science
        </motion.p>
      </motion.div>
    </div>
  );
}
