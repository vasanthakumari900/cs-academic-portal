import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiFileText, FiDownload, FiBookOpen,
  FiArrowLeft, FiChevronRight, FiLayers,
  FiChevronDown, FiExternalLink, FiSearch, FiUploadCloud,
} from "react-icons/fi";
import { useFirestoreList } from "../hooks/useFirestoreList";
import { noteService } from "../services/noteService";
import { useAuth } from "../context/AuthContext";
import { STORAGE_PATHS } from "../utils/constants";
import { uploadFile } from "../services/storageService";
import toast from "react-hot-toast";

const CURRICULUM = {
  1: { label: "1st Year", icon: "Ⅰ", semesters: { 1: { label: "Semester 1", subjects: ["FUNDAMENTALS OF PYTHON PROGRAMMING","FUNDAMENTALS OF DIGITAL ELECTRONICS","MATHEMATICS PAPER - I","TAMIL","ENGLISH","DATA STRUCTURES"] }, 2: { label: "Semester 2", subjects: ["OBJECT ORIENTED PROGRAMMING USING C++","MATHEMATICS PAPER - II","TAMIL","ENGLISH"] } } },
  2: { label: "2nd Year", icon: "Ⅱ", semesters: { 1: { label: "Semester 1", subjects: ["JAVA PROGRAMMING","WEB TECHNOLOGY","STATISTICAL METHODS FOR COMPUTER SCIENCE - I","TAMIL","ENGLISH","OPERATING SYSTEM","REACT"] }, 2: { label: "Semester 2", subjects: ["ANDROID APP DEVELOPMENT","SOFTWARE ENGINEERING","STATISTICAL METHODS FOR COMPUTER SCIENCE - II","ARTIFICIAL INTELLIGENCE AND EXPERT SYSTEM","TAMIL","ENGLISH"] } } },
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
  "SOFTWARE ENGINEERING": "V PONNILA",
};

// Placeholder subjects in 2nd Year that share names with higher years — show name only, no content
const PLACEHOLDER_SUBJECTS = new Set(["OPERATING SYSTEM"]);

// Subjects that appear name-only in specific year+semester combos (subject listed but no notes/syllabus)
const NAME_ONLY_MAP = {
  "1-1": new Set(["TAMIL", "ENGLISH"]), // 1st Year Sem 1 - TAMIL & ENGLISH name only
  "1-2": new Set(["TAMIL", "ENGLISH"]), // 1st Year Sem 2 - TAMIL & ENGLISH name only
  "2-1": new Set(["ENGLISH"]),          // 2nd Year Sem 1 - ENGLISH name only
  "2-2": new Set(["ENGLISH"]),          // 2nd Year Sem 2 - ENGLISH name only
};

// Semester-specific unit keys for subjects shared across different semesters
// Maps "year-semester" -> subject -> Set of allowed unit numbers
const SEMESTER_UNITS = {
  "1-1": { "ENGLISH": new Set([1]) },
  "1-2": { "ENGLISH": new Set([1]) },
  "2-1": { "TAMIL": new Set([1,2,3,4,5,6,7,8]), "ENGLISH": new Set([2]) },
  "2-2": { "TAMIL": new Set([9,10,11,12,13]), "ENGLISH": new Set([2]) },
};

// Teachers exclusive to 1st Year Semester 1
const FIRST_YEAR_SEM1_FACULTY = {
  "TAMIL": "MR.VADIVELMURUGAN",
  "ENGLISH": "MS. RITZY WONDERBELL",
  "MATHEMATICS PAPER - I": "MR.KARNAN, MR.SATHISHKUMAR",
  "FUNDAMENTALS OF PYTHON PROGRAMMING": "MS.V.PONNILA",
  "DATA STRUCTURES": "DR.R.LALITHA",
};

