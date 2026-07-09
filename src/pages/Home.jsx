// src/pages/Home.jsx
// Awwwards-inspired premium university homepage — glassmorphism, animated gradient hero, smooth animations
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiBookOpen, FiStar, FiTrendingUp,
  FiPlayCircle, FiFileText, FiBriefcase, FiGrid, FiAward,
  FiArrowRight, FiChevronRight,
} from "react-icons/fi";

// ─── Quote ───
const studentQuote = {
  text: "Education is the most powerful weapon which you can use to change the world.",
  author: "Nelson Mandela",
};

// ─── Quick Navigation ───
const quickCards = [
  {
    label: "Video Lectures",
    icon: FiPlayCircle,
    to: "/e-content",
    gradient: "from-blue-600 to-indigo-700",
    glow: "shadow-neon-primary",
    desc: "Watch subject-wise lectures",
  },
  {
    label: "Question Papers",
    icon: FiGrid,
    to: "/question-papers",
    gradient: "from-rose-500 to-pink-600",
    glow: "shadow-neon-rose",
    desc: "Practice with past papers",
  },
  {
    label: "Placement Details",
    icon: FiBriefcase,
    to: "/placements",
    gradient: "from-amber-500 to-orange-600",
    glow: "shadow-neon-amber",
    desc: "Explore drives & opportunities",
  },
  {
    label: "Lecture Notes",
    icon: FiFileText,
    to: "/notes",
    gradient: "from-violet-500 to-purple-600",
    glow: "shadow-neon-violet",
    desc: "Download study materials",
  },
];

// ─── Stats ───
const stats = [
  { label: "Video Lectures", value: "50+" },
  { label: "Lecture Notes", value: "30+" },
  { label: "Question Papers", value: "25+" },
  { label: "Placement Drives", value: "15+" },
];

