// src/pages/Home.jsx
// Student home page — CS images + one inspirational quote
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiBookOpen, FiStar, FiTrendingUp,
  FiPlayCircle, FiFileText, FiBriefcase, FiGrid, FiAward,
} from "react-icons/fi";

// ─── Single Student Quote ───
const studentQuote = {
  text: "Education is the most powerful weapon which you can use to change the world.",
  author: "Nelson Mandela",
};

// ─── Quick Navigation Cards ───
const quickCards = [
  {
    label: "Video Lectures",
    icon: FiPlayCircle,
    to: "/e-content",
    gradient: "from-blue-500 to-indigo-600",
    desc: "Watch subject-wise lectures",
  },
  {
    label: "Previous Year\nQuestion Papers",
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
    desc: "Explore drives & opportunities",
  },
  {
    label: "Lecture Notes",
    icon: FiFileText,
    to: "/notes",
    gradient: "from-violet-500 to-purple-600",
    desc: "Download study materials",
  },
];

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-animated-gradient">
      {/* ─── Floating Particles ─── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="particle h-16 w-16 bg-blue-200/20 blur-xl" style={{top:'10%',left:'5%',width:'80px',height:'80px','--duration':'12s','--delay':'0s'}} />
        <div className="particle h-12 w-12 bg-indigo-200/20 blur-xl" style={{top:'20%',right:'10%',width:'60px',height:'60px','--duration':'10s','--delay':'2s'}} />
        <div className="particle h-20 w-20 bg-purple-200/15 blur-xl" style={{bottom:'30%',left:'15%',width:'100px',height:'100px','--duration':'14s','--delay':'1s'}} />
        <div className="particle h-10 w-10 bg-cyan-200/15 blur-xl" style={{top:'60%',right:'5%',width:'50px',height:'50px','--duration':'9s','--delay':'3s'}} />
        <div className="particle h-14 w-14 bg-pink-200/10 blur-xl" style={{bottom:'10%',right:'20%',width:'70px',height:'70px','--duration':'11s','--delay':'0.5s'}} />
        <div className="particle h-8 w-8 bg-emerald-200/10 blur-xl" style={{top:'40%',left:'40%',width:'40px',height:'40px','--duration':'13s','--delay':'4s'}} />
      </div>

      {/* ─── HERO SECTION with CS Illustration ─── */}
      <section className="relative overflow-hidden px-4 pt-12 pb-12 sm:px-6 lg:px-8">
        {/* Decorative glow */}
        <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-blue-200/20 blur-[120px] animate-pulse-glow" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-indigo-200/20 blur-[120px] animate-pulse-glow" style={{animationDelay:'1.5s'}} />

        <div className="relative mx-auto max-w-5xl">
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:gap-12">
            {/* Left: Text content */}
            <div className="flex-1 text-center lg:text-left">
              {/* Greeting */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4"
              >
                <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-1.5 text-xs font-semibold text-blue-700 border border-blue-200/50">
                  <FiStar size={12} className="text-amber-500" />
                  {user ? `${user.name}${user.section ? ` · Sec ${user.section}` : ""}` : "DDGD Vaishnav College"}
                  <FiStar size={12} className="text-amber-500" />
                </span>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-display text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl md:text-5xl"
              >
                {user ? (
                  <>Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{user.name}</span>! 👋</>
                ) : (
                  <>CS Academic Portal</>
                )}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-3 text-sm text-gray-500 sm:text-base max-w-lg"
              >
                Your complete learning companion — videos, notes, question papers & placements
              </motion.p>
            </div>

            {/* Right: CS-themed SVG Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="shrink-0"
            >
              <svg width="260" height="200" viewBox="0 0 260 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-52 sm:w-64 lg:w-72">
                {/* Monitor */}
                <rect x="30" y="20" width="180" height="130" rx="10" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
                <rect x="38" y="30" width="164" height="100" rx="4" fill="#0f172a" />
                {/* Code lines on screen */}
                <line x1="50" y1="48" x2="120" y2="48" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="50" y1="62" x2="100" y2="62" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="62" y1="76" x2="140" y2="76" stroke="#eab308" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="50" y1="90" x2="110" y2="90" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="62" y1="104" x2="130" y2="104" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="50" y1="118" x2="90" y2="118" stroke="#eab308" strokeWidth="2.5" strokeLinecap="round" />
                {/* Monitor stand */}
                <rect x="100" y="150" width="40" height="8" rx="2" fill="#475569" />
                <rect x="80" y="158" width="80" height="6" rx="3" fill="#475569" />
                {/* Gear icons */}
                <circle cx="225" cy="60" r="18" stroke="#6366f1" strokeWidth="2" fill="none" opacity="0.6" />
                <circle cx="225" cy="60" r="8" stroke="#6366f1" strokeWidth="2" fill="none" opacity="0.6" />
                <circle cx="235" cy="140" r="14" stroke="#8b5cf6" strokeWidth="2" fill="none" opacity="0.5" />
                <circle cx="235" cy="140" r="6" stroke="#8b5cf6" strokeWidth="2" fill="none" opacity="0.5" />
                {/* Small database icon */}
                <ellipse cx="50" cy="175" rx="20" ry="8" stroke="#6366f1" strokeWidth="1.5" fill="none" opacity="0.5" />
                <line x1="30" y1="175" x2="30" y2="185" stroke="#6366f1" strokeWidth="1.5" opacity="0.5" />
                <line x1="70" y1="175" x2="70" y2="185" stroke="#6366f1" strokeWidth="1.5" opacity="0.5" />
                <ellipse cx="50" cy="185" rx="20" ry="8" stroke="#6366f1" strokeWidth="1.5" fill="none" opacity="0.5" />
              </svg>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── SINGLE STUDENT QUOTE ─── */}
      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative rounded-2xl bg-white border border-indigo-100/60 p-6 shadow-lg shadow-indigo-100/20 text-center"
          >
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-50 to-blue-50">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-400">
                <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
                <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
              </svg>
            </div>
            <blockquote className="text-base font-medium leading-relaxed text-gray-700 sm:text-lg md:text-xl">
              &ldquo;{studentQuote.text}&rdquo;
            </blockquote>
            <p className="mt-3 text-sm font-semibold text-indigo-600">
              — {studentQuote.author}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── QUICK NAVIGATION CARDS ─── */}
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-6 text-center font-display text-xl font-bold text-gray-800">
            What would you like to explore?
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickCards.map((card, i) => (
              <motion.button
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                whileHover={{ scale: 1.03, y: -3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(card.to)}
                className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white p-5 text-left shadow-soft hover:shadow-premium transition-all"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                <div className="relative flex flex-col items-center text-center gap-3">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${card.gradient} text-white shadow-md`}>
                    <card.icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 whitespace-pre-line leading-snug">
                      {card.label}
                    </h3>
                    <p className="mt-0.5 text-xs text-gray-400">{card.desc}</p>
                  </div>
                </div>
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${card.gradient} scale-x-0 group-hover:scale-x-100 transition-transform origin-left`} />
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CS THEMED VISUAL SECTION ─── */}
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-xl bg-white border border-gray-100 p-5 shadow-soft text-center"
            >
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
              </div>
              <h3 className="font-bold text-sm text-gray-900">Learn to Code</h3>
              <p className="mt-1 text-xs text-gray-400">Master programming languages and build real-world projects</p>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="rounded-xl bg-white border border-gray-100 p-5 shadow-soft text-center"
            >
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-amber-50 to-orange-50">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
              <h3 className="font-bold text-sm text-gray-900">Watch & Learn</h3>
              <p className="mt-1 text-xs text-gray-400">Video lectures delivered by experienced faculty</p>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="rounded-xl bg-white border border-gray-100 p-5 shadow-soft text-center"
            >
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h3 className="font-bold text-sm text-gray-900">Track Progress</h3>
              <p className="mt-1 text-xs text-gray-400">Stay on top of your academic journey</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── ACHIEVEMENT TEASER ─── */}
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white shadow-premium"
          >
            <FiAward size={36} className="mx-auto mb-3 opacity-80" />
            <h2 className="font-display text-xl font-bold">You've got this! 🚀</h2>
            <p className="mt-2 max-w-lg mx-auto text-sm text-blue-100">
              Every session you study, every paper you practice, every video you watch — 
              brings you one step closer to your dreams. Keep going!
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-blue-200">
              <span className="flex items-center gap-1"><FiBookOpen size={14} /> Study</span>
              <span className="flex items-center gap-1"><FiTrendingUp size={14} /> Practice</span>
              <span className="flex items-center gap-1"><FiStar size={14} /> Succeed</span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
