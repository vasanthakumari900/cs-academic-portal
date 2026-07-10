import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiFileText, FiDownload, FiBookOpen,
  FiArrowLeft, FiChevronRight, FiLayers,
  FiChevronDown, FiExternalLink, FiSearch,
} from "react-icons/fi";
import { useFirestoreList } from "../hooks/useFirestoreList";
import { noteService } from "../services/noteService";

const CURRICULUM = {
  1: { label: "1st Year", icon: "Ⅰ", semesters: { 1: { label: "Semester 1", subjects: ["FUNDAMENTALS OF PYTHON PROGRAMMING","FUNDAMENTALS OF DIGITAL ELECTRONICS","MATHEMATICS PAPER - I","TAMIL","ENGLISH"] }, 2: { label: "Semester 2", subjects: ["OBJECT ORIENTED PROGRAMMING USING C++","DATA STRUCTURES","MATHEMATICS PAPER - II","TAMIL","ENGLISH"] } } },
  2: { label: "2nd Year", icon: "Ⅱ", semesters: { 1: { label: "Semester 1", subjects: ["JAVA PROGRAMMING","WEB TECHNOLOGY","STATISTICAL METHODS FOR COMPUTER SCIENCE - I","TAMIL","ENGLISH"] }, 2: { label: "Semester 2", subjects: ["ANDROID APP DEVELOPMENT","SOFTWARE ENGINEERING","STATISTICAL METHODS FOR COMPUTER SCIENCE - II","TAMIL","ENGLISH"] } } },
  3: { label: "3rd Year", icon: "Ⅲ", semesters: { 1: { label: "Semester 1", subjects: ["OPERATING SYSTEM","DATA MINING TECHNIQUES","ASP.NET","DATABASE MANAGEMENT SYSTEM"] }, 2: { label: "Semester 2", subjects: [] } } },
};

const yearStyles = {
  1: { gradient: "from-emerald-500 to-teal-600", text: "text-emerald-300" },
  2: { gradient: "from-violet-500 to-purple-600", text: "text-violet-300" },
  3: { gradient: "from-amber-500 to-orange-600", text: "text-amber-300" },
};

const subjectColors = [
  { from: "from-indigo-500", to: "to-violet-600" },
  { from: "from-rose-500", to: "to-pink-600" },
  { from: "from-cyan-500", to: "to-sky-600" },
  { from: "from-amber-500", to: "to-yellow-600" },
  { from: "from-lime-500", to: "to-green-600" },
];

const FACULTY_MAP = {
  "OPERATING SYSTEM": "DR DHARANI", "DATA MINING TECHNIQUES": "V PONNILA",
  "ASP.NET": "R SARANYA", "DATABASE MANAGEMENT SYSTEM": "M P SUDHA",
};

