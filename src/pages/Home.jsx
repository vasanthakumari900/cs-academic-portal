// src/pages/Home.jsx
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiPlayCircle, FiFileText, FiBriefcase, FiGrid, FiAward,
  FiArrowRight, FiChevronRight, FiUsers, FiLayers, FiStar,
  FiZap, FiBookOpen, FiCompass, FiShield, FiTrendingUp, FiCalendar
} from "react-icons/fi";
import AnimatedCounter from "../components/ui/AnimatedCounter";
import BentoCard3D from "../components/ui/BentoCard3D";
import InteractiveKnowledgeGraph from "../components/ui/InteractiveKnowledgeGraph";

const quickCards = [
  {
    label: "College Calendar",
    icon: FiCalendar,
    to: "/college-calendar",
    badge: "2026 - 2027",
    color: "from-[#E08813] to-[#D97706]",
    glow: "hover:shadow-[0_20px_60px_rgba(217,119,6,0.15)]",
    desc: "Full 12-month academic calendar, working days & exam schedule."
  },
  {
    label: "Video Lectures",
    icon: FiPlayCircle,
    to: "/e-content",
    badge: "E-Content",
    color: "from-[#7E2238] to-[#4A1620]",
    glow: "hover:shadow-[0_20px_60px_rgba(74,22,32,0.3)]",
    desc: "Watch subject-wise video lectures & tutorial playlists."
  },
  {
    label: "Lecture Notes",
    icon: FiFileText,
    to: "/notes",
    badge: "PDF Notes",
    color: "from-[#C50337] to-[#7F011F]",
    glow: "hover:shadow-[0_20px_60px_rgba(197,3,55,0.15)]",
    desc: "Comprehensive unit-wise lecture notes & study materials."
  },
  {
    label: "Question Papers",
    icon: FiGrid,
    to: "/question-papers",
    badge: "Semester Exams",
    color: "from-[#61182A] to-[#3A101A]",
    glow: "hover:shadow-[0_20px_60px_rgba(74,22,32,0.25)]",
    desc: "University semester question papers with subject filters."
  },
  {
    label: "Placement Drives",
    icon: FiBriefcase,
    to: "/placements",
    badge: "Career Hub",
    color: "from-[#E08813] to-[#B45309]",
    glow: "hover:shadow-[0_20px_60px_rgba(217,119,6,0.18)]",
    desc: "Top recruiter drives, mock aptitude & alumni stories."
  },
];

const stats = [
  { label: "Video Lectures", value: 50, suffix: "+", icon: FiPlayCircle, color: "text-[#F4C266]" },
  { label: "Lecture Notes", value: 30, suffix: "+", icon: FiFileText, color: "text-[#F3E4E8]" },
  { label: "Question Papers", value: 100, suffix: "+", icon: FiGrid, color: "text-[#F4C266]" },
  { label: "Placement Drives", value: 15, suffix: "+", icon: FiBriefcase, color: "text-[#F3E4E8]" },
  { label: "Students Enrolled", value: 200, suffix: "+", icon: FiUsers, color: "text-[#F4C266]" },
  { label: "CS Subjects", value: 20, suffix: "+", icon: FiLayers, color: "text-[#F3E4E8]" },
];

