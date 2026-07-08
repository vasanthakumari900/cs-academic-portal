// src/pages/QuestionPapers.jsx
// Question Papers — UG/PG → Year → Subject drill-down flow with curriculum-aligned subjects
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiFileText, FiDownload, FiEye, FiGrid, FiBookOpen,
  FiUser, FiCalendar, FiSearch, FiAward, FiArrowLeft,
  FiChevronRight, FiMonitor, FiLayers,
} from "react-icons/fi";
import { FACULTY_NAMES } from "../utils/constants";
import { generateQuestionPaperPdf } from "../utils/pdfGenerator";
import { useAuth } from "../context/AuthContext";

// ─── Curriculum Data (mirrors EContent) ───
const CURRICULUM = {
  1: {
    label: "1st Year",
    icon: "Ⅰ",
    semesters: {
      1: {
        label: "Semester 1",
        subjects: [
          "FUNDAMENTALS OF PYTHON PROGRAMMING",
          "FUNDAMENTALS OF DIGITAL ELECTRONICS",
          "MATHEMATICS PAPER - I",
          "TAMIL",
          "ENGLISH",
        ],
      },
      2: {
        label: "Semester 2",
        subjects: [
          "OBJECT ORIENTED PROGRAMMING USING C++",
          "DATA STRUCTURES",
          "MATHEMATICS PAPER - II",
          "TAMIL",
          "ENGLISH",
        ],
      },
    },
  },
  2: {
    label: "2nd Year",
    icon: "Ⅱ",
    semesters: {
      1: {
        label: "Semester 1",
        subjects: [
          "JAVA PROGRAMMING",
          "WEB TECHNOLOGY",
          "STATISTICAL METHODS FOR COMPUTER SCIENCE - I",
          "TAMIL",
          "ENGLISH",
        ],
      },
      2: {
        label: "Semester 2",
        subjects: [
          "ANDROID APP DEVELOPMENT",
          "SOFTWARE ENGINEERING",
          "STATISTICAL METHODS FOR COMPUTER SCIENCE - II",
          "TAMIL",
          "ENGLISH",
        ],
      },
    },
  },
  3: {
    label: "3rd Year",
    icon: "Ⅲ",
    semesters: {
      1: {
        label: "Semester 1",
        subjects: [
          "OPERATING SYSTEM",
          "DATA MINING TECHNIQUES",
          "ASP.NET",
          "DATABASE MANAGEMENT SYSTEM",
        ],
      },
      2: {
        label: "Semester 2",
        subjects: [],
      },
    },
  },
};

// Combine all subjects across semesters for a given year
function getSubjectsForYear(year) {
  const yr = CURRICULUM[year];
  if (!yr) return [];
  const all = [];
  Object.values(yr.semesters).forEach((sem) => {
    sem.subjects.forEach((s) => {
      if (!all.includes(s)) all.push(s);
    });
  });
  return all;
}

// ─── Color palettes per year ───
const yearStyles = {
  1: {
    gradient: "from-emerald-500 to-teal-600",
    lightGradient: "from-emerald-50 to-teal-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    badge: "bg-emerald-100 text-emerald-800",
    accent: "bg-emerald-500",
    glow: "shadow-emerald-200/30",
  },
  2: {
    gradient: "from-violet-500 to-purple-600",
    lightGradient: "from-violet-50 to-purple-50",
    border: "border-violet-200",
    text: "text-violet-700",
    badge: "bg-violet-100 text-violet-800",
    accent: "bg-violet-500",
    glow: "shadow-violet-200/30",
  },
  3: {
    gradient: "from-amber-500 to-orange-600",
    lightGradient: "from-amber-50 to-orange-50",
    border: "border-amber-200",
    text: "text-amber-700",
    badge: "bg-amber-100 text-amber-800",
    accent: "bg-amber-500",
    glow: "shadow-amber-200/30",
  },
};

const subjectColors = [
  { from: "from-blue-500", to: "to-indigo-600", badge: "bg-blue-100 text-blue-800" },
  { from: "from-rose-500", to: "to-pink-600", badge: "bg-rose-100 text-rose-800" },
  { from: "from-cyan-500", to: "to-sky-600", badge: "bg-cyan-100 text-cyan-800" },
  { from: "from-amber-500", to: "to-yellow-600", badge: "bg-amber-100 text-amber-800" },
  { from: "from-lime-500", to: "to-green-600", badge: "bg-lime-100 text-lime-800" },
];