const NOTES_DATA = {
  "OPERATING SYSTEM": { units: { 1: { title: "Unit I", subtitle: "Introduction to OS", syllabus: "INTRODUCTION - VIEWS AND GOALS - OPERATING-SYSTEM SERVICES - USER AND OPERATING-SYSTEM INTERFACE - SYSTEM CALL - TYPES OF SYSTEM CALLS", files: [{ id: "os-u1-1", title: "OS Introduction", fileName: "OS-INTRO.pptx", fileId: "1GixI9_7uxRNzbf5qSe_wf4McmWaylQDS", type: "pptx" },{ id: "os-u1-2", title: "Session 2 - OS Basics", fileName: "ses-2.pptx", fileId: "1Zny7cAR4GR0YTRr3sIZT-u-FAOIQvQ-d", type: "pptx" },{ id: "os-u1-3", title: "OS Structures - Unit 1", fileName: "os structures-unit 1.pdf", fileId: "1O8-gnDMSgXurNN6O99N4S26z-UlONUbu", type: "pdf" },{ id: "os-u1-4", title: "OS Structures", fileName: "OSStructures.ppt", fileId: "1xqoPAFz_xavBAX8RR8nNErwANXnce-3B", type: "ppt" },{ id: "os-u1-5", title: "Processes", fileName: "os-processes.ppt", fileId: "1MoiwrzKonwOc4MH9wuO_sxKm92coXyYM", type: "ppt" },{ id: "os-u1-6", title: "Interprocess Communication", fileName: "interprocesscommunication-180721182943.pptx", fileId: "14mf_5YIS0TZB00phmq2kTSN8gT1gpfJY", type: "pptx" },{ id: "os-u1-7", title: "Threads - Unit 1", fileName: "threads-unit 1.pdf", fileId: "172mi8UGGUnGPAPF7zOeSKEBkqFucF5SM", type: "pdf" },{ id: "os-u1-8", title: "THREADS", fileName: "THREADS.pptx", fileId: "1uU4O05stk5cg2AVhfQBdC1VifAd_nrgJ", type: "pptx" }] }, 2: { title: "Unit II", subtitle: "Process Scheduling & Synchronization", syllabus: "PROCESS SCHEDULING: BASIC CONCEPTS - SCHEDULING CRITERIA - SCHEDULING ALGORITHMS - MULTIPLE-PROCESSOR SCHEDULING - CPU SCHEDULING. SYNCHRONIZATION: THE CRITICAL-SECTION PROBLEM - SYNCHRONIZATION HARDWARE - SEMAPHORES", files: [{ id: "os-u2-1", title: "OS Unit 2 - Process Scheduling & Synchronization", fileName: "OS_Unit2.pdf", fileId: "1J8M3d7mVSU4oxkyp6q_Dq-m4tuhdVmLV", type: "pdf" }] }, 3: { title: "Unit III", subtitle: "Deadlocks", syllabus: "DEADLOCKS: DEADLOCK CHARACTERIZATION - METHODS FOR HANDLING DEADLOCKS - DEADLOCK PREVENTION - DEADLOCK AVOIDANCE - DEADLOCK DETECTION - RECOVERY FROM DEADLOCK", files: [] }, 4: { title: "Unit IV", subtitle: "Memory Management", syllabus: "MEMORY-MANAGEMENT STRATEGIES: SWAPPING - CONTIGUOUS MEMORY ALLOCATION - SEGMENTATION - PAGING - STRUCTURE OF THE PAGE TABLE", files: [] }, 5: { title: "Unit V", subtitle: "Storage Management", syllabus: "STORAGE MANAGEMENT: FILE SYSTEM - FILE CONCEPT - ACCESS METHODS - DIRECTORY AND DISK STRUCTURE - FILE SHARING - PROTECTION", files: [] } } },
  "DATABASE MANAGEMENT SYSTEM": { units: { 1: { title: "Unit I", subtitle: "Introduction to DBMS", syllabus: "INTRODUCTION - DATABASE SYSTEM - CHARACTERISTICS OF DBMS - ARCHITECTURE - DATABASE MODELS - SDLC - ENTITY RELATIONSHIP MODEL", files: [{ id: "dbms-u1-1", title: "DBMS Unit 1 - Introduction", fileName: "DBMS_Unit1.pdf", fileId: "1RKBkfvx4_s9HN3kBYUK0fHRh6j451JHr", type: "pdf" }] }, 2: { title: "Unit II", subtitle: "Relational Model & Normalization", syllabus: "INTRODUCTION TO RELATIONAL DATABASE MODEL - KEYS - RELATIONAL ALGEBRA - NORMALIZATION", files: [] }, 3: { title: "Unit III", subtitle: "SQL", syllabus: "SQL: INTRODUCTION - DATA RETRIEVAL - FUNCTIONS - SUB QUERY - JOINS - DML - TCL", files: [] }, 4: { title: "Unit IV", subtitle: "PL/SQL", syllabus: "PL/SQL: INTRODUCTION - BASIC - CHARACTER SET - STRUCTURE - SQL CURSOR - SUBPROGRAMS", files: [] }, 5: { title: "Unit V", subtitle: "Exception Handling & Triggers", syllabus: "EXCEPTION HANDLER - TRIGGERS - CURSORS", files: [] } } },
  "ENGLISH": { units: { 1: { title: "Unit I", subtitle: "English - Complete Notes", syllabus: "OVERALL FIRST YEAR ENGLISH SYLLABUS", files: [{ id: "eng-u1-1", title: "English - Complete Notes", fileName: "English_Complete_Notes.pdf", fileId: "1izO8tdAjD-E4xeTTRXFHKDMmj6eUvZo4", type: "pdf" }] }, 2: { title: "Unit II", subtitle: "", syllabus: "", files: [] }, 3: { title: "Unit III", subtitle: "", syllabus: "", files: [] }, 4: { title: "Unit IV", subtitle: "", syllabus: "", files: [] }, 5: { title: "Unit V", subtitle: "", syllabus: "", files: [] } } },
  "ASP.NET": { units: { 1: { title: "Unit I", subtitle: "Overview of ASP.NET Framework", syllabus: "OVERVIEW OF ASP.NET FRAMEWORK - PAGE STRUCTURE - COMPILER DIRECTIVES - NAMESPACE", files: [{ id: "u1-1", title: "Overview of ASP.Net Framework", fileName: "Overview of ASP.Net Framework.pdf", fileId: "173-KUv6pOGV8o8ihTckpLwvkvDyKv9nj", type: "pdf" },{ id: "u1-2", title: "ASP Page Structure", fileName: "ASP page structure.pdf", fileId: "1OcVM4CDJTvGvdT9WfqLHFd1Sz61kEO3a", type: "pdf" },{ id: "u1-3", title: "Compiler Directives", fileName: "Compiler Directives.pdf", fileId: "14CpNpp7OVns3R6Kj4dWy81Io4FiFVvYi", type: "pdf" },{ id: "u1-4", title: "NAMESPACE", fileName: "NAMESPACE.pdf", fileId: "1cbb7Mt3m7MKXJkW_Hu_YsR4tWKDJanP3", type: "pdf" },{ id: "u1-5", title: "Overview of ASP.Net Framework (Notes)", fileName: "Overview of ASP.Net Framework (Notes)", fileId: "1VjVHcuCldGrTi6trGyb5gf4Z81RwpzsmsEqKm4Tajfg", type: "doc" }] }, 2: { title: "Unit II", subtitle: "ASP.NET Controls", syllabus: "UNDERSTANDING ASP.NET CONTROLS - STANDARD CONTROLS - DISPLAYING INFORMATION - ACCEPTING USER INPUT", files: [{ id: "u2-1", title: "ASP.NET UNIT - 2", fileName: "ASP.NET UNIT -2.pptx", fileId: "1t4g4ab9d5HdKZGuGxmYpWcAwTkjmoqjm", type: "pptx" }] }, 3: { title: "Unit III", subtitle: "Validation & Rich Controls", syllabus: "VALIDATION CONTROLS - REQUIRED FIELD VALIDATOR - RANGE VALIDATOR - RICH CONTROLS - ADROTATOR, CALENDAR", files: [{ id: "u3-1", title: "Validation Controls", fileName: "Validation Controls.docx", fileId: "1z-1R0gaqaVaSIvgRybN5AiA8ExYGsJfY", type: "docx" },{ id: "u3-2", title: "Calendar Control in ASP.NET", fileName: "Calendar Control in ASP.pdf", fileId: "1DInHlyYjC7OpG7sY1i0l987_uZLjo5iY", type: "pdf" },{ id: "u3-3", title: "Rich Controls", fileName: "RICH CONTROLS.pdf", fileId: "1xE1sIoFOWnkI5D7GRbm0EtgyDHpxwYg0", type: "pdf" }] }, 4: { title: "Unit IV", subtitle: "Data Access in ASP.NET", syllabus: "DATA BOUND CONTROL - SQLDATASOURCE - OLEDB - DATASET", files: [{ id: "u4-1", title: "Data Bound Controls", fileName: "data bound controls.docx", fileId: "1IXY-buceR6cV10jEbMClDXUuveYjVWUo", type: "docx" },{ id: "u4-2", title: "Simple Data Bound Controls", fileName: "Simple Data Bound Controls.pdf", fileId: "1PCHmZ2U3uUV8Ah83Do1vZ2bTk4uBArx7", type: "pdf" }] }, 5: { title: "Unit V", subtitle: "List Controls & State Management", syllabus: "LIST CONTROLS - GRID VIEW - REPEATER - STATE MANAGEMENT - COOKIES - SESSION", files: [{ id: "u5-1", title: "List Controls", fileName: "Listbox RadiobuttionList CheckboxList BulletedList.pdf", fileId: "1hGMGwEMhCFf1J_RyY3pKNKNAEVXnkwH2", type: "pdf" },{ id: "u5-2", title: "ADO.NET Architecture", fileName: "ADO.NET ARCHITECTURE.pdf", fileId: "12EETP-MtzBDgmT_ybJ0xiTebiksP5In4", type: "pdf" },{ id: "u5-3", title: "Application and Session State", fileName: "Application and Session State.pdf", fileId: "1FnobkINTlyJp4Nbi31oTLAtN6_PtLrUX", type: "pdf" },{ id: "u5-4", title: "Cookies", fileName: "COOKIES.pdf", fileId: "1Lw-RzMw2vLCAbYNxR7HzcfYs_Wt102Ob", type: "pdf" },{ id: "u5-5", title: "Web Service", fileName: "WEB SERVICE.pdf", fileId: "1lbt5Eqo79yie2GsHA6O5sgvq0j2V3xnu", type: "pdf" }] } } },
};