const features = [
  {
    icon: FiPlayCircle,
    title: "Curated Video Lectures",
    desc: "Faculty-curated video playlists covering the entire CS syllabus with practical code walkthroughs.",
    color: "from-[#7E2238] to-[#4A1620]",
    accent: "text-[#F4C266]"
  },
  {
    icon: FiFileText,
    title: "Unit-wise PDF Notes",
    desc: "Instant download unit notes prepared by expert faculty for quick revision and deep subject learning.",
    color: "from-[#C50337] to-[#7F011F]",
    accent: "text-[#F4C266]"
  },
  {
    icon: FiGrid,
    title: "Past University Papers",
    desc: "Extensive bank of semester examination question papers with multiple sets per subject.",
    color: "from-[#61182A] to-[#250A11]",
    accent: "text-[#F3E4E8]"
  },
  {
    icon: FiBriefcase,
    title: "Placement & Career Hub",
    desc: "Live placement alerts, top IT recruiter insights, eligibility criteria, and alumni interview experiences.",
    color: "from-[#E08813] to-[#B45309]",
    accent: "text-[#F4C266]"
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
    <div className="min-h-screen bg-[#14070D] text-[#F3E4E8] font-sans overflow-hidden">
      
      {/* ── HERO SECTION ── */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#3A101A] via-[#250A11] to-[#0F060B] text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-[#D97706]/25">
        
        {/* Animated Background Glowing Orbs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#C50337]/25 blur-[100px] pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/2 -right-32 w-[500px] h-[500px] rounded-full bg-[#D97706]/15 blur-[120px] pointer-events-none"
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
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-5 py-2 text-xs font-extrabold text-[#F4C266] border border-[#F4C266]/30 shadow-lg tracking-wider uppercase font-heading">
              <FiShield size={14} className="text-[#F4C266]" />
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
            <h1 style={{ fontSize: 'clamp(1.65rem, 4.5vw + 0.5rem, 3.75rem)' }} className="font-black tracking-tight leading-[1.15] font-heading text-white">
              {user ? (
                <>
                  Welcome back, <span className="bg-gradient-to-r from-[#F4C266] via-[#E08813] to-[#F3E4E8] bg-clip-text text-transparent">{user.name}</span>!
                </>
              ) : (
                <>
                  Department of Computer Science <br />
                  <span className="bg-gradient-to-r from-[#F4C266] via-[#D97706] to-[#F3E4E8] bg-clip-text text-transparent">
                    Academic Learning Portal
                  </span>
                </>
              )}
            </h1>

            <p style={{ fontSize: 'clamp(0.875rem, 1.5vw + 0.5rem, 1.125rem)' }} className="text-[#D9C2CA] max-w-2xl mx-auto font-medium leading-relaxed">
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
            <button
              onClick={() => navigate(user ? getDashboardPath() : "/login")}
              className="group relative inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#C50337] to-[#7F011F] px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-black text-white shadow-[0_8px_30px_rgba(197,3,55,0.35)] transition-all hover:scale-105 hover:shadow-[0_12px_40px_rgba(197,3,55,0.45)] active:scale-95 w-full sm:w-auto font-heading"
            >
              <span>{user ? "Go to Dashboard" : "Access Student Portal"}</span>
              <FiArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => navigate("/about")}
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 backdrop-blur-md px-6 sm:px-7 py-3.5 sm:py-4 text-xs sm:text-sm font-bold text-white border border-white/20 hover:bg-white/20 transition-all hover:scale-105 active:scale-95 shadow-md w-full sm:w-auto"
            >
              <FiCompass size={16} className="text-[#F4C266]" />
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
                className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-lg hover:border-[#F4C266]/40 transition-all"
              >
                <stat.icon size={22} className={`mx-auto mb-1.5 ${stat.color}`} />
                <p className="text-2xl sm:text-3xl font-black text-white font-mono">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-[11px] font-bold text-[#D9C2CA] mt-1 uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* ── 3D BENTO GRID PORTAL CARDS ── */}
      <section className="relative -mt-10 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card-grid">
          {quickCards.map((card, i) => (
            <BentoCard3D
              key={card.label}
              onClick={() => navigate(card.to)}
              glowColor="rgba(244, 194, 102, 0.25)"
              conicColor="from-[#F4C266] via-[#C50337] to-[#D97706]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${card.color} text-white shadow-md transition-transform duration-300 group-hover:scale-110`}>
                  <card.icon size={26} />
                </div>
                <span className="rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider bg-white/10 text-[#F4C266] border border-white/15 font-heading">
                  {card.badge}
                </span>
              </div>

              <h3 className="text-lg font-extrabold text-white group-hover:text-[#F4C266] transition-colors font-heading">
                {card.label}
              </h3>
              <p className="text-xs text-[#C09DAA] mt-1.5 leading-relaxed">
                {card.desc}
              </p>

              <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-[#F4C266] group-hover:text-[#F3E4E8] transition-colors pt-3 border-t border-white/10">
                <span>Access Section</span>
                <FiChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
              </div>
            </BentoCard3D>
          ))}
        </div>
      </section>

      {/* ── INTERACTIVE SUBJECT KNOWLEDGE GRAPH SECTION ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <InteractiveKnowledgeGraph />
      </section>

      {/* ── FEATURES & ACADEMIC HIGHLIGHTS ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-2 max-w-2xl mx-auto"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D97706]/10 text-[#F4C266] border border-[#D97706]/25 px-4 py-1 text-xs font-extrabold uppercase tracking-widest font-heading">
            <FiZap size={14} className="text-[#D97706]" /> Core Academic Suite
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-heading">
            Everything You Need To Excel
          </h2>
          <p className="text-xs sm:text-sm text-[#C09DAA]">
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
              className="bg-[#22101A]/80 rounded-3xl p-6 border border-white/10 shadow-md hover:border-[#F4C266]/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${feature.color} text-white flex items-center justify-center shadow-md mb-4`}>
                  <feature.icon size={22} />
                </div>
                <h3 className="text-base font-extrabold text-white mb-2 font-heading">{feature.title}</h3>
                <p className="text-xs text-[#C09DAA] leading-relaxed">{feature.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-1 text-[11px] font-bold text-[#D9C2CA]">
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
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#3A101A] via-[#61182A] to-[#250A11] p-8 sm:p-14 text-white text-center shadow-2xl border border-[#F4C266]/30"
        >
          <div className="absolute -top-20 left-1/3 h-64 w-64 rounded-full bg-[#D97706]/20 blur-[90px] pointer-events-none" />
          <div className="relative z-10 space-y-5 max-w-2xl mx-auto">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-b from-[#E08813] to-[#D97706] border border-[#F4C266]/50 text-white shadow-lg">
              <FiAward size={32} />
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white font-heading">
              Empowering Your Future in Tech
            </h2>
            <p className="text-xs sm:text-sm text-[#EDC8D0] leading-relaxed font-medium">
              Every note you read, every video you watch, and every past paper you solve brings you closer to technical mastery and career success.
            </p>

            <div className="pt-4">
              <button
                onClick={() => navigate(getDashboardPath())}
                className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#C50337] to-[#7F011F] px-8 py-4 text-sm font-black text-white shadow-[0_8px_30px_rgba(197,3,55,0.35)] hover:scale-105 active:scale-95 transition-all font-heading"
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