const NOTES_DATA = {
  "OPERATING SYSTEM": { units: { 1: { title: "Unit I", subtitle: "Introduction to OS", syllabus: "INTRODUCTION - VIEWS AND GOALS - OPERATING-SYSTEM SERVICES - USER AND OPERATING-SYSTEM INTERFACE - SYSTEM CALL - TYPES OF SYSTEM CALLS", files: [{ id: "os-u1-1", title: "OS Introduction", fileName: "OS-INTRO.pptx", fileId: "1GixI9_7uxRNzbf5qSe_wf4McmWaylQDS", type: "pptx" },{ id: "os-u1-2", title: "Session 2 - OS Basics", fileName: "ses-2.pptx", fileId: "1Zny7cAR4GR0YTRr3sIZT-u-FAOIQvQ-d", type: "pptx" },{ id: "os-u1-3", title: "OS Structures - Unit 1", fileName: "os structures-unit 1.pdf", fileId: "1O8-gnDMSgXurNN6O99N4S26z-UlONUbu", type: "pdf" },{ id: "os-u1-4", title: "OS Structures", fileName: "OSStructures.ppt", fileId: "1xqoPAFz_xavBAX8RR8nNErwANXnce-3B", type: "ppt" },{ id: "os-u1-5", title: "Processes", fileName: "os-processes.ppt", fileId: "1MoiwrzKonwOc4MH9wuO_sxKm92coXyYM", type: "ppt" },{ id: "os-u1-6", title: "Interprocess Communication", fileName: "interprocesscommunication-180721182943.pptx", fileId: "14mf_5YIS0TZB00phmq2kTSN8gT1gpfJY", type: "pptx" },{ id: "os-u1-7", title: "Threads - Unit 1", fileName: "threads-unit 1.pdf", fileId: "172mi8UGGUnGPAPF7zOeSKEBkqFucF5SM", type: "pdf" },{ id: "os-u1-8", title: "THREADS", fileName: "THREADS.pptx", fileId: "1uU4O05stk5cg2AVhfQBdC1VifAd_nrgJ", type: "pptx" }] }, 2: { title: "Unit II", subtitle: "Process Scheduling & Synchronization", syllabus: "PROCESS SCHEDULING: BASIC CONCEPTS - SCHEDULING CRITERIA - SCHEDULING ALGORITHMS - MULTIPLE-PROCESSOR SCHEDULING - CPU SCHEDULING. SYNCHRONIZATION: THE CRITICAL-SECTION PROBLEM - SYNCHRONIZATION HARDWARE - SEMAPHORES",          files: [
            { id: "os-u2-1", title: "OS Unit 2 - Process Scheduling & Synchronization", fileName: "OS_Unit2.pdf", fileId: "1J8M3d7mVSU4oxkyp6q_Dq-m4tuhdVmLV", type: "pdf" },
            { id: "os-u2-2", title: "CPU Scheduling Algorithms", fileName: "CPU_Scheduling_Algorithms.pdf", fileId: "1_XELBrqMfKayUaj3iU_SqpwY_NQv55Kt", type: "pdf" },
            { id: "os-u2-3", title: "Process Scheduling - Basic Concepts & Criteria", fileName: "Process_Scheduling_Concepts.pdf", fileId: "1G25fBzDLCLnCHNu_dby65kRLi5IUyJRW", type: "pdf" },
            { id: "os-u2-4", title: "Multiple-Processor Scheduling", fileName: "Multiple_Processor_Scheduling.pdf", fileId: "18GbhNE-Or0GQCk-Y3-bYNzbV8JbEFX7J", type: "pdf" },
            { id: "os-u2-5", title: "Process Synchronization & Semaphores", fileName: "Process_Synchronization.pdf", fileId: "1KzBX3DYJipevwk5eYTBU6uv52NZX7F8C", type: "pdf" }
          ]
        }, 3: { title: "Unit III", subtitle: "Deadlocks", syllabus: "DEADLOCKS: DEADLOCK CHARACTERIZATION - METHODS FOR HANDLING DEADLOCKS - DEADLOCK PREVENTION - DEADLOCK AVOIDANCE - DEADLOCK DETECTION - RECOVERY FROM DEADLOCK", files: [
            { id: "os-u3-1", title: "Deadlocks - Characterization, Prevention & Avoidance", fileName: "Deadlocks_Unit3.pdf", fileId: "1KEvkmZURClibxejv1uiRlpAENXP9mlSE", type: "pdf" }
          ]
        }, 4: { title: "Unit IV", subtitle: "Memory Management", syllabus: "MEMORY-MANAGEMENT STRATEGIES: SWAPPING - CONTIGUOUS MEMORY ALLOCATION - SEGMENTATION - PAGING - STRUCTURE OF THE PAGE TABLE", files: [
            { id: "os-u4-1", title: "Memory Management - Swapping & Contiguous Allocation", fileName: "Memory_Swapping_Allocation.pdf", fileId: "1w5o-MsZ6pgyB3DEbMuA7UHF2e38Dd3Jc", type: "pdf" },
            { id: "os-u4-2", title: "Segmentation", fileName: "Segmentation.pdf", fileId: "1pzxj1nLB8W2cbjLyfRXTx1SSfLu4KixD", type: "pdf" },
            { id: "os-u4-3", title: "Paging", fileName: "Paging.pdf", fileId: "1kIsJciTjPagETuo350PmDQUgOWLlbeAO", type: "pdf" },
            { id: "os-u4-4", title: "Structure of the Page Table", fileName: "Page_Table_Structure.pdf", fileId: "1U_G19A8JVehszrXY2XFjxKx6SBfBbptL", type: "pdf" },
            { id: "os-u4-5", title: "Memory Management Strategies Overview", fileName: "Memory_Management_Strategies.pdf", fileId: "1NkJUQVv7ufUccXPE1sI_zhfXFVRTql6L", type: "pdf" }
          ]
        }, 5: { title: "Unit V", subtitle: "Storage Management", syllabus: "STORAGE MANAGEMENT: FILE SYSTEM - FILE CONCEPT - ACCESS METHODS - DIRECTORY AND DISK STRUCTURE - FILE SHARING - PROTECTION", files: [
            { id: "os-u5-1", title: "File System & File Concept", fileName: "File_System_Concept.pdf", fileId: "1HYnm9Ih13bwLt2Z6XtCZS_ORu1BU5XVW", type: "pdf" },
            { id: "os-u5-2", title: "Access Methods & Directory Structure", fileName: "Access_Methods_Directory.pdf", fileId: "1Nu7e79tt6PV6la3cXv9ulvb_BCgMaEX1", type: "pdf" },
            { id: "os-u5-3", title: "File Sharing & Protection", fileName: "File_Sharing_Protection.pdf", fileId: "1c_UXqc3WB3whDm9r3tDZtPH3asdONrzK", type: "pdf" }
          ]
        } } },

  "DATABASE MANAGEMENT SYSTEM": { units: { 1: { title: "Unit I", subtitle: "Introduction to DBMS", syllabus: "INTRODUCTION - DATABASE SYSTEM - CHARACTERISTICS OF DBMS - ARCHITECTURE - DATABASE MODELS - SDLC - ENTITY RELATIONSHIP MODEL", files: [{ id: "dbms-u1-1", title: "DBMS Unit 1 - Introduction", fileName: "DBMS_Unit1.pdf", fileId: "1RKBkfvx4_s9HN3kBYUK0fHRh6j451JHr", type: "pdf" }] }, 2: { title: "Unit II", subtitle: "Relational Model & Normalization", syllabus: "INTRODUCTION TO RELATIONAL DATABASE MODEL - KEYS - RELATIONAL ALGEBRA - NORMALIZATION", files: [] }, 3: { title: "Unit III", subtitle: "SQL", syllabus: "SQL: INTRODUCTION - DATA RETRIEVAL - FUNCTIONS - SUB QUERY - JOINS - DML - TCL", files: [] }, 4: { title: "Unit IV", subtitle: "PL/SQL", syllabus: "PL/SQL: INTRODUCTION - BASIC - CHARACTER SET - STRUCTURE - SQL CURSOR - SUBPROGRAMS", files: [] }, 5: { title: "Unit V", subtitle: "Exception Handling & Triggers", syllabus: "EXCEPTION HANDLER - TRIGGERS - CURSORS", files: [] } } },
  "DATA MINING TECHNIQUES": { units: {
    1: { title: "Unit I", subtitle: "Introduction to Data Mining", syllabus: "INTRODUCTION - DATA MINING - KINDS OF DATA - KINDS OF PATTERNS - APPLICATIONS - ISSUES", files: [
      { id: "dmt-u1-1", title: "DMT Unit 1 - Introduction to Data Mining (Part 1)", fileName: "DMT_Unit1_Part1.pptx", fileId: "1_8xLyy3sW6wik6TwtyIByBXbAsEAR8zc", type: "pptx" },
      { id: "dmt-u1-2", title: "DMT Unit 1 - Introduction to Data Mining (Part 2)", fileName: "DMT_Unit1_Part2.pptx", fileId: "1M4m8rqaFHIcpVHVWWHQvsK86yDOjTq9e", type: "pptx" },
      { id: "dmt-u1-3", title: "DMT Unit 1 - Kinds of Data & Patterns", fileName: "DMT_Unit1_Part3.pptx", fileId: "1PX-Eg6OUlGqwxF9Q4VWDAYhh_-pyeeEK", type: "pptx" }
    ] },
    2: { title: "Unit II", subtitle: "Data Preprocessing", syllabus: "DATA PREPROCESSING - DATA CLEANING - DATA INTEGRATION - DATA REDUCTION", files: [
      { id: "dmt-u2-1", title: "DMT Unit 2 - Data Preprocessing (Part 1)", fileName: "DMT_Unit2_Part1.pptx", fileId: "1JIDI_w7MlYt00c0mZH-1r8Zi-jAZKYXW", type: "pptx" },
      { id: "dmt-u2-2", title: "DMT Unit 2 - Data Preprocessing (Part 2)", fileName: "DMT_Unit2_Part2.pdf", fileId: "1mV8bZwHl2q5Npp0dZR2fjiwC_DeJqDXm", type: "pdf" },
      { id: "dmt-u2-3", title: "DMT Unit 2 - Data Cleaning & Integration", fileName: "DMT_Unit2_Part3.pptx", fileId: "1iMoQ5BCEGBhCwPiPXUlw0EADnKgmNNrU", type: "pptx" },
      { id: "dmt-u2-4", title: "DMT Unit 2 - Data Reduction", fileName: "DMT_Unit2_Part4.pdf", fileId: "1kwXx7RvoqPCuX-iAue_TLZ3PoZq0imPD", type: "pdf" }
    ] },
    3: { title: "Unit III", subtitle: "Mining Frequent Patterns", syllabus: "MINING FREQUENT PATTERNS - APRIORI ALGORITHM - ASSOCIATION RULES", files: [
      { id: "dmt-u3-1", title: "DMT Unit 3 - Frequent Patterns & Apriori Algorithm", fileName: "DMT_Unit3.pptx", fileId: "1T0hcjDoxW57II_5eXDXIXjMxzQsCEF-o", type: "pptx" }
    ] },
    4: { title: "Unit IV", subtitle: "Classification", syllabus: "CLASSIFICATION - DECISION TREE - BAYES CLASSIFICATION - RULE-BASED CLASSIFICATION", files: [
      { id: "dmt-u4-1", title: "DMT Unit 4 - Classification (Part 1)", fileName: "DMT_Unit4_Part1.pptx", fileId: "16MOr4LnUukcXE4Ey11RaTV67VCOiaz4y", type: "pptx" },
      { id: "dmt-u4-2", title: "DMT Unit 4 - Decision Tree & Bayes Classification", fileName: "DMT_Unit4_Part2.pptx", fileId: "1Oavo7kURP2xJlTjnNMLaYk2bYpuU2JJt", type: "pptx" },
      { id: "dmt-u4-3", title: "DMT Unit 4 - Rule-Based Classification", fileName: "DMT_Unit4_Part3.docx", fileId: "1d-tI-YD39y6KkfvBImYL0XxuF1X9w5VM", type: "doc" }
    ] },
    5: { title: "Unit V", subtitle: "Cluster Analysis", syllabus: "CLUSTER ANALYSIS - PARTITIONING METHODS - OUTLIER DETECTION", files: [
      { id: "dmt-u5-1", title: "DMT Unit 5 - Cluster Analysis & Outlier Detection", fileName: "DMT_Unit5.docx", fileId: "1MctHUSXAcVlRozM-aLbvm4qzQSDBOLFv", type: "doc" }
    ] }
  } },
  "ENGLISH": { units: { 1: { title: "Unit I", subtitle: "1st Year - English Complete Notes", syllabus: "", files: [{ id: "eng-u1-1", title: "1st Year English - Complete Notes", fileName: "English_1stYear.pdf", fileId: "1hz0m4SITKQiGVa8wax8mIRSOuKryOYQp", type: "pdf" }] }, 2: { title: "Unit II", subtitle: "2nd Year - English Complete Notes", syllabus: "", files: [{ id: "eng-u2-1", title: "2nd Year English - Complete Notes", fileName: "English_2ndYear.pdf", fileId: "1Ji6UOgrPlrPk338Amz6s_9GnXuj7WosW", type: "pdf" }] }, 3: { title: "Unit III", subtitle: "", syllabus: "", files: [] }, 4: { title: "Unit IV", subtitle: "", syllabus: "", files: [] }, 5: { title: "Unit V", subtitle: "", syllabus: "", files: [] } } },
  "ASP.NET": { units: { 1: { title: "Unit I", subtitle: "Overview of ASP.NET Framework", syllabus: "OVERVIEW OF ASP.NET FRAMEWORK - PAGE STRUCTURE - COMPILER DIRECTIVES - NAMESPACE", files: [{ id: "u1-1", title: "Overview of ASP.Net Framework", fileName: "Overview of ASP.Net Framework.pdf", fileId: "173-KUv6pOGV8o8ihTckpLwvkvDyKv9nj", type: "pdf" },{ id: "u1-2", title: "ASP Page Structure", fileName: "ASP page structure.pdf", fileId: "1OcVM4CDJTvGvdT9WfqLHFd1Sz61kEO3a", type: "pdf" },{ id: "u1-3", title: "Compiler Directives", fileName: "Compiler Directives.pdf", fileId: "14CpNpp7OVns3R6Kj4dWy81Io4FiFVvYi", type: "pdf" },{ id: "u1-4", title: "NAMESPACE", fileName: "NAMESPACE.pdf", fileId: "1cbb7Mt3m7MKXJkW_Hu_YsR4tWKDJanP3", type: "pdf" },{ id: "u1-5", title: "Overview of ASP.Net Framework (Notes)", fileName: "Overview of ASP.Net Framework (Notes)", fileId: "1VjVHcuCldGrTi6trGyb5gf4Z81RwpzsmsEqKm4Tajfg", type: "doc" }] }, 2: { title: "Unit II", subtitle: "ASP.NET Controls", syllabus: "UNDERSTANDING ASP.NET CONTROLS - STANDARD CONTROLS - DISPLAYING INFORMATION - ACCEPTING USER INPUT", files: [{ id: "u2-1", title: "ASP.NET UNIT - 2", fileName: "ASP.NET UNIT -2.pptx", fileId: "1t4g4ab9d5HdKZGuGxmYpWcAwTkjmoqjm", type: "pptx" }] }, 3: { title: "Unit III", subtitle: "Validation & Rich Controls", syllabus: "VALIDATION CONTROLS - REQUIRED FIELD VALIDATOR - RANGE VALIDATOR - RICH CONTROLS - ADROTATOR, CALENDAR", files: [{ id: "u3-1", title: "Validation Controls", fileName: "Validation Controls.docx", fileId: "1z-1R0gaqaVaSIvgRybN5AiA8ExYGsJfY", type: "docx" },{ id: "u3-2", title: "Calendar Control in ASP.NET", fileName: "Calendar Control in ASP.pdf", fileId: "1DInHlyYjC7OpG7sY1i0l987_uZLjo5iY", type: "pdf" },{ id: "u3-3", title: "Rich Controls", fileName: "RICH CONTROLS.pdf", fileId: "1xE1sIoFOWnkI5D7GRbm0EtgyDHpxwYg0", type: "pdf" }] }, 4: { title: "Unit IV", subtitle: "Data Access in ASP.NET", syllabus: "DATA BOUND CONTROL - SQLDATASOURCE - OLEDB - DATASET", files: [{ id: "u4-1", title: "Data Bound Controls", fileName: "data bound controls.docx", fileId: "1IXY-buceR6cV10jEbMClDXUuveYjVWUo", type: "docx" },{ id: "u4-2", title: "Simple Data Bound Controls", fileName: "Simple Data Bound Controls.pdf", fileId: "1PCHmZ2U3uUV8Ah83Do1vZ2bTk4uBArx7", type: "pdf" }] }, 5: { title: "Unit V", subtitle: "List Controls & State Management", syllabus: "LIST CONTROLS - GRID VIEW - REPEATER - STATE MANAGEMENT - COOKIES - SESSION", files: [{ id: "u5-1", title: "List Controls", fileName: "Listbox RadiobuttionList CheckboxList BulletedList.pdf", fileId: "1hGMGwEMhCFf1J_RyY3pKNKNAEVXnkwH2", type: "pdf" },{ id: "u5-2", title: "ADO.NET Architecture", fileName: "ADO.NET ARCHITECTURE.pdf", fileId: "12EETP-MtzBDgmT_ybJ0xiTebiksP5In4", type: "pdf" },{ id: "u5-3", title: "Application and Session State", fileName: "Application and Session State.pdf", fileId: "1FnobkINTlyJp4Nbi31oTLAtN6_PtLrUX", type: "pdf" },{ id: "u5-4", title: "Cookies", fileName: "COOKIES.pdf", fileId: "1Lw-RzMw2vLCAbYNxR7HzcfYs_Wt102Ob", type: "pdf" },{ id: "u5-5", title: "Web Service", fileName: "WEB SERVICE.pdf", fileId: "1lbt5Eqo79yie2GsHA6O5sgvq0j2V3xnu", type: "pdf" }] } } },
 "JAVA PROGRAMMING": { units: {
      1: { title: "Unit I", subtitle: "Introduction to Java", syllabus: "INTRODUCTION TO JAVA - OOP CONCEPTS - JAVA VIRTUAL MACHINE - DATA TYPES - VARIABLES - OPERATORS - CONTROL STATEMENTS - ARRAYS", files: [{ id: "java-u1-1", title: "Java Unit 1 - Introduction to Java", fileName: "Java_Unit1.pdf", fileId: "1Rc1MPevM5go_wHtt6vymVE0G6AKhEy2A", type: "pdf" }] },
      2: { title: "Unit II", subtitle: "Classes and Inheritance", syllabus: "CLASSES - OBJECTS - CONSTRUCTORS - INHERITANCE - PACKAGES - INTERFACES - METHOD OVERRIDING", files: [{ id: "java-u2-1", title: "Java Unit 2 - Classes and Inheritance", fileName: "Java_Unit2.pdf", fileId: "1PRi2MFawHIDfj3eDrJZ6nqRzwqhKn5rW", type: "pdf" }] },
      3: { title: "Unit III", subtitle: "Exception Handling & Multithreading", syllabus: "EXCEPTION HANDLING - TRY CATCH FINALLY - THROW - THROWS - MULTITHREADING - THREAD LIFE CYCLE - SYNCHRONIZATION", files: [{ id: "java-u3-1", title: "Java Unit 3 - Exception Handling & Multithreading", fileName: "Java_Unit3.pdf", fileId: "1b1ucYCpHPUvq614eY8dU6NsGe07tMcOK", type: "pdf" }] },
      4: { title: "Unit IV", subtitle: "Collections Framework", syllabus: "COLLECTIONS FRAMEWORK - LIST - SET - MAP - GENERICS - ITERATOR - COMPARABLE AND COMPARATOR", files: [{ id: "java-u4-1", title: "Java Unit 4 - Collections Framework", fileName: "Java_Unit4.pdf", fileId: "1oSZNVAFTDgVoFS-XGOT89N88YRVAo5RE", type: "pdf" }] },
      5: { title: "Unit V", subtitle: "Applets & GUI Programming", syllabus: "APPLETS - AWT - SWING - EVENT HANDLING - JDBC - DATABASE CONNECTIVITY", files: [{ id: "java-u5-1", title: "Java Unit 5 - Applets & GUI", fileName: "Java_Unit5.pdf", fileId: "1X3bah3gZVtI4Xuih0P9WXAU-jZ8xgyMP", type: "pdf" }] }
    } },
 "TAMIL": { units: {
      1: { title: "செய்யுள் I", subtitle: "சங்க இலக்கியம் - சங்க இலக்கியங்களின் தோற்றம்", syllabus: "சங்க இலக்கியத் தோற்றம் - சங்க காலம் - சங்க இலக்கியங்கள் - பதினெண் மேல்கணக்கு - பதினெண் கீழ்க்கணக்கு", files: [{ id: "tam-u1-1", title: "தமிழ் செய்யுள் 1 - சங்க இலக்கியம்", fileName: "Tamil_Unit1.pdf", fileId: "1G8K2_-fioXUfYxVYrkMewrUXXVCif4gs", type: "pdf" },{ id: "tam-u1-2", title: "தமிழ் இலக்கிய வரலாறு", fileName: "Tamil_Ilakkiya_Varalaru.pdf", fileId: "1rdcO8C66yHARYLaTkuvSOKCWampdAgPJ", type: "pdf" }] },
      2: { title: "செய்யுள் II", subtitle: "சங்க இலக்கியங்களின் போர்க்களங்கள்", syllabus: "சங்க போர்க்களங்கள் - ஐந்திணை - திணைக் கோட்பாடு - திணை மயக்கம்", files: [{ id: "tam-u2-1", title: "தமிழ் செய்யுள் 2 - சங்க போர்க்களங்கள்", fileName: "Tamil_Unit2.pdf", fileId: "1nUaNYAvG0ctYGMoZsUtmkVacDfwTPufY", type: "pdf" }] },
      3: { title: "செய்யுள் III", subtitle: "சிலப்பதிகாரம் - காப்பிய இலக்கியம்", syllabus: "சிலப்பதிகாரம் - காப்பியத் தோற்றம் - காப்பிய இலக்கியங்களின் தன்மைகள் - சாதுவின் உண்மை", files: [{ id: "tam-u3-1", title: "தமிழ் செய்யுள் 3 - சிலப்பதிகாரம்", fileName: "Tamil_Unit3.pdf", fileId: "1pi3c_P_-ebA-GWVnAIb-803UllYsXErA", type: "pdf" }] },
      4: { title: "செய்யுள் IV", subtitle: "மணிமேகலை - புத்தத்த இலக்கியம்", syllabus: "மணிமேகலை - புத்தத்த இலக்கியத் தோற்றம் - சாதுகளின் வரையறை - இனக்கம்", files: [{ id: "tam-u4-1", title: "தமிழ் செய்யுள் 4 - மணிமேகலை", fileName: "Tamil_Unit4.pdf", fileId: "1q5Tj-YCdd5x4-KtG5Cm9PxsmP9tywZtN", type: "pdf" }] },
      5: { title: "செய்யுள் V", subtitle: "தேவாரம் - பக்தி இலக்கியம்", syllabus: "தேவாரம் - பக்தி இலக்கியத் தோற்றம் - நாயன்மார்கள் - நால்வர் - முதல் வரலாறு", files: [{ id: "tam-u5-1", title: "தமிழ் செய்யுள் 5 - தேவாரம்", fileName: "Tamil_Unit5.pdf", fileId: "112PmbaBnPjUog2Tbwj-FeoOGyoij1k1c", type: "pdf" }] },
      6: { title: "செய்யுள் VI", subtitle: "திருவாசகம் - சைவ இலக்கியம்", syllabus: "திருவாசகம் - சைவ இலக்கியம் - மாணிக்கவாசகர் - பதிற்றுப்பத்தந்தாதி", files: [{ id: "tam-u6-1", title: "தமிழ் செய்யுள் 6 - திருவாசகம்", fileName: "Tamil_Unit6.pdf", fileId: "18ZCqfqlvXawkRyeanusTdQp7LHsQwb8e", type: "pdf" }] },
      7: { title: "செய்யுள் VII", subtitle: "கலித்தொகை - பட்டுப்பாட்டு", syllabus: "கலித்தொகை - பட்டுப்பாட்டு - முதல் குழு - திணைமலை நூறு - எட்டுத்தொகை", files: [{ id: "tam-u7-1", title: "தமிழ் செய்யுள் 7 - கலித்தொகை", fileName: "Tamil_Unit7.pdf", fileId: "1il76fMyzY3311msevv5oNsseaMkeXWqx", type: "pdf" }] },
      8: { title: "செய்யுள் VIII", subtitle: "தொல்காப்பியம் - இலக்கண இலக்கியம்", syllabus: "தொல்காப்பியம் - இலக்கண இலக்கியத் தோற்றம் - எழுத்து, சொல், பொருளதிகாரம் - தொல்காப்பியர்", files: [{ id: "tam-u8-1", title: "தமிழ் செய்யுள் 8 - தொல்காப்பியம்", fileName: "Tamil_Unit8.pdf", fileId: "11pNVGPtJUkKb3WzNhdobc2ddet9fk0b2", type: "pdf" }] },
      9: { title: "செய்யுள் I", subtitle: "பாலைத்திணை - பிரிவு மற்றும் காதல்", syllabus: "பாலைத்திணை - பிரிவுத் துன்பம் - தலைவன் பிரிவு - தலைவி ஏக்கம் - பாலை நில இயற்கை - வழிப்பயண இடையூறுகள்", files: [{ id: "tam-u9-1", title: "தமிழ் செய்யுள் 9 - பாலைத்திணை", fileName: "Tamil_Unit9.pdf", fileId: "1NiWfJD5z_2lC2jyFne9sc2c57_OIRG6W", type: "pdf" }] },
      10: { title: "செய்யுள் II", subtitle: "குறிஞ்சித்திணை - கபிலர் பாடல்கள்", syllabus: "குறிஞ்சித்திணை - கபிலர் - மலை நிலம் - தலைவன் தலைவி சந்திப்பு - குறிஞ்சி நில இயற்கை வளம்", files: [{ id: "tam-u10-1", title: "தமிழ் செய்யுள் 10 - குறிஞ்சித்திணை", fileName: "Tamil_Unit10.pdf", fileId: "1Z-7eaIjSCL-pbiyCoeaweIOrdK8gibRJ", type: "pdf" }] },
      11: { title: "செய்யுள் III", subtitle: "அகநானூறு - திணைக் கோட்பாடு", syllabus: "அகநானூறு - முல்லைத்திணை - நெய்தற்றிணை - மருதத்திணை - ஐந்திணை இலக்கணம் - திணைக் கோட்பாடு", files: [{ id: "tam-u11-1", title: "தமிழ் செய்யுள் 11 - அகநானூறு", fileName: "Tamil_Unit11.pdf", fileId: "1XwHqqWbQ6fXACwLYcZfNa4VzQTYzj4sq", type: "pdf" }] },
      12: { title: "செய்யுள் IV", subtitle: "கலித்தொகை - பாலைக்கலி", syllabus: "கலித்தொகை - பாலைக்கலி - குறிஞ்சிக்கலி - கலிப்பாடல்கள் - தலைவன் தலைவி உரையாடல் - கற்பு மற்றும் களவு வாழ்க்கை", files: [{ id: "tam-u12-1", title: "தமிழ் செய்யுள் 12 - கலித்தொகை", fileName: "Tamil_Unit12.pdf", fileId: "1xILKC8OrlJ61HYwTnAsF0v0EWpMKWH6J", type: "pdf" }] },
      13: { title: "செய்யுள் V", subtitle: "ஐங்குறுநூறு - பாலை மற்றும் குறிஞ்சி", syllabus: "ஐங்குறுநூறு - பாலைப்பாட்டு - குறிஞ்சிப்பாட்டு - சிற்றிலக்கியங்கள் - பத்துப்பாட்டு - எட்டுத்தொகை மரபு", files: [{ id: "tam-u13-1", title: "தமிழ் செய்யுள் 13 - ஐங்குறுநூறு", fileName: "Tamil_Unit13.pdf", fileId: "1oU3_V7mFYfYPjJlMbesrdkBWDaVabNjX", type: "pdf" }] }
    } },
 "WEB TECHNOLOGY": { units: {
      1: { title: "Unit I", subtitle: "Introduction to Web Technologies", syllabus: "INTRODUCTION TO WEB TECHNOLOGIES - HTML BASICS - CSS FUNDAMENTALS - JAVASCRIPT OVERVIEW - WEB ARCHITECTURE", files: [{ id: "web-u1-1", title: "Web Tech Unit 1 - Introduction", fileName: "WebTech_Unit1.pptx", fileId: "12dv8jFAYcQwZbXUEfAuFUrKYYuw736OJ", type: "pptx" }] },
      2: { title: "Unit II", subtitle: "Advanced HTML & CSS", syllabus: "HTML FORMS AND TABLES - CSS LAYOUTS - FLEXBOX - GRID - RESPONSIVE DESIGN - CSS FRAMEWORKS", files: [{ id: "web-u2-1", title: "Web Tech Unit 2 - Advanced HTML & CSS", fileName: "WebTech_Unit2.pptx", fileId: "1ZEHoSFvqerdMt4cMtLMHIlNwh-UXSsqC", type: "pptx" }] },
      3: { title: "Unit III", subtitle: "JavaScript & DOM", syllabus: "JAVASCRIPT BASICS - DOM MANIPULATION - EVENTS - VALIDATION - ES6 FEATURES", files: [{ id: "web-u3-1", title: "Web Tech Unit 3 - JavaScript & DOM", fileName: "WebTech_Unit3.pptx", fileId: "1m-iUfVYv8GrE2TC4rLA3jiLLP7wxLuUC", type: "pptx" }] },
      4: { title: "Unit IV", subtitle: "Server-Side Programming", syllabus: "SERVER-SIDE PROGRAMMING - PHP/SERVLETS - DATABASE CONNECTIVITY - SESSION MANAGEMENT - CRUD OPERATIONS", files: [{ id: "web-u4-1", title: "Web Tech Unit 4 - Server-Side Programming", fileName: "WebTech_Unit4.pdf", fileId: "1inVaANm-llf0-ixvVVwh2MpQhb-VqhAt", type: "pdf" }] },
      5: { title: "Unit V", subtitle: "Web Services & XML", syllabus: "WEB SERVICES - XML - JSON - AJAX - REST API - INTRODUCTION TO FRAMEWORKS", files: [{ id: "web-u5-1", title: "Web Tech Unit 5 - Web Services", fileName: "WebTech_Unit5.docx", fileId: "1LUux3fYsHW-CCkuEV0nogtqrRHfgDOOR", type: "doc" }] }
    } },
 "STATISTICAL METHODS FOR COMPUTER SCIENCE - I": { units: {
      1: { title: "Unit I", subtitle: "Introduction to Statistics", syllabus: "INTRODUCTION - STATISTICS - MEASURES OF CENTRAL TENDENCY - MEAN, MEDIAN, MODE - MEASURES OF DISPERSION - VARIANCE, STANDARD DEVIATION", files: [{ id: "stats-u1-1", title: "Statistics Unit 1 - Introduction to Statistics", fileName: "Stats_Unit1.pdf", fileId: "1CaoFLLcl1gi5CWvutD8m6BJnUswieCjA", type: "pdf" }] },
      2: { title: "Unit II", subtitle: "Probability Theory", syllabus: "PROBABILITY - BASIC CONCEPTS - AXIOMS OF PROBABILITY - CONDITIONAL PROBABILITY - BAYES THEOREM - RANDOM VARIABLES", files: [{ id: "stats-u2-1", title: "Statistics Unit 2 - Probability Theory", fileName: "Stats_Unit2.pdf", fileId: "1hMQguilzowigHuBpoGyilbGY0hGZRBUY", type: "pdf" }] },
      3: { title: "Unit III", subtitle: "Probability Distributions", syllabus: "PROBABILITY DISTRIBUTIONS - BINOMIAL DISTRIBUTION - POISSON DISTRIBUTION - NORMAL DISTRIBUTION - APPLICATIONS", files: [{ id: "stats-u3-1", title: "Statistics Unit 3 - Probability Distributions", fileName: "Stats_Unit3.pdf", fileId: "1Z7LLBa_EAQeG2Q_ILavs5zItgcbOTd26", type: "pdf" }] },
      4: { title: "Unit IV", subtitle: "Sampling and Estimation", syllabus: "SAMPLING THEORY - SAMPLING METHODS - SAMPLING DISTRIBUTION - POINT ESTIMATION - INTERVAL ESTIMATION", files: [{ id: "stats-u4-1", title: "Statistics Unit 4 - Sampling and Estimation", fileName: "Stats_Unit4.pdf", fileId: "1vpROUE_BETA4RpyKM-K9t2I1tVrjT35Z", type: "pdf" }] },
      5: { title: "Unit V", subtitle: "Correlation and Regression", syllabus: "CORRELATION ANALYSIS - PEARSON'S CORRELATION COEFFICIENT - REGRESSION ANALYSIS - LINEAR REGRESSION - APPLICATIONS", files: [{ id: "stats-u5-1", title: "Statistics Unit 5 - Correlation and Regression", fileName: "Stats_Unit5.pdf", fileId: "1JNaI61ehmV6QnLNG6YQvedoV1iBb1gHs", type: "pdf" }] }
    } },
 "STATISTICAL METHODS FOR COMPUTER SCIENCE - II": { units: {
      1: { title: "Unit I", subtitle: "Testing of Hypothesis - Basic Concepts", syllabus: "INTRODUCTION TO TESTING OF HYPOTHESIS - SAMPLE SPACE - EVENTS - DEFINITION OF PROBABILITY - NULL AND ALTERNATIVE HYPOTHESIS - TYPE I AND TYPE II ERRORS - LEVEL OF SIGNIFICANCE", files: [{ id: "stats2-u1-1", title: "Stats 2 Unit 1 - Basic Concepts of Testing", fileName: "Stats2_Unit1.pdf", fileId: "144VSC7IsknD8td--AIvTXLzaDUrnovYN", type: "pdf" }] },
      2: { title: "Unit II", subtitle: "Large Sample Tests", syllabus: "LARGE SAMPLE TESTS - TEST FOR SINGLE MEAN - TEST FOR DIFFERENCE OF MEANS - TEST FOR SINGLE PROPORTION - TEST FOR DIFFERENCE OF PROPORTIONS", files: [{ id: "stats2-u2-1", title: "Stats 2 Unit 2 - Large Sample Tests", fileName: "Stats2_Unit2.pdf", fileId: "1VDRWVCxvvKqnr7QnhypF0CdJBFMz3RR5", type: "pdf" }] },
      3: { title: "Unit III", subtitle: "Small Sample Tests", syllabus: "SMALL SAMPLE TESTS - STUDENT'S T-TEST - F-TEST FOR EQUALITY OF VARIANCES - PAIRED T-TEST - TEST FOR SINGLE MEAN - TEST FOR DIFFERENCE OF MEANS", files: [{ id: "stats2-u3-1", title: "Stats 2 Unit 3 - Small Sample Tests", fileName: "Stats2_Unit3.pdf", fileId: "1eu32jW_4pXdJpgSIjiF3RpKox6y_DLPs", type: "pdf" }] },
      4: { title: "Unit IV", subtitle: "Chi-square Test and Non-Parametric Tests", syllabus: "CHI-SQUARE DISTRIBUTION - CHI-SQUARE TEST FOR GOODNESS OF FIT - CHI-SQUARE TEST FOR INDEPENDENCE - SAMPLING DISTRIBUTION - STANDARD ERROR - PROCEDURE FOR TESTING OF HYPOTHESIS", files: [{ id: "stats2-u4-1", title: "Stats 2 Unit 4 - Chi-square & Non-Parametric Tests", fileName: "Stats2_Unit4.pdf", fileId: "1S3KFoOlwqYbgcrPey8GT0l3E8uMRXx_Z", type: "pdf" }] },
      5: { title: "Unit V", subtitle: "Design of Experiments", syllabus: "DESIGN OF EXPERIMENTS - PRINCIPLES OF EXPERIMENTATION - RANDOMIZATION - REPLICATION - LOCAL CONTROL - COMPLETELY RANDOMIZED DESIGN (CRD) - RANDOMIZED BLOCK DESIGN (RBD) - LATIN SQUARE DESIGN (LSD) - ANOVA TABLE", files: [{ id: "stats2-u5-1", title: "Stats 2 Unit 5 - Design of Experiments", fileName: "Stats2_Unit5.pdf", fileId: "1dMY4-_myb2rUKHlYyuaqeB6hyg_mbecZ", type: "pdf" }] }
    } },
 "ANDROID APP DEVELOPMENT": { units: {
      1: { title: "Unit I", subtitle: "Introduction to Mobile Applications", syllabus: "INTRODUCTION TO MOBILE APPLICATIONS - MARKET AND BUSINESS DRIVERS FOR MOBILE APPLICATIONS - REQUIREMENTS GATHERING AND VALIDATION FOR MOBILE APPLICATIONS - PUBLISHING AND DELIVERY OF MOBILE APPLICATIONS", files: [
        { id: "android-u1-1", title: "Unit 1 - Introduction to Mobile Applications", fileName: "Android_Unit1.pdf", fileId: "1bf8euP-fJ8kGISfyjokbxoM_oE04dyte", type: "pdf" }
      ] },
      2: { title: "Unit II", subtitle: "Android Development Basics", syllabus: "INTRODUCTION TO ANDROID: THE ANDROID PLATFORM - ANDROID SDK - ANDROID DEVELOPMENT BASICS - HARDWARE TOOLS AND SOFTWARE TOOLS - BUILDING YOUR FIRST ANDROID APPLICATION - UNDERSTANDING STRUCTURE OF ANDROID APPLICATION - ANDROID MANIFEST FILE", files: [
        { id: "android-u2-1", title: "Unit 2 - Android Development Basics", fileName: "Android_Unit2.pdf", fileId: "1CTXrJiAv0A7eS2l-B4Sb9RLxP02AqpxC", type: "pdf" }
      ] },
      3: { title: "Unit III", subtitle: "User Interface Design", syllabus: "ANDROID USER INTERFACE DESIGN ESSENTIALS - USER INTERFACE SCREEN ELEMENTS - DESIGNING USER INTERFACES WITH LAYOUTS - USING INTENT FILTER - PERMISSIONS - CREATING YOUR FIRST ACTIVITY - WORKING WITH THE ANDROID FRAMEWORK CLASSES", files: [
        { id: "android-u3-1", title: "Unit 3 - User Interface Design", fileName: "Android_Unit3.pdf", fileId: "14LFwvnVAA8gh8pCskBuMAm1u8XtcZRsW", type: "pdf" }
      ] },
      4: { title: "Unit IV", subtitle: "Coding the Application & Resources", syllabus: "CREATING INSTALLING YOUR APPLICATION - CODING YOUR APPLICATION - UNDERSTANDING ACTIVITIES AND THE ACTIVITY LIFECYCLE - TESTING ANDROID APPLICATIONS - PUBLISHING ANDROID APPLICATION - UNDERSTANDING RESOURCES - WORKING WITH RESOURCES", files: [
        { id: "android-u4-1", title: "Unit 4 - Coding the Application & Resources", fileName: "Android_Unit4.pdf", fileId: "1SqQf0Q9amOPx4TBLtgecX6UVnpcCN0-W", type: "pdf" }
      ] },
      5: { title: "Unit V", subtitle: "Case Study & Advanced Topics", syllabus: "INTRODUCTION TO OBJECTIVE C - ANDROID STUDIO PERMISSIONS - WORKING WITH FILES - WORKING WITH THE NETWORK - DEBUGGING ANDROID APPS - PROVIDING FEEDBACK TO THE USER - VIBRATION - SOUND - FLASH - RAW CAMERA USAGE - TOUCH GESTURES", files: [
        { id: "android-u5-1", title: "Unit 5 - Case Study & Advanced Topics", fileName: "Android_Unit5.pdf", fileId: "1Tm0YW1xkhvkSLDgo73DYyf15h2CS44Zn", type: "pdf" }
      ] }
    } },
 "ARTIFICIAL INTELLIGENCE AND EXPERT SYSTEM": { units: {
      1: { title: "Unit I", subtitle: "Introduction to Artificial Intelligence", syllabus: "INTRODUCTION TO ARTIFICIAL INTELLIGENCE - DEFINITION - GOALS OF AI - HISTORY - INTELLIGENT AGENTS - PROBLEM SOLVING - STATE SPACE SEARCH - UNINFORMED SEARCH STRATEGIES - INFORMED SEARCH STRATEGIES - GAME PLAYING", files: [
        { id: "ai-u1-1", title: "Unit 1 - Introduction to AI", fileName: "UNIT_1_-_AI.pdf", fileId: "1c8qMrnPzbVbLvmHkBbHMIBJ2_E9fU0b9", type: "pdf" }
      ] },
      2: { title: "Unit II", subtitle: "Knowledge Representation & Reasoning", syllabus: "KNOWLEDGE REPRESENTATION - LOGIC - PROPOSITIONAL LOGIC - PREDICATE LOGIC - SEMANTIC NETWORKS - FRAMES - SCRIPT - ONTOLOGIES - REASONING MECHANISMS - INFERENCE - EXPERT SYSTEMS AND KNOWLEDGE BASES", files: [
        { id: "ai-u2-1", title: "Unit 2 - Knowledge Representation", fileName: "UNIT_2_-_AI.pdf", fileId: "1ZYfcBytaNw3q4XoO1F-1bsR6UBFGGp03", type: "pdf" }
      ] },
      3: { title: "Unit III", subtitle: "Machine Learning & Neural Networks", syllabus: "MACHINE LEARNING - SUPERVISED LEARNING - UNSUPERVISED LEARNING - DECISION TREES - NEURAL NETWORKS - PERCEPTRON - BACKPROPAGATION - FUZZY LOGIC SYSTEMS - GENETIC ALGORITHMS", files: [
        { id: "ai-u3-1", title: "Unit 3 - Machine Learning & Neural Networks", fileName: "AI_UNIT_4.pdf", fileId: "1q-n-e4sl4VeM0N0duh5wxqgSDLVjQVmU", type: "pdf" }
      ] },
      4: { title: "Unit IV", subtitle: "Natural Language Processing", syllabus: "NATURAL LANGUAGE PROCESSING - NLP PIPELINE - TEXT PREPROCESSING - LANGUAGE ANALYSIS - TEXT REPRESENTATION - EMBEDDING TECHNIQUES - NATURAL LANGUAGE UNDERSTANDING (NLU) - NATURAL LANGUAGE GENERATION (NLG) - MODEL TRAINING - NLP APPLICATIONS", files: [
        { id: "ai-u4-1", title: "Unit 4 - Natural Language Processing", fileName: "AI_UNIT_4.pdf", fileId: "1cRtyzCu_BiuZVW-BioljtVKti8_G1CB7", type: "pdf" }
      ] },
      5: { title: "Unit V", subtitle: "Expert Systems & Applications", syllabus: "EXPERT SYSTEMS - ARCHITECTURE OF ES - KNOWLEDGE BASE - INFERENCE ENGINE - USER INTERFACE - KNOWLEDGE ACQUISITION - RULE-BASED SYSTEMS - FUZZY EXPERT SYSTEMS - AI APPLICATIONS - ROBOTICS - COMPUTER VISION - SPEECH RECOGNITION", files: [
        { id: "ai-u5-1", title: "Unit 5 - Expert Systems & AI Applications", fileName: "AI_UNIT_4.pdf", fileId: "1Xib1DCMMRPLp6lTkKdIyh8tpwmZuMHPx", type: "pdf" }
      ] }
    } },
 "SOFTWARE ENGINEERING": { units: {
      1: { title: "Unit I", subtitle: "Introduction to SE & Process Models", syllabus: "The Nature of Software - Definition: Software, Software Engineering - Prescriptive Process Models - The Waterfall Model - Incremental Process Model - Evolutionary Process Models - Concurrent Models", files: [
        { id: "se-u1-1", title: "Unit 1 - Prescriptive Process Models", fileName: "unit_1_SE.pdf", fileId: "1t9Q0y7C9b0ssDFjAysFAJQCP5y0qLvB1", type: "pdf" },
        { id: "se-u1-2", title: "Introduction to Software Engineering", fileName: "SE_Intro.pptx", fileId: "1wicoSwbV4stVGHfGuIsfDAtpGFksoKUM", type: "pptx" },
        { id: "se-u1-3", title: "Software Engineering Fundamentals", fileName: "SE_Fundamentals.pdf", fileId: "1nJQlMcGSQifbJzgB3w6h2Dlct3aFkcAf", type: "pdf" }
      ] },
      2: { title: "Unit II", subtitle: "Requirements Engineering & Analysis", syllabus: "Requirements Analysis - Scenario-Based Modeling - UML Models That Supplement the Use Case - Data Modeling Concepts - Class-Based Modeling - Requirements Modeling Strategies - Flow-Oriented Modeling - Creating a Behavioral Model", files: [
        { id: "se-u2-1", title: "Requirements Engineering", fileName: "SE_Requirements.pptx", fileId: "1AFt1x09wc9VXqe_MwpETYaZZUqLXIjiv", type: "pptx" },
        { id: "se-u2-2", title: "Requirements Analysis & SRS", fileName: "SE_SRS_Analysis.pptx", fileId: "1Aq81z1wJ5taTOGEjt_ce2gUPy3wdziG6", type: "pptx" },
        { id: "se-u2-3", title: "Requirements Engineering Notes", fileName: "SE_Requirements_Notes.pdf", fileId: "1_eqY6oM8MlLD3sw3eQdyhxE0pIckstHQ", type: "pdf" }
      ] },
      3: { title: "Unit III", subtitle: "Software Design Concepts", syllabus: "The Design Process - Design Concepts - The Design Model - Designing Class-Based Components: Basic Design Principles - Component-Level Design Guidelines - Cohesion Coupling - Designing Traditional Components - Graphical Design Notation - Tabular Design Notation - Program Design Language", files: [
        { id: "se-u3-1", title: "The Design Model", fileName: "The_Design_Model.docx", fileId: "1F7_LGo1Xprq5L5BqP-lEJXD6oKIWqFAF", type: "doc" }
      ] },
      4: { title: "Unit IV", subtitle: "Software Testing", syllabus: "Elements of Software Quality Assurance - SQA Tasks, goals, and metrics - Software Testing Strategies - Unit Testing - Integration Testing - Validation Testing - Alpha and Beta Testing - System Testing - The Debugging Process - White-Box Testing - Basis Path Testing - Control Structure Testing - Black-Box Testing", files: [
        { id: "se-u4-1", title: "Software Engineering - 2 Marks Question Bank", fileName: "SE_2Marks_Qn_Bank.docx", fileId: "1jU5UTZx-wbDYVV4amuG1MCna_XMkS3po", type: "doc" }
      ] },
      5: { title: "Unit V", subtitle: "SCM, Risk & Reverse Engineering", syllabus: "SOFTWARE CONFIGURATION MANAGEMENT - THE SCM REPOSITORY - THE SCM PROCESS - RISK MANAGEMENT - SOFTWARE RISKS - RISK IDENTIFICATION RISK PROJECTION - RISK REFINEMENT RISK MITIGATION, MONITORING, AND MANAGEMENT - THE RMMM PLAN - SOFTWARE MAINTENANCE - SOFTWARE SUPPORTABILITY - SOFTWARE REENGINEERING - REVERSE ENGINEERING", files: [
        { id: "se-u5-1", title: "Unit 5 - SCM & Risk Management", fileName: "UNIT_5_NOTES.pdf", fileId: "1bwKBwe7R8TLZI4amdOMTnzApwZY_yKVG", type: "pdf" },
        { id: "se-u5-2", title: "SCM - Software Configuration Management", fileName: "SE_SCM.pptx", fileId: "1UITgq6iVv2n2O9VVVYNvS_-SudztgAkl", type: "pptx" },
        { id: "se-u5-3", title: "Software Reverse Engineering - Part 1", fileName: "SE_Reverse_Eng_Part1.pptx", fileId: "12qX05WeVf2BOfgPxD-wu9atNwgdZbz9j", type: "pptx" },
        { id: "se-u5-4", title: "Software Reverse Engineering - Part 2", fileName: "SE_Reverse_Eng_Part2.pptx", fileId: "1ujkP43sKFI0vg5xhjyJ2qa8pxpb2d9h5", type: "pptx" },
        { id: "se-u5-5", title: "Software Reverse Engineering - Part 3", fileName: "SE_Reverse_Eng_Part3.pptx", fileId: "1HUJYtKFYEuWEkNzfFHXS5Dh8x-uoNahv", type: "pptx" },
        { id: "se-u5-6", title: "Software Reverse Engineering - Part 4", fileName: "SE_Reverse_Eng_Part4.pptx", fileId: "1ko8Gx4aMDkdg1nOQqY3Lb--aPmMAhc9k", type: "pptx" }
      ] }
    } },
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
  "JAVA PROGRAMMING": [
    { sl: 1, module: "INTRODUCTION TO JAVA - OOP CONCEPTS - JAVA VIRTUAL MACHINE - DATA TYPES - VARIABLES - OPERATORS - CONTROL STATEMENTS - ARRAYS", hrs: 15, co: "CO1" },
    { sl: 2, module: "CLASSES - OBJECTS - CONSTRUCTORS - INHERITANCE - PACKAGES - INTERFACES - METHOD OVERRIDING", hrs: 15, co: "CO2" },
    { sl: 3, module: "EXCEPTION HANDLING - TRY CATCH FINALLY - THROW - THROWS - MULTITHREADING - THREAD LIFE CYCLE - SYNCHRONIZATION", hrs: 15, co: "CO3" },
    { sl: 4, module: "COLLECTIONS FRAMEWORK - LIST - SET - MAP - GENERICS - ITERATOR - COMPARABLE AND COMPARATOR", hrs: 15, co: "CO4" },
    { sl: 5, module: "APPLETS - AWT - SWING - EVENT HANDLING - JDBC - DATABASE CONNECTIVITY", hrs: 15, co: "CO5" },
  ],
  "TAMIL": [
    { sl: 1, module: "சங்க இலக்கியத் தோற்றம் - சங்க காலம் - சங்க இலக்கியங்கள் - பதினெண் மேல்கணக்கு - பதினெண் கீழ்க்கணக்கு", hrs: 15, co: "CO1" },
    { sl: 2, module: "சங்க போர்க்களங்கள் - ஐந்திணை - திணைக் கோட்பாடு - திணை மயக்கம்", hrs: 15, co: "CO2" },
    { sl: 3, module: "சிலப்பதிகாரம் - காப்பியத் தோற்றம் - காப்பிய இலக்கியங்களின் தன்மைகள் - சாதுவின் உண்மை", hrs: 15, co: "CO3" },
    { sl: 4, module: "மணிமேகலை - புத்தத்த இலக்கியத் தோற்றம் - சாதுகளின் வரையறை - இனக்கம்", hrs: 15, co: "CO4" },
    { sl: 5, module: "தேவாரம் - பக்தி இலக்கியத் தோற்றம் - நாயன்மார்கள் - நால்வர் - முதல் வரலாறு", hrs: 15, co: "CO5" },
    { sl: 6, module: "திருவாசகம் - சைவ இலக்கியம் - மாணிக்கவாசகர் - பதிற்றுப்பத்தந்தாதி", hrs: 15, co: "CO6" },
    { sl: 7, module: "கலித்தொகை - பட்டுப்பாட்டு - முதல் குழு - திணைமலை நூறு - எட்டுத்தொகை", hrs: 15, co: "CO7" },
    { sl: 8, module: "தொல்காப்பியம் - இலக்கண இலக்கியத் தோற்றம் - எழுத்து, சொல், பொருளதிகாரம் - தொல்காப்பியர்", hrs: 15, co: "CO8" },
    { sl: 9, module: "பாலைத்திணை - பிரிவுத் துன்பம் - தலைவன் பிரிவு - தலைவி ஏக்கம் - பாலை நில இயற்கை - வழிப்பயண இடையூறுகள்", hrs: 15, co: "CO9" },
    { sl: 10, module: "குறிஞ்சித்திணை - கபிலர் - மலை நிலம் - தலைவன் தலைவி சந்திப்பு - குறிஞ்சி நில இயற்கை வளம்", hrs: 15, co: "CO10" },
    { sl: 11, module: "அகநானூறு - முல்லைத்திணை - நெய்தற்றிணை - மருதத்திணை - ஐந்திணை இலக்கணம் - திணைக் கோட்பாடு", hrs: 15, co: "CO11" },
    { sl: 12, module: "கலித்தொகை - பாலைக்கலி - குறிஞ்சிக்கலி - கலிப்பாடல்கள் - தலைவன் ஒழுக்கம் - கற்பு மற்றும் களவு வாழ்க்கை", hrs: 15, co: "CO12" },
    { sl: 13, module: "ஐங்குறுநூறு - பாலைப்பாட்டு - குறிஞ்சிப்பாட்டு - சிற்றிலக்கியங்கள் - பத்துப்பாட்டு - எட்டுத்தொகை மரபு", hrs: 15, co: "CO13" },
  ],
  "WEB TECHNOLOGY": [
    { sl: 1, module: "INTRODUCTION TO WEB TECHNOLOGIES - HTML BASICS - CSS FUNDAMENTALS - JAVASCRIPT OVERVIEW - WEB ARCHITECTURE", hrs: 15, co: "CO1" },
    { sl: 2, module: "HTML FORMS AND TABLES - CSS LAYOUTS - FLEXBOX - GRID - RESPONSIVE DESIGN - CSS FRAMEWORKS", hrs: 15, co: "CO2" },
    { sl: 3, module: "JAVASCRIPT BASICS - DOM MANIPULATION - EVENTS - VALIDATION - ES6 FEATURES", hrs: 15, co: "CO3" },
    { sl: 4, module: "SERVER-SIDE PROGRAMMING - PHP/SERVLETS - DATABASE CONNECTIVITY - SESSION MANAGEMENT - CRUD OPERATIONS", hrs: 15, co: "CO4" },
    { sl: 5, module: "WEB SERVICES - XML - JSON - AJAX - REST API - INTRODUCTION TO FRAMEWORKS", hrs: 15, co: "CO5" },
  ],
  "STATISTICAL METHODS FOR COMPUTER SCIENCE - I": [
    { sl: 1, module: "INTRODUCTION - STATISTICS - MEASURES OF CENTRAL TENDENCY - MEAN, MEDIAN, MODE - MEASURES OF DISPERSION", hrs: 15, co: "CO1" },
    { sl: 2, module: "PROBABILITY - BASIC CONCEPTS - AXIOMS OF PROBABILITY - CONDITIONAL PROBABILITY - BAYES THEOREM", hrs: 15, co: "CO2" },
    { sl: 3, module: "PROBABILITY DISTRIBUTIONS - BINOMIAL DISTRIBUTION - POISSON DISTRIBUTION - NORMAL DISTRIBUTION", hrs: 15, co: "CO3" },
    { sl: 4, module: "SAMPLING THEORY - SAMPLING METHODS - SAMPLING DISTRIBUTION - POINT ESTIMATION - INTERVAL ESTIMATION", hrs: 15, co: "CO4" },
    { sl: 5, module: "CORRELATION ANALYSIS - REGRESSION ANALYSIS - LINEAR REGRESSION - APPLICATIONS", hrs: 15, co: "CO5" },
  ],
  "STATISTICAL METHODS FOR COMPUTER SCIENCE - II": [
    { sl: 1, module: "INTRODUCTION TO TESTING OF HYPOTHESIS - SAMPLE SPACE - EVENTS - PROBABILITY - NULL AND ALTERNATIVE HYPOTHESIS - TYPE I AND TYPE II ERRORS", hrs: 15, co: "CO1" },
    { sl: 2, module: "LARGE SAMPLE TESTS - TEST FOR SINGLE MEAN - DIFFERENCE OF MEANS - SINGLE PROPORTION - DIFFERENCE OF PROPORTIONS", hrs: 15, co: "CO2" },
    { sl: 3, module: "SMALL SAMPLE TESTS - STUDENT'S T-TEST - F-TEST - PAIRED T-TEST - SINGLE MEAN - DIFFERENCE OF MEANS", hrs: 15, co: "CO3" },
    { sl: 4, module: "CHI-SQUARE DISTRIBUTION - GOODNESS OF FIT - TEST FOR INDEPENDENCE - SAMPLING DISTRIBUTION - STANDARD ERROR", hrs: 15, co: "CO4" },
    { sl: 5, module: "DESIGN OF EXPERIMENTS - PRINCIPLES - RANDOMIZATION - REPLICATION - LOCAL CONTROL - CRD - RBD - LSD - ANOVA", hrs: 15, co: "CO5" },
  ],
  "ANDROID APP DEVELOPMENT": [
    { sl: 1, module: "INTRODUCTION TO MOBILE APPLICATIONS - MARKET AND BUSINESS DRIVERS FOR MOBILE APPLICATIONS - REQUIREMENTS GATHERING AND VALIDATION FOR MOBILE APPLICATIONS - PUBLISHING AND DELIVERY OF MOBILE APPLICATIONS", hrs: 10, co: "CO1" },
    { sl: 2, module: "INTRODUCTION TO ANDROID: THE ANDROID PLATFORM - ANDROID SDK - ANDROID DEVELOPMENT BASICS - HARDWARE TOOLS AND SOFTWARE TOOLS - BUILDING YOUR FIRST ANDROID APPLICATION - UNDERSTANDING STRUCTURE OF ANDROID APPLICATION - ANDROID MANIFEST FILE", hrs: 10, co: "CO2" },
    { sl: 3, module: "ANDROID USER INTERFACE DESIGN ESSENTIALS - USER INTERFACE SCREEN ELEMENTS - DESIGNING USER INTERFACES WITH LAYOUTS - USING INTENT FILTER - PERMISSIONS - CREATING YOUR FIRST ACTIVITY - WORKING WITH THE ANDROID FRAMEWORK CLASSES", hrs: 15, co: "CO3" },
    { sl: 4, module: "CREATING INSTALLING YOUR APPLICATION - CODING YOUR APPLICATION - UNDERSTANDING ACTIVITIES AND THE ACTIVITY LIFECYCLE - TESTING ANDROID APPLICATIONS - PUBLISHING ANDROID APPLICATION - UNDERSTANDING RESOURCES - WORKING WITH RESOURCES", hrs: 15, co: "CO4" },
    { sl: 5, module: "INTRODUCTION TO OBJECTIVE C - ANDROID STUDIO PERMISSIONS - WORKING WITH FILES - WORKING WITH THE NETWORK - DEBUGGING ANDROID APPS - PROVIDING FEEDBACK TO THE USER - VIBRATION - SOUND - FLASH - RAW CAMERA USAGE - TOUCH GESTURES", hrs: 10, co: "CO5" },
  ],
  "ARTIFICIAL INTELLIGENCE AND EXPERT SYSTEM": [
    { sl: 1, module: "INTRODUCTION TO ARTIFICIAL INTELLIGENCE - GOALS OF AI - INTELLIGENT AGENTS - PROBLEM SOLVING - STATE SPACE SEARCH - UNINFORMED SEARCH STRATEGIES - INFORMED SEARCH STRATEGIES - GAME PLAYING", hrs: 10, co: "CO1" },
    { sl: 2, module: "KNOWLEDGE REPRESENTATION - LOGIC - PROPOSITIONAL LOGIC - PREDICATE LOGIC - SEMANTIC NETWORKS - FRAMES - ONTOLOGIES - REASONING MECHANISMS - INFERENCE", hrs: 10, co: "CO2" },
    { sl: 3, module: "MACHINE LEARNING - SUPERVISED LEARNING - UNSUPERVISED LEARNING - DECISION TREES - NEURAL NETWORKS - PERCEPTRON - BACKPROPAGATION - FUZZY LOGIC - GENETIC ALGORITHMS", hrs: 10, co: "CO3" },
    { sl: 4, module: "NATURAL LANGUAGE PROCESSING - NLP PIPELINE - TEXT PREPROCESSING - LANGUAGE ANALYSIS - TEXT REPRESENTATION - EMBEDDING TECHNIQUES - NLU - NLG - NLP APPLICATIONS", hrs: 10, co: "CO4" },
    { sl: 5, module: "EXPERT SYSTEMS - ARCHITECTURE OF ES - KNOWLEDGE BASE - INFERENCE ENGINE - RULE-BASED SYSTEMS - FUZZY EXPERT SYSTEMS - AI APPLICATIONS - ROBOTICS - COMPUTER VISION", hrs: 10, co: "CO5" },
  ],
  "SOFTWARE ENGINEERING": [
    { sl: 1, module: "The Nature of Software - Definition: Software, Software Engineering - Prescriptive Process Models - The Waterfall Model - Incremental Process Model - Evolutionary Process Models - Concurrent Models", hrs: 10, co: "CO1" },
    { sl: 2, module: "Requirements Analysis - Scenario-Based Modeling - UML Models That Supplement the Use Case - Data Modeling Concepts - Class-Based Modeling - Requirements Modeling Strategies - Flow-Oriented Modeling - Creating a Behavioral Model", hrs: 10, co: "CO2" },
    { sl: 3, module: "The Design Process - Design Concepts - The Design Model - Designing Class-Based Components: Basic Design Principles - Component-Level Design Guidelines - Cohesion Coupling - Designing Traditional Components - Graphical Design Notation - Tabular Design Notation - Program Design Language", hrs: 10, co: "CO3" },
    { sl: 4, module: "Elements of Software Quality Assurance - SQA Tasks, goals, and metrics - Software Testing Strategies - Unit Testing - Integration Testing - Validation Testing - Alpha and Beta Testing - System Testing - The Debugging Process - White-Box Testing - Basis Path Testing - Control Structure Testing - Black-Box Testing", hrs: 10, co: "CO4" },
    { sl: 5, module: "Software Configuration Management - The SCM Repository - The SCM Process - Risk Management - Software Risks - Risk Identification Risk Projection - Risk Refinement Risk Mitigation, Monitoring, and Management - The RMMM Plan - Software Maintenance - Software Supportability - Software Reengineering - Reverse Engineering", hrs: 10, co: "CO5" },
  ],
};

