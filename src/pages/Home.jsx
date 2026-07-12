import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiBookOpen, FiStar, FiTrendingUp,
  FiPlayCircle, FiFileText, FiBriefcase, FiGrid, FiAward,
  FiArrowRight, FiChevronRight, FiUsers, FiLayers,
} from "react-icons/fi";
import AnimatedCounter from "../components/ui/AnimatedCounter";

const quickCards = [
  { label: "Video Lectures", icon: FiPlayCircle, to: "/e-content", gradient: "from-indigo-600 to-violet-600", desc: "Watch subject-wise lectures" },
  { label: "Question Papers", icon: FiGrid, to: "/question-papers", gradient: "from-rose-500 to-pink-600", desc: "Practice with past papers" },
  { label: "Placement Details", icon: FiBriefcase, to: "/placements", gradient: "from-amber-500 to-orange-600", desc: "Explore drives & opportunities" },
  { label: "Lecture Notes", icon: FiFileText, to: "/notes", gradient: "from-violet-500 to-purple-600", desc: "Download study materials" },
];

const stats = [
  { label: "Video Lectures", value: 50, suffix: "+", icon: FiPlayCircle },
  { label: "Lecture Notes", value: 30, suffix: "+", icon: FiFileText },
  { label: "Question Papers", value: 100, suffix: "+", icon: FiGrid },
  { label: "Placement Drives", value: 15, suffix: "+", icon: FiBriefcase },
  { label: "Students", value: 200, suffix: "+", icon: FiUsers },
  { label: "Subjects", value: 20, suffix: "+", icon: FiLayers },
];

const features = [
  { icon: FiPlayCircle, title: "Video Lectures", desc: "Faculty-curated video lectures covering the entire syllabus with practical examples and in-depth explanations.", gradient: "from-indigo-600 to-violet-600" },
  { icon: FiFileText, title: "PDF Notes", desc: "Comprehensive unit-wise PDF notes for every subject, available for instant download and offline reading.", gradient: "from-emerald-500 to-teal-600" },
  { icon: FiGrid, title: "Question Banks", desc: "Previous year question papers with multiple sets per subject to help you prepare thoroughly.", gradient: "from-amber-500 to-orange-600" },
  { icon: FiBriefcase, title: "Placements", desc: "Stay updated with the latest placement drives, eligibility criteria, and application deadlines.", gradient: "from-rose-500 to-pink-600" },
];

