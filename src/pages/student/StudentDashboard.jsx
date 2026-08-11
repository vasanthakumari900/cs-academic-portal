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
} from "react-icons/fi";
import CiaExamNotificationCard from "../../components/dashboard/CiaExamNotificationCard";
import BirthdayWishCard from "../../components/dashboard/BirthdayWishCard";
import ProjectFeedbackModal from "../../components/feedback/ProjectFeedbackModal";
import AdminFeedbackModal from "../../components/admin/AdminFeedbackModal";
import useActivityTracker from "../../hooks/useActivityTracker";

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

const STUDENT_OPTIONS = [
  {
    label: "Video Lectures",
    icon: FiPlayCircle,
    to: "/student/videos",
    badge: "E-Content",
    desc: "Watch subject-wise video lectures, playlists & tutorials.",
    color: "#021C4F",
    emblemGradient: "bg-gradient-to-tr from-[#011337] via-[#021C4F] to-[#7F011F]",
    iconColor: "text-amber-400 drop-shadow-xs",
  },
  {
    label: "Notes",
    icon: FiBookOpen,
    to: "/student/notes",
    badge: "PDF Notes",
    desc: "Unit-wise lecture notes & downloadable study materials.",
    color: "#C50337",
    emblemGradient: "bg-gradient-to-tr from-[#7F011F] via-[#C50337] to-[#A0022B]",
    iconColor: "text-amber-300 drop-shadow-xs",
  },
  {
    label: "Previous Year Question Papers",
    icon: FiAward,
    to: "/student/question-papers",
    badge: "Semester Exams",
    desc: "Browse & download past university question papers.",
    color: "#021C4F",
    emblemGradient: "bg-gradient-to-tr from-[#011337] via-[#021C4F] to-[#0A369D]",
    iconColor: "text-amber-400 drop-shadow-xs",
  },
  {
    label: "CIA Question Papers",
    icon: FiCheckCircle,
    to: "/student/cia-question-papers",
    badge: "Internal Assessment",
    desc: "Continuous Internal Assessment (CIA 1 & CIA 2) papers.",
    color: "#C50337",
    emblemGradient: "bg-gradient-to-tr from-[#C50337] via-[#A0022B] to-[#7F011F]",
    iconColor: "text-amber-300 drop-shadow-xs",
  },
  {
    label: "Placement Details",
    icon: FiBriefcase,
    to: "/student/placements",
    badge: "Career Drives",
    desc: "Placement updates, company eligibility & mock aptitude.",
    color: "#7F011F",
    emblemGradient: "bg-gradient-to-tr from-[#580017] via-[#8B0024] to-[#C50337]",
    iconColor: "text-amber-300 drop-shadow-xs",
  },
  {
    label: "Smart AI Exam Study Planner & Countdown",
    icon: FiCalendar,
    to: "/student/exam-study-planner",
    badge: "AI Study Planner",
    desc: "Calculate unit revision timetables & track daily exam prep progress.",
    color: "#021C4F",
    emblemGradient: "bg-gradient-to-tr from-[#0D9488] via-[#0F766E] to-[#115E59]",
    iconColor: "text-amber-400 drop-shadow-xs",
  },
  {
    label: "Vaishnav LMS Portal",
    icon: FiExternalLink,
    href: "https://dgvc.in/lms/login.php",
    isExternal: true,
    badge: "Official LMS",
    desc: "Access the official Vaishnav Learning Management System portal.",
    color: "#C50337",
    emblemGradient: "bg-gradient-to-tr from-[#7F011F] via-[#C50337] to-[#990000]",
    iconColor: "text-amber-300 drop-shadow-xs",
  },
];

export default function StudentDashboard() {
  const { user } = useAuth();
  useActivityTracker("Student Dashboard");
  const navigate = useNavigate();

  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isAdminFeedbackOpen, setIsAdminFeedbackOpen] = useState(false);

  const isAdmin = user?.rollNumber === "24E3006" || user?.rollNumber === "24E3013" || user?.role === "admin" || user?.type === "admin" || Boolean(user?.adminBadge);
  const hasPhoto = Boolean(user?.photoUrl);
  const photoPath = user?.photoUrl || "/admin_photo.jpg";

  const optionsToRender = STUDENT_OPTIONS;

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

        {/* Options Section Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-sans text-xl font-extrabold text-[#021C4F]">Academic Options</h2>
            <p className="mt-0.5 text-xs text-[#475569] font-medium">
              Select an option below to access course content
            </p>
          </div>
        </div>

        {/* Options Grid with High Contrast Readable Cards */}
        <div className="card-grid">
          {optionsToRender.map((option, idx) => {
            const IconComponent = option.icon;
            return (
              <motion.button
                key={option.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06, type: "spring", stiffness: 260, damping: 20 }}
                whileHover={{ y: -6, scale: 1.02, boxShadow: "0 16px 32px -8px rgba(2, 28, 79, 0.12)" }}
                whileTap={{ scale: 0.96 }}
                onClick={() => (option.isExternal ? window.open(option.href, "_blank") : navigate(option.to))}
                style={{ padding: 'var(--fluid-pad-card)' }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white border-2 border-slate-200 shadow-md transition-all duration-300 hover:border-[#021C4F] text-left"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      style={{ height:'var(--fluid-icon-lg)', width:'var(--fluid-icon-lg)' }}
                      className={`flex items-center justify-center rounded-2xl ${
                        option.emblemGradient || "bg-gradient-to-tr from-[#011337] via-[#021C4F] to-[#7F011F]"
                      } p-1 shadow-md ring-2 ring-amber-400/40 transition-transform duration-300 group-hover:scale-110 shrink-0`}
                    >
                      <div className="flex h-full w-full items-center justify-center rounded-xl bg-black/25 backdrop-blur-xs">
                        <IconComponent size={24} className={option.iconColor || "text-amber-300"} />
                      </div>
                    </div>

                    <span
                      className="rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider border shadow-2xs bg-teal-50 text-[#0F766E] border-teal-200"
                    >
                      {option.badge}
                    </span>
                  </div>

                  <h3
                    className="font-sans text-base font-bold text-[#021C4F] transition-colors leading-snug group-hover:text-[#0D9488]"
                  >
                    {option.label}
                  </h3>
                  <p className="mt-1.5 text-xs text-[#334155] font-medium leading-relaxed">
                    {option.desc}
                  </p>
                </div>

                <div
                  className="mt-5 flex items-center gap-1.5 text-xs font-extrabold text-[#021C4F] transition-colors pt-3 border-t border-slate-100 group-hover:text-[#0D9488]"
                >
                  <span>Open Section</span>
                  <FiChevronRight
                    size={14}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </div>
              </motion.button>
            );
          })}
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
