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
} from "react-icons/fi";
import CiaExamNotificationCard from "../../components/dashboard/CiaExamNotificationCard";
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
];

export default function StudentDashboard() {
  const { user } = useAuth();
  useActivityTracker("Student Dashboard");
  const navigate = useNavigate();

  const isAdmin = user?.rollNumber === "24E3006" || user?.role === "admin" || user?.type === "admin";
  const is24E3006 = user?.rollNumber === "24E3006" || Boolean(user?.photoUrl);
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
            {is24E3006 ? (
              /* Profile Photo Banner for Tharun B S (24E3006) */
              <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="relative mb-4">
                  <div className="absolute -inset-1.5 rounded-2xl bg-[#021C4F]/20 blur-sm" />
                  <img
                    src={photoPath}
                    alt={user?.name || "THARUN B S"}
                    className="relative h-60 w-48 sm:h-64 sm:w-52 object-cover rounded-2xl border-4 border-[#021C4F] shadow-md mx-auto"
                    onError={(e) => {
                      e.target.src = "/admin_photo.jpg";
                    }}
                  />
                </div>

                <h1 className="font-sans text-2xl sm:text-3xl font-extrabold text-[#021C4F] tracking-wider uppercase">
                  {user?.name || "THARUN B S"}
                </h1>

                <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C50337] px-4 py-1 text-xs font-bold text-white shadow-sm tracking-wider uppercase">
                    <FiShield size={13} /> {user?.adminBadge || "ADMIN"}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#021C4F]/10 border border-[#021C4F]/20 px-3.5 py-1 text-xs font-bold text-[#021C4F]">
                    Roll No: {user?.rollNumber || "24E3006"}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3.5 py-1 text-xs font-bold text-[#021C4F] border border-slate-200">
                    Department of Computer Science · {user?.section ? `Sec ${user.section}` : "Sec B"} · {yearLabel} · {semesterLabel}
                  </span>
                </div>

                {/* CS Quote for Tharun B S */}
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
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(option.to)}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-slate-200 p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-[#C50337] text-left"
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