function getDrivePreviewUrl(fileId, type = "pdf") {
  if (type === "doc") return `https://docs.google.com/document/d/${fileId}/preview`;
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

function getDriveDownloadUrl(fileId, type = "pdf") {
  if (type === "doc") return `https://docs.google.com/document/d/${fileId}/export?format=pdf`;
  return `https://drive.google.com/uc?export=download&confirm=t&id=${fileId}`;
}

const unitColors = [
  { from: "from-indigo-500", to: "to-violet-600", light: "bg-indigo-500/10" },
  { from: "from-emerald-500", to: "to-teal-600", light: "bg-emerald-500/10" },
  { from: "from-amber-500", to: "to-orange-600", light: "bg-amber-500/10" },
  { from: "from-rose-500", to: "to-pink-600", light: "bg-rose-500/10" },
  { from: "from-violet-500", to: "to-purple-600", light: "bg-violet-500/10" },
];

export default function Notes() {
  const { user } = useAuth();
  const isFaculty = user?.type === "faculty";
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [expandedUnit, setExpandedUnit] = useState(null);
  const [viewingPdf, setViewingPdf] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploadFileObj, setUploadFileObj] = useState(null);

  async function handleUpload(e) {
    e.preventDefault();
    if (!uploadFileObj) {
      toast.error("Please select a file to upload");
      return;
    }
    if (!uploadTitle.trim()) {
      toast.error("Please enter a title");
      return;
    }
    setUploading(true);
    try {
      const fileUrl = await uploadFile(STORAGE_PATHS.NOTES, uploadFileObj, setProgress);
      await noteService.create({
        title: uploadTitle.trim(),
        description: uploadDescription.trim(),
        subject: selectedSubject,
        semester: Number(selectedSemester),
        year: Number(selectedYear),
        fileUrl,
        facultyName: user.name || "Faculty",
        facultyId: user.uid || "faculty-id",
      });
      toast.success("Note uploaded successfully!");
      setUploadTitle("");
      setUploadDescription("");
      setUploadFileObj(null);
      setShowUploadForm(false);
      refetch();
    } catch (err) {
      toast.error(err.message || "Failed to upload");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }

  const yearData = selectedYear ? CURRICULUM[selectedYear] : null;
  const semesterData = selectedSemester && yearData ? yearData.semesters[selectedSemester] : null;
  const ys = selectedYear ? yearStyles[selectedYear] : yearStyles[1];
  // Placeholder subjects — name only, no syllabus/faculty/PDF content
  const isPlaceholder = (selectedYear === 2 && selectedSubject && PLACEHOLDER_SUBJECTS.has(selectedSubject)) ||
    (NAME_ONLY_MAP[`${selectedYear}-${selectedSemester}`]?.has(selectedSubject));
  const subjectNotesData = !isPlaceholder && selectedSubject ? NOTES_DATA[selectedSubject] : null;
  // Semester-specific unit filter for subjects shared across semesters
  const semesterUnitFilter = selectedSubject ? SEMESTER_UNITS[`${selectedYear}-${selectedSemester}`]?.[selectedSubject] : null;
  const { items: uploadedNotes, refetch } = useFirestoreList(noteService);

  // Uploaded notes from Firestore for this subject
  const uploadedSubjectNotes = useMemo(() => {
    if (!selectedSubject || isPlaceholder) return [];
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

  const syllabusData = !isPlaceholder && selectedSubject
    ? (SYLLABUS[selectedSubject] && semesterUnitFilter
      ? SYLLABUS[selectedSubject].filter(s => semesterUnitFilter.has(s.sl))
      : SYLLABUS[selectedSubject])
    : null;

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
              const isNameOnly = (selectedYear === 2 && PLACEHOLDER_SUBJECTS.has(subject)) ||
                (NAME_ONLY_MAP[`${selectedYear}-${selectedSemester}`]?.has(subject));
              const subjectData = isNameOnly ? null : NOTES_DATA[subject];
              const hasNotes = subjectData && Object.values(subjectData.units).some(u => u.files.length > 0);
              const semesterFilter = NAME_ONLY_MAP[`${selectedYear}-${selectedSemester}`]?.has(subject)
                ? null : SEMESTER_UNITS[`${selectedYear}-${selectedSemester}`]?.[subject];
              const filteredSubjectUnits = subjectData && semesterFilter
                ? Object.entries(subjectData.units).filter(([key]) => semesterFilter.has(Number(key)))
                : subjectData ? Object.entries(subjectData.units) : [];
              const totalFiles = filteredSubjectUnits.length > 0
                ? filteredSubjectUnits.reduce((s, [, u]) => s + u.files.length, 0)
                : 0;
              const facultyName = selectedYear === 1 && selectedSemester === 1
                ? FIRST_YEAR_SEM1_FACULTY[subject]
                : isNameOnly ? null : FACULTY_MAP[subject];
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
                      {facultyName && <p className="mt-0.5 text-[11px] font-semibold tracking-wide text-white/50">{facultyName}</p>}
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
  const allUnits = subjectNotesData ? Object.entries(subjectNotesData.units) : [];
  const filteredUnits = semesterUnitFilter ? allUnits.filter(([key]) => semesterUnitFilter.has(Number(key))) : allUnits;
  const units = filteredUnits;
  const totalFiles = units.reduce((s, [, u]) => s + u.files.length, 0);

  const isEnglish = selectedSubject === "ENGLISH";
  const englishPdf = isEnglish && NOTES_DATA["ENGLISH"]?.units?.[selectedYear === 2 ? 2 : 1]?.files?.[0];

  // Determine the current subject's semester number for pre-filling upload form
  const currentSemesterNumber = selectedSemester;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* ─── Faculty Upload Section ─── */}
      {isFaculty && selectedSubject && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          {!showUploadForm ? (
            <button
              onClick={() => setShowUploadForm(true)}
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:shadow-emerald-500/30 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.97]"
            >
              <FiUploadCloud size={18} />
              Upload Notes
            </button>
          ) : (
            <form onSubmit={handleUpload} className="space-y-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 shadow-md">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
                  <FiUploadCloud size={18} className="text-emerald-400" />
                  Upload Notes — {selectedSubject}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowUploadForm(false)}
                  className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white/50 hover:bg-white/10 hover:text-white transition-all"
                >
                  Cancel
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-white/50">Title</label>
                  <input
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    required
                    placeholder="e.g. Unit 1 Introduction"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/20 focus:bg-white/10 transition-all"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-white/50">Description</label>
                  <textarea
                    value={uploadDescription}
                    onChange={(e) => setUploadDescription(e.target.value)}
                    placeholder="Brief description of the note"
                    rows={2}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/20 focus:bg-white/10 transition-all"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-white/50">Select File</label>
                  <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-white/15 bg-white/5 px-4 py-6 text-center transition-all hover:border-emerald-500/50 hover:bg-white/10">
                    <FiUploadCloud size={24} className="text-emerald-400" />
                    <span className="text-xs text-white/50">
                      {uploadFileObj ? uploadFileObj.name : "Choose a PDF, DOC, PPTX file..."}
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.pptx,.ppt"
                      className="hidden"
                      onChange={(e) => setUploadFileObj(e.target.files?.[0] ?? null)}
                      required={!uploading}
                    />
                  </label>
                </div>

                {uploading && progress > 0 && progress < 100 && (
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all" style={{ width: `${progress}%` }} />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg hover:shadow-emerald-500/20 disabled:opacity-50"
                >
                  {uploading ? `Uploading (${progress}%)...` : "Upload note"}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      )}

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

      {!isEnglish && syllabusData ? (
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
      ) : !isEnglish ? (
        <div className="mb-8 rounded-2xl border border-dashed border-white/15 bg-white/5 py-16 text-center">
          <FiBookOpen size={40} className="mx-auto mb-3 text-white/30" />
          <p className="text-sm text-white/50">Syllabus not yet available</p>
        </div>
      ) : null}

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
                </div>                    <div className="shrink-0 rounded-full bg-white/10 p-2.5 text-white/50 group-hover:bg-cyan-500/20 group-hover:text-cyan-300 transition-all">
                  <a href={getDriveDownloadUrl(englishPdf.fileId, englishPdf.type)} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
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
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${uc.from} ${uc.to} text-white text-xs font-bold shadow-sm transition-transform duration-300 ${isExpanded ? 'scale-110' : ''}`}>{idx + 1}</div>
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

export { CURRICULUM, NOTES_DATA, SEMESTER_UNITS, NAME_ONLY_MAP };
