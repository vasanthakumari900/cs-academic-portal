// src/pages/EContent.jsx
// Premium glassmorphism Video Lectures page
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlayCircle, FiBookOpen, FiArrowLeft, FiMonitor,
  FiYoutube, FiX, FiFilm, FiChevronRight, FiBook, FiLayers,
  FiStar, FiAward,
} from "react-icons/fi";

// ─── Faculty Map ───
const FACULTY_MAP = {
  "OPERATING SYSTEM": "DR DHARANI",
  "DATA MINING TECHNIQUES": "V PONNILA",
  "ASP.NET": "R SARANYA",
  "DATABASE MANAGEMENT SYSTEM": "M P SUDHA",
};

// ─── Curriculum Data ───
const CURRICULUM = {
  1: {
    label: "1st Year", icon: "Ⅰ",
    semesters: {
      1: { label: "Semester 1", subjects: ["FUNDAMENTALS OF PYTHON PROGRAMMING","FUNDAMENTALS OF DIGITAL ELECTRONICS","MATHEMATICS PAPER - I","TAMIL","ENGLISH"] },
      2: { label: "Semester 2", subjects: ["OBJECT ORIENTED PROGRAMMING USING C++","DATA STRUCTURES","MATHEMATICS PAPER - II","TAMIL","ENGLISH"] },
    },
  },
  2: {
    label: "2nd Year", icon: "Ⅱ",
    semesters: {
      1: { label: "Semester 1", subjects: ["JAVA PROGRAMMING","WEB TECHNOLOGY","STATISTICAL METHODS FOR COMPUTER SCIENCE - I","TAMIL","ENGLISH"] },
      2: { label: "Semester 2", subjects: ["ANDROID APP DEVELOPMENT","SOFTWARE ENGINEERING","STATISTICAL METHODS FOR COMPUTER SCIENCE - II","TAMIL","ENGLISH"] },
    },
  },
  3: {
    label: "3rd Year", icon: "Ⅲ",
    semesters: {
      1: { label: "Semester 1", subjects: ["OPERATING SYSTEM","DATA MINING TECHNIQUES","ASP.NET","DATABASE MANAGEMENT SYSTEM"] },
      2: { label: "Semester 2", subjects: [] },
    },
  },
};

const yearStyles = {
  1: { gradient: "from-emerald-500 to-teal-600", lightGradient: "from-emerald-50 to-teal-50", border: "border-emerald-200", text: "text-emerald-700", badge: "bg-emerald-100 text-emerald-800", accent: "bg-emerald-500", icon: "Ⅰ" },
  2: { gradient: "from-violet-500 to-purple-600", lightGradient: "from-violet-50 to-purple-50", border: "border-violet-200", text: "text-violet-700", badge: "bg-violet-100 text-violet-800", accent: "bg-violet-500", icon: "Ⅱ" },
  3: { gradient: "from-amber-500 to-orange-600", lightGradient: "from-amber-50 to-orange-50", border: "border-amber-200", text: "text-amber-700", badge: "bg-amber-100 text-amber-800", accent: "bg-amber-500", icon: "Ⅲ" },
};

const subjectColors = [
  { from: "from-blue-500", to: "to-indigo-600", badge: "bg-blue-100 text-blue-800" },
  { from: "from-rose-500", to: "to-pink-600", badge: "bg-rose-100 text-rose-800" },
  { from: "from-cyan-500", to: "to-sky-600", badge: "bg-cyan-100 text-cyan-800" },
  { from: "from-amber-500", to: "to-yellow-600", badge: "bg-amber-100 text-amber-800" },
  { from: "from-lime-500", to: "to-green-600", badge: "bg-lime-100 text-lime-800" },
];