// ─── Features ───
const features = [
  {
    icon: FiPlayCircle,
    title: "Video Lectures",
    desc: "Faculty-curated video lectures covering the entire syllabus with practical examples.",
    gradient: "from-blue-500 to-indigo-600",
    lightBg: "bg-blue-50",
  },
  {
    icon: FiFileText,
    title: "PDF Notes",
    desc: "Comprehensive unit-wise PDF notes for every subject, available for download.",
    gradient: "from-emerald-500 to-teal-600",
    lightBg: "bg-emerald-50",
  },
  {
    icon: FiGrid,
    title: "Question Banks",
    desc: "Previous year question papers with model answers to help you prepare.",
    gradient: "from-amber-500 to-orange-600",
    lightBg: "bg-amber-50",
  },
  {
    icon: FiBriefcase,
    title: "Placements",
    desc: "Stay updated with the latest placement drives and company opportunities.",
    gradient: "from-rose-500 to-pink-600",
    lightBg: "bg-rose-50",
  },
];

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* ════════════════════════════════════════ */}
      {/* HERO — Awwwards-inspired animated section */}
      {/* ════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-animated-gradient-cool" />

        {/* Grid overlay */}
        <div className="absolute inset-0 hero-grid" />

        {/* Animated orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="orb h-72 w-72 bg-blue-400/15" style={{top:'-5%',right:'-5%','--duration':'8s','--delay':'0s'}} />
          <div className="orb h-56 w-56 bg-indigo-400/10" style={{top:'40%',left:'-3%','--duration':'10s','--delay':'2s'}} />
          <div className="orb h-40 w-40 bg-purple-400/8" style={{bottom:'10%',right:'20%','--duration':'7s','--delay':'1s'}} />
        </div>

        {/* Particles */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="particle h-16 w-16 bg-blue-200/20 blur-xl" style={{top:'15%',left:'10%',width:'80px',height:'80px','--duration':'12s','--delay':'0s'}} />
          <div className="particle h-12 w-12 bg-indigo-200/20 blur-xl" style={{top:'25%',right:'15%',width:'60px',height:'60px','--duration':'10s','--delay':'2s'}} />
          <div className="particle h-20 w-20 bg-purple-200/15 blur-xl" style={{bottom:'30%',left:'20%',width:'100px',height:'100px','--duration':'14s','--delay':'1s'}} />
          <div className="particle h-10 w-10 bg-cyan-200/15 blur-xl" style={{top:'60%',right:'8%',width:'50px',height:'50px','--duration':'9s','--delay':'3s'}} />
        </div>

        {/* Hero content */}
        <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24 lg:pb-28">
          <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-16">
            {/* Left */}
            <div className="flex-1 text-center lg:text-left">
              {/* Greeting badge */}
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <span className="glass-card-strong inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-blue-700">
                  <FiStar size={12} className="text-amber-500" />
                  {user
                    ? `${user.name}${user.section ? ` · Section ${user.section}` : ""}`
                    : "DDGD Vaishnav College"}
                  <FiStar size={12} className="text-amber-500" />
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
              >
                {user ? (
                  <>
                    Welcome back,{" "}
                    <span className="text-gradient-primary">
                      {user.name}
                    </span>
                  </>
                ) : (
                  <>
                    Your Gateway to{" "}
                    <span className="text-gradient-primary">
                      Academic Excellence
                    </span>
                  </>
                )}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-5 text-base text-gray-500 sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed"
              >
                {user
                  ? "Continue your learning journey — access video lectures, notes, question papers, and placement drives all in one place."
                  : "Dwarka Doss Goverdhan Doss Vaishnav College — Department of Computer Science's complete learning companion with e-content, notes, question papers & placements."}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 flex flex-wrap items-center gap-3 justify-center lg:justify-start"
              >
                {user ? (
                  <button
                    onClick={() => navigate("/student/dashboard")}
                    className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-3 text-sm font-bold text-white shadow-premium transition-all duration-300 hover:shadow-neon-primary hover:from-blue-500 hover:to-indigo-600 active:scale-[0.97]"
                  >
                    Go to Dashboard
                    <FiArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </button>
                ) : (
                  <button
                    onClick={() => navigate("/login")}
                    className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-3 text-sm font-bold text-white shadow-premium transition-all duration-300 hover:shadow-neon-primary hover:from-blue-500 hover:to-indigo-600 active:scale-[0.97]"
                  >
                    Access Student Portal
                    <FiArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </button>
                )}
                <button
                  onClick={() => navigate("/about")}
                  className="group inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white/60 backdrop-blur-sm px-6 py-3 text-sm font-semibold text-gray-700 transition-all duration-300 hover:border-gray-300 hover:bg-white/80 hover:shadow-soft active:scale-[0.97]"
                >
                  Learn More
                </button>
              </motion.div>

              {/* Stats row */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-10 flex flex-wrap items-center justify-center gap-6 lg:justify-start"
              >
                {stats.map((stat, i) => (
                  <div key={stat.label} className="text-center lg:text-left">
                    <p className="font-display text-lg font-bold text-gray-900">{stat.value}</p>
                    <p className="text-[11px] text-gray-500 whitespace-nowrap">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right — Premium illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 }}
              className="shrink-0"
            >
              <div className="glass-card-strong p-4 sm:p-6">
                <svg width="280" height="220" viewBox="0 0 280 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-56 sm:w-64 lg:w-72">
                  {/* Monitor */}
                  <rect x="40" y="20" width="200" height="140" rx="12" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
                  <rect x="50" y="34" width="180" height="108" rx="6" fill="#0f172a" />
                  {/* Code lines */}
                  <line x1="64" y1="54" x2="140" y2="54" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="64" y1="70" x2="120" y2="70" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="78" y1="86" x2="160" y2="86" stroke="#eab308" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="64" y1="102" x2="130" y2="102" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="78" y1="118" x2="150" y2="118" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
                  {/* Stand */}
                  <rect x="120" y="160" width="40" height="10" rx="2" fill="#475569" />
                  <rect x="100" y="170" width="80" height="8" rx="4" fill="#475569" />
                  {/* Floating elements */}
                  <circle cx="250" cy="60" r="20" stroke="#6366f1" strokeWidth="2" fill="none" opacity="0.5" />
                  <circle cx="250" cy="60" r="10" stroke="#6366f1" strokeWidth="2" fill="none" opacity="0.5" />
                  <circle cx="20" cy="90" r="16" stroke="#06b6d4" strokeWidth="2" fill="none" opacity="0.4" />
                  <circle cx="20" cy="90" r="8" stroke="#06b6d4" strokeWidth="2" fill="none" opacity="0.4" />
                  <circle cx="260" cy="160" r="12" stroke="#8b5cf6" strokeWidth="2" fill="none" opacity="0.4" />
                  <circle cx="260" cy="160" r="6" stroke="#8b5cf6" strokeWidth="2" fill="none" opacity="0.4" />
                </svg>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FAFBFC] to-transparent" />
      </section>

      {/* ════════════════════════════════════════ */}
      {/* QUOTE SECTION */}
      {/* ════════════════════════════════════════ */}
      <section className="relative px-4 pb-8 sm:px-6 lg:px-8 -mt-8">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card-strong relative overflow-hidden p-6 sm:p-8 text-center"
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-300/30 to-transparent" />
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 shadow-soft">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-blue-500">
                <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
                <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
              </svg>
            </div>
            <blockquote className="text-lg font-medium leading-relaxed text-gray-700 sm:text-xl md:text-2xl">
              &ldquo;{studentQuote.text}&rdquo;
            </blockquote>
            <p className="mt-4 text-sm font-semibold text-gradient-primary">
              — {studentQuote.author}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════ */}
      {/* QUICK NAVIGATION */}
      {/* ════════════════════════════════════════ */}
      <section className="section-padding">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 text-center"
          >
            <h2 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl">
              What would you like to explore?
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Everything you need, right at your fingertips
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {quickCards.map((card, i) => (
              <motion.button
                key={card.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(card.to)}
                className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-glass border border-white/30 shadow-glass transition-all duration-300 hover:shadow-glass-lg hover:bg-white/90"
              >
                {/* Glass shine */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-tr from-transparent via-white/30 to-transparent pointer-events-none" />
                
                <div className="relative flex flex-col items-center gap-4 p-6 text-center">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${card.gradient} text-white shadow-soft transition-all duration-300 group-hover:shadow-lg group-hover:scale-105`}>
                    <card.icon size={26} />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-gray-900">
                      {card.label}
                    </h3>
                    <p className="mt-1 text-xs text-gray-500">{card.desc}</p>
                  </div>
                  <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0">
                    Explore
                    <FiChevronRight size={12} />
                  </div>
                </div>
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${card.gradient} scale-x-0 group-hover:scale-x-100 transition-transform origin-left`} />
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════ */}
      {/* FEATURES */}
      {/* ════════════════════════════════════════ */}
      <section className="section-padding bg-mesh-cool">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 text-center"
          >
            <span className="badge-primary mb-4">Features</span>
            <h2 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl">
              Everything you need to succeed
            </h2>
            <p className="mt-2 text-sm text-gray-500 max-w-xl mx-auto">
              A comprehensive suite of academic resources designed to help you excel in your studies
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group rounded-2xl bg-white/80 backdrop-blur-glass border border-white/30 shadow-glass p-6 transition-all duration-300 hover:shadow-glass-lg hover:bg-white/90 hover:-translate-y-0.5"
              >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} text-white shadow-soft transition-all duration-300 group-hover:scale-110`}>
                  <feature.icon size={22} />
                </div>
                <h3 className="font-display text-base font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════ */}
      {/* MOTIVATIONAL CTA */}
      {/* ════════════════════════════════════════ */}
      <section className="section-padding">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 p-8 sm:p-12 text-white text-center shadow-premium-lg"
          >
            {/* Pattern overlay */}
            <div className="absolute inset-0 bg-grid-subtle opacity-[0.08]" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            
            {/* Glow */}
            <div className="absolute -top-20 left-1/2 h-40 w-3/4 -translate-x-1/2 rounded-full bg-white/10 blur-[60px]" />

            <div className="relative">
              <FiAward size={40} className="mx-auto mb-4 opacity-90" />
              <h2 className="font-display text-2xl font-bold sm:text-3xl">
                You've got this! 🚀
              </h2>
              <p className="mt-3 max-w-lg mx-auto text-sm text-blue-200 leading-relaxed">
                Every session you study, every paper you practice, every video you watch — 
                brings you one step closer to your dreams. Keep going!
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => navigate(user ? "/student/dashboard" : "/login")}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-blue-700 shadow-soft transition-all duration-300 hover:shadow-premium hover:scale-105 active:scale-[0.97]"
                >
                  {user ? "Go to Dashboard" : "Get Started"}
                  <FiArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
