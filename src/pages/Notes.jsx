// src/pages/Notes.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiFileText, FiDownload, FiEye, FiUploadCloud, FiBookOpen,
  FiGrid, FiUser, FiCalendar, FiClock, FiFilter, FiSearch,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { SAMPLE_NOTES, SUBJECTS, YEARS, FACULTY_NAMES } from "../utils/constants";
import { generateNotePdf } from "../utils/pdfGenerator";
import { useAuth } from "../context/AuthContext";

const courseTypes = [
  { value: "ug", label: "UG" },
  { value: "pg", label: "PG" },
];

// Map subject codes to faculty names as specified
function getFacultyName(subject) {
  const upper = subject.toUpperCase();
  if (upper.includes("DBMS") || upper.includes("DATABASE")) return FACULTY_NAMES.DBMS;
  if (upper.includes("ASP") || upper.includes(".NET")) return FACULTY_NAMES.ASPNET;
  if (upper.includes("OPERATING") || upper.includes("OS")) return FACULTY_NAMES.OS;
  if (upper.includes("DMT") || upper.includes("DATA MINING")) return FACULTY_NAMES.DMT;
  return null; // use existing
}

const allNotes = [
  ...SAMPLE_NOTES,
  { id: "sn-9", title: "ASP.NET — MVC Architecture", description: "Complete guide to MVC pattern, Razor views, controllers, and routing in ASP.NET Core.", subject: "ASP.NET", semester: 5, facultyName: FACULTY_NAMES.ASPNET, year: 3, pages: 88, downloads: 2100, courseType: "ug" },
  { id: "sn-10", title: "DBMS — Advanced SQL & PL/SQL", description: "Stored procedures, triggers, functions, and cursors in Oracle PL/SQL with examples.", subject: "DBMS", semester: 4, facultyName: FACULTY_NAMES.DBMS, year: 2, pages: 110, downloads: 3200, courseType: "ug" },
  { id: "sn-11", title: "DMT — Data Warehousing Concepts", description: "Star schema, snowflake schema, ETL processes, OLAP cubes, and dimensional modeling.", subject: "DMT", semester: 6, facultyName: FACULTY_NAMES.DMT, year: 3, pages: 72, downloads: 1800, courseType: "pg" },
  { id: "sn-12", title: "OS — Linux Kernel Internals", description: "Process scheduling, memory management, file systems, and device drivers in the Linux kernel.", subject: "OPERATING SYSTEM", semester: 4, facultyName: FACULTY_NAMES.OS, year: 2, pages: 134, downloads: 2500, courseType: "ug" },
];

