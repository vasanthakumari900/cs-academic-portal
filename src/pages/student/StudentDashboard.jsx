import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FiPlayCircle,
  FiFileText,
  FiGrid,
  FiBriefcase,
  FiAward,
  FiChevronRight,
  FiShield,
  FiCheckCircle,
  FiMessageSquare,
  FiActivity,
  FiEdit3,
  FiUserCheck,
  FiBookOpen,
  FiEye,
  FiExternalLink,
  FiCalendar,
  FiUsers,
  FiArrowRight,
  FiFilter,
  FiZap,
  FiLayers,
} from "react-icons/fi";
import CiaExamNotificationCard from "../../components/dashboard/CiaExamNotificationCard";
import BirthdayWishCard from "../../components/dashboard/BirthdayWishCard";
import ProjectFeedbackModal from "../../components/feedback/ProjectFeedbackModal";
import AdminFeedbackModal from "../../components/admin/AdminFeedbackModal";
import useActivityTracker from "../../hooks/useActivityTracker";
import InteractiveKnowledgeGraph from "../../components/ui/InteractiveKnowledgeGraph";

const CS_QUOTES = [
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "Computers are good at following instructions, but not at reading your mind.", author: "Donald Knuth" },
  { text: "The most dangerous phrase in the language is: 'We've always done it this way.'", author: "Grace Hopper" },
  { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
  { text: "Simplicity is prerequisite for reliability.", author: "Edsger W. Dijkstra" },
  { text: "Software is a great combination between artistry and engineering.", author: "Bill Gates" },
  { text: "Knowledge is power, especially in computer science.", author: "Alan Turing" },
  { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
  { text: "UNIX is simple. It just takes a genius to understand its simplicity.", author: "Dennis Ritchie" },
  { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
  { text: "Ideas are cheap. Execution is everything in software engineering.", author: "Linus Torvalds" },
  { text: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson" },
  { text: "Algorithms are the fundamental building blocks of computing.", author: "Donald Knuth" },
  { text: "That's the thing about technology. It's only as good as the minds behind it.", author: "Margaret Hamilton" },
  { text: "System architecture is the art of shaping digital possibilities.", author: "Alan Kay" },
];

function getStudentCsQuote(identifier = "") {
  let hash = 0;
  const str = String(identifier);
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % CS_QUOTES.length;
  return CS_QUOTES[index];
}

const CATEGORY_TABS = [
  { id: "all", label: "All Options", count: 8 },
  { id: "materials", label: "Study Materials", count: 4 },
  { id: "career", label: "Career & Hub", count: 2 },
  { id: "tools", label: "Tools & Portals", count: 2 },
];

const STUDENT_OPTIONS = [
  {
    id: "videos",
    label: "Video Lectures",
    icon: FiPlayCircle,
    to: "/student/videos",
    badge: "E-Content",
    desc: "Watch subject-wise video lectures, playlists & tutorials.",
    color: "#021C4F",
    emblemGradient: "bg-gradient-to-tr from-[#011337] via-[#021C4F] to-[#7F011F]",
    cardBgGradient: "bg-gradient-to-br from-[#011438] via-[#021C4F] to-[#0A369D] text-white border-2 border-[#0A369D]/60 hover:border-amber-400 hover:shadow-[0_16px_36px_-8px_rgba(2,28,79,0.5)]",
    iconColor: "text-amber-400 drop-shadow-xs",
    category: "materials",
  },
  {
    id: "notes",
    label: "Notes",
    icon: FiBookOpen,
    to: "/student/notes",
    badge: "PDF Notes",
    desc: "Unit-wise lecture notes & downloadable study materials.",
    color: "#C50337",
    emblemGradient: "bg-gradient-to-tr from-[#7F011F] via-[#C50337] to-[#A0022B]",
    cardBgGradient: "bg-gradient-to-br from-[#470012] via-[#7F011F] to-[#C50337] text-white border-2 border-[#A0022B]/60 hover:border-amber-300 hover:shadow-[0_16px_36px_-8px_rgba(197,3,55,0.5)]",
    iconColor: "text-amber-300 drop-shadow-xs",
    category: "materials",
  },
  {
    id: "question-papers",
    label: "Previous Year Question Papers",
    icon: FiAward,
    to: "/student/question-papers",
    badge: "Semester Exams",
    desc: "Browse & download past university question papers.",
    color: "#021C4F",
    emblemGradient: "bg-gradient-to-tr from-[#011337] via-[#021C4F] to-[#0A369D]",
    cardBgGradient: "bg-gradient-to-br from-[#011438] via-[#0A2D69] to-[#0544B3] text-white border-2 border-[#0A369D]/60 hover:border-amber-400 hover:shadow-[0_16px_36px_-8px_rgba(10,54,157,0.5)]",
    iconColor: "text-amber-400 drop-shadow-xs",
    category: "materials",
  },
  {
    id: "cia-papers",
    label: "CIA Question Papers",
    icon: FiCheckCircle,
    to: "/student/cia-question-papers",
    badge: "Internal Assessment",
    desc: "Continuous Internal Assessment (CIA 1 & CIA 2) papers.",
    color: "#C50337",
    emblemGradient: "bg-gradient-to-tr from-[#C50337] via-[#A0022B] to-[#7F011F]",
    cardBgGradient: "bg-gradient-to-br from-[#3D0010] via-[#660019] to-[#A0022B] text-white border-2 border-[#C50337]/60 hover:border-amber-300 hover:shadow-[0_16px_36px_-8px_rgba(160,2,43,0.5)]",
    iconColor: "text-amber-300 drop-shadow-xs",
    category: "materials",
  },
  {
    id: "placements",
    label: "Placement Details",
    icon: FiBriefcase,
    to: "/student/placements",
    badge: "Career Drives",
    desc: "Placement updates, company eligibility & mock aptitude.",
    color: "#7F011F",
    emblemGradient: "bg-gradient-to-tr from-[#580017] via-[#8B0024] to-[#C50337]",
    cardBgGradient: "bg-gradient-to-br from-[#2E000C] via-[#580017] to-[#8B0024] text-white border-2 border-[#7F011F]/60 hover:border-amber-400 hover:shadow-[0_16px_36px_-8px_rgba(127,1,31,0.5)]",
    iconColor: "text-amber-300 drop-shadow-xs",
    category: "career",
  },
  {
    id: "study-planner",
    label: "Smart AI Exam Study Planner & Countdown",
    icon: FiCalendar,
    to: "/student/exam-study-planner",
    badge: "AI Study Planner",
    desc: "Calculate unit revision timetables & track daily exam prep progress.",
    color: "#0D9488",
    emblemGradient: "bg-gradient-to-tr from-[#0D9488] via-[#0F766E] to-[#115E59]",
    cardBgGradient: "bg-gradient-to-br from-[#022C2B] via-[#0D9488] to-[#115E59] text-white border-2 border-[#0D9488]/60 hover:border-amber-300 hover:shadow-[0_16px_36px_-8px_rgba(13,148,136,0.5)]",
    iconColor: "text-amber-400 drop-shadow-xs",
    category: "tools",
  },
  {
    id: "project-hub",
    label: "Department Hackathon & Project Partner Finder",
    icon: FiUsers,
    to: "/student/project-hub",
    badge: "Student Innovation Hub",
    desc: "Showcase GitHub projects, find hackathon teammates & recruit skills across sections.",
    color: "#C50337",
    emblemGradient: "bg-gradient-to-tr from-[#7F011F] via-[#C50337] to-[#D97706]",
    cardBgGradient: "bg-gradient-to-br from-[#450C00] via-[#7F011F] to-[#D97706] text-white border-2 border-[#D97706]/60 hover:border-amber-300 hover:shadow-[0_16px_36px_-8px_rgba(217,119,6,0.5)]",
    iconColor: "text-amber-300 drop-shadow-xs",
    category: "career",
  },
  {
    id: "vaishnav-lms",
    label: "Vaishnav LMS Portal",
    icon: FiExternalLink,
    href: "https://dgvc.in/lms/login.php",
    isExternal: true,
    badge: "Official LMS",
    desc: "Access the official Vaishnav Learning Management System portal.",
    color: "#021C4F",
    emblemGradient: "bg-gradient-to-tr from-[#011337] via-[#021C4F] to-[#990000]",
    cardBgGradient: "bg-gradient-to-br from-[#050D24] via-[#021C4F] to-[#7F011F] text-white border-2 border-[#021C4F]/60 hover:border-amber-400 hover:shadow-[0_16px_36px_-8px_rgba(2,28,79,0.5)]",
    iconColor: "text-amber-300 drop-shadow-xs",
    category: "tools",
  },
];

export default function StudentDashboard() {
  const { user } = useAuth();
  useActivityTracker("Student Dashboard");
  const navigate = useNavigate();

  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isAdminFeedbackOpen, setIsAdminFeedbackOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");

  const isAdmin = user?.rollNumber === "24E3006" || user?.rollNumber === "24E3013" || user?.role === "admin" || user?.type === "admin" || Boolean(user?.adminBadge);
  const hasPhoto = Boolean(user?.photoUrl);
  const photoPath = user?.photoUrl || "/admin_photo.jpg";

  const optionsToRender = activeCategory === "all"
    ? STUDENT_OPTIONS
    : STUDENT_OPTIONS.filter((opt) => opt.category === activeCategory);

  const yearLabel = user?.year
    ? user.year === 1
      ? "1st Year"
      : user.year === 2
      ? "2nd Year"
      : "3rd Year"
    : "3rd Year";

  const semesterLabel = user?.semester
    ? `Semester ${user.semester}`
    : "Semester 5";

  // Individual CS Quote deterministically assigned to each student
  const studentQuote = getStudentCsQuote(user?.rollNumber || user?.name || "CS_STUDENT");

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 py-8 sm:px-6 lg:px-8 bg-[#FAF0F2] text-[#2D060E]">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Top Header Grid: Banner on Left + Notification Cards on Top-Right */}
        <div className="mb-8 flex flex-col lg:flex-row items-start justify-between gap-6">
          <div className="flex-1 w-full">
            {hasPhoto ? (
              /* Profile Photo Banner for Students with Photos (e.g. 24E3006, 24E3007) */
              <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="relative mb-4">
                  <div className="absolute -inset-1.5 rounded-2xl bg-[#021C4F]/20 blur-sm" />
                  <img
                    src={photoPath}
                    alt={user?.name || "Student"}
                    className="relative h-60 w-48 sm:h-64 sm:w-52 object-cover rounded-2xl border-4 border-[#021C4F] shadow-md mx-auto"
                  />
                </div>
                <h2 className="font-mono text-xl sm:text-2xl font-black text-[#021C4F]">
                  Welcome back, {user?.name || "Student"}! 👋
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-[#475569] font-medium max-w-md">
                  {yearLabel} · {semesterLabel} · B.Sc. Computer Science
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs font-mono font-bold">
                  <span className="rounded-full bg-[#021C4F] text-amber-300 px-3 py-1 shadow-xs border border-amber-400/40">
                    Roll No: {user?.rollNumber || "24E2901"}
                  </span>
                  {user?.section && (
                    <span className="rounded-full bg-[#0D9488] text-white px-3 py-1 shadow-xs">
                      Section {user.section}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              /* Standard Banner for Students without Profile Photo */
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#011337] via-[#021C4F] to-[#7F011F] p-6 sm:p-8 text-white shadow-lg border-2 border-amber-400/40">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="space-y-3 max-w-xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 text-slate-950 px-3 py-1 text-[11px] font-black uppercase tracking-widest shadow-md">
                        🎓 Student Dashboard
                      </span>
                      {isAdmin && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-500 text-white px-3 py-1 text-[11px] font-black uppercase tracking-widest shadow-md animate-pulse">
                          ⚡ Portal Admin
                        </span>
                      )}
                    </div>
                    <h1 className="font-sans text-2xl sm:text-3xl font-extrabold text-white">
                      Welcome back, {user?.name || "Student"}! 👋
                    </h1>
                    <p className="text-xs sm:text-sm text-teal-100 font-medium leading-relaxed">
                      Department of Computer Science — Dwaraka Doss Goverdhan Doss Vaishnav College
                    </p>

                    {/* Personal CS Quote */}
                    <div className="mt-3 rounded-xl bg-black/30 backdrop-blur-md p-3.5 border border-white/20 text-xs italic text-amber-200">
                      &quot;{studentQuote}&quot;
                    </div>
                  </div>

                  {/* Student Details Card */}
                  <div className="rounded-xl bg-white/10 backdrop-blur-md p-4 border border-white/20 shrink-0 text-left w-full md:w-auto md:min-w-[240px]">
                    <p className="text-[11px] uppercase font-extrabold tracking-wider text-white border-b border-white/20 pb-1 mb-2">
                      Student Information
                    </p>
                    <div className="space-y-2 text-xs text-white">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-slate-200 font-semibold">Roll Number:</span>
                        <span className="font-bold bg-white/20 px-2 py-0.5 rounded text-[11px] text-white">
                          {user?.rollNumber || "24E2901"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-slate-200 font-semibold">Department:</span>
                        <span className="font-bold text-white">Computer Science</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-slate-200 font-semibold">Year &amp; Sem:</span>
                        <span className="font-bold text-white">
                          {yearLabel} · Semester 1
                        </span>
                      </div>
                      {user?.section && (
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-slate-200 font-semibold">Section:</span>
                          <span className="font-bold text-white">Section {user.section}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Top-Right CIA Examination Notification Card */}
          <div className="shrink-0 w-full lg:w-auto self-stretch lg:self-start">
            <CiaExamNotificationCard studentYear={user?.year || 1} />
          </div>
        </div>

        {/* Birthday Countdown Notification Card */}
        <div className="mb-6">
          <BirthdayWishCard user={user} />
        </div>

        {/* ── Redesigned Academic Options Header & Category Filters ── */}
        <div className="mb-6 rounded-3xl bg-gradient-to-r from-[#011337] via-[#021C4F] to-[#580017] p-6 sm:p-7 border-2 border-amber-400/40 shadow-xl text-white transition-all">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 text-slate-950 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-md">
                  <FiLayers size={12} className="text-slate-950" /> Academic Hub
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 text-amber-300 border border-white/20 px-2.5 py-0.5 text-[10px] font-bold backdrop-blur-md">
                  <FiZap size={11} className="text-amber-400 animate-pulse" /> 8 Modules Available
                </span>
              </div>
              <h2 className="font-sans text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                Academic Options
              </h2>
              <p className="text-xs sm:text-sm text-teal-100/90 font-medium leading-relaxed max-w-xl">
                Access subject video lectures, PDF notes, previous university &amp; internal CIA question papers, placement drives &amp; AI planners.
              </p>
            </div>

            {/* Study Timer Activation Button */}
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("activate-focus-timer", { detail: { duration: 25 } }))}
              className="group relative overflow-hidden flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#C50337] via-[#A0022B] to-[#7F011F] px-5 py-3 text-xs font-black text-white shadow-lg hover:shadow-2xl hover:scale-[1.03] active:scale-[0.98] transition-all font-heading border-2 border-amber-400/50 cursor-pointer shrink-0"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-400 text-slate-950 shadow-md text-sm font-extrabold group-hover:rotate-12 transition-transform">
                ⚡
              </span>
              <div className="text-left">
                <span className="block text-[11px] font-black uppercase tracking-wider text-amber-300">Focus Mode</span>
                <span className="block text-xs font-extrabold text-white">25-Min Study Timer</span>
              </div>
            </button>
          </div>

          {/* Category Navigation Pills */}
          <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none w-full sm:w-auto">
              {CATEGORY_TABS.map((tab) => {
                const isActive = activeCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategory(tab.id)}
                    className={`relative flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? "bg-gradient-to-r from-[#C50337] to-[#7F011F] text-white shadow-lg ring-2 ring-amber-400/50"
                        : "bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                        isActive
                          ? "bg-amber-400 text-slate-950"
                          : "bg-black/30 text-amber-300"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            <span className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-amber-300/80">
              <FiFilter size={13} /> Interactive Hub View
            </span>
          </div>
        </div>

        {/* ── Ultra-Premium Academic Option Cards Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {optionsToRender.map((option, idx) => {
            const IconComponent = option.icon;
            const indexFormatted = String(idx + 1).padStart(2, "0");

            return (
              <motion.button
                key={option.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, type: "spring", stiffness: 280, damping: 22 }}
                whileHover={{ y: -7, scale: 1.025 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => (option.isExternal ? window.open(option.href, "_blank") : navigate(option.to))}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl ${option.cardBgGradient} p-5 shadow-lg transition-all duration-300 text-left cursor-pointer`}
              >
                {/* Glossy Top Accent Bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-amber-200 to-amber-400 opacity-90 group-hover:h-2 transition-all duration-300" />

                {/* Glass Light Overlay on Hover */}
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div>
                  {/* Top Row: Icon + Watermark & Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`relative flex h-13 w-13 items-center justify-center rounded-2xl ${
                        option.emblemGradient || "bg-gradient-to-tr from-[#011337] via-[#021C4F] to-[#7F011F]"
                      } p-1 shadow-lg ring-2 ring-amber-400/60 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shrink-0`}
                    >
                      {/* Glossy inner container */}
                      <div className="flex h-full w-full items-center justify-center rounded-xl bg-black/35 backdrop-blur-xs">
                        <IconComponent size={24} className={option.iconColor || "text-amber-300"} />
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="font-mono text-xs font-black text-amber-300/80 tracking-widest drop-shadow-xs">
                        #{indexFormatted}
                      </span>
                      <span className="rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 shadow-md">
                        {option.badge}
                      </span>
                    </div>
                  </div>

                  {/* Option Title */}
                  <h3 className="font-sans text-base font-extrabold text-white leading-snug group-hover:text-amber-300 transition-colors drop-shadow-xs">
                    {option.label}
                  </h3>

                  {/* Option Description */}
                  <p className="mt-2 text-xs text-slate-200 font-medium leading-relaxed line-clamp-3">
                    {option.desc}
                  </p>
                </div>

                {/* Bottom Action Bar */}
                <div className="mt-5 pt-3.5 border-t border-white/20 flex items-center justify-between text-xs font-black text-amber-300 group-hover:text-white transition-colors">
                  <span className="inline-flex items-center gap-1 text-[11px] tracking-wide uppercase font-black">
                    {option.isExternal ? "Launch Portal" : "Explore Section"}
                  </span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20 text-white group-hover:bg-amber-400 group-hover:text-slate-950 transition-all duration-300 shadow-sm">
                    {option.isExternal ? (
                      <FiExternalLink size={13} className="transition-transform group-hover:scale-110" />
                    ) : (
                      <FiArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* ── Interactive CS Knowledge Graph ── */}
        <div className="mt-10">
          <InteractiveKnowledgeGraph />
        </div>

        {/* CS Academic Portal Project Feedback Options */}
        {isAdmin ? (
          /* ADMIN VIEW (24E3006): View Feedback Responses ONLY */
          <div className="mt-12 rounded-3xl bg-gradient-to-r from-[#021C4F] via-[#0A369D] to-[#C50337] p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 text-slate-950 px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-md">
                  <FiShield size={13} /> Admin Exclusive Access (24E3006)
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-2">
                  View Student Feedback Responses
                </h2>
                <p className="text-xs text-amber-100 mt-1 max-w-xl font-medium leading-relaxed">
                  As the portal Administrator, inspect all submitted student &amp; faculty feedback responses, ratings, choices, and recommendations.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAdminFeedbackOpen(true)}
                className="shrink-0 flex items-center gap-2 rounded-2xl bg-amber-400 text-slate-950 hover:bg-amber-300 px-6 py-3.5 text-xs font-black shadow-lg transition-all transform hover:scale-105 cursor-pointer border border-amber-300"
              >
                <FiEye size={18} />
                <span>View Feedback Responses</span>
              </button>
            </div>
          </div>
        ) : (
          /* STUDENT VIEW: Submit Student Feedback to Admin */
          <div className="mt-12 rounded-3xl bg-gradient-to-r from-[#021C4F] via-[#0A369D] to-[#C50337] p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/20 pb-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-amber-300">
                    <FiEdit3 size={13} /> Student Feedback Portal
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                    Student Feedback Form
                  </h2>
                  <p className="text-xs text-white/80 mt-0.5">
                    Submit your feedback directly to the Admin (24E3006) to help improve the CS Academic Portal.
                  </p>
                </div>
              </div>

              {/* Student Feedback Button Card */}
              <div className="bg-white/10 p-6 rounded-2xl border border-white/20 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#021C4F] shadow-md shrink-0 font-bold">
                    <FiUserCheck size={24} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-white">Student Feedback Form</h3>
                    <p className="text-xs text-white/80 mt-0.5">
                      Rate lecture notes, question papers, E-content &amp; AI assistant. Responses go straight to Admin (24E3006).
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsFeedbackOpen(true)}
                  className="shrink-0 flex items-center gap-2 rounded-2xl bg-white text-[#021C4F] hover:bg-amber-300 hover:text-slate-900 px-6 py-3 text-xs font-black shadow-md transition-all transform hover:scale-105 cursor-pointer"
                >
                  <FiEdit3 size={16} />
                  <span>Open Student Feedback Form</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Student Feedback Modal */}
        <ProjectFeedbackModal
          isOpen={isFeedbackOpen}
          onClose={() => setIsFeedbackOpen(false)}
          defaultType="student"
          user={user}
        />

        {/* Admin Feedback Modal for 24E3006 */}
        <AdminFeedbackModal
          isOpen={isAdminFeedbackOpen}
          onClose={() => setIsAdminFeedbackOpen(false)}
        />

        {/* Department Footer Info */}
        <div className="mt-12 rounded-xl bg-white p-4 text-center border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-[#021C4F]">
            Dwaraka Doss Goverdhan Doss Vaishnav College (Autonomous)
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Department of Computer Science · Affiliated to University of Madras · NAAC A++ Accredited
          </p>
        </div>
      </motion.div>
    </div>
  );
}