const FACULTY_MAP = {
  "OPERATING SYSTEM": "DR DHARANI",
  "DATA MINING TECHNIQUES": "V PONNILA",
  "ASP.NET": "R SARANYA",
  "DATABASE MANAGEMENT SYSTEM": "M P SUDHA",
};

function getFacultyName(subject) {
  const upper = subject.toUpperCase();
  if (upper.includes("DBMS") || upper.includes("DATABASE")) return FACULTY_NAMES.DBMS;
  if (upper.includes("ASP") || upper.includes(".NET")) return FACULTY_NAMES.ASPNET;
  if (upper.includes("OPERATING") || upper.includes("OS")) return FACULTY_NAMES.OS;
  if (upper.includes("DMT") || upper.includes("DATA MINING")) return FACULTY_NAMES.DMT;
  return null;
}

const allPapers = [];

function downloadPaperPdf(paper) {
  const pdfData = generateQuestionPaperPdf(paper);
  const link = document.createElement("a");
  link.href = pdfData;
  link.download = `${paper.title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function formatCount(n) {
  if (!n) return "0";
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n;
}

const COURSE_OPTIONS = [
  { value: "ug", label: "UG", desc: "Bachelor of Science in Computer Science (B.Sc.)" },
  { value: "pg", label: "PG", desc: "Master of Science in Computer Science (M.Sc.)" },
];

export default function QuestionPapers() {
  const [courseType, setCourseType] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const [previewing, setPreviewing] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();

  const yearSubjects = selectedYear ? getSubjectsForYear(selectedYear) : [];
  const ys = selectedYear ? yearStyles[selectedYear] : yearStyles[1];

  // Filter papers by selected subject
  const overridePapers = allPapers.map((p) => ({
    ...p,
    facultyName: getFacultyName(p.subject) || p.facultyName,
  }));

  const filtered = overridePapers.filter((p) => {
    if (selectedSubject) {
      const subjLower = selectedSubject.toLowerCase();
      const noteSubjLower = p.subject.toLowerCase();
      const words = subjLower.split(/\s+/);
      const match = words.some((w) => noteSubjLower.includes(w));
      if (!match) return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.subject.toLowerCase().includes(q) || p.facultyName.toLowerCase().includes(q);
    }
    return true;
  });

  const paperYears = [...new Set(allPapers.map((p) => p.year))].sort().reverse();

  // ─── Step 0: UG/PG Selection ───
  if (!courseType) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-premium">
            <FiAward size={32} />
          </div>
          <h1 className="font-display text-3xl font-bold text-gray-900">Question Papers</h1>
          <p className="mt-1 text-sm text-gray-400">Select your course to browse previous year exam papers</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {COURSE_OPTIONS.map((course, i) => (
            <motion.button
              key={course.value}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setCourseType(course.value)}
              className={`group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-soft hover:shadow-premium transition-all ${
                course.value === "ug" ? "hover:border-emerald-200" : "hover:border-purple-300"
              }`}
            >
              <div className={`absolute inset-0 ${course.value === "ug" ? "bg-gradient-to-br from-emerald-50 to-teal-50" : "bg-gradient-to-br from-purple-50 to-violet-50"} opacity-40 group-hover:opacity-70 transition-opacity`} />
              <div className="relative">
                <div className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${
                  course.value === "ug" ? "from-emerald-500 to-teal-600" : "from-purple-500 to-violet-600"
                } text-2xl font-bold text-white shadow-lg`}>
                  {course.value === "ug" ? "UG" : "PG"}
                </div>
                <h2 className={`text-xl font-bold ${
                  course.value === "ug" ? "text-emerald-700" : "text-violet-700"
                }`}>
                  {course.label}
                </h2>
                <p className="mt-1 text-xs text-gray-400 leading-relaxed max-w-xs mx-auto">
                  {course.desc}
                </p>
              </div>
              <div className={`absolute bottom-0 left-0 right-0 h-1 ${
                course.value === "ug" ? "bg-emerald-500" : "bg-violet-500"
              } scale-x-0 group-hover:scale-x-100 transition-transform origin-left`} />
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  // ─── Step 1: Year Selection ───
  if (!selectedYear) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => { setCourseType(null); setSelectedYear(null); setSelectedSubject(null); }}
          className="mb-6 inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-all"
        >
          <FiArrowLeft size={14} /> Back to Course Selection
        </motion.button>

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-lg">
            <FiMonitor size={26} />
          </div>
          <h1 className="font-display text-2xl font-bold text-gray-900">
            {courseType.toUpperCase()} — Select Year
          </h1>
          <p className="mt-1 text-sm text-gray-400">Choose your academic year</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {[1, 2, 3].map((year, i) => {
            const s = yearStyles[year];
            const subjects = getSubjectsForYear(year);
            return (
              <motion.button
                key={year}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedYear(year)}
                className={`group relative overflow-hidden rounded-2xl border ${s.border} bg-white p-8 text-center shadow-soft ${s.glow} hover:shadow-premium transition-all`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${s.lightGradient} opacity-50 group-hover:opacity-80 transition-opacity`} />
                <div className="relative">
                  <div className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${s.gradient} text-2xl font-bold text-white shadow-lg`}>
                    {CURRICULUM[year].icon}
                  </div>
                  <h2 className={`text-xl font-bold ${s.text}`}>{CURRICULUM[year].label}</h2>
                  <p className="mt-1 text-xs text-gray-400">{subjects.length} subjects</p>
                </div>
                <div className={`absolute bottom-0 left-0 right-0 h-1 ${s.accent} scale-x-0 group-hover:scale-x-100 transition-transform origin-left`} />
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── Step 2: Subject Selection ───
  if (!selectedSubject) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedYear(null)}
          className="mb-6 inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-all"
        >
          <FiArrowLeft size={14} /> Back to Years
        </motion.button>

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 text-sm text-gray-400 mb-2">
            <span className="uppercase text-xs font-semibold text-gray-500">{courseType.toUpperCase()}</span>
            <FiChevronRight size={12} />
            <span className={ys.text}>{CURRICULUM[selectedYear].label}</span>
          </div>
          <h1 className={`font-display text-2xl font-bold ${ys.text}`}>Select Subject</h1>
          <p className="mt-1 text-sm text-gray-400">Choose a subject to view its previous year question papers</p>
        </motion.div>

        {yearSubjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white/50 py-20"
          >
            <FiBookOpen size={48} className="mb-3 text-gray-300" />
            <p className="text-sm font-medium text-gray-500">No subjects available</p>
            <p className="mt-1 text-xs text-gray-400">This year's curriculum is being updated</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {yearSubjects.map((subject, i) => {
              const sc = subjectColors[i % subjectColors.length];
              return (
                <motion.button
                  key={subject}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedSubject(subject)}
                  className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 text-left shadow-soft hover:shadow-premium transition-all"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 opacity-50" />
                  <div className="relative flex items-start gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${sc.from} ${sc.to} text-white shadow-md`}>
                      <FiFileText size={20} />
                    </div>
                    <div className="min-w-0 flex-1 pt-1">
                      <h3 className="font-bold text-sm text-gray-900 leading-snug">{subject}</h3>
                      {FACULTY_MAP[subject] && (
                        <p className="mt-0.5 text-[11px] font-semibold tracking-wide text-gray-500">
                          {FACULTY_MAP[subject]}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 rounded-full ${sc.badge} px-2.5 py-0.5 text-[10px] font-semibold`}>
                          <FiAward size={10} /> VIEW PAPERS
                        </span>
                        <FiChevronRight size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors ml-auto" />
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ─── Step 3: Question Papers for Selected Subject ───
  const sc = subjectColors[yearSubjects.indexOf(selectedSubject) % subjectColors.length];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb & Back */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => { setSelectedSubject(null); }}
          className="mb-3 inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-all"
        >
          <FiArrowLeft size={14} /> Back to Subjects
        </motion.button>

        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="uppercase text-[11px] font-semibold text-gray-500">{courseType.toUpperCase()}</span>
          <FiChevronRight size={10} />
          <span className={ys.text}>{CURRICULUM[selectedYear].label}</span>
          <FiChevronRight size={10} />
          <span className="text-gray-700 font-semibold">{selectedSubject}</span>
        </div>
      </motion.div>

      {/* Subject Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-4">
          <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${sc.from} ${sc.to} text-white shadow-lg`}>
            <FiAward size={26} />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-gray-900 sm:text-2xl">{selectedSubject}</h1>
            <p className="text-xs text-gray-400">
              {courseType.toUpperCase()} · {CURRICULUM[selectedYear].label}{" "}
              · {filtered.length} paper{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      {filtered.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {[
            { icon: FiFileText, label: "Total Papers", value: filtered.length, color: "text-blue-600" },
            { icon: FiDownload, label: "Downloads", value: formatCount(filtered.reduce((s, p) => s + (p.downloads || 0), 0)), color: "text-blue-700" },
            { icon: FiCalendar, label: "Exam Years", value: new Set(filtered.map((p) => p.year)).size, color: "text-gray-500" },
            { icon: FiGrid, label: "Subjects", value: new Set(filtered.map((p) => p.subject)).size, color: "text-gray-700" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="premium-card p-3 text-center"
            >
              <s.icon className={`mx-auto mb-1 ${s.color}`} size={20} />
              <p className="font-display text-lg font-bold text-gray-900">{s.value}</p>
              <p className="text-[11px] text-gray-400">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Search */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6 flex flex-wrap gap-3"
      >
        <div className="relative flex-1 min-w-[200px]">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search papers by title, subject…"
            className="input-field !py-2 pl-9 text-sm"
          />
        </div>
      </motion.div>

      {/* Papers Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedSubject + searchQuery}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((paper, i) => (
            <motion.div
              key={paper.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <div className="premium-card-hover group relative flex flex-col gap-3 overflow-hidden p-5">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <FiFileText size={22} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-1 font-display text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{paper.title}</h3>
                    <p className="mt-0.5 flex items-center gap-2 text-[11px] text-gray-400">
                      <span>{paper.subject}</span>
                      <span className="text-gray-300">·</span>
                      <span className="flex items-center gap-1"><FiUser size={10} /> {paper.facultyName}</span>
                    </p>
                  </div>
                </div>
                <p className="line-clamp-2 text-xs text-gray-500">{paper.description}</p>
                <div className="flex flex-wrap gap-2 text-[10px]">
                  {paper.pages && <span className="rounded-md bg-gray-50 px-2 py-0.5 text-gray-500">📄 {paper.pages}p</span>}
                  {paper.downloads && <span className="rounded-md bg-blue-50 px-2 py-0.5 text-blue-700">⬇ {formatCount(paper.downloads)}</span>}
                  <span className="rounded-md bg-blue-50 px-2 py-0.5 text-blue-700">{paper.year}</span>
                  {paper.courseType && <span className="rounded-md bg-gray-100 px-2 py-0.5 text-gray-600">{paper.courseType.toUpperCase()}</span>}
                  <span className="rounded-md bg-gray-50 px-2 py-0.5 text-gray-500">{paper.regulation}</span>
                </div>
                <div className="mt-auto flex gap-2 pt-1">
                  <button
                    onClick={() => setPreviewing(paper)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white py-2 text-xs font-semibold text-gray-600 transition-all hover:border-gray-300 hover:text-gray-800 active:scale-95"
                  >
                    <FiEye size={13} /> Preview
                  </button>
                  <button
                    onClick={() => { setDownloadingId(paper.id); setTimeout(() => { downloadPaperPdf(paper); setDownloadingId(null); }, 400); }}
                    disabled={downloadingId === paper.id}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 py-2 text-xs font-semibold text-white shadow-soft transition-all hover:shadow-premium active:scale-95 disabled:opacity-60"
                  >
                    {downloadingId === paper.id ? (
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    ) : (
                      <><FiDownload size={13} /> Download</>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full flex flex-col items-center py-16 text-gray-400">
              <FiAward size={48} className="mb-3 opacity-30" />
              <p className="text-sm font-medium text-gray-500">No question papers available yet</p>
              <p className="mt-1 text-xs text-gray-400">
                Papers for {selectedSubject} · {courseType.toUpperCase()} · {CURRICULUM[selectedYear].label} will be uploaded soon
              </p>
              <div className="mt-4 rounded-xl bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700">
                Check back later
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4 backdrop-blur-sm"
            onClick={() => setPreviewing(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-premium-lg"
            >
              <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-3">
                <h3 className="truncate text-sm font-semibold text-gray-900">{previewing.title}</h3>
                <button onClick={() => setPreviewing(null)} className="rounded-full bg-white/80 p-1.5 text-gray-500 hover:bg-gray-100">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <div className="flex-1 overflow-auto bg-white p-6">
                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                  <FiFileText size={64} className="mb-4 text-blue-200" />
                  <p className="text-sm font-medium text-gray-700">{previewing.title}</p>
                  <p className="mt-1 text-xs">{previewing.subject} · {previewing.regulation} · {previewing.facultyName}</p>
                  <button
                    onClick={() => { downloadPaperPdf(previewing); setPreviewing(null); }}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-2.5 text-sm font-semibold text-white shadow-premium transition-all hover:shadow-premium-lg active:scale-95"
                  >
                    <FiDownload size={16} /> Download PDF
                  </button>
                </div>
              </div>
              <div className="border-t border-gray-100 px-4 py-2 text-center text-[11px] text-gray-400">
                {previewing.pages && <span>{previewing.pages} pages</span>} · {previewing.subject} · {previewing.year} · {previewing.regulation}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