function downloadNotePdf(note) {
  const pdfData = generateNotePdf(note);
  const link = document.createElement("a");
  link.href = pdfData;
  link.download = `${note.title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function Notes() {
  const [previewing, setPreviewing] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedCourseType, setSelectedCourseType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();

  // Override faculty names for matching subjects
  const overrideNotes = allNotes.map(n => ({
    ...n,
    facultyName: getFacultyName(n.subject) || n.facultyName,
  }));

  const filtered = overrideNotes.filter((n) => {
    if (selectedSubject && n.subject !== selectedSubject) return false;
    if (selectedYear && n.year !== Number(selectedYear)) return false;
    if (selectedCourseType && n.courseType !== selectedCourseType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return n.title.toLowerCase().includes(q) || n.subject.toLowerCase().includes(q) || n.facultyName.toLowerCase().includes(q);
    }
    return true;
  });

  const totalDownloads = filtered.reduce((s, n) => s + (n.downloads || 0), 0);
  const uniqueSubjects = [...new Set(filtered.map((n) => n.subject))];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-soft">
            <FiBookOpen size={22} />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl">Lecture Notes</h1>
            <p className="text-xs text-gray-400">Faculty-curated PDF notes organized by subject</p>
          </div>
        </div>
      </motion.div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        {[
          { icon: FiFileText, label: "Total Notes", value: filtered.length, color: "text-blue-600" },
          { icon: FiDownload, label: "Downloads", value: formatCount(totalDownloads), color: "text-blue-700" },
          { icon: FiGrid, label: "Subjects", value: uniqueSubjects.length, color: "text-gray-500" },
          { icon: FiBookOpen, label: "Total Pages", value: filtered.reduce((s, n) => s + (n.pages || 0), 0), color: "text-gray-700" },
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

      {/* Action Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="mb-6 flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white/80 p-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FiFileText size={18} className="text-blue-600" />
          <span>Access notes by subject, year, and course type</span>
        </div>
        {user && (
          <button onClick={() => toast.success("Upload PDF feature opens here")} className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-2.5 text-xs font-semibold text-white shadow-soft transition-all hover:shadow-premium">
            <FiUploadCloud size={14} /> Upload Notes
          </button>
        )}
      </motion.div>

      {/* Filters */}
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
            placeholder="Search notes by title, subject, faculty…"
            className="input-field !py-2 pl-9 text-sm"
          />
        </div>
        <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="input-field !w-auto !py-2 text-xs">
          <option value="">All Subjects</option>
          {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="input-field !w-auto !py-2 text-xs">
          <option value="">All Years</option>
          {YEARS.map((y) => <option key={y.value} value={y.value}>{y.label}</option>)}
        </select>
        <select value={selectedCourseType} onChange={(e) => setSelectedCourseType(e.target.value)} className="input-field !w-auto !py-2 text-xs">
          <option value="">All Courses</option>
          {courseTypes.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </motion.div>

      {/* Notes Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedSubject + selectedYear + selectedCourseType + searchQuery}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((note, i) => (
            <motion.div
              key={note.id}
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
                    <h3 className="line-clamp-1 font-display text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{note.title}</h3>
                    <p className="mt-0.5 flex items-center gap-2 text-[11px] text-gray-400">
                      <span>{note.subject}</span>
                      <span className="text-gray-300">·</span>
                      <span className="flex items-center gap-1"><FiUser size={10} /> {note.facultyName}</span>
                    </p>
                  </div>
                </div>
                <p className="line-clamp-2 text-xs text-gray-500">{note.description}</p>
                <div className="flex flex-wrap gap-2 text-[10px]">
                  {note.pages && <span className="rounded-md bg-gray-50 px-2 py-0.5 text-gray-500">📄 {note.pages}p</span>}
                  {note.downloads && <span className="rounded-md bg-blue-50 px-2 py-0.5 text-blue-700">⬇ {formatCount(note.downloads)}</span>}
                  {note.year && <span className="rounded-md bg-blue-50 px-2 py-0.5 text-blue-700">Year {note.year}</span>}
                  {note.courseType && <span className="rounded-md bg-gray-100 px-2 py-0.5 text-gray-600">{note.courseType.toUpperCase()}</span>}
                </div>
                <div className="mt-auto flex gap-2 pt-1">
                  <button
                    onClick={() => setPreviewing(note)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white py-2 text-xs font-semibold text-gray-600 transition-all hover:border-gray-300 hover:text-gray-800 active:scale-95"
                  >
                    <FiEye size={13} /> Preview
                  </button>
                  <button
                    onClick={() => {
                      setDownloadingId(note.id);
                      setTimeout(() => { downloadNotePdf(note); setDownloadingId(null); }, 400);
                    }}
                    disabled={downloadingId === note.id}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 py-2 text-xs font-semibold text-white shadow-soft transition-all hover:shadow-premium active:scale-95 disabled:opacity-60"
                  >
                    {downloadingId === note.id ? (
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
              <FiFileText size={48} className="mb-3 opacity-30" />
              <p className="text-sm">No notes found</p>
              <button onClick={() => { setSelectedSubject(""); setSelectedYear(""); setSelectedCourseType(""); setSearchQuery(""); }} className="mt-1 text-xs text-blue-600 hover:underline">
                Clear filters
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* PDF Preview Modal */}
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
                  <p className="mt-1 text-xs">{previewing.subject} · {previewing.facultyName}</p>
                  <button
                    onClick={() => { downloadNotePdf(previewing); setPreviewing(null); }}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-2.5 text-sm font-semibold text-white shadow-premium transition-all hover:shadow-premium-lg active:scale-95"
                  >
                    <FiDownload size={16} /> Download PDF
                  </button>
                </div>
              </div>
              <div className="border-t border-gray-100 px-4 py-2 text-center text-[11px] text-gray-400">
                {previewing.pages && <span>{previewing.pages} pages</span>} · {previewing.subject} · Year {previewing.year}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function formatCount(n) {
  if (!n) return "0";
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n;
}