const SYLLABUS = {
  "OPERATING SYSTEM": [
    { sl: 1, module: "INTRODUCTION - VIEWS AND GOALS - OPERATING-SYSTEM SERVICES - USER AND OPERATING-SYSTEM INTERFACE - SYSTEM CALL - TYPES OF SYSTEM CALLS", hrs: 15, co: "CO1" },
    { sl: 2, module: "PROCESS SCHEDULING: BASIC CONCEPTS - SCHEDULING CRITERIA - SCHEDULING ALGORITHMS - MULTIPLE-PROCESSOR SCHEDULING", hrs: 15, co: "CO2" },
    { sl: 3, module: "DEADLOCKS: DEADLOCK CHARACTERIZATION - METHODS FOR HANDLING DEADLOCKS - DEADLOCK PREVENTION - DEADLOCK AVOIDANCE", hrs: 15, co: "CO3" },
    { sl: 4, module: "MEMORY-MANAGEMENT STRATEGIES: SWAPPING - CONTIGUOUS MEMORY ALLOCATION - SEGMENTATION - PAGING", hrs: 15, co: "CO4" },
    { sl: 5, module: "STORAGE MANAGEMENT: FILE SYSTEM - FILE CONCEPT - ACCESS METHODS - DIRECTORY AND DISK STRUCTURE", hrs: 15, co: "CO5" },
  ],
  "DATABASE MANAGEMENT SYSTEM": [
    { sl: 1, module: "INTRODUCTION - DATABASE SYSTEM - CHARACTERISTICS OF DBMS - ARCHITECTURE - DATABASE MODELS - SDLC - ER MODEL", hrs: 15, co: "CO1" },
    { sl: 2, module: "INTRODUCTION TO RELATIONAL DATABASE MODEL - KEYS - RELATIONAL ALGEBRA - NORMALIZATION", hrs: 15, co: "CO2" },
    { sl: 3, module: "SQL: INTRODUCTION - DATA RETRIEVAL - FUNCTIONS - SUB QUERY - JOINS - DML - TCL - VIEW - SEQUENCE - INDEX", hrs: 15, co: "CO3" },
    { sl: 4, module: "PL/SQL: INTRODUCTION - BASIC - CHARACTER SET - STRUCTURE - SQL CURSOR - SUBPROGRAMS - FUNCTIONS - PROCEDURES", hrs: 15, co: "CO4" },
    { sl: 5, module: "EXCEPTION HANDLER - TRIGGERS - CURSORS", hrs: 15, co: "CO5" },
  ],
  "DATA MINING TECHNIQUES": [
    { sl: 1, module: "INTRODUCTION - DATA MINING - KINDS OF DATA - KINDS OF PATTERNS - APPLICATIONS - ISSUES", hrs: 15, co: "CO1" },
    { sl: 2, module: "DATA PREPROCESSING - DATA CLEANING - DATA INTEGRATION - DATA REDUCTION", hrs: 15, co: "CO2" },
    { sl: 3, module: "MINING FREQUENT PATTERNS - APRIORI ALGORITHM - ASSOCIATION RULES", hrs: 15, co: "CO3" },
    { sl: 4, module: "CLASSIFICATION - DECISION TREE - BAYES CLASSIFICATION - RULE-BASED CLASSIFICATION", hrs: 15, co: "CO4" },
    { sl: 5, module: "CLUSTER ANALYSIS - PARTITIONING METHODS - OUTLIER DETECTION", hrs: 15, co: "CO5" },
  ],
  "ASP.NET": [
    { sl: 1, module: "OVERVIEW OF ASP.NET FRAMEWORK - PAGE STRUCTURE - COMPILER DIRECTIVES - NAMESPACE", hrs: 10, co: "CO1" },
    { sl: 2, module: "UNDERSTANDING ASP.NET CONTROL: STANDARD CONTROLS - DISPLAYING INFORMATION - ACCEPTING USER INPUT", hrs: 10, co: "CO2" },
    { sl: 3, module: "OVERVIEW OF VALIDATION CONTROL - RICH CONTROLS: ADROTATOR, CALENDAR", hrs: 15, co: "CO3" },
    { sl: 4, module: "OVERVIEW OF DATA ACCESS: DATA BOUND CONTROL - SQLDATASOURCE - OLEDB - DATASET", hrs: 15, co: "CO4" },
    { sl: 5, module: "LIST CONTROL: GRID VIEW - REPEATER - DATA LIST - STATE MANAGEMENT", hrs: 10, co: "CO5" },
  ],
};

