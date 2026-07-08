// src/pages/EContent.jsx
// Video Lectures — year → semester → subject drill-down flow with syllabus
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlayCircle, FiBookOpen, FiArrowLeft, FiMonitor,
  FiYoutube, FiX, FiFilm, FiChevronRight, FiBook, FiLayers,
} from "react-icons/fi";

// ─── Faculty Map for 3rd Year Subjects ───
const FACULTY_MAP = {
  "OPERATING SYSTEM": "DR DHARANI",
  "DATA MINING TECHNIQUES": "V PONNILA",
  "ASP.NET": "R SARANYA",
  "DATABASE MANAGEMENT SYSTEM": "M P SUDHA",
};

// ─── Curriculum Data ───
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

// ─── Syllabus Data for 3rd Year Semester 1 ───
const SYLLABUS = {
  "OPERATING SYSTEM": [
    { sl: 1, module: "INTRODUCTION - VIEWS AND GOALS - OPERATING-SYSTEM SERVICES - USER AND OPERATING-SYSTEM INTERFACE - SYSTEM CALL - TYPES OF SYSTEM CALLS - OPERATING SYSTEM DESIGN AND IMPLEMENTATION - OPERATING-SYSTEM STRUCTURE. PROCESS MANAGEMENT: PROCESS CONCEPT - PROCESS SCHEDULING - OPERATIONS ON PROCESSES - INTERPROCESS COMMUNICATION. THREADS: TYPES OF THREADS", hrs: 15, co: "CO1" },
    { sl: 2, module: "PROCESS SCHEDULING: BASIC CONCEPTS - SCHEDULING CRITERIA - SCHEDULING ALGORITHMS - MULTIPLE-PROCESSOR SCHEDULING - CPU SCHEDULING. SYNCHRONIZATION: THE CRITICAL-SECTION PROBLEM - SYNCHRONIZATION HARDWARE - SEMAPHORES - CLASSIC PROBLEM OF SYNCHRONIZATION.", hrs: 15, co: "CO2" },
    { sl: 3, module: "DEADLOCKS: DEADLOCK CHARACTERIZATION - METHODS FOR HANDLING DEADLOCKS - DEADLOCK PREVENTION - DEADLOCK AVOIDANCE - DEADLOCK DETECTION - RECOVERY FROM DEADLOCK.", hrs: 15, co: "CO3" },
    { sl: 4, module: "MEMORY-MANAGEMENT STRATEGIES: SWAPPING - CONTIGUOUS MEMORY ALLOCATION - SEGMENTATION - PAGING - STRUCTURE OF THE PAGE TABLE. VIRTUAL-MEMORY MANAGEMENT: DEMAND PAGING - PAGE REPLACEMENT - ALLOCATION OF FRAMES - THRASHING.", hrs: 15, co: "CO4" },
    { sl: 5, module: "STORAGE MANAGEMENT: FILE SYSTEM - FILE CONCEPT - ACCESS METHODS - DIRECTORY AND DISK STRUCTURE - FILE SHARING - PROTECTION. ALLOCATION METHODS - FREE-SPACE MANAGEMENT - EFFICIENCY AND PERFORMANCE - RECOVERY.", hrs: 15, co: "CO5" },
  ],
  "DATABASE MANAGEMENT SYSTEM": [
    { sl: 1, module: "INTRODUCTION - DATABASE SYSTEM - CHARACTERISTICS OF DATABASE MANAGEMENT SYSTEMS - ARCHITECTURE OF DATABASE MANAGEMENT SYSTEMS - DATABASE MODELS - SYSTEM DEVELOPMENT LIFE CYCLE - ENTITY RELATIONSHIP MODEL", hrs: 15, co: "CO1" },
    { sl: 2, module: "INTRODUCTION TO RELATIONAL DATABASE MODEL - STRUCTURE OF RELATIONAL MODEL - KEYS - RELATIONAL ALGEBRA - NORMALIZATION: FUNCTIONAL DEPENDENCY - FIRST NORMAL FORM - SECOND NORMAL FORM - THIRD NORMAL FORM - BOYCE-CODE NORMAL FORM - FOURTH NORMAL FORM.", hrs: 15, co: "CO2" },
    { sl: 3, module: "SQL: INTRODUCTION - DATA RETRIEVAL - SINGLE ROW FUNCTION - GROUP FUNCTION - SET FUNCTION - SUB QUERY - JOINS. DATA MANIPULATION LANGUAGE: INSERT, UPDATE AND DELETE STATEMENTS - TRANSACTION CONTROL LANGUAGE - VIEW - SEQUENCE - SYNONYM - INDEX - DEFINING CONSTRAINTS", hrs: 15, co: "CO3" },
    { sl: 4, module: "PL/SQL: INTRODUCTION - PL/SQL BASIC - CHARACTER SET - PL/SQL STRUCTURE - SQL CURSOR - SUBPROGRAMS - FUNCTIONS - PROCEDURES.", hrs: 15, co: "CO4" },
    { sl: 5, module: "EXCEPTION HANDLER - INTRODUCTION - PREDEFINED EXCEPTION - USER DEFINED EXCEPTION - TRIGGERS - IMPLICIT AND EXPLICIT CURSORS - LOOPS IN EXPLICIT CURSOR.", hrs: 15, co: "CO5" },
  ],
  "DATA MINING TECHNIQUES": [
    { sl: 1, module: "INTRODUCTION - DATA MINING - KINDS OF DATA - KINDS OF PATTERNS - TECHNOLOGIES USED - APPLICATIONS - MAJOR ISSUES IN DATA MINING", hrs: 15, co: "CO1" },
    { sl: 2, module: "DATA PREPROCESSING: AN OVERVIEW - DATA CLEANING - DATA INTEGRATION - DATA REDUCTION: OVERVIEW OF DATA REDUCTION STRATEGIES - HISTOGRAMS - CLUSTERING - SAMPLING - DATA CUBE AGGREGATION", hrs: 15, co: "CO2" },
    { sl: 3, module: "MINING FREQUENT PATTERNS, ASSOCIATIONS, AND CORRELATIONS: BASIC CONCEPTS - FREQUENT ITEMSET MINING METHODS: APRIORI ALGORITHM - GENERATING ASSOCIATION RULES FROM FREQUENT ITEMSETS - IMPROVING THE EFFICIENCY OF APRIORI - A PATTERN-GROWTH APPROACH FOR MINING FREQUENT ITEMSETS - MINING FREQUENT ITEMSETS USING VERTICAL DATA FORMAT - MINING CLOSED AND MAX PATTERNS", hrs: 15, co: "CO3" },
    { sl: 4, module: "CLASSIFICATION: BASIC CONCEPTS - GENERAL APPROACH TO CLASSIFICATION - DECISION TREE INDUCTION - BAYES CLASSIFICATION - RULE-BASED CLASSIFICATION", hrs: 15, co: "CO4" },
    { sl: 5, module: "CLUSTER ANALYSIS: BASIC CONCEPTS AND METHODS - PARTITIONING METHODS - OUTLIER DETECTION: OUTLIERS AND OUTLIER ANALYSIS - OUTLIER DETECTION METHODS", hrs: 15, co: "CO5" },
  ],
  "ASP.NET": [
    { sl: 1, module: "OVERVIEW OF ASP.NET FRAMEWORK - PAGE STRUCTURE - COMPILER DIRECTIVES - NAMESPACE.", hrs: 10, co: "CO1" },
    { sl: 2, module: "UNDERSTANDING ASP.NET CONTROL: STANDARD CONTROLS: DISPLAYING INFORMATION - ACCEPTING USER INPUT - SUBMITTING FORM DATA - DISPLAYING IMAGES - HYPER LINK CONTROL.", hrs: 10, co: "CO2" },
    { sl: 3, module: "OVERVIEW OF VALIDATION CONTROL - REQUIRED FIELD VALIDATOR CONTROL - RANGE VALIDATOR CONTROL - COMPARE VALIDATOR CONTROL - CUSTOM VALIDATOR CONTROL - VALIDATION SUMMARY CONTROL - RICH CONTROLS: ADROTATOR, CALENDAR CONTROL.", hrs: 15, co: "CO3" },
    { sl: 4, module: "OVERVIEW OF DATA ACCESS: DATA BOUND CONTROL - DATA SOURCE CONTROL - DATA BINDING - SQLDATASOURCE CONTROL - OLEDB CONNECTION - OLEDB COMMAND - OLEDB TRANSACTION - DATA ADAPTER - DATASET.", hrs: 15, co: "CO4" },
    { sl: 5, module: "LIST CONTROL: DROPDOWN LIST - RADIOBUTTON LIST - LIST BOX - CHECKBOX LIST - BULLETED LIST - GRID VIEW CONTROL - REPEATER - DATA LIST CONTROL - BUILDING DATA ACCESS COMPONENT WITH ADO.NET - MAINTAINING APPLICATION STATE: BROWSER COOKIES - SESSION STATE, WEB SERVICES.", hrs: 10, co: "CO5" },
  ],
};

