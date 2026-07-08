// src/pages/Notes.jsx
// Lecture Notes — year → semester → subject drill-down flow with unit-based PDF downloads
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiFileText, FiDownload, FiBookOpen,
  FiArrowLeft, FiChevronRight, FiLayers,
  FiChevronDown, FiExternalLink,
} from "react-icons/fi";

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

// ─── Faculty Map ───
const FACULTY_MAP = {
  "OPERATING SYSTEM": "DR DHARANI",
  "DATA MINING TECHNIQUES": "V PONNILA",
  "ASP.NET": "R SARANYA",
  "DATABASE MANAGEMENT SYSTEM": "M P SUDHA",
};

// ─── Unit-based Notes Data (Google Drive PDFs) ───
// Structure: subject → units → files
// fileId = Google Drive file ID for embedding/preview/download
const NOTES_DATA = {
  "OPERATING SYSTEM": {
    units: {
      1: {
        title: "Unit I",
        subtitle: "Introduction to OS",
        syllabus: "INTRODUCTION - VIEWS AND GOALS - OPERATING-SYSTEM SERVICES - USER AND OPERATING-SYSTEM INTERFACE - SYSTEM CALL - TYPES OF SYSTEM CALLS - OPERATING SYSTEM DESIGN AND IMPLEMENTATION - OPERATING-SYSTEM STRUCTURE. PROCESS MANAGEMENT: PROCESS CONCEPT - PROCESS SCHEDULING - OPERATIONS ON PROCESSES - INTERPROCESS COMMUNICATION. THREADS: TYPES OF THREADS",
        files: [
          {
            id: "os-u1-1",
            title: "OS Introduction",
            fileName: "OS-INTRO.pptx",
            fileId: "1GixI9_7uxRNzbf5qSe_wf4McmWaylQDS",
            type: "pptx",
          },
          {
            id: "os-u1-2",
            title: "Session 2 - OS Basics",
            fileName: "ses-2.pptx",
            fileId: "1Zny7cAR4GR0YTRr3sIZT-u-FAOIQvQ-d",
            type: "pptx",
          },
          {
            id: "os-u1-3",
            title: "OS Structures - Unit 1",
            fileName: "os structures-unit 1.pdf",
            fileId: "1O8-gnDMSgXurNN6O99N4S26z-UlONUbu",
            type: "pdf",
          },
          {
            id: "os-u1-4",
            title: "OS Structures",
            fileName: "OSStructures.ppt",
            fileId: "1xqoPAFz_xavBAX8RR8nNErwANXnce-3B",
            type: "ppt",
          },
          {
            id: "os-u1-5",
            title: "Processes",
            fileName: "os-processes.ppt",
            fileId: "1MoiwrzKonwOc4MH9wuO_sxKm92coXyYM",
            type: "ppt",
          },
          {
            id: "os-u1-6",
            title: "Interprocess Communication",
            fileName: "interprocesscommunication-180721182943.pptx",
            fileId: "14mf_5YIS0TZB00phmq2kTSN8gT1gpfJY",
            type: "pptx",
          },
          {
            id: "os-u1-7",
            title: "Threads - Unit 1",
            fileName: "threads-unit 1.pdf",
            fileId: "172mi8UGGUnGPAPF7zOeSKEBkqFucF5SM",
            type: "pdf",
          },
          {
            id: "os-u1-8",
            title: "THREADS",
            fileName: "THREADS.pptx",
            fileId: "1uU4O05stk5cg2AVhfQBdC1VifAd_nrgJ",
            type: "pptx",
          },
        ],
      },
      2: {
        title: "Unit II",
        subtitle: "Process Scheduling & Synchronization",
        syllabus: "PROCESS SCHEDULING: BASIC CONCEPTS - SCHEDULING CRITERIA - SCHEDULING ALGORITHMS - MULTIPLE-PROCESSOR SCHEDULING - CPU SCHEDULING. SYNCHRONIZATION: THE CRITICAL-SECTION PROBLEM - SYNCHRONIZATION HARDWARE - SEMAPHORES",
        files: [
          {
            id: "os-u2-1",
            title: "OS Unit 2 - Process Scheduling & Synchronization",
            fileName: "OS_Unit2.pdf",
            fileId: "1J8M3d7mVSU4oxkyp6q_Dq-m4tuhdVmLV",
            type: "pdf",
          },
        ],
      },
      3: {
        title: "Unit III",
        subtitle: "Deadlocks",
        syllabus: "DEADLOCKS: DEADLOCK CHARACTERIZATION - METHODS FOR HANDLING DEADLOCKS - DEADLOCK PREVENTION - DEADLOCK AVOIDANCE - DEADLOCK DETECTION - RECOVERY FROM DEADLOCK",
        files: [],
      },
      4: {
        title: "Unit IV",
        subtitle: "Memory Management",
        syllabus: "MEMORY-MANAGEMENT STRATEGIES: SWAPPING - CONTIGUOUS MEMORY ALLOCATION - SEGMENTATION - PAGING - STRUCTURE OF THE PAGE TABLE. VIRTUAL-MEMORY MANAGEMENT: DEMAND PAGING - PAGE REPLACEMENT - ALLOCATION OF FRAMES - THRASHING",
        files: [],
      },
      5: {
        title: "Unit V",
        subtitle: "Storage Management",
        syllabus: "STORAGE MANAGEMENT: FILE SYSTEM - FILE CONCEPT - ACCESS METHODS - DIRECTORY AND DISK STRUCTURE - FILE SHARING - PROTECTION. ALLOCATION METHODS - FREE-SPACE MANAGEMENT - EFFICIENCY AND PERFORMANCE - RECOVERY",
        files: [],
      },
    },
  },
  "DATABASE MANAGEMENT SYSTEM": {
    units: {
      1: {
        title: "Unit I",
        subtitle: "Introduction to DBMS",
        syllabus: "INTRODUCTION - DATABASE SYSTEM - CHARACTERISTICS OF DATABASE MANAGEMENT SYSTEMS - ARCHITECTURE OF DATABASE MANAGEMENT SYSTEMS - DATABASE MODELS - SYSTEM DEVELOPMENT LIFE CYCLE - ENTITY RELATIONSHIP MODEL",
        files: [
          {
            id: "dbms-u1-1",
            title: "DBMS Unit 1 - Introduction",
            fileName: "DBMS_Unit1.pdf",
            fileId: "1RKBkfvx4_s9HN3kBYUK0fHRh6j451JHr",
            type: "pdf",
          },
        ],
      },
      2: {
        title: "Unit II",
        subtitle: "Relational Model & Normalization",
        syllabus: "INTRODUCTION TO RELATIONAL DATABASE MODEL - STRUCTURE OF RELATIONAL MODEL - KEYS - RELATIONAL ALGEBRA - NORMALIZATION",
        files: [],
      },
      3: {
        title: "Unit III",
        subtitle: "SQL",
        syllabus: "SQL: INTRODUCTION - DATA RETRIEVAL - SINGLE ROW FUNCTION - GROUP FUNCTION - SET FUNCTION - SUB QUERY - JOINS - DML - TCL - VIEW - SEQUENCE - INDEX",
        files: [],
      },
      4: {
        title: "Unit IV",
        subtitle: "PL/SQL",
        syllabus: "PL/SQL: INTRODUCTION - PL/SQL BASIC - CHARACTER SET - PL/SQL STRUCTURE - SQL CURSOR - SUBPROGRAMS - FUNCTIONS - PROCEDURES",
        files: [],
      },
      5: {
        title: "Unit V",
        subtitle: "Exception Handling & Triggers",
        syllabus: "EXCEPTION HANDLER - INTRODUCTION - PREDEFINED EXCEPTION - USER DEFINED EXCEPTION - TRIGGERS - IMPLICIT AND EXPLICIT CURSORS - LOOPS IN EXPLICIT CURSOR",
        files: [],
      },
    },
  },
  "ASP.NET": {
    units: {
      1: {
        title: "Unit I",
        subtitle: "Overview of ASP.NET Framework",
        syllabus: "OVERVIEW OF ASP.NET FRAMEWORK - PAGE STRUCTURE - COMPILER DIRECTIVES - NAMESPACE",
        files: [
          {
            id: "u1-1",
            title: "Overview of ASP.Net Framework",
            fileName: "Overview of ASP.Net Framework.pdf",
            fileId: "173-KUv6pOGV8o8ihTckpLwvkvDyKv9nj",
            type: "pdf",
          },
          {
            id: "u1-2",
            title: "ASP Page Structure",
            fileName: "ASP page structure.pdf",
            fileId: "1OcVM4CDJTvGvdT9WfqLHFd1Sz61kEO3a",
            type: "pdf",
          },
          {
            id: "u1-3",
            title: "Compiler Directives",
            fileName: "Compiler Directives.pdf",
            fileId: "14CpNpp7OVns3R6Kj4dWy81Io4FiFVvYi",
            type: "pdf",
          },
          {
            id: "u1-4",
            title: "NAMESPACE",
            fileName: "NAMESPACE.pdf",
            fileId: "1cbb7Mt3m7MKXJkW_Hu_YsR4tWKDJanP3",
            type: "pdf",
          },
          {
            id: "u1-5",
            title: "Overview of ASP.Net Framework (Notes)",
            fileName: "Overview of ASP.Net Framework (Notes)",
            fileId: "1VjVHcuCldGrTi6trGyb5gf4Z81RwpzsmsEqKm4Tajfg",
            type: "doc",
          },
        ],
      },
      2: {
        title: "Unit II",
        subtitle: "ASP.NET Controls",
        syllabus: "UNDERSTANDING ASP.NET CONTROL: STANDARD CONTROLS - DISPLAYING INFORMATION - ACCEPTING USER INPUT - SUBMITTING FORM DATA - DISPLAYING IMAGES - HYPER LINK CONTROL",
        files: [
          {
            id: "u2-1",
            title: "ASP.NET UNIT - 2",
            fileName: "ASP.NET UNIT -2.pptx",
            fileId: "1t4g4ab9d5HdKZGuGxmYpWcAwTkjmoqjm",
            type: "pptx",
          },
        ],
      },
      3: {
        title: "Unit III",
        subtitle: "Validation & Rich Controls",
        syllabus: "OVERVIEW OF VALIDATION CONTROL - REQUIRED FIELD VALIDATOR - RANGE VALIDATOR - COMPARE VALIDATOR - CUSTOM VALIDATOR - VALIDATION SUMMARY - RICH CONTROLS: ADROTATOR, CALENDAR",
        files: [
          {
            id: "u3-1",
            title: "Validation Controls",
            fileName: "Validation Controls.docx",
            fileId: "1z-1R0gaqaVaSIvgRybN5AiA8ExYGsJfY",
            type: "docx",
          },
          {
            id: "u3-2",
            title: "Calendar Control in ASP.NET",
            fileName: "Calendar Control in ASP.pdf",
            fileId: "1DInHlyYjC7OpG7sY1i0l987_uZLjo5iY",
            type: "pdf",
          },
          {
            id: "u3-3",
            title: "Rich Controls",
            fileName: "RICH CONTROLS.pdf",
            fileId: "1xE1sIoFOWnkI5D7GRbm0EtgyDHpxwYg0",
            type: "pdf",
          },
        ],
      },
      4: {
        title: "Unit IV",
        subtitle: "Data Access in ASP.NET",
        syllabus: "OVERVIEW OF DATA ACCESS: DATA BOUND CONTROL - DATA SOURCE CONTROL - SQLDATASOURCE - OLEDB CONNECTION - OLEDB COMMAND - OLEDB TRANSACTION - DATA ADAPTER - DATASET",
        files: [
          {
            id: "u4-1",
            title: "Data Bound Controls",
            fileName: "data bound controls.docx",
            fileId: "1IXY-buceR6cV10jEbMClDXUuveYjVWUo",
            type: "docx",
          },
          {
            id: "u4-2",
            title: "Simple Data Bound Controls",
            fileName: "Simple Data Bound Controls.pdf",
            fileId: "1PCHmZ2U3uUV8Ah83Do1vZ2bTk4uBArx7",
            type: "pdf",
          },
        ],
      },
      5: {
        title: "Unit V",
        subtitle: "List Controls & State Management",
        syllabus: "LIST CONTROL: DROPDOWN LIST - RADIOBUTTON LIST - LIST BOX - CHECKBOX LIST - BULLETED LIST - GRID VIEW - REPEATER - DATA LIST - ADO.NET - STATE MANAGEMENT: COOKIES, SESSION, WEB SERVICES",
        files: [
          {
            id: "u5-1",
            title: "List Controls (Listbox, RadioButtonList, CheckboxList, BulletedList)",
            fileName: "Listbox RadiobuttionList CheckboxList BulletedList.pdf",
            fileId: "1hGMGwEMhCFf1J_RyY3pKNKNAEVXnkwH2",
            type: "pdf",
          },
          {
            id: "u5-2",
            title: "ADO.NET Architecture",
            fileName: "ADO.NET ARCHITECTURE.pdf",
            fileId: "12EETP-MtzBDgmT_ybJ0xiTebiksP5In4",
            type: "pdf",
          },
          {
            id: "u5-3",
            title: "Application and Session State",
            fileName: "Application and Session State.pdf",
            fileId: "1FnobkINTlyJp4Nbi31oTLAtN6_PtLrUX",
            type: "pdf",
          },
          {
            id: "u5-4",
            title: "Cookies",
            fileName: "COOKIES.pdf",
            fileId: "1Lw-RzMw2vLCAbYNxR7HzcfYs_Wt102Ob",
            type: "pdf",
          },
          {
            id: "u5-5",
            title: "Web Service",
            fileName: "WEB SERVICE.pdf",
            fileId: "1lbt5Eqo79yie2GsHA6O5sgvq0j2V3xnu",
            type: "pdf",
          },
        ],
      },
    },
  },
};

