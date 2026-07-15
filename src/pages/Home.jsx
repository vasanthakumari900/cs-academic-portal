import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiPlayCircle, FiFileText, FiBriefcase, FiGrid, FiAward,
  FiArrowRight, FiChevronRight, FiUsers, FiLayers, FiStar,
} from "react-icons/fi";
import AnimatedCounter from "../components/ui/AnimatedCounter";

const quickCards = [
  { label: "Video Lectures", icon: FiPlayCircle, to: "/e-content", bgIcon: "bg-[#0F4C81]", desc: "Watch subject-wise lectures" },
  { label: "Question Papers", icon: FiGrid, to: "/question-papers", bgIcon: "bg-[#1E88E5]", desc: "Practice with past papers" },
  { label: "Placement Details", icon: FiBriefcase, to: "/placements", bgIcon: "bg-[#2E7D32]", desc: "Explore drives & opportunities" },
  { label: "Lecture Notes", icon: FiFileText, to: "/notes", bgIcon: "bg-[#0F4C81]", desc: "Download study materials" },
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
  { icon: FiPlayCircle, title: "Video Lectures", desc: "Faculty-curated video lectures covering the entire syllabus with practical examples and in-depth explanations.", bgIcon: "bg-[#0F4C81]" },
  { icon: FiFileText, title: "PDF Notes", desc: "Comprehensive unit-wise PDF notes for every subject, available for instant download and offline reading.", bgIcon: "bg-[#1E88E5]" },
  { icon: FiGrid, title: "Question Banks", desc: "Previous year question papers with multiple sets per subject to help you prepare thoroughly.", bgIcon: "bg-[#2E7D32]" },
  { icon: FiBriefcase, title: "Placements", desc: "Stay updated with the latest placement drives, eligibility criteria, and application deadlines.", bgIcon: "bg-[#0F4C81]" },
];

const fadeInUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" } }) };

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
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* HERO */}
      <section className="relative min-h-[75vh] flex items-center overflow-hidden bg-[#0F4C81] text-white">
        <div className="absolute inset-0 bg-[#0F4C81]" />
        
        <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-24 sm:px-6 lg:px-8 w-full z-10">
          <div className="flex flex-col items-center text-center">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-xs font-semibold text-white/90">
                <FiStar size={12} className="text-white" />
                {user ? `Welcome, ${user.name}${user.section ? ` · Section ${user.section}` : ""}` : "DDGD Vaishnav College · Dept of Computer Science"}
                <FiStar size={12} className="text-white" />
              </span>
            </motion.div>

            <motion.h1 custom={0} initial="hidden" animate="visible" variants={fadeInUp}
              className="font-sans text-3xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl text-white max-w-4xl"
            >
              {user ? <>Welcome back, <span className="text-[#42A5F5]">{user.name}</span></>
                : <>Your Gateway to <span className="text-[#42A5F5]">Academic Excellence</span></>}
            </motion.h1>

            <motion.p custom={1} initial="hidden" animate="visible" variants={fadeInUp}
              className="mt-6 text-sm sm:text-base text-white/80 max-w-xl leading-relaxed">
              {user ? "Continue your learning journey — access video lectures, notes, question papers, and placement drives all in one place."
                : "Complete learning companion with e-content, notes, question papers & placements — everything you need to excel."}
            </motion.p>

            <motion.div custom={2} initial="hidden" animate="visible" variants={fadeInUp} className="mt-10 flex flex-wrap items-center justify-center gap-4">
              {user ? (
                <button onClick={() => navigate(getDashboardPath())}
                  className="group inline-flex items-center gap-2 rounded-lg bg-white px-7 py-3 text-sm font-bold text-[#0F4C81] shadow-sm transition-all hover:bg-[#F0F4F8] active:scale-[0.97]"
                >Go to Dashboard <FiArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></button>
              ) : (
                <button onClick={() => navigate("/login")}
                  className="group inline-flex items-center gap-2 rounded-lg bg-white px-7 py-3 text-sm font-bold text-[#0F4C81] shadow-sm transition-all hover:bg-[#F0F4F8] active:scale-[0.97]"
                >Access Student Portal <FiArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></button>
              )}
              <button onClick={() => navigate("/about")}
                className="group inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-white/20 active:scale-[0.97]"
              >Learn More</button>
            </motion.div>

            <motion.div custom={3} initial="hidden" animate="visible" variants={fadeInUp}
              className="mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 w-full max-w-4xl">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <stat.icon size={20} className="mx-auto mb-1 text-white/70" />
                  <p className="font-sans text-2xl font-bold text-white"><AnimatedCounter value={stat.value} suffix={stat.suffix} /></p>
                  <p className="text-[11px] text-white/70">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="relative -mt-8 z-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {quickCards.map((card, i) => (
              <motion.button key={card.label}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}
                onClick={() => navigate(card.to)}
                className="group relative overflow-hidden rounded-lg bg-white border border-[#E5E7EB] shadow-sm transition-all duration-300 hover:shadow-sm"
              >
                <div className="relative flex flex-col items-center gap-4 p-6 text-center">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-lg ${card.bgIcon} text-white shadow-sm transition-all duration-300 group-hover:scale-105`}><card.icon size={26} /></div>
                  <div>
                    <h3 className="font-sans text-base font-bold text-[#0F4C81]">{card.label}</h3>
                    <p className="mt-1 text-xs text-[#6B7280]">{card.desc}</p>
                  </div>
                  <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1E88E5] opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0">Explore <FiChevronRight size={12} /></div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#0F4C81]/10 px-4 py-1.5 text-xs font-bold text-[#0F4C81] mb-4"><FiStar size={12} /> Features</span>
            <h2 className="font-sans text-3xl font-bold text-[#0F4C81]">Everything you need to succeed</h2>
            <p className="mt-3 text-sm text-[#6B7280] max-w-xl mx-auto">A comprehensive suite of academic resources designed to help you excel in your studies</p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.4 }}
                className="group rounded-lg bg-white border border-[#E5E7EB] shadow-sm p-6 transition-all duration-300 hover:shadow-sm hover:-translate-y-0.5"
              >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${feature.bgIcon} text-white shadow-sm`}><feature.icon size={22} /></div>
                <h3 className="font-sans text-base font-bold text-[#0F4C81] mb-2">{feature.title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4"><div className="h-px bg-[#E5E7EB]" /></div>

      {/* CTA */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative overflow-hidden rounded-lg bg-[#0F4C81] p-10 sm:p-14 text-white text-center shadow-sm border border-[#0A3356]"
          >
            <div className="relative">
              <FiAward size={48} className="mx-auto mb-4 opacity-85" />
              <h2 className="font-sans text-2xl sm:text-3xl font-bold">You've got this! 🚀</h2>
              <p className="mt-3 max-w-lg mx-auto text-sm text-white/80 leading-relaxed">
                Every session you study, every paper you practice, every video you watch — brings you one step closer to your dreams. Keep going!
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <button onClick={() => navigate(getDashboardPath())}
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-bold text-[#0F4C81] shadow-sm transition-all hover:bg-[#F0F4F8] active:scale-[0.97]"
                >{user ? "Go to Dashboard" : "Get Started"} <FiArrowRight size={16} /></button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