const SYLLABUS = {
  "OPERATING SYSTEM": [
    { sl: 1, module: "INTRODUCTION - VIEWS AND GOALS - OPERATING-SYSTEM SERVICES - USER AND OPERATING-SYSTEM INTERFACE - SYSTEM CALL - TYPES OF SYSTEM CALLS - OPERATING SYSTEM DESIGN AND IMPLEMENTATION - OPERATING-SYSTEM STRUCTURE.", hrs: 15, co: "CO1" },
    { sl: 2, module: "PROCESS SCHEDULING: BASIC CONCEPTS - SCHEDULING CRITERIA - SCHEDULING ALGORITHMS - MULTIPLE-PROCESSOR SCHEDULING - CPU SCHEDULING.", hrs: 15, co: "CO2" },
    { sl: 3, module: "DEADLOCKS: DEADLOCK CHARACTERIZATION - METHODS FOR HANDLING DEADLOCKS - DEADLOCK PREVENTION - DEADLOCK AVOIDANCE - DEADLOCK DETECTION - RECOVERY FROM DEADLOCK.", hrs: 15, co: "CO3" },
    { sl: 4, module: "MEMORY-MANAGEMENT STRATEGIES: SWAPPING - CONTIGUOUS MEMORY ALLOCATION - SEGMENTATION - PAGING - STRUCTURE OF THE PAGE TABLE.", hrs: 15, co: "CO4" },
    { sl: 5, module: "STORAGE MANAGEMENT: FILE SYSTEM - FILE CONCEPT - ACCESS METHODS - DIRECTORY AND DISK STRUCTURE - FILE SHARING - PROTECTION.", hrs: 15, co: "CO5" },
  ],
  "DATABASE MANAGEMENT SYSTEM": [
    { sl: 1, module: "INTRODUCTION - DATABASE SYSTEM - CHARACTERISTICS OF DBMS - ARCHITECTURE - DATABASE MODELS - SDLC - ENTITY RELATIONSHIP MODEL", hrs: 15, co: "CO1" },
    { sl: 2, module: "INTRODUCTION TO RELATIONAL DATABASE MODEL - STRUCTURE - KEYS - RELATIONAL ALGEBRA - NORMALIZATION", hrs: 15, co: "CO2" },
    { sl: 3, module: "SQL: INTRODUCTION - DATA RETRIEVAL - FUNCTIONS - SUB QUERY - JOINS - DML - TCL - VIEW - SEQUENCE - INDEX", hrs: 15, co: "CO3" },
    { sl: 4, module: "PL/SQL: INTRODUCTION - BASIC - CHARACTER SET - STRUCTURE - SQL CURSOR - SUBPROGRAMS - FUNCTIONS - PROCEDURES", hrs: 15, co: "CO4" },
    { sl: 5, module: "EXCEPTION HANDLER - INTRODUCTION - TRIGGERS - CURSORS", hrs: 15, co: "CO5" },
  ],
  "DATA MINING TECHNIQUES": [
    { sl: 1, module: "INTRODUCTION - DATA MINING - KINDS OF DATA - KINDS OF PATTERNS - TECHNOLOGIES USED - APPLICATIONS", hrs: 15, co: "CO1" },
    { sl: 2, module: "DATA PREPROCESSING: AN OVERVIEW - DATA CLEANING - DATA INTEGRATION - DATA REDUCTION", hrs: 15, co: "CO2" },
    { sl: 3, module: "MINING FREQUENT PATTERNS, ASSOCIATIONS, AND CORRELATIONS: BASIC CONCEPTS - APRIORI ALGORITHM", hrs: 15, co: "CO3" },
    { sl: 4, module: "CLASSIFICATION: BASIC CONCEPTS - DECISION TREE INDUCTION - BAYES CLASSIFICATION - RULE-BASED CLASSIFICATION", hrs: 15, co: "CO4" },
    { sl: 5, module: "CLUSTER ANALYSIS: BASIC CONCEPTS - PARTITIONING METHODS - OUTLIER DETECTION", hrs: 15, co: "CO5" },
  ],
  "ASP.NET": [
    { sl: 1, module: "OVERVIEW OF ASP.NET FRAMEWORK - PAGE STRUCTURE - COMPILER DIRECTIVES - NAMESPACE", hrs: 10, co: "CO1" },
    { sl: 2, module: "UNDERSTANDING ASP.NET CONTROL: STANDARD CONTROLS - DISPLAYING INFORMATION - ACCEPTING USER INPUT", hrs: 10, co: "CO2" },
    { sl: 3, module: "OVERVIEW OF VALIDATION CONTROL - RICH CONTROLS: ADROTATOR, CALENDAR", hrs: 15, co: "CO3" },
    { sl: 4, module: "OVERVIEW OF DATA ACCESS: DATA BOUND CONTROL - SQLDATASOURCE - OLEDB - DATASET", hrs: 15, co: "CO4" },
    { sl: 5, module: "LIST CONTROL: GRID VIEW - REPEATER - DATA LIST - STATE MANAGEMENT", hrs: 10, co: "CO5" },
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

  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // ─── Step 1: Year Selection ───
  if (!selectedYear) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-premium-lg">
            <FiPlayCircle size={36} />
          </div>
          <h1 className="font-display text-4xl font-bold text-gray-900">Video Lectures</h1>
          <p className="mt-2 text-sm text-gray-500">Select your year to browse subject-wise lectures &amp; syllabus</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[1, 2, 3].map((year, i) => {
            const s = yearStyles[year];
            return (
              <motion.button
                key={year}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.12, type: "spring", stiffness: 80 }}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedYear(year)}
                className="group relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-glass border border-white/30 shadow-glass transition-all duration-500 hover:shadow-glass-lg hover:bg-white/90"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${s.lightGradient} opacity-60 group-hover:opacity-90 transition-opacity duration-500`} />
                <div className="relative p-8 text-center">
                  <div className={`mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br ${s.gradient} text-3xl font-bold text-white shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl`}>
                    {CURRICULUM[year].icon}
                  </div>
                  <h2 className={`text-xl font-bold ${s.text}`}>{CURRICULUM[year].label}</h2>
                  <p className="mt-1.5 text-xs text-gray-400">
                    {Object.keys(CURRICULUM[year].semesters).length} Semesters
                  </p>
                  <div className="mt-4 inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                    Browse Lectures <FiChevronRight size={12} />
                  </div>
                </div>
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${s.gradient} scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500`} />
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
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => { setSelectedYear(null); setSelectedSemester(null); setSelectedSubject(null); }}
          className="mb-8 inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white/60 backdrop-blur-sm px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-white/80 transition-all"
        >
          <FiArrowLeft size={14} /> Back to Years
        </motion.button>

        <motion.div variants={pageVariants} initial="hidden" animate="visible" className="mb-8 text-center">
          <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${ys.gradient} text-white shadow-lg`}>
            <FiLayers size={28} />
          </div>
          <h1 className={`font-display text-2xl font-bold ${ys.text}`}>{yearData.label}</h1>
          <p className="mt-1 text-sm text-gray-500">Choose a semester</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {sems.map(([semKey, semData], i) => (
            <motion.button
              key={semKey}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedSemester(Number(semKey))}
              className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-glass border border-white/30 shadow-glass transition-all duration-300 hover:shadow-glass-lg hover:bg-white/90"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${ys.lightGradient} opacity-50 group-hover:opacity-80 transition-opacity`} />
              <div className="relative p-8 text-center">
                <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br ${ys.gradient} text-xl font-bold text-white shadow-md`}>
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
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedSemester(null)}
          className="mb-8 inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white/60 backdrop-blur-sm px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-white/80 transition-all"
        >
          <FiArrowLeft size={14} /> Back to Semesters
        </motion.button>

        <motion.div variants={pageVariants} initial="hidden" animate="visible" className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
            <span className={ys.text}>{yearData.label}</span>
            <FiChevronRight size={12} />
            <span className={ys.text}>{semesterData.label}</span>
          </div>
          <h1 className={`font-display text-2xl font-bold ${ys.text}`}>Select Subject</h1>
          <p className="mt-1 text-sm text-gray-500">Choose a subject to view its syllabus &amp; video lectures</p>
        </motion.div>

        {semesterData.subjects.length === 0 ? (
          <motion.div variants={pageVariants} initial="hidden" animate="visible"
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setSelectedSubject(subject); setShowVideos(false); }}
                  className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-glass border border-white/30 shadow-glass transition-all duration-300 hover:shadow-glass-lg hover:bg-white/90"
                >
                  <div className="relative flex items-start gap-4 p-5">
                    <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${sc.from} ${sc.to} text-white shadow-soft transition-all duration-300 group-hover:scale-105 group-hover:shadow-md`}>
                      <FiBook size={22} />
                    </div>
                    <div className="min-w-0 flex-1 pt-1">
                      <h3 className="font-display font-bold text-sm text-gray-900 leading-snug">{subject}</h3>
                      {FACULTY_MAP[subject] && (
                        <p className="mt-0.5 text-[11px] font-semibold tracking-wide text-gray-500">
                          {FACULTY_MAP[subject]}
                        </p>
                      )}
                      <div className="mt-3 flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 rounded-full ${sc.badge} px-2.5 py-0.5 text-[10px] font-semibold`}>
                          <FiBookOpen size={10} /> VIEW SYLLABUS
                        </span>
                        <FiChevronRight size={14} className="text-gray-300 group-hover:text-blue-500 transition-colors ml-auto" />
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

  // ─── Step 4: Syllabus View ───
  if (!showVideos) {
    const sc = subjectColors[semesterData.subjects.indexOf(selectedSubject) % subjectColors.length];
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          onClick={() => { setSelectedSubject(null); }}
          className="mb-8 inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white/60 backdrop-blur-sm px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-white/80 transition-all"
        >
          <FiArrowLeft size={14} /> Back to Subjects
        </motion.button>

        <motion.div variants={pageVariants} initial="hidden" animate="visible" className="mb-4 flex items-center gap-2 text-xs text-gray-400">
          <span className={ys.text}>{yearData.label}</span>
          <FiChevronRight size={10} />
          <span className={ys.text}>{semesterData.label}</span>
          <FiChevronRight size={10} />
          <span className="text-gray-700 font-semibold">{selectedSubject}</span>
        </motion.div>

        <motion.div variants={pageVariants} initial="hidden" animate="visible" className="mb-8">
          <div className="flex items-center gap-4">
            <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${sc.from} ${sc.to} text-white shadow-lg`}>
              <FiBookOpen size={28} />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-gray-900">{selectedSubject}</h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-gray-500">{yearData.label} · {semesterData.label}</span>
                <span className="badge-primary">{syllabusData?.length || 0} modules</span>
              </div>
            </div>
          </div>
        </motion.div>

        {syllabusData ? (
          <motion.div variants={pageVariants} initial="hidden" animate="visible"
            className="mb-8 overflow-hidden rounded-2xl bg-white/80 backdrop-blur-glass border border-white/30 shadow-glass"
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-5 py-3.5">
              <div className="flex items-center gap-2 text-white">
                <FiBookOpen size={15} />
                <span className="text-xs font-bold uppercase tracking-wider">Syllabus</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-50/80 text-gray-600">
                    <th className="px-5 py-3 font-bold uppercase tracking-wider w-14">Sl No</th>
                    <th className="px-5 py-3 font-bold uppercase tracking-wider">Contents of Module</th>
                    <th className="px-5 py-3 font-bold uppercase tracking-wider text-center w-20">Hrs</th>
                    <th className="px-5 py-3 font-bold uppercase tracking-wider text-center w-20">COs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {syllabusData.map((row) => (
                    <tr key={row.sl} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-gray-700 align-top">{row.sl}</td>
                      <td className="px-5 py-3.5 text-gray-600 leading-relaxed font-medium">{row.module}</td>
                      <td className="px-5 py-3.5 text-center font-semibold text-gray-700 align-top">{row.hrs}</td>
                      <td className="px-5 py-3.5 text-center font-bold text-blue-700 align-top">{row.co}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          <motion.div variants={pageVariants} initial="hidden" animate="visible"
            className="mb-8 rounded-2xl border border-dashed border-gray-200 bg-white/50 py-16 text-center"
          >
            <FiBookOpen size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="text-sm text-gray-400">Syllabus not yet available for this subject</p>
          </motion.div>
        )}

        <motion.div variants={pageVariants} initial="hidden" animate="visible" className="flex justify-center">
          <button onClick={() => setShowVideos(true)}
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-3.5 text-sm font-bold text-white shadow-premium transition-all duration-300 hover:shadow-neon-primary hover:from-blue-500 hover:to-indigo-600 active:scale-[0.97]"
          >
            <FiPlayCircle size={20} />
            Watch Videos
            <FiChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </button>
        </motion.div>
      </div>
    );
  }

  // ─── Step 5: Videos ───
  const sc = subjectColors[semesterData.subjects.indexOf(selectedSubject) % subjectColors.length];
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        onClick={() => setShowVideos(false)}
        className="mb-8 inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white/60 backdrop-blur-sm px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-white/80 transition-all"
      >
        <FiArrowLeft size={14} /> Back to Syllabus
      </motion.button>

      <motion.div variants={pageVariants} initial="hidden" animate="visible" className="mb-2 flex items-center gap-2 text-xs text-gray-400">
        <span className={ys.text}>{yearData.label}</span>
        <FiChevronRight size={10} />
        <span className={ys.text}>{semesterData.label}</span>
        <FiChevronRight size={10} />
        <span className="text-gray-700 font-semibold">{selectedSubject}</span>
        <FiChevronRight size={10} />
        <span className="text-blue-600 font-semibold">Videos</span>
      </motion.div>

      <motion.div variants={pageVariants} initial="hidden" animate="visible" className="mb-8">
        <div className="flex items-center gap-4">
          <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${sc.from} ${sc.to} text-white shadow-lg`}>
            <FiMonitor size={28} />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-gray-900">{selectedSubject}</h1>
            <p className="text-xs text-gray-500">
              {yearData.label} · {semesterData.label}
            </p>
          </div>
        </div>
      </motion.div>

      {subjectVideos.length === 0 ? (
        <motion.div variants={pageVariants} initial="hidden" animate="visible"
          className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white/50 py-24"
        >
          <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 shadow-soft">
            <FiYoutube size={44} className="text-blue-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-700">No Videos Added Yet</h3>
          <p className="mt-1 max-w-md text-center text-sm text-gray-400">
            Video lectures for {selectedSubject} will be uploaded soon.
          </p>
          <span className="mt-6 badge-primary">{yearData.label} · {semesterData.label}</span>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {subjectVideos.map((video, i) => (
            <motion.div key={video.id || i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <button onClick={() => setPlaying(video)}
                className="group w-full overflow-hidden rounded-2xl bg-white/80 backdrop-blur-glass border border-white/30 shadow-glass transition-all duration-300 hover:shadow-glass-lg hover:-translate-y-1 text-left"
              >
                <div className="relative aspect-video w-full bg-gradient-to-br from-gray-100 to-gray-200">
                  {video.youtubeId && (
                    <img src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`} alt={video.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-premium transition-transform duration-300 group-hover:scale-110">
                      <FiPlayCircle size={24} className="text-blue-600 ml-0.5" />
                    </div>
                  </div>
                  {video.duration && (
                    <span className="absolute bottom-3 right-3 rounded-lg bg-black/70 backdrop-blur-sm px-2.5 py-1 text-[10px] font-mono text-white border border-white/10">
                      {video.duration}
                    </span>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                <div className="p-4">
                  <h3 className="line-clamp-1 font-display text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {video.title || "Lecture Video"}
                  </h3>
                  {video.description && (
                    <p className="mt-0.5 text-xs text-gray-500 line-clamp-1">{video.description}</p>
                  )}
                  <div className="mt-2 flex items-center gap-2">
                    <span className="badge-primary">Lecture</span>
                    {video.facultyName && <span className="text-[10px] text-gray-400">{video.facultyName}</span>}
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {playing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 p-4 backdrop-blur-sm"
            onClick={() => setPlaying(null)}
          >
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-premium-lg"
            >
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-bold text-gray-900">{playing.title || "Lecture"}</h3>
                  <p className="text-[11px] text-gray-500">{selectedSubject}</p>
                </div>
                <button onClick={() => setPlaying(null)} className="rounded-full bg-gray-100 p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-all">
                  <FiX size={16} />
                </button>
              </div>
              <div className="aspect-video w-full bg-black">
                {playing.youtubeId ? (
                  <iframe src={`https://www.youtube.com/embed/${playing.youtubeId}?autoplay=1&rel=0`}
                    title={playing.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen className="h-full w-full" />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400 text-sm">
                    Video URL not available
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