export default function EContent() {
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showVideos, setShowVideos] = useState(false);
  const [playing, setPlaying] = useState(null);

  const yearData = selectedYear ? CURRICULUM[selectedYear] : null;
  const semesterData = selectedSemester && yearData ? yearData.semesters[selectedSemester] : null;
  const ys = selectedYear ? yearStyles[selectedYear] : yearStyles[1];

  const subjectVideos = [];
  const syllabusData = selectedSubject ? SYLLABUS[selectedSubject] : null;

  // ─── Step 1: Year Selection ───
  if (!selectedYear) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-premium">
            <FiPlayCircle size={32} />
          </div>
          <h1 className="font-display text-3xl font-bold text-gray-900">Video Lectures</h1>
          <p className="mt-1 text-sm text-gray-400">Select your year to browse subject-wise video lectures &amp; syllabus</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {[1, 2, 3].map((year, i) => {
            const s = yearStyles[year];
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
                  <p className="mt-1 text-xs text-gray-400">
                    {Object.keys(CURRICULUM[year].semesters).length} Semesters
                  </p>
                </div>
                <div className={`absolute bottom-0 left-0 right-0 h-1 ${s.accent} scale-x-0 group-hover:scale-x-100 transition-transform origin-left`} />
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── Step 2: Semester Selection ───
  if (!selectedSemester) {
    const sems = Object.entries(yearData.semesters);
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => { setSelectedYear(null); setSelectedSemester(null); setSelectedSubject(null); }}
          className="mb-6 inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-all"
        >
          <FiArrowLeft size={14} /> Back to Years
        </motion.button>

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <div className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${ys.gradient} text-white shadow-lg`}>
            <FiLayers size={26} />
          </div>
          <h1 className={`font-display text-2xl font-bold ${ys.text}`}>{yearData.label}</h1>
          <p className="mt-1 text-sm text-gray-400">Choose a semester</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {sems.map(([semKey, semData], i) => (
            <motion.button
              key={semKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedSemester(Number(semKey))}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-soft hover:shadow-premium transition-all"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${ys.lightGradient} opacity-40 group-hover:opacity-70 transition-opacity`} />
              <div className="relative">
                <div className={`mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br ${ys.gradient} text-xl font-bold text-white shadow-md`}>
                  {semKey === 1 ? "I" : "II"}
                </div>
                <h2 className={`text-lg font-bold ${ys.text}`}>{semData.label}</h2>
                <p className="mt-1 text-xs text-gray-400">{semData.subjects.length} subjects</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  // ─── Step 3: Subject Selection ───
  if (!selectedSubject) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedSemester(null)}
          className="mb-6 inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-all"
        >
          <FiArrowLeft size={14} /> Back to Semesters
        </motion.button>

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 text-sm text-gray-400 mb-2">
            <span className={ys.text}>{yearData.label}</span>
            <FiChevronRight size={12} />
            <span className={ys.text}>{semesterData.label}</span>
          </div>
          <h1 className={`font-display text-2xl font-bold ${ys.text}`}>Select Subject</h1>
          <p className="mt-1 text-sm text-gray-400">Choose a subject to view its syllabus &amp; video lectures</p>
        </motion.div>

        {semesterData.subjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white/50 py-20"
          >
            <FiBookOpen size={48} className="mb-3 text-gray-300" />
            <p className="text-sm font-medium text-gray-500">Subjects will be added soon</p>
            <p className="mt-1 text-xs text-gray-400">This semester's curriculum is being updated</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {semesterData.subjects.map((subject, i) => {
              const sc = subjectColors[i % subjectColors.length];
              return (
                <motion.button
                  key={subject}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setSelectedSubject(subject); setShowVideos(false); }}
                  className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 text-left shadow-soft hover:shadow-premium transition-all"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 opacity-50" />
                  <div className="relative flex items-start gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${sc.from} ${sc.to} text-white shadow-md`}>
                      <FiBook size={20} />
                    </div>
                    <div className="min-w-0 flex-1 pt-1">
                      <h3 className="font-bold text-sm text-gray-900 leading-snug">{subject}</h3>
                      {FACULTY_MAP[subject] && (
                        <p className="mt-0.5 text-[11px] font-semibold tracking-wide text-gray-500">
                          {FACULTY_MAP[subject]}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-2">
                        {SYLLABUS[subject] ? (
                          <span className={`inline-flex items-center gap-1 rounded-full ${sc.badge} px-2.5 py-0.5 text-[10px] font-semibold`}>
                            <FiBookOpen size={10} /> VIEW SYLLABUS
                          </span>
                        ) : (
                          <span className={`inline-flex items-center gap-1 rounded-full ${sc.badge} px-2.5 py-0.5 text-[10px] font-semibold`}>
                            <FiFilm size={10} /> {subjectVideos.length} videos
                          </span>
                        )}
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

  // ─── Step 4: Syllabus View (default) ───
  if (!showVideos) {
    const sc = subjectColors[semesterData.subjects.indexOf(selectedSubject) % subjectColors.length];
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Back */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => { setSelectedSubject(null); setShowVideos(false); }}
          className="mb-6 inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-all"
        >
          <FiArrowLeft size={14} /> Back to Subjects
        </motion.button>

        {/* Breadcrumb */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 flex items-center gap-2 text-xs text-gray-400">
          <span className={ys.text}>{yearData.label}</span>
          <FiChevronRight size={10} />
          <span className={ys.text}>{semesterData.label}</span>
          <FiChevronRight size={10} />
          <span className="text-gray-700 font-semibold">{selectedSubject}</span>
        </motion.div>

        {/* Subject Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-4">
            <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${sc.from} ${sc.to} text-white shadow-lg`}>
              <FiBookOpen size={26} />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-gray-900 sm:text-2xl">{selectedSubject}</h1>
              {FACULTY_MAP[selectedSubject] && (
                <p className="text-xs font-semibold text-gray-500">{FACULTY_MAP[selectedSubject]}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Syllabus Table */}
        {syllabusData ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-soft"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                    <th className="px-4 py-3 font-bold uppercase tracking-wider w-12">Sl No</th>
                    <th className="px-4 py-3 font-bold uppercase tracking-wider">Contents of Module</th>
                    <th className="px-4 py-3 font-bold uppercase tracking-wider text-center w-16">Hrs</th>
                    <th className="px-4 py-3 font-bold uppercase tracking-wider text-center w-16">COs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {syllabusData.map((row) => (
                    <tr key={row.sl} className="hover:bg-blue-50/50 transition-colors">
                      <td className="px-4 py-3 font-bold text-gray-700 align-top">{row.sl}</td>
                      <td className="px-4 py-3 text-gray-600 leading-relaxed font-medium">{row.module}</td>
                      <td className="px-4 py-3 text-center font-semibold text-gray-700 align-top">{row.hrs}</td>
                      <td className="px-4 py-3 text-center font-bold text-blue-700 align-top">{row.co}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 rounded-xl border border-dashed border-gray-200 bg-white/50 py-12 text-center"
          >
            <FiBookOpen size={36} className="mx-auto mb-2 text-gray-300" />
            <p className="text-sm text-gray-400">Syllabus not yet available for this subject</p>
          </motion.div>
        )}

        {/* Watch Videos Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center"
        >
          <button
            onClick={() => setShowVideos(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-3.5 text-sm font-bold text-white shadow-premium hover:shadow-premium-lg hover:-translate-y-0.5 transition-all"
          >
            <FiPlayCircle size={20} />
            Watch Videos
          </button>
        </motion.div>
      </div>
    );
  }

  // ─── Step 5: Videos for Selected Subject ───
  const sc = subjectColors[semesterData.subjects.indexOf(selectedSubject) % subjectColors.length];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Back to Syllabus */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => setShowVideos(false)}
        className="mb-6 inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-all"
      >
        <FiArrowLeft size={14} /> Back to Syllabus
      </motion.button>

      {/* Breadcrumb */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-2 flex items-center gap-2 text-xs text-gray-400">
        <span className={ys.text}>{yearData.label}</span>
        <FiChevronRight size={10} />
        <span className={ys.text}>{semesterData.label}</span>
        <FiChevronRight size={10} />
        <span className="text-gray-700 font-semibold">{selectedSubject}</span>
        <FiChevronRight size={10} />
        <span className="text-blue-600 font-semibold">Videos</span>
      </motion.div>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-4">
          <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${sc.from} ${sc.to} text-white shadow-lg`}>
            <FiMonitor size={26} />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-gray-900 sm:text-2xl">{selectedSubject}</h1>
            <p className="text-xs text-gray-400">
              {yearData.label} · {semesterData.label} · {subjectVideos.length} video{subjectVideos.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Videos */}
      {subjectVideos.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white/50 py-24"
        >
          <div className={`mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${ys.lightGradient}`}>
            <FiYoutube size={40} className="text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700">No Videos Added Yet</h3>
          <p className="mt-1 max-w-md text-center text-sm text-gray-400">
            Video lectures for {selectedSubject} will be uploaded soon.
            Check back later or contact your faculty for updates.
          </p>
          <div className={`mt-6 rounded-xl ${ys.badge} px-4 py-2 text-xs font-semibold`}>
            {yearData.label} · {semesterData.label}
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {subjectVideos.map((video, i) => (
            <motion.div
              key={video.id || i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <button
                onClick={() => setPlaying(video)}
                className="group w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-soft hover:shadow-premium transition-all text-left"
              >
                <div className="relative aspect-video w-full bg-gray-100">
                  <img
                    src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                    alt={video.title}
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/30 group-hover:opacity-100">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600/90 text-white shadow-lg">
                      <FiPlayCircle size={22} className="ml-0.5" />
                    </div>
                  </div>
                  {video.duration && (
                    <span className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-mono text-white">
                      {video.duration}
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="line-clamp-1 text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {video.title}
                  </h3>
                  {video.description && (
                    <p className="mt-0.5 text-xs text-gray-400 line-clamp-1">{video.description}</p>
                  )}
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Video Player Modal */}
      <AnimatePresence>
        {playing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 p-4 backdrop-blur-sm"
            onClick={() => setPlaying(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-premium-lg"
            >
              <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-gray-900">{playing.title}</h3>
                  <p className="text-[11px] text-gray-500">{selectedSubject} · {selectedYear && yearData.label} · {selectedSemester && semesterData.label}</p>
                </div>
                <button onClick={() => setPlaying(null)} className="ml-3 rounded-full bg-white/80 p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                  <FiX size={16} />
                </button>
              </div>
              <div className="aspect-video w-full bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${playing.youtubeId}?autoplay=1&rel=0`}
                  title={playing.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