const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" } }) };

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const getDashboardPath = () => {
    if (!user) return "/login";
    if (user.type === "faculty") return "/faculty/dashboard";
    if (user.type === "admin") return "/admin/dashboard";
    return "/student/dashboard";
  };

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#080D1A] via-[#1E1B4B] to-[#2E1065]" />
        <div className="absolute inset-0 bg-animated-gradient-primary opacity-60" />
        <div className="absolute inset-0 hero-grid opacity-20" />
        
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="orb h-[500px] w-[500px] bg-indigo-500/10" style={{top:'-10%',right:'-5%','--duration':'8s','--delay':'0s'}} />
          <div className="orb h-[400px] w-[400px] bg-indigo-500/10" style={{top:'30%',left:'-5%','--duration':'10s','--delay':'2s'}} />
          <div className="orb h-[300px] w-[300px] bg-cyan-500/10" style={{bottom:'5%',right:'20%','--duration':'7s','--delay':'1s'}} />
        </div>

        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="particle"
              style={{ top: `${10 + Math.random() * 80}%`, left: `${5 + Math.random() * 90}%`, width: `${40 + Math.random() * 80}px`, height: `${40 + Math.random() * 80}px`, background: `rgba(${[59,130,246, 99,102,241, 6,182,212, 139,92,246][i % 4]},0.08)`, '--duration': `${8 + Math.random() * 8}s`, '--delay': `${Math.random() * 5}s` }} />
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#0F172A] to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 pt-24 pb-32 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col items-center text-center">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 px-5 py-2 text-xs font-semibold text-white/80">
                <FiStar size={12} className="text-amber-400" />
                {user ? `Welcome, ${user.name}${user.section ? ` · Section ${user.section}` : ""}` : "DDGD Vaishnav College · Dept of Computer Science"}
                <FiStar size={12} className="text-amber-400" />
              </span>
            </motion.div>

            <motion.h1 custom={0} initial="hidden" animate="visible" variants={fadeInUp}
              className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-white max-w-4xl"
            >
              {user ? <>Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-cyan-200 to-indigo-200">{user.name}</span></>
                : <>Your Gateway to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-cyan-200 to-indigo-200">Academic Excellence</span></>}
            </motion.h1>

            <motion.p custom={1} initial="hidden" animate="visible" variants={fadeInUp}
              className="mt-6 text-base sm:text-lg text-white/50 max-w-xl leading-relaxed">
              {user ? "Continue your learning journey — access video lectures, notes, question papers, and placement drives all in one place."
                : "Complete learning companion with e-content, notes, question papers & placements — everything you need to excel."}
            </motion.p>

            <motion.div custom={2} initial="hidden" animate="visible" variants={fadeInUp} className="mt-10 flex flex-wrap items-center justify-center gap-4">
              {user ? (
                <button onClick={() => navigate(getDashboardPath())}
                  className="group inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-[#0F172A] shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-[0.97]"
                >Go to Dashboard <FiArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></button>
              ) : (
                <button onClick={() => navigate("/login")}
                  className="group inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-[#0F172A] shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-[0.97]"
                >Access Student Portal <FiArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></button>
              )}
              <button onClick={() => navigate("/about")}
                className="group inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/20 hover:border-white/30 active:scale-[0.97]"
              >Learn More</button>
            </motion.div>

            <motion.div custom={3} initial="hidden" animate="visible" variants={fadeInUp}
              className="mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 w-full max-w-4xl">
              {stats.map((stat, i) => (
                <div key={stat.label} className="text-center">
                  <stat.icon size={20} className="mx-auto mb-1 text-cyan-400/60" />
                  <p className="font-display text-2xl font-bold text-white"><AnimatedCounter value={stat.value} suffix={stat.suffix} /></p>
                  <p className="text-[11px] text-white/50">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="relative -mt-16 z-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {quickCards.map((card, i) => (
              <motion.button key={card.label}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -6, scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => navigate(card.to)}
                className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-glass transition-all duration-300 hover:shadow-glass-lg hover:bg-white/10"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
                <div className="relative flex flex-col items-center gap-4 p-6 text-center">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${card.gradient} text-white shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-110`}><card.icon size={26} /></div>
                  <div>
                    <h3 className="font-display text-base font-bold text-white">{card.label}</h3>
                    <p className="mt-1 text-xs text-white/50">{card.desc}</p>
                  </div>
                  <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-300 opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0">Explore <FiChevronRight size={12} /></div>
                </div>
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${card.gradient} scale-x-0 group-hover:scale-x-100 transition-transform origin-left`} />
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-4 py-1.5 text-xs font-bold text-indigo-300 mb-4"><FiStar size={12} /> Features</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">Everything you need to <span className="text-gradient-primary">succeed</span></h2>
            <p className="mt-3 text-sm sm:text-base text-white/50 max-w-xl mx-auto">A comprehensive suite of academic resources designed to help you excel in your studies</p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-glass p-6 transition-all duration-300 hover:shadow-glass-lg hover:bg-white/10 hover:-translate-y-1"
              >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg transition-all duration-300 group-hover:scale-110`}><feature.icon size={22} /></div>
                <h3 className="font-display text-base font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4"><div className="divider-gradient" /></div>

      {/* CTA */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600/30 via-violet-600/30 to-purple-800/30 border border-white/10 p-10 sm:p-14 text-white text-center shadow-[0_20px_60px_rgba(79,70,229,0.1)]"
          >
            <div className="absolute inset-0 bg-grid-subtle opacity-[0.08]" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <div className="absolute -top-20 left-1/2 h-40 w-3/4 -translate-x-1/2 rounded-full bg-white/5 blur-[60px]" />
            <div className="relative">
              <FiAward size={48} className="mx-auto mb-4 opacity-80" />
              <h2 className="font-display text-2xl sm:text-3xl font-bold">You've got this! 🚀</h2>
              <p className="mt-3 max-w-lg mx-auto text-sm sm:text-base text-white/60 leading-relaxed">
                Every session you study, every paper you practice, every video you watch — brings you one step closer to your dreams. Keep going!
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <button onClick={() => navigate(getDashboardPath())}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#0F172A] shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-[0.97]"
                >{user ? "Go to Dashboard" : "Get Started"} <FiArrowRight size={16} /></button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