function getDrivePreviewUrl(fileId, type = "pdf") {
  if (type === "doc") return `https://docs.google.com/document/d/${fileId}/preview`;
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

function getDriveDownloadUrl(fileId, type = "pdf") {
  if (type === "doc") return `https://docs.google.com/document/d/${fileId}/export?format=pdf`;
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

const unitColors = [
  { from: "from-indigo-500", to: "to-violet-600", light: "bg-indigo-500/10" },
  { from: "from-emerald-500", to: "to-teal-600", light: "bg-emerald-500/10" },
  { from: "from-amber-500", to: "to-orange-600", light: "bg-amber-500/10" },
  { from: "from-rose-500", to: "to-pink-600", light: "bg-rose-500/10" },
  { from: "from-violet-500", to: "to-purple-600", light: "bg-violet-500/10" },
];

export default function Notes() {
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [expandedUnit, setExpandedUnit] = useState(null);
  const [viewingPdf, setViewingPdf] = useState(null);

  const yearData = selectedYear ? CURRICULUM[selectedYear] : null;
  const semesterData = selectedSemester && yearData ? yearData.semesters[selectedSemester] : null;
  const ys = selectedYear ? yearStyles[selectedYear] : yearStyles[1];
  const subjectNotesData = selectedSubject ? NOTES_DATA[selectedSubject] : null;
  const { items: uploadedNotes } = useFirestoreList(noteService);

  // Uploaded notes from Firestore for this subject
  const uploadedSubjectNotes = useMemo(() => {
    if (!selectedSubject) return [];
    return uploadedNotes
      .filter((n) => n.subject?.toUpperCase() === selectedSubject)
      .map((n) => ({
        id: n.id,
        title: n.title,
        fileName: n.title,
        fileUrl: n.fileUrl,
        subject: n.subject,
        fromFirestore: true,
      }));
  }, [selectedSubject, uploadedNotes]);

  const syllabusData = selectedSubject ? SYLLABUS[selectedSubject] : null;

  if (!selectedYear) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-[0_8px_32px_rgba(16,185,129,0.2)]">
            <FiBookOpen size={36} />
          </div>
          <h1 className="font-display text-4xl font-bold text-white">Lecture Notes</h1>
          <p className="mt-2 text-sm text-white/50">Select your year to browse faculty-curated PDF notes by subject</p>
        </motion.div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[1, 2, 3].map((year, i) => {
            const s = yearStyles[year];
            return (
              <motion.button key={year}
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.12, type: "spring", stiffness: 80 }}
                whileHover={{ y: -8, scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedYear(year)}
                className="glass-card-hover group"
              >
                <div className="p-8 text-center">
                  <div className={`mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br ${s.gradient} text-3xl font-bold text-white shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl`}>{CURRICULUM[year].icon}</div>
                  <h2 className={`text-xl font-bold ${s.text}`}>{CURRICULUM[year].label}</h2>
                  <p className="mt-1.5 text-xs text-white/50">{Object.keys(CURRICULUM[year].semesters).length} Semesters</p>
                  <div className="mt-4 inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-400 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">Browse Notes <FiChevronRight size={12} /></div>
                </div>
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${s.gradient} scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500`} />
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  if (!selectedSemester) {
    const sems = Object.entries(yearData.semesters);
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          onClick={() => { setSelectedYear(null); setSelectedSemester(null); setSelectedSubject(null); }}
          className="mb-8 inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm px-4 py-2 text-xs font-semibold text-white/60 hover:bg-white/10 transition-all"
        ><FiArrowLeft size={14} /> Back to Years</motion.button>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${ys.gradient} text-white shadow-lg`}><FiLayers size={28} /></div>
          <h1 className={`font-display text-2xl font-bold ${ys.text}`}>{yearData.label}</h1>
          <p className="mt-1 text-sm text-white/60">Choose a semester</p>
        </motion.div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {sems.map(([semKey, semData], i) => (
            <motion.button key={semKey}
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.1 }}
              whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedSemester(Number(semKey))}
              className="glass-card-hover"
            >
              <div className="p-8 text-center">
                <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br ${ys.gradient} text-xl font-bold text-white shadow-md`}>{semKey === 1 ? "I" : "II"}</div>
                <h2 className={`text-lg font-bold ${ys.text}`}>{semData.label}</h2>
                <p className="mt-1 text-xs text-white/50">{semData.subjects.length} subjects</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  if (!selectedSubject) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          onClick={() => setSelectedSemester(null)}
          className="mb-8 inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm px-4 py-2 text-xs font-semibold text-white/60 hover:bg-white/10 transition-all"
        ><FiArrowLeft size={14} /> Back to Semesters</motion.button>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 text-sm text-white/50 mb-3">
            <span className={ys.text}>{yearData.label}</span><FiChevronRight size={12} /><span className={ys.text}>{semesterData.label}</span>
          </div>
          <h1 className={`font-display text-2xl font-bold ${ys.text}`}>Select Subject</h1>
          <p className="mt-1 text-sm text-white/60">Choose a subject to browse its lecture notes</p>
        </motion.div>
        {semesterData.subjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/15 bg-white/5 py-20">
            <FiBookOpen size={48} className="mb-3 text-white/30" />
            <p className="text-sm font-medium text-white/60">Subjects will be added soon</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {semesterData.subjects.map((subject, i) => {
              const sc = subjectColors[i % subjectColors.length];
              const hasNotes = NOTES_DATA[subject] && Object.values(NOTES_DATA[subject].units).some(u => u.files.length > 0);
              const totalFiles = NOTES_DATA[subject] ? Object.values(NOTES_DATA[subject].units).reduce((s, u) => s + u.files.length, 0) : 0;
              return (
                <motion.button key={subject}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedSubject(subject)}
                  className="glass-card-hover"
                >
                  <div className="relative flex items-start gap-4 p-5">
                    <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${sc.from} ${sc.to} text-white shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg`}><FiFileText size={22} /></div>
                    <div className="min-w-0 flex-1 pt-1">
                      <h3 className="font-display font-bold text-sm text-white leading-snug">{subject}</h3>
                      {FACULTY_MAP[subject] && <p className="mt-0.5 text-[11px] font-semibold tracking-wide text-white/50">{FACULTY_MAP[subject]}</p>}
                      <div className="mt-3 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 text-[10px] font-semibold"><FiFileText size={10} /> VIEW NOTES</span>
                        {hasNotes && <span className="inline-flex items-center rounded-full bg-emerald-500/20 text-emerald-300 px-2 py-0.5 text-[9px] font-bold">{totalFiles} PDFs</span>}
                        <FiChevronRight size={14} className="text-white/30 group-hover:text-cyan-400 transition-colors ml-auto" />
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

  const sc = subjectColors[semesterData.subjects.indexOf(selectedSubject) % subjectColors.length];
  const units = subjectNotesData ? Object.entries(subjectNotesData.units) : [];
  const totalFiles = units.reduce((s, [, u]) => s + u.files.length, 0);

  const isEnglish = selectedSubject === "ENGLISH";
  const englishPdf = isEnglish && NOTES_DATA["ENGLISH"]?.units?.[1]?.files?.[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          onClick={() => { setSelectedSubject(null); setExpandedUnit(null); setViewingPdf(null); }}
          className="mb-4 inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm px-4 py-2 text-xs font-semibold text-white/60 hover:bg-white/10 transition-all"
        ><FiArrowLeft size={14} /> Back to Subjects</motion.button>
        <div className="flex items-center gap-2 text-xs text-white/50">
          <span className={ys.text}>{yearData.label}</span><FiChevronRight size={10} /><span className={ys.text}>{semesterData.label}</span><FiChevronRight size={10} /><span className="text-white/80 font-semibold">{selectedSubject}</span>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-4">
          <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${sc.from} ${sc.to} text-white shadow-lg`}><FiBookOpen size={28} /></div>
          <div>
            <h1 className="font-display text-2xl font-bold text-white">{selectedSubject}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-white/60">{yearData.label} · {semesterData.label}</span>
              {syllabusData && <span className="badge-primary">{syllabusData.length} modules</span>}
              {totalFiles > 0 && <span className="badge-success">{totalFiles} PDFs</span>}
            </div>
          </div>
        </div>
      </motion.div>

      {syllabusData ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="mb-8 glass-card overflow-hidden"
        >
          <div className="bg-gradient-to-r from-indigo-600 to-violet-700 px-5 py-3.5 flex items-center gap-2 text-white">
            <FiBookOpen size={15} />
            <span className="text-xs font-bold uppercase tracking-wider">Syllabus</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-white/5 text-white/60">
                  <th className="px-5 py-3 font-bold uppercase tracking-wider w-14">Sl No</th>
                  <th className="px-5 py-3 font-bold uppercase tracking-wider">Contents of Module</th>
                  <th className="px-5 py-3 font-bold uppercase tracking-wider text-center w-20">Hrs</th>
                  <th className="px-5 py-3 font-bold uppercase tracking-wider text-center w-20">COs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {syllabusData.map((row) => (
                  <tr key={row.sl} className="hover:bg-white/5 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-white/80 align-top">{row.sl}</td>
                    <td className="px-5 py-3.5 text-white/60 leading-relaxed font-medium">{row.module}</td>
                    <td className="px-5 py-3.5 text-center font-semibold text-white/80 align-top">{row.hrs}</td>
                    <td className="px-5 py-3.5 text-center font-bold text-cyan-400 align-top">{row.co}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : (
        <div className="mb-8 rounded-2xl border border-dashed border-white/15 bg-white/5 py-16 text-center">
          <FiBookOpen size={40} className="mx-auto mb-3 text-white/30" />
          <p className="text-sm text-white/50">Syllabus not yet available</p>
        </div>
      )}

      {isEnglish && englishPdf && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="mb-5 flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${sc.from} ${sc.to} text-white shadow-lg`}><FiDownload size={18} /></div>
            <div>
              <h2 className="font-display text-lg font-bold text-white">English - Complete Notes</h2>
              <p className="text-[11px] text-white/50">Complete English notes PDF for download</p>
            </div>
          </div>
          <div className="glass-card overflow-hidden">
            <div className="p-5">
              <motion.button
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                onClick={() => setViewingPdf({ ...englishPdf, subject: "ENGLISH", unit: "Complete Notes" })}
                className="group flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-left transition-all hover:border-cyan-400/30 hover:bg-cyan-500/10 hover:shadow-lg active:scale-[0.98]"
              >
                <div className="flex h-14 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-red-500/20 to-rose-500/20 text-red-400 shadow-sm">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">{englishPdf.title}</p>
                  <p className="text-xs text-white/50">PDF · Complete Notes · 1st Year Semester 1</p>
                </div>
                <div className="shrink-0 rounded-full bg-white/10 p-2.5 text-white/50 group-hover:bg-cyan-500/20 group-hover:text-cyan-300 transition-all">
                  <a href={`https://drive.google.com/uc?export=download&id=${englishPdf.fileId}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                    <FiDownload size={16} />
                  </a>
                </div>
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Uploaded Notes from Firestore */}
      {uploadedSubjectNotes.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="mb-5 flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${sc.from} ${sc.to} text-white shadow-lg`}><FiDownload size={18} /></div>
            <div>
              <h2 className="font-display text-lg font-bold text-white">Uploaded Notes</h2>
              <p className="text-[11px] text-white/50">{uploadedSubjectNotes.length} note{uploadedSubjectNotes.length > 1 ? "s" : ""} uploaded by faculty</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {uploadedSubjectNotes.map((note) => (
              <a key={note.id}
                href={note.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:border-cyan-400/30 hover:bg-cyan-500/10 hover:shadow-lg active:scale-[0.98]"
              >
                <div className="flex h-12 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-red-500/20 to-rose-500/20 text-red-400 shadow-sm">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white truncate group-hover:text-cyan-300 transition-colors">{note.title}</p>
                  <p className="text-[10px] text-white/50">PDF · {note.subject}</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/30 group-hover:text-cyan-300 shrink-0"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </a>
            ))}
          </div>
        </motion.div>
      )}

      {!isEnglish && subjectNotesData && units.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="mb-5 flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${sc.from} ${sc.to} text-white shadow-md`}><FiDownload size={18} /></div>
            <div>
              <h2 className="font-display text-lg font-bold text-white">Download Notes</h2>
              <p className="text-[11px] text-white/50">{totalFiles} PDFs available across {units.length} units</p>
            </div>
          </div>
          <div className="space-y-3">
            {units.map(([unitKey, unit], idx) => {
              const uc = unitColors[idx % unitColors.length];
              const isExpanded = expandedUnit === unitKey;
              const fileCount = unit.files.length;
              return (
                <motion.div key={unitKey} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * idx }}
                  className="glass-card overflow-hidden transition-all duration-300"
                >
                  <button onClick={() => setExpandedUnit(isExpanded ? null : unitKey)}
                    className={`flex w-full items-center justify-between px-5 py-4 text-left transition-all ${isExpanded ? `${uc.light} border-b border-white/10` : "hover:bg-white/10"}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${uc.from} ${uc.to} text-white text-xs font-bold shadow-sm transition-transform duration-300 ${isExpanded ? 'scale-110' : ''}`}>{unitKey}</div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-white">{unit.title}</h3>
                        <p className="text-[11px] text-white/50">{unit.subtitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {fileCount > 0 && <span className="rounded-full bg-indigo-500/20 text-indigo-300 px-3 py-0.5 text-[10px] font-bold">{fileCount} PDF{fileCount > 1 ? "s" : ""}</span>}
                      <FiChevronDown size={16} className={`text-white/40 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                    </div>
                  </button>
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                        <div className="px-5 py-4">
                          {unit.syllabus && (
                            <div className="mb-4 rounded-xl bg-white/5 px-4 py-3 border border-white/10">
                              <p className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1">Topics Covered</p>
                              <p className="text-[11px] text-white/60 leading-relaxed">{unit.syllabus}</p>
                            </div>
                          )}
                          {fileCount > 0 ? (
                            <div className="space-y-2">
                              {unit.files.map((file, i) => (
                                <motion.button key={file.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                                  onClick={() => setViewingPdf({ ...file, subject: selectedSubject, unit: unit.title })}
                                  className="group flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3.5 text-left transition-all hover:border-cyan-400/30 hover:bg-cyan-500/10 hover:shadow-sm active:scale-[0.98]"
                                >
                                  <div className="flex h-11 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-red-500/20 to-rose-500/20 text-red-400 shadow-sm">
                                    {file.type === "doc" ? (
                                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                                    ) : (
                                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                    )}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-white truncate group-hover:text-cyan-300 transition-colors">{file.title}</p>
                                    <p className="text-[10px] text-white/50">{file.type === "doc" ? "Google Doc" : file.type === "docx" ? "Word" : file.type === "pptx" || file.type === "ppt" ? "PowerPoint" : "PDF"} · {unit.title}</p>
                                  </div>
                                  <div className="shrink-0 rounded-full bg-white/10 p-2 text-white/40 group-hover:bg-cyan-500/20 group-hover:text-cyan-300 transition-all"><FiExternalLink size={12} /></div>
                                </motion.button>
                              ))}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center py-6 text-white/40">
                              <FiFileText size={24} className="mb-1 opacity-40" />
                              <p className="text-xs font-medium">No PDFs uploaded yet</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {viewingPdf && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 p-2 sm:p-4 backdrop-blur-sm"
            onClick={() => setViewingPdf(null)}
          >
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-[#0F172A]/95 backdrop-blur-xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
            >
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-gradient-to-r from-indigo-600/20 to-violet-600/20">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-bold text-white">{viewingPdf.title}</h3>
                  <p className="text-[11px] text-white/50">{viewingPdf.subject} · {viewingPdf.unit}</p>
                </div>
                <div className="flex items-center gap-2">
                  <a href={getDriveDownloadUrl(viewingPdf.fileId, viewingPdf.type)} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-xs font-bold text-white shadow-md transition-all duration-300 hover:shadow-indigo-500/30 hover:from-indigo-500 hover:to-violet-500"
                  ><FiDownload size={14} /> Download</a>
                  <button onClick={() => setViewingPdf(null)}
                    className="rounded-full bg-white/10 p-1.5 text-white/50 hover:bg-white/20 hover:text-white transition-all">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                </div>
              </div>
              <div className="aspect-[4/3] w-full bg-gray-900 sm:aspect-[16/10] lg:aspect-[16/9]">
                <iframe src={getDrivePreviewUrl(viewingPdf.fileId, viewingPdf.type)} title={viewingPdf.title} className="h-full w-full" allowFullScreen />
              </div>
              <div className="border-t border-white/10 px-5 py-2.5 text-center text-[11px] text-white/40">
                {viewingPdf.fileName} · {viewingPdf.subject} · {viewingPdf.unit}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
