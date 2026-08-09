// src/pages/Home.jsx
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiPlayCircle, FiFileText, FiBriefcase, FiGrid, FiAward,
  FiArrowRight, FiChevronRight, FiUsers, FiLayers, FiStar,
  FiZap, FiBookOpen, FiCompass, FiShield, FiTrendingUp
} from "react-icons/fi";
import AnimatedCounter from "../components/ui/AnimatedCounter";

const quickCards = [
  {
    label: "Video Lectures",
    icon: FiPlayCircle,
    to: "/e-content",
    badge: "E-Content",
    color: "from-blue-600 to-indigo-700",
    glow: "shadow-blue-500/20",
    desc: "Watch subject-wise video lectures & tutorial playlists."
  },
  {
    label: "Lecture Notes",
    icon: FiFileText,
    to: "/notes",
    badge: "PDF Notes",
    color: "from-[#C50337] to-rose-700",
    glow: "shadow-rose-500/20",
    desc: "Comprehensive unit-wise lecture notes & study materials."
  },
  {
    label: "Question Papers",
    icon: FiGrid,
    to: "/question-papers",
    badge: "Semester Exams",
    color: "from-emerald-600 to-teal-700",
    glow: "shadow-emerald-500/20",
    desc: "University semester question papers with subject filters."
  },
  {
    label: "Placement Drives",
    icon: FiBriefcase,
    to: "/placements",
    badge: "Career Hub",
    color: "from-[#021C4F] to-cyan-800",
    glow: "shadow-cyan-500/20",
    desc: "Top recruiter drives, mock aptitude & alumni stories."
  },
];

const stats = [
  { label: "Video Lectures", value: 50, suffix: "+", icon: FiPlayCircle, color: "text-cyan-300" },
  { label: "Lecture Notes", value: 30, suffix: "+", icon: FiFileText, color: "text-[#C50337]" },
  { label: "Question Papers", value: 100, suffix: "+", icon: FiGrid, color: "text-amber-300" },
  { label: "Placement Drives", value: 15, suffix: "+", icon: FiBriefcase, color: "text-emerald-400" },
  { label: "Students Enrolled", value: 200, suffix: "+", icon: FiUsers, color: "text-purple-300" },
  { label: "CS Subjects", value: 20, suffix: "+", icon: FiLayers, color: "text-rose-300" },
];

