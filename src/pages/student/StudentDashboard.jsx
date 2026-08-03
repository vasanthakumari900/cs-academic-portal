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
} from "react-icons/fi";
import CiaExamNotificationCard from "../../components/dashboard/CiaExamNotificationCard";
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
  },
  {
    label: "Notes",
    icon: FiFileText,
    to: "/student/notes",
    badge: "PDF Notes",
    desc: "Unit-wise lecture notes & downloadable study materials.",
    color: "#C50337",
  },
  {
    label: "Previous Year Question Papers",
    icon: FiGrid,
    to: "/student/question-papers",
    badge: "Semester Exams",
    desc: "Browse & download past university question papers.",
    color: "#021C4F",
  },
  {
    label: "CIA Question Papers",
    icon: FiAward,
    to: "/student/cia-question-papers",
    badge: "Internal Assessment",
    desc: "Continuous Internal Assessment (CIA 1 & CIA 2) papers.",
    color: "#C50337",
  },
  {
    label: "Placement Details",
    icon: FiBriefcase,
    to: "/student/placements",
    badge: "Career Drives",
    desc: "Placement updates, company eligibility & mock aptitude.",
    color: "#021C4F",
  },
  {
    label: "Vaishnav LMS Portal",
    icon: FiExternalLink,
    href: "https://dgvc.in/lms/login.php",
    isExternal: true,
    badge: "Official LMS",
    desc: "Access the official Vaishnav Learning Management System portal.",
    color: "#C50337",
  },
];