// ─── Syllabus Data (from EContent) ───
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

// ─── Helper: build Google Drive embed/download URLs ───
function getDrivePreviewUrl(fileId, type = "pdf") {
  if (type === "doc") {
    return `https://docs.google.com/document/d/${fileId}/preview`;
  }
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

function getDriveDownloadUrl(fileId, type = "pdf") {
  if (type === "doc") {
    return `https://docs.google.com/document/d/${fileId}/export?format=pdf`;
  }
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}


// ─── Unit colours ───
const unitColors = [
  { from: "from-blue-500", to: "to-indigo-600", badge: "bg-blue-100 text-blue-800", light: "bg-blue-50" },
  { from: "from-emerald-500", to: "to-teal-600", badge: "bg-emerald-100 text-emerald-800", light: "bg-emerald-50" },
  { from: "from-amber-500", to: "to-orange-600", badge: "bg-amber-100 text-amber-800", light: "bg-amber-50" },
  { from: "from-rose-500", to: "to-pink-600", badge: "bg-rose-100 text-rose-800", light: "bg-rose-50" },
  { from: "from-violet-500", to: "to-purple-600", badge: "bg-violet-100 text-violet-800", light: "bg-violet-50" },
];

export default function Notes() {
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  // Unit-based notes state
  const [expandedUnit, setExpandedUnit] = useState(null);
  const [viewingPdf, setViewingPdf] = useState(null);



  const yearData = selectedYear ? CURRICULUM[selectedYear] : null;
  const semesterData = selectedSemester && yearData ? yearData.semesters[selectedSemester] : null;
  const ys = selectedYear ? yearStyles[selectedYear] : yearStyles[1];

  // Get notes data for the selected subject
  const subjectNotesData = selectedSubject ? NOTES_DATA[selectedSubject] : null;
  const syllabusData = selectedSubject ? SYLLABUS[selectedSubject] : null;

  // ─── Step 1: Year Selection ───
  if (!selectedYear) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-premium">
            <FiBookOpen size={32} />
          </div>
          <h1 className="font-display text-3xl font-bold text-gray-900">Lecture Notes</h1>
          <p className="mt-1 text-sm text-gray-400">Select your year to browse faculty-curated PDF notes by subject</p>
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
          <p className="mt-1 text-sm text-gray-400">Choose a subject to browse its lecture notes</p>
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
              const hasNotes = NOTES_DATA[subject] && Object.values(NOTES_DATA[subject].units).some(u => u.files.length > 0);
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
                          <FiFileText size={10} /> VIEW NOTES
                        </span>
                        {hasNotes && (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-[9px] font-bold text-green-700">
                            PDFs
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

  // ─── Step 4: Subject Detail View (Syllabus + Unit Notes) ───
  const sc = subjectColors[semesterData.subjects.indexOf(selectedSubject) % subjectColors.length];
  const units = subjectNotesData ? Object.entries(subjectNotesData.units) : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb & Back */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => { setSelectedSubject(null); setExpandedUnit(null); setViewingPdf(null); }}
          className="mb-3 inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-all"
        >
          <FiArrowLeft size={14} /> Back to Subjects
        </motion.button>

        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className={ys.text}>{yearData.label}</span>
          <FiChevronRight size={10} />
          <span className={ys.text}>{semesterData.label}</span>
          <FiChevronRight size={10} />
          <span className="text-gray-700 font-semibold">{selectedSubject}</span>
        </div>
      </motion.div>

      {/* Subject Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-4">
          <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${sc.from} ${sc.to} text-white shadow-lg`}>
            <FiBookOpen size={26} />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-gray-900 sm:text-2xl">{selectedSubject}</h1>
            <p className="text-xs text-gray-400">
              {yearData.label} · {semesterData.label}{" "}
              · {syllabusData ? `${syllabusData.length} modules` : ""}
            </p>
          </div>
        </div>
      </motion.div>

      {/* ═══ Syllabus Table ═══ */}
      {syllabusData ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-soft"
        >
          <div className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-3 text-white">
            <FiBookOpen size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Syllabus</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-700">
                  <th className="px-4 py-2.5 font-bold uppercase tracking-wider w-12">Sl No</th>
                  <th className="px-4 py-2.5 font-bold uppercase tracking-wider">Contents of Module</th>
                  <th className="px-4 py-2.5 font-bold uppercase tracking-wider text-center w-16">Hrs</th>
                  <th className="px-4 py-2.5 font-bold uppercase tracking-wider text-center w-16">COs</th>
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

      {/* ═══ Download Notes Section ═══ */}
      {subjectNotesData && units.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          {/* Section Header */}
          <div className="mb-5 flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${sc.from} ${sc.to} text-white shadow-md`}>
              <FiDownload size={18} />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-gray-900">Download Notes</h2>
              <p className="text-[11px] text-gray-400">
                {units.reduce((s, [, u]) => s + u.files.length, 0)} PDFs available across {units.length} units
              </p>
            </div>
          </div>

          {/* Units Accordion */}
          <div className="space-y-3">
            {units.map(([unitKey, unit], idx) => {
              const uc = unitColors[idx % unitColors.length];
              const isExpanded = expandedUnit === unitKey;
              const fileCount = unit.files.length;

              return (
                <motion.div
                  key={unitKey}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * idx }}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-soft"
                >
                  {/* Unit Header (clickable) */}
                  <button
                    onClick={() => setExpandedUnit(isExpanded ? null : unitKey)}
                    className={`flex w-full items-center justify-between px-4 py-3.5 text-left transition-all ${
                      isExpanded ? `${uc.light} border-b border-gray-100` : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${uc.from} ${uc.to} text-white text-xs font-bold shadow-sm`}>
                        {unitKey}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-gray-900">{unit.title}</h3>
                        <p className="text-[11px] text-gray-500">{unit.subtitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {fileCount > 0 && (
                        <span className={`rounded-full ${uc.badge} px-2.5 py-0.5 text-[10px] font-bold`}>
                          {fileCount} PDF{fileCount > 1 ? "s" : ""}
                        </span>
                      )}
                      <FiChevronDown
                        size={16}
                        className={`text-gray-400 transition-transform duration-200 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {/* Unit Content (expandable) */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 py-3">
                          {/* Syllabus snippet */}
                          {unit.syllabus && (
                            <div className="mb-3 rounded-lg bg-gray-50 px-3 py-2">
                              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Topics</p>
                              <p className="mt-0.5 text-[11px] text-gray-600 leading-relaxed">{unit.syllabus}</p>
                            </div>
                          )}

                          {/* Files */}
                          {fileCount > 0 ? (
                            <div className="space-y-2">
                              {unit.files.map((file, i) => (
                                <motion.button
                                  key={file.id}
                                  initial={{ opacity: 0, x: -8 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.04 }}
                                  onClick={() => setViewingPdf({ ...file, subject: selectedSubject, unit: unit.title })}
                                  className="group flex w-full items-center gap-3 rounded-lg border border-gray-100 bg-white p-3 text-left transition-all hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-sm active:scale-[0.98]"
                                >
                                  {/* Thumbnail */}
                                  <div className="flex h-10 w-8 shrink-0 items-center justify-center rounded-md bg-red-50 text-red-500 shadow-sm overflow-hidden">
                                    {file.type === "doc" ? (
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                                    ) : (
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                    )}
                                  </div>

                                  {/* File info */}
                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                                      {file.title}
                                    </p>
                                    <p className="text-[10px] text-gray-400">
                                      {file.type === "doc" ? "Google Doc" : file.type === "docx" ? "Word" : file.type === "pptx" ? "PowerPoint" : file.type === "ppt" ? "PowerPoint" : file.type === "zip" ? "ZIP" : "PDF"} · {unit.title}
                                    </p>
                                  </div>

                                  {/* Open icon */}
                                  <div className="shrink-0 rounded-full bg-gray-100 p-1.5 text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-all">
                                    <FiExternalLink size={12} />
                                  </div>
                                </motion.button>
                              ))}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center py-6 text-gray-400">
                              <FiFileText size={24} className="mb-1 opacity-40" />
                              <p className="text-xs font-medium">No PDFs uploaded yet</p>
                              <p className="text-[10px] text-gray-300">Notes will appear here once uploaded by faculty</p>
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

      {/* ═══ PDF Viewer Modal ═══ */}
      <AnimatePresence>
        {viewingPdf && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 p-2 sm:p-4 backdrop-blur-sm"
            onClick={() => setViewingPdf(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-premium-lg"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-gray-900">{viewingPdf.title}</h3>
                  <p className="text-[11px] text-gray-500">
                    {viewingPdf.subject} · {viewingPdf.unit}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {/* Download Button */}
                  <a
                    href={getDriveDownloadUrl(viewingPdf.fileId, viewingPdf.type)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-2 text-xs font-bold text-white shadow-soft hover:shadow-premium transition-all"
                  >
                    <FiDownload size={14} />
                    Download
                  </a>
                  {/* Close Button */}
                  <button
                    onClick={() => setViewingPdf(null)}
                    className="rounded-full bg-white/80 p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* PDF Viewer */}
              <div className="aspect-[4/3] w-full bg-gray-100 sm:aspect-[16/10] lg:aspect-[16/9]">
                <iframe
                  src={getDrivePreviewUrl(viewingPdf.fileId, viewingPdf.type)}
                  title={viewingPdf.title}
                  className="h-full w-full"
                  allowFullScreen
                />
              </div>

              {/* Footer */}
              <div className="border-t border-gray-100 px-4 py-2 text-center text-[11px] text-gray-400">
                {viewingPdf.fileName} · {viewingPdf.subject} · {viewingPdf.unit}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