const features = [
  {
    icon: FiPlayCircle,
    title: "Curated Video Lectures",
    desc: "Faculty-curated video playlists covering the entire CS syllabus with practical code walkthroughs.",
    color: "from-[#021C4F] to-indigo-900",
    accent: "text-cyan-400"
  },
  {
    icon: FiFileText,
    title: "Unit-wise PDF Notes",
    desc: "Instant download unit notes prepared by expert faculty for quick revision and deep subject learning.",
    color: "from-[#C50337] to-rose-900",
    accent: "text-amber-300"
  },
  {
    icon: FiGrid,
    title: "Past University Papers",
    desc: "Extensive bank of semester examination question papers with multiple sets per subject.",
    color: "from-[#021C4F] to-slate-900",
    accent: "text-emerald-400"
  },
  {
    icon: FiBriefcase,
    title: "Placement & Career Hub",
    desc: "Live placement alerts, top IT recruiter insights, eligibility criteria, and alumni interview experiences.",
    color: "from-[#C50337] to-rose-900",
    accent: "text-yellow-300"
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const getDashboardPath = () => {
    if (!user) return "/login";
    if (user.type === "faculty" || user.role === "faculty") return "/faculty/dashboard";
    if (user.type === "admin" || user.role === "admin") return "/admin/dashboard";
    return "/student/dashboard";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      
      {/* ── HERO SECTION ── */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#011337] via-[#021C4F] to-slate-950 text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-amber-400/20">
        
        {/* Animated Background Glowing Orbs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#C50337]/30 blur-[100px] pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/2 -right-32 w-[500px] h-[500px] rounded-full bg-[#021C4F] blur-[120px] pointer-events-none"
        />
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="relative mx-auto max-w-6xl text-center z-10 space-y-8">
          
          {/* Animated Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-5 py-2 text-xs font-extrabold text-amber-300 border border-white/20 shadow-lg tracking-wider uppercase">
              <FiShield size={14} className="text-[#C50337]" />
              <span className="hidden sm:inline">
                Dwaraka Doss Goverdhan Doss Vaishnav College (Autonomous)
              </span>
              <span className="sm:hidden">DDGDVC (Autonomous)</span>
            </span>
          </motion.div>

          {/* Main Hero Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4 max-w-4xl mx-auto"
          >
            <h1 style={{ fontSize: 'clamp(1.65rem, 4.5vw + 0.5rem, 3.75rem)' }} className="font-black tracking-tight leading-[1.15] font-serif text-white">
              {user ? (
                <>
                  Welcome back, <span className="bg-gradient-to-r from-rose-400 via-[#C50337] to-amber-300 bg-clip-text text-transparent">{user.name}</span>!
                </>
              ) : (
                <>
                  Department of Computer Science <br />
                  <span className="bg-gradient-to-r from-rose-400 via-[#C50337] to-amber-300 bg-clip-text text-transparent">
                    Academic Learning Portal
                  </span>
                </>
              )}
            </h1>

            <p style={{ fontSize: 'clamp(0.875rem, 1.5vw + 0.5rem, 1.125rem)' }} className="text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
              {user ? (
                "Access unit-wise lecture notes, video playlists, past university question papers, CIA assessments, and placement drives."
              ) : (
                "Your official academic hub for e-content, lecture notes, question papers, CIA assessments, and top corporate placement drives."
              )}
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-[clamp(0.75rem,2vw,1rem)] pt-2 w-full sm:w-auto px-[clamp(0.5rem,2vw,0rem)]"
          >
            {user ? (
              <button
                onClick={() => navigate(getDashboardPath())}
                className="group relative inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#C50337] to-rose-700 px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-black text-white shadow-xl shadow-rose-950/40 transition-all hover:scale-105 hover:shadow-2xl active:scale-95 w-full sm:w-auto"
              >
                <span>Go to Student Dashboard</span>
                <FiArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="group relative inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#C50337] to-rose-700 px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-black text-white shadow-xl shadow-rose-950/40 transition-all hover:scale-105 hover:shadow-2xl active:scale-95 w-full sm:w-auto"
              >
                <span>Access Student Portal</span>
                <FiArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </button>
            )}

            <button
              onClick={() => navigate("/about")}
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 backdrop-blur-md px-6 sm:px-7 py-3.5 sm:py-4 text-xs sm:text-sm font-bold text-white border border-white/20 hover:bg-white/20 transition-all hover:scale-105 active:scale-95 shadow-md w-full sm:w-auto"
            >
              <FiCompass size={16} className="text-amber-300" />
              <span>Explore About DGVC</span>
            </button>
          </motion.div>

          {/* Animated Stats Bar */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="pt-12 stat-grid max-w-5xl mx-auto"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-lg hover:border-amber-400/40 transition-all"
              >
                <stat.icon size={22} className={`mx-auto mb-1.5 ${stat.color}`} />
                <p className="text-2xl sm:text-3xl font-black text-white font-mono">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-[11px] font-bold text-slate-300 mt-1 uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* ── QUICK ACCESS PORTAL CARDS ── */}
      <section className="relative -mt-10 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card-grid">
          {quickCards.map((card, i) => (
            <motion.button
              key={card.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(card.to)}
              className={`group relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 p-6 border border-slate-800 shadow-xl text-left transition-all duration-300 hover:border-amber-400/50 ${card.glow}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${card.color} text-white shadow-md transition-transform duration-300 group-hover:scale-110`}>
                  <card.icon size={26} />
                </div>
                <span className="rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider bg-white/10 text-amber-300 border border-white/15">
                  {card.badge}
                </span>
              </div>

              <h3 className="text-lg font-extrabold text-white group-hover:text-amber-300 transition-colors">
                {card.label}
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                {card.desc}
              </p>

              <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-cyan-400 group-hover:text-rose-400 transition-colors pt-3 border-t border-slate-800">
                <span>Access Section</span>
                <FiChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* ── FEATURES & ACADEMIC HIGHLIGHTS ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-2 max-w-2xl mx-auto"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 px-4 py-1 text-xs font-extrabold uppercase tracking-widest">
            <FiZap size={14} className="text-[#C50337]" /> Core Academic Suite
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            Everything You Need To Excel
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            A comprehensive digital ecosystem built for Computer Science students &amp; faculty
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-slate-900/80 rounded-3xl p-6 border border-slate-800 shadow-md hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${feature.color} text-white flex items-center justify-center shadow-md mb-4`}>
                  <feature.icon size={22} />
                </div>
                <h3 className="text-base font-extrabold text-white mb-2">{feature.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-1 text-[11px] font-bold text-slate-400">
                <FiTrendingUp className={feature.accent} size={14} />
                <span>Semester Ready</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── INSPIRATIONAL CTA BANNER ── */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#011337] via-[#021C4F] to-[#7F011F] p-8 sm:p-14 text-white text-center shadow-2xl border border-amber-400/30"
        >
          <div className="relative z-10 space-y-5 max-w-2xl mx-auto">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 border border-white/20 text-amber-300 shadow-lg">
              <FiAward size={32} />
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white font-serif">
              Empowering Your Future in Tech
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              Every note you read, every video you watch, and every past paper you solve brings you closer to technical mastery and career success.
            </p>

            <div className="pt-4">
              <button
                onClick={() => navigate(getDashboardPath())}
                className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#C50337] to-rose-700 px-8 py-4 text-sm font-black text-white shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                <span>{user ? "Go to Dashboard" : "Get Started Now"}</span>
                <FiArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