export default function StudentDashboard() {
  const { user } = useAuth();
  useActivityTracker("Student Dashboard");
  const navigate = useNavigate();

  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isAdminFeedbackOpen, setIsAdminFeedbackOpen] = useState(false);

  const isAdmin = user?.rollNumber === "24E3006" || user?.role === "admin" || user?.type === "admin";
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
    <div className="mx-auto min-h-[80vh] max-w-6xl px-4 py-8 sm:px-6 lg:px-8 bg-[#F8FAFC]">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Top Header Grid: Banner on Left + CIA Notification Card on Top-Right */}
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

                <h1 className="font-sans text-2xl sm:text-3xl font-extrabold text-[#021C4F] tracking-wider uppercase">
                  {user?.name || "STUDENT"}
                </h1>

                <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                  {user?.adminBadge && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C50337] px-4 py-1 text-xs font-bold text-white shadow-sm tracking-wider uppercase">
                      <FiShield size={13} /> {user.adminBadge}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#021C4F]/10 border border-[#021C4F]/20 px-3.5 py-1 text-xs font-bold text-[#021C4F]">
                    Roll No: {user?.rollNumber}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3.5 py-1 text-xs font-bold text-[#021C4F] border border-slate-200">
                    Department of Computer Science · {user?.section ? `Sec ${user.section}` : "Sec B"} · {yearLabel} · {semesterLabel}
                  </span>
                </div>

                {/* CS Quote for Student */}
                <div className="mt-5 max-w-xl rounded-xl bg-[#F8FAFC] border border-slate-200 p-3.5 text-center">
                  <p className="text-xs font-medium text-slate-700 italic">
                    “{studentQuote.text}”
                  </p>
                  <p className="text-[11px] font-bold text-[#C50337] mt-1">
                    — {studentQuote.author}
                  </p>
                </div>
              </div>
            ) : (
              /* Student Information Banner for all Students */
              <div className="relative overflow-hidden rounded-2xl bg-[#021C4F] p-6 sm:p-8 text-white shadow-md border border-[#021C4F]">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white border border-white/20 mb-3">
                      <FiCheckCircle size={13} className="text-[#C50337]" />
                      DDGDVC Student Academic Portal
                    </div>
                    <h1 className="font-sans text-2xl sm:text-3xl font-black text-white tracking-tight">
                      Welcome back, {user?.name || "Student"}!
                    </h1>

                    {/* Individual Computer Science Quote */}
                    <div className="mt-3 max-w-xl rounded-xl bg-white/10 backdrop-blur-md p-3.5 border border-white/20">
                      <div className="flex items-start gap-2">
                        <FiMessageSquare size={16} className="text-[#C50337] shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-slate-100 italic leading-relaxed">
                            “{studentQuote.text}”
                          </p>
                          <p className="text-[11px] font-bold text-[#C50337] mt-1">
                            — {studentQuote.author}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Student Information Summary Card */}
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

          {/* Top-Right CIA Notification Card */}
          <div className="shrink-0 w-full lg:w-auto self-stretch lg:self-start">
            <CiaExamNotificationCard studentYear={user?.year || 1} />
          </div>
        </div>

        {/* Options Section directly down to Student Information */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-sans text-xl font-bold text-[#021C4F]">Academic Options</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Select an option below to access course content
            </p>
          </div>
        </div>

        {/* Options Grid directly down to Student Information */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {optionsToRender.map((option, idx) => {
            const IconComponent = option.icon;
            const isRed = option.color === "#C50337";
            return (
              <motion.button
                key={option.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06, type: "spring", stiffness: 260, damping: 20 }}
                whileHover={{ y: -6, scale: 1.02, boxShadow: "0 16px 32px -8px rgba(2, 28, 79, 0.12)" }}
                whileTap={{ scale: 0.96 }}
                onClick={() => (option.isExternal ? window.open(option.href, "_blank") : navigate(option.to))}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-slate-200 p-6 shadow-sm transition-all duration-300 hover:border-[#C50337] text-left"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-sm transition-transform duration-200 group-hover:scale-105 ${
                        isRed ? "bg-[#C50337]" : "bg-[#021C4F]"
                      }`}
                    >
                      <IconComponent size={22} />
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold border ${
                        isRed
                          ? "bg-[#C50337]/10 text-[#C50337] border-[#C50337]/20"
                          : "bg-[#021C4F]/10 text-[#021C4F] border-[#021C4F]/20"
                      }`}
                    >
                      {option.badge}
                    </span>
                  </div>

                  <h3
                    className={`font-sans text-base font-bold transition-colors leading-snug ${
                      isRed ? "text-[#C50337]" : "text-[#021C4F]"
                    }`}
                  >
                    {option.label}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                    {option.desc}
                  </p>
                </div>

                <div
                  className={`mt-5 flex items-center gap-1.5 text-xs font-bold transition-colors pt-3 border-t border-slate-100 ${
                    isRed ? "text-[#C50337]" : "text-[#021C4F]"
                  }`}
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

        {/* CS Academic Portal Project Feedback Options (Down on Student Dashboard) */}
        {isAdmin ? (
          /* ADMIN VIEW (24E3006): View Feedback Responses */
          <div className="mt-12 rounded-3xl bg-gradient-to-r from-[#021C4F] via-[#0A369D] to-[#C50337] p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-amber-300">
                  <FiShield size={13} /> Admin Exclusive Access (24E3006)
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-2">
                  View Student Feedback Responses
                </h2>
                <p className="text-xs text-white/80 mt-1 max-w-xl leading-relaxed">
                  As the portal Administrator, inspect all submitted student feedback responses, ratings, choices, and recommendations.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAdminFeedbackOpen(true)}
                className="shrink-0 flex items-center gap-2 rounded-2xl bg-white text-[#021C4F] hover:bg-amber-300 hover:text-slate-900 px-6 py-3.5 text-xs font-black shadow-lg transition-all transform hover:scale-105"
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
                      Rate lecture notes, question papers, E-content &amp; AI assistant. Responses go straight to Admin.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsFeedbackOpen(true)}
                  className="shrink-0 flex items-center gap-2 rounded-2xl bg-white text-[#021C4F] hover:bg-amber-300 hover:text-slate-900 px-6 py-3 text-xs font-black shadow-md transition-all transform hover:scale-105"
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
