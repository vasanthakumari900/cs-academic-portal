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
          "ARTIFICIAL INTELLIGENCE AND EXPERT SYSTEMS",
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

// ─── DBMS Question Papers (Google Drive PDFs) ───
const DBMS_PAPERS = [
  {
    id: "dbms-u1819",
    title: "DBMS - U1819",
    subject: "DATABASE MANAGEMENT SYSTEM",
    facultyName: "M P Sudha",
    description: "Previous year question paper for Database Management System (U1819)",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1Cp68ANRP_doVafYZC5cw-myc-tGh8yPZ",
  },
  {
    id: "dbms-u1819-1",
    title: "DBMS - U1819 Set 1",
    subject: "DATABASE MANAGEMENT SYSTEM",
    facultyName: "M P Sudha",
    description: "Previous year question paper for Database Management System (U1819 Set 1)",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1S5815UhqWp5Rh0LvGMApKXUS7iua0VHo",
  },
  {
    id: "dbms-u1819-2",
    title: "DBMS - U1819 Set 2",
    subject: "DATABASE MANAGEMENT SYSTEM",
    facultyName: "M P Sudha",
    description: "Previous year question paper for Database Management System (U1819 Set 2)",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1RXMrycEqt10WHukIOYU8RgOiek-1MwwZ",
  },
  {
    id: "dbms-u1819-3",
    title: "DBMS - U1819 Set 3",
    subject: "DATABASE MANAGEMENT SYSTEM",
    facultyName: "M P Sudha",
    description: "Previous year question paper for Database Management System (U1819 Set 3)",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1oXeenpoCMrbmn-kzYzZI7-NCrSy5kCZP",
  },
];

// ─── OS Question Papers (Google Drive PDFs) ───
const OS_PAPERS = [
  {
    id: "os-1",
    title: "Operating Systems - Paper 1",
    subject: "OPERATING SYSTEM",
    facultyName: "Dr Dharani",
    description: "Previous year question paper for Operating System",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1dWKCFsNml6heTR_OSL_NTw9R3tlNnzbH",
  },
  {
    id: "os-2",
    title: "Operating Systems - Paper 2",
    subject: "OPERATING SYSTEM",
    facultyName: "Dr Dharani",
    description: "Previous year question paper for Operating System",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1cLy_amz1L_Jw8sRc6PwN1qvim41v7UbS",
  },
  {
    id: "os-3",
    title: "Operating Systems - Paper 3",
    subject: "OPERATING SYSTEM",
    facultyName: "Dr Dharani",
    description: "Previous year question paper for Operating System",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1t5SuYyqfYIDGAL0hmuqJ35GkJ9R6kJlw",
  },
  {
    id: "os-4",
    title: "Operating Systems - Paper 4",
    subject: "OPERATING SYSTEM",
    facultyName: "Dr Dharani",
    description: "Previous year question paper for Operating System",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1Vwu1e9nzOOJUBN5B2WNNmdHVsUAvJfd8",
  },
  {
    id: "os-5",
    title: "Operating Systems - Paper 5",
    subject: "OPERATING SYSTEM",
    facultyName: "Dr Dharani",
    description: "Previous year question paper for Operating System",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1YFk496U3Wv1jzBr6eYi4IIPOQeKPUgKc",
  },
  {
    id: "os-6",
    title: "Operating Systems - Paper 6",
    subject: "OPERATING SYSTEM",
    facultyName: "Dr Dharani",
    description: "Previous year question paper for Operating System",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1UFNbBQuvaWjg-d8iug7zQQGw3sUODxAj",
  },
];

// ─── DMT Question Papers (Google Drive PDFs) ───
const DMT_PAPERS = [
  {
    id: "dmt-1",
    title: "Data Mining Techniques - Paper 1",
    subject: "DATA MINING TECHNIQUES",
    facultyName: "V Ponnila",
    description: "Previous year question paper for Data Mining Techniques",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1eUnnWP3zTfBi0tUcv55W77NaTV32pNru",
  },
  {
    id: "dmt-2",
    title: "Data Mining Techniques - Paper 2",
    subject: "DATA MINING TECHNIQUES",
    facultyName: "V Ponnila",
    description: "Previous year question paper for Data Mining Techniques",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1BltdeHc_PEiwNkdEJWhqOrHevKO5kkfr",
  },
  {
    id: "dmt-3",
    title: "Data Mining Techniques - Paper 3",
    subject: "DATA MINING TECHNIQUES",
    facultyName: "V Ponnila",
    description: "Previous year question paper for Data Mining Techniques",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1LwxS2cRZFuEi88EnR97JHSkIdtjnu-t-",
  },
  {
    id: "dmt-4",
    title: "Data Mining Techniques - Paper 4",
    subject: "DATA MINING TECHNIQUES",
    facultyName: "V Ponnila",
    description: "Previous year question paper for Data Mining Techniques",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1SGNhkMBw_uYUDd6g7moccCvmIP60P4aA",
  },
  {
    id: "dmt-5",
    title: "Data Mining Techniques - Paper 5",
    subject: "DATA MINING TECHNIQUES",
    facultyName: "V Ponnila",
    description: "Previous year question paper for Data Mining Techniques",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1bks-vmoF824Vhw8oKI7oqOunhWLqnsZH",
  },
  {
    id: "dmt-6",
    title: "Data Mining Techniques - Paper 6",
    subject: "DATA MINING TECHNIQUES",
    facultyName: "V Ponnila",
    description: "Previous year question paper for Data Mining Techniques",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1dY5Dlyx71fEXUJTop7Rer4xIWbHn_zXw",
  },
];

// ─── ASP.NET Question Papers (Google Drive PDFs) ───
const ASPNET_PAPERS = [
  {
    id: "aspnet-1",
    title: "ASP.NET - Paper 1",
    subject: "ASP.NET",
    facultyName: "R Saranya",
    description: "Previous year question paper for ASP.NET",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1-zlOLsuXsYIwX-eGopeUinrsjbofTJRp",
  },
  {
    id: "aspnet-2",
    title: "ASP.NET - Paper 2",
    subject: "ASP.NET",
    facultyName: "R Saranya",
    description: "Previous year question paper for ASP.NET",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1VGfqCbntp335IOAt-w04LV-643iJ3_TX",
  },
  {
    id: "aspnet-3",
    title: "ASP.NET - Paper 3",
    subject: "ASP.NET",
    facultyName: "R Saranya",
    description: "Previous year question paper for ASP.NET",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1sWi0UvGVOSpA_DaK7JgJ-PKHHdkAgGRh",
  },
  {
    id: "aspnet-4",
    title: "ASP.NET - Paper 4",
    subject: "ASP.NET",
    facultyName: "R Saranya",
    description: "Previous year question paper for ASP.NET",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1ddRnBA1IyzRinn847bf1cf1KwKNwauop",
  },
  {
    id: "aspnet-5",
    title: "ASP.NET - Paper 5",
    subject: "ASP.NET",
    facultyName: "R Saranya",
    description: "Previous year question paper for ASP.NET",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1LSKjWGCIj-OtAIJ-fBRC7xdQd80lXwtp",
  },
  {
    id: "aspnet-6",
    title: "ASP.NET - Paper 6",
    subject: "ASP.NET",
    facultyName: "R Saranya",
    description: "Previous year question paper for ASP.NET",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1kNfOw9vK2iZy4aHUq4DLzBw0pHV5t1--",
  },
];

// ─── Java Question Papers (Google Drive PDFs, 2nd Year) ───
const JAVA_PAPERS = [
  {
    id: "java-1",
    title: "Java Programming - Paper 1",
    subject: "JAVA PROGRAMMING",
    facultyName: "",
    description: "Previous year question paper for Java Programming",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1jUVgImh2xSnbOaWyL5SOgkU45gqpekO-",
  },
  {
    id: "java-2",
    title: "Java Programming - Paper 2",
    subject: "JAVA PROGRAMMING",
    facultyName: "",
    description: "Previous year question paper for Java Programming",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1Yen9go0xCsZztkRWNvvEj65gUCsNFaG4",
  },
  {
    id: "java-3",
    title: "Java Programming - Paper 3",
    subject: "JAVA PROGRAMMING",
    facultyName: "",
    description: "Previous year question paper for Java Programming",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1WqI5g9tkcfDnFVQ3aD5ConYNNrIK0PBz",
  },
  {
    id: "java-4",
    title: "Java Programming - Paper 4",
    subject: "JAVA PROGRAMMING",
    facultyName: "",
    description: "Previous year question paper for Java Programming",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1O-tDSsg3KSlo1XROmBAzvJT7QE_i70K9",
  },
  {
    id: "java-5",
    title: "Java Programming - Paper 5",
    subject: "JAVA PROGRAMMING",
    facultyName: "",
    description: "Previous year question paper for Java Programming",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1C0TRBHRHjsmTHVwAO4T4fcBTalsWK22t",
  },
  {
    id: "java-6",
    title: "Java Programming - Paper 6",
    subject: "JAVA PROGRAMMING",
    facultyName: "",
    description: "Previous year question paper for Java Programming",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "12ndwwfEA7yxEh8qVar_wdKLWyitefupH",
  },
];

// ─── Web Technology Question Papers (Google Drive PDFs, 2nd Year) ───
const WEBTECH_PAPERS = [
  {
    id: "webtech-1",
    title: "Web Technology - Paper 1",
    subject: "WEB TECHNOLOGY",
    facultyName: "",
    description: "Previous year question paper for Web Technology",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1k9OOUdhRCPMhmvHGrEs-kKyFaJtKd4Cs",
  },
  {
    id: "webtech-2",
    title: "Web Technology - Paper 2",
    subject: "WEB TECHNOLOGY",
    facultyName: "",
    description: "Previous year question paper for Web Technology",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1c4p1JjCmfKGQuY7_HkDjlyc-ipR73vuf",
  },
  {
    id: "webtech-3",
    title: "Web Technology - Paper 3",
    subject: "WEB TECHNOLOGY",
    facultyName: "",
    description: "Previous year question paper for Web Technology",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1ZN2zHGtPg4z3SpPcIx4WrIPDmL0WPzGZ",
  },
  {
    id: "webtech-4",
    title: "Web Technology - Paper 4",
    subject: "WEB TECHNOLOGY",
    facultyName: "",
    description: "Previous year question paper for Web Technology",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1MrJiJpOwrQg6Swyldfb_1R790nwf2foo",
  },
  {
    id: "webtech-5",
    title: "Web Technology - Paper 5",
    subject: "WEB TECHNOLOGY",
    facultyName: "",
    description: "Previous year question paper for Web Technology",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1xWfFOVdz9WtCyDClR7-XsgnrV_NWhBzZ",
  },
  {
    id: "webtech-6",
    title: "Web Technology - Paper 6",
    subject: "WEB TECHNOLOGY",
    facultyName: "",
    description: "Previous year question paper for Web Technology",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1Jj7zE77oeKWOgMJ94YOSBn9Fqto9NEdY",
  },
  {
    id: "webtech-7",
    title: "Web Technology - Paper 7",
    subject: "WEB TECHNOLOGY",
    facultyName: "",
    description: "Previous year question paper for Web Technology",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "12dHzPYbjUj4Fux_vGk3gi8TaWGFp17sS",
  },
];

// ─── Android App Development Question Papers (Google Drive PDFs, 2nd Year Sem 2) ───
const ANDROID_PAPERS = [
  {
    id: "android-1",
    title: "Android App Development - Paper 1",
    subject: "ANDROID APP DEVELOPMENT",
    facultyName: "",
    description: "Previous year question paper for Android App Development",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "17am2OfoImHY139oyoZ7PwgI60fFTPlio",
  },
  {
    id: "android-2",
    title: "Android App Development - Paper 2",
    subject: "ANDROID APP DEVELOPMENT",
    facultyName: "",
    description: "Previous year question paper for Android App Development",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "10AWHldygH6_rgg_GV73hBYEyZsO3kBu-",
  },
  {
    id: "android-3",
    title: "Android App Development - Paper 3",
    subject: "ANDROID APP DEVELOPMENT",
    facultyName: "",
    description: "Previous year question paper for Android App Development",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1maJnSuM1qMrvWDnKvbaql2KfsoKsyHGR",
  },
];

// ─── Stats-I Question Papers (Google Drive PDFs, 2nd Year Sem 1) ───
const STATS1_PAPERS = [
  {
    id: "stats1-1",
    title: "Statistical Methods for CS - I - Paper 1",
    subject: "STATISTICAL METHODS FOR COMPUTER SCIENCE - I",
    facultyName: "",
    description: "Previous year question paper for Statistical Methods for CS - I",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1X_VRk6AgYnAKv7fMrv6NMgnXl8BaRHE5",
  },
  {
    id: "stats1-2",
    title: "Statistical Methods for CS - I - Paper 2",
    subject: "STATISTICAL METHODS FOR COMPUTER SCIENCE - I",
    facultyName: "",
    description: "Previous year question paper for Statistical Methods for CS - I",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1Cjpmlsqu6SnxDBxYYc0xoubto81IpbR0",
  },
  {
    id: "stats1-3",
    title: "Statistical Methods for CS - I - Paper 3",
    subject: "STATISTICAL METHODS FOR COMPUTER SCIENCE - I",
    facultyName: "",
    description: "Previous year question paper for Statistical Methods for CS - I",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1v75G4l7Ue1qrPVzAjFlXBT-CIOXBJRnE",
  },
  {
    id: "stats1-4",
    title: "Statistical Methods for CS - I - Paper 4",
    subject: "STATISTICAL METHODS FOR COMPUTER SCIENCE - I",
    facultyName: "",
    description: "Previous year question paper for Statistical Methods for CS - I",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1Hn9Fjv6lqn45J2dmPGzRgupHSRYySHPl",
  },
  {
    id: "stats1-5",
    title: "Statistical Methods for CS - I - Paper 5",
    subject: "STATISTICAL METHODS FOR COMPUTER SCIENCE - I",
    facultyName: "",
    description: "Previous year question paper for Statistical Methods for CS - I",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1pNZNVipT_Yk0HLEy3B1iPumNyM4fwQ5z",
  },
];

// ─── Software Engineering Question Papers (Google Drive PDFs, 2nd Year Sem 2) ───
const SE_PAPERS = [
  {
    id: "se-1",
    title: "Software Engineering - Paper 1",
    subject: "SOFTWARE ENGINEERING",
    facultyName: "",
    description: "Previous year question paper for Software Engineering",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1rpM2BMCth8Jman-wmlE4WJK_KrCX5F6r",
  },
  {
    id: "se-2",
    title: "Software Engineering - Paper 2",
    subject: "SOFTWARE ENGINEERING",
    facultyName: "",
    description: "Previous year question paper for Software Engineering",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1PbV6XtasCjKh6BymjMuigDoGILyBZXKN",
  },
  {
    id: "se-3",
    title: "Software Engineering - Paper 3",
    subject: "SOFTWARE ENGINEERING",
    facultyName: "",
    description: "Previous year question paper for Software Engineering",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1wGJmEp9Z5zP7hmhnj9D6Bkz9TjMgOf3S",
  },
  {
    id: "se-4",
    title: "Software Engineering - Paper 4",
    subject: "SOFTWARE ENGINEERING",
    facultyName: "",
    description: "Previous year question paper for Software Engineering",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1Y6MoIpg5G9ZONPCq-GhvgBISfgyL08zF",
  },
  {
    id: "se-5",
    title: "Software Engineering - Paper 5",
    subject: "SOFTWARE ENGINEERING",
    facultyName: "",
    description: "Previous year question paper for Software Engineering",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1KVhiuJz0Dq-XKiF96KcAasfgl46DxKo9",
  },
  {
    id: "se-6",
    title: "Software Engineering - Paper 6",
    subject: "SOFTWARE ENGINEERING",
    facultyName: "",
    description: "Previous year question paper for Software Engineering",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1qyJMPXu-WnePNyqAtib3ep69Q2SmT2L4",
  },
  {
    id: "se-7",
    title: "Software Engineering - Paper 7",
    subject: "SOFTWARE ENGINEERING",
    facultyName: "",
    description: "Previous year question paper for Software Engineering",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1kdruNm8tO1n-w-Du2nJTTxJBEYhrKry5",
  },
  {
    id: "se-8",
    title: "Software Engineering - Paper 8",
    subject: "SOFTWARE ENGINEERING",
    facultyName: "",
    description: "Previous year question paper for Software Engineering",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1ykfN9OF3T4RSAxVzTrOL9V9EZRyD7eDh",
  },
];

// ─── Stats-II Question Papers (Google Drive PDFs, 2nd Year Sem 2) ───
const STATS2_PAPERS = [
  {
    id: "stats2-1",
    title: "Statistical Methods for CS - II - Paper 1",
    subject: "STATISTICAL METHODS FOR COMPUTER SCIENCE - II",
    facultyName: "",
    description: "Previous year question paper for Statistical Methods for CS - II",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1loHS32UEASmrvrvHQERJu4hZjKlm1eDD",
  },
  {
    id: "stats2-2",
    title: "Statistical Methods for CS - II - Paper 2",
    subject: "STATISTICAL METHODS FOR COMPUTER SCIENCE - II",
    facultyName: "",
    description: "Previous year question paper for Statistical Methods for CS - II",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "19KbU3TqzaghgyGlaMAMgOykhJ8aDI-tJ",
  },
  {
    id: "stats2-3",
    title: "Statistical Methods for CS - II - Paper 3",
    subject: "STATISTICAL METHODS FOR COMPUTER SCIENCE - II",
    facultyName: "",
    description: "Previous year question paper for Statistical Methods for CS - II",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1TPwIj4s8aY-OyYfPWCejeKhunVDO0ZUX",
  },
];

// ─── Python Programming Question Papers (Google Drive PDFs, 1st Year Sem 1) ───
const PYTHON_PAPERS = [
  {
    id: "python-1",
    title: "Python Programming - Paper 1",
    subject: "FUNDAMENTALS OF PYTHON PROGRAMMING",
    facultyName: "",
    description: "Previous year question paper for Fundamentals of Python Programming",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1wFiahReZ1PAjUVgOMiTFpso22pTOv2Q-",
  },
  {
    id: "python-2",
    title: "Python Programming - Paper 2",
    subject: "FUNDAMENTALS OF PYTHON PROGRAMMING",
    facultyName: "",
    description: "Previous year question paper for Fundamentals of Python Programming",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1u1P3lBvCyHckAi9cAEVbEQqrDzefjygU",
  },
  {
    id: "python-3",
    title: "Python Programming - Paper 3",
    subject: "FUNDAMENTALS OF PYTHON PROGRAMMING",
    facultyName: "",
    description: "Previous year question paper for Fundamentals of Python Programming",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1qMNOXeyw6uXUJoEpaC9WPwIb3jtA9Mrm",
  },
  {
    id: "python-4",
    title: "Python Programming - Paper 4",
    subject: "FUNDAMENTALS OF PYTHON PROGRAMMING",
    facultyName: "",
    description: "Previous year question paper for Fundamentals of Python Programming",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1gSJW7kY4fNKi5idas-Op7f9mO-8Ehg-_",
  },
  {
    id: "python-5",
    title: "Python Programming - Paper 5",
    subject: "FUNDAMENTALS OF PYTHON PROGRAMMING",
    facultyName: "",
    description: "Previous year question paper for Fundamentals of Python Programming",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1FQSVnQXv2xNicuiF5OCOjxgk2ej2--DW",
  },
  {
    id: "python-6",
    title: "Python Programming - Paper 6",
    subject: "FUNDAMENTALS OF PYTHON PROGRAMMING",
    facultyName: "",
    description: "Previous year question paper for Fundamentals of Python Programming",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1Ehfe16NUO-qze_FjqxCYA6vXDBgS9zvM",
  },
];

// ─── Digital Electronics Question Papers (Google Drive PDFs, 1st Year Sem 1) ───
const DIGITAL_ELECTRONICS_PAPERS = [
  {
    id: "de-1",
    title: "Digital Electronics - Paper 1",
    subject: "FUNDAMENTALS OF DIGITAL ELECTRONICS",
    facultyName: "",
    description: "Previous year question paper for Fundamentals of Digital Electronics",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1nbc1ERrNHYrG9wlwayKWR4KIccXByRJp",
  },
  {
    id: "de-2",
    title: "Digital Electronics - Paper 2",
    subject: "FUNDAMENTALS OF DIGITAL ELECTRONICS",
    facultyName: "",
    description: "Previous year question paper for Fundamentals of Digital Electronics",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1eHvjvzflmnqgCHbZFgEmU400_AePprC3",
  },
  {
    id: "de-3",
    title: "Digital Electronics - Paper 3",
    subject: "FUNDAMENTALS OF DIGITAL ELECTRONICS",
    facultyName: "",
    description: "Previous year question paper for Fundamentals of Digital Electronics",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1VcQhK0dphEViXrFqLajiIqKan4BScx0G",
  },
  {
    id: "de-4",
    title: "Digital Electronics - Paper 4",
    subject: "FUNDAMENTALS OF DIGITAL ELECTRONICS",
    facultyName: "",
    description: "Previous year question paper for Fundamentals of Digital Electronics",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1QjbvJsQL6fvWGgmgrwOiSH6EWy7hPA4j",
  },
  {
    id: "de-5",
    title: "Digital Electronics - Paper 5",
    subject: "FUNDAMENTALS OF DIGITAL ELECTRONICS",
    facultyName: "",
    description: "Previous year question paper for Fundamentals of Digital Electronics",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1CUuMmnColJWD1oyszK37MEORCA3eZM8L",
  },
  {
    id: "de-6",
    title: "Digital Electronics - Paper 6",
    subject: "FUNDAMENTALS OF DIGITAL ELECTRONICS",
    facultyName: "",
    description: "Previous year question paper for Fundamentals of Digital Electronics",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "114fQjNi6ZRg6p6G1XE-RlKNeJkvOojc0",
  },
];

// ─── Mathematics Paper - I Question Papers (Google Drive PDFs, 1st Year Sem 1) ───
const MATH1_PAPERS = [
  {
    id: "math1-1",
    title: "Mathematics Paper I - Paper 1",
    subject: "MATHEMATICS PAPER - I",
    facultyName: "",
    description: "Previous year question paper for Mathematics Paper - I",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1vuXboLXscJMNb5MZc8E9mLrm43piiNG4",
  },
  {
    id: "math1-2",
    title: "Mathematics Paper I - Paper 2",
    subject: "MATHEMATICS PAPER - I",
    facultyName: "",
    description: "Previous year question paper for Mathematics Paper - I",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1TaBSsLgeFP1PJcbT9-ue2FinvtkM5xq0",
  },
  {
    id: "math1-3",
    title: "Mathematics Paper I - Paper 3",
    subject: "MATHEMATICS PAPER - I",
    facultyName: "",
    description: "Previous year question paper for Mathematics Paper - I",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1Bxmd8bmvSaiMO8nmDsjLiiegi3J6n-eZ",
  },
  {
    id: "math1-4",
    title: "Mathematics Paper I - Paper 4",
    subject: "MATHEMATICS PAPER - I",
    facultyName: "",
    description: "Previous year question paper for Mathematics Paper - I",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "12Z2Kms6Pr7w2zClr2g9kUpsBrcQbBXT9",
  },
  {
    id: "math1-5",
    title: "Mathematics Paper I - Paper 5",
    subject: "MATHEMATICS PAPER - I",
    facultyName: "",
    description: "Previous year question paper for Mathematics Paper - I",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "12G7oMktl3M7sVTO7OTsaYSyjiuH513JV",
  },
];

// ─── AI & Expert Systems Question Papers (Google Drive PDFs, 2nd Year Sem 2) ───
const AI_PAPERS = [
  {
    id: "ai-1",
    title: "AI and Expert Systems - Paper 1",
    subject: "ARTIFICIAL INTELLIGENCE AND EXPERT SYSTEMS",
    facultyName: "",
    description: "Previous year question paper for Artificial Intelligence and Expert Systems",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1n4lo9IGkAXclSguIG78bIeExrTMvsl29",
  },
];

// ─── Data Structures Question Papers (Google Drive PDFs, 1st Year Sem 2) ───
const DS_PAPERS = [
  {
    id: "ds-1",
    title: "Data Structures - Paper 1",
    subject: "DATA STRUCTURES",
    facultyName: "",
    description: "Previous year question paper for Data Structures",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1qtKOHStqtBY5i-f0-uf7oQNYSK7N_n57",
  },
  {
    id: "ds-2",
    title: "Data Structures - Paper 2",
    subject: "DATA STRUCTURES",
    facultyName: "",
    description: "Previous year question paper for Data Structures",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1jF9CnZeZ6oyh6CGRXrt700hoC_o8sOAd",
  },
  {
    id: "ds-3",
    title: "Data Structures - Paper 3",
    subject: "DATA STRUCTURES",
    facultyName: "",
    description: "Previous year question paper for Data Structures",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1hy0DZliAZXc6PFiz73EA0sdnDXtXmvxH",
  },
  {
    id: "ds-4",
    title: "Data Structures - Paper 4",
    subject: "DATA STRUCTURES",
    facultyName: "",
    description: "Previous year question paper for Data Structures",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1R9J3h72mar2XBHKJaRIYaX8Pm3UOGAK2",
  },
  {
    id: "ds-5",
    title: "Data Structures - Paper 5",
    subject: "DATA STRUCTURES",
    facultyName: "",
    description: "Previous year question paper for Data Structures",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1806T-RVm5fJO7GGLtsuGanDOqSIEG0Ez",
  },
  {
    id: "ds-6",
    title: "Data Structures - Paper 6",
    subject: "DATA STRUCTURES",
    facultyName: "",
    description: "Previous year question paper for Data Structures",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "11oUh8dVxfXD2dqORphl532HRlmf6BSdQ",
  },
];

// ─── C++ OOP Question Papers (Google Drive PDFs, 1st Year Sem 2) ───
const CPP_PAPERS = [
  {
    id: "cpp-1",
    title: "OOP Using C++ - Paper 1",
    subject: "OBJECT ORIENTED PROGRAMMING USING C++",
    facultyName: "",
    description: "Previous year question paper for Object Oriented Programming Using C++",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1Nt0SM0S-G0kZYWxpvZH0zjPm89R6y18v",
  },
  {
    id: "cpp-2",
    title: "OOP Using C++ - Paper 2",
    subject: "OBJECT ORIENTED PROGRAMMING USING C++",
    facultyName: "",
    description: "Previous year question paper for Object Oriented Programming Using C++",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1CfhaOsqr3rkn-g51scMCxkzQQLuWB4He",
  },
  {
    id: "cpp-3",
    title: "OOP Using C++ - Paper 3",
    subject: "OBJECT ORIENTED PROGRAMMING USING C++",
    facultyName: "",
    description: "Previous year question paper for Object Oriented Programming Using C++",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1BtWJsAEAo3q4NdWlH-pyTzxa6wKf-hjW",
  },
  {
    id: "cpp-4",
    title: "OOP Using C++ - Paper 4",
    subject: "OBJECT ORIENTED PROGRAMMING USING C++",
    facultyName: "",
    description: "Previous year question paper for Object Oriented Programming Using C++",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "12s7EZb1QHZ7-MK90_dwRfBQh02YG7wIu",
  },
  {
    id: "cpp-5",
    title: "OOP Using C++ - Paper 5",
    subject: "OBJECT ORIENTED PROGRAMMING USING C++",
    facultyName: "",
    description: "Previous year question paper for Object Oriented Programming Using C++",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1-BevZj13cFduRraVQWwdY4KWU7xZbs_u",
  },
];

// ─── Mathematics Paper - II Question Papers (Google Drive PDFs, 1st Year Sem 2) ───
const MATH2_PAPERS = [
  {
    id: "math2-1",
    title: "Mathematics Paper II - Paper 1",
    subject: "MATHEMATICS PAPER - II",
    facultyName: "",
    description: "Previous year question paper for Mathematics Paper - II",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1X8A-hO3EdFNmC7OqS8ozCrOYhEmuBOT5",
  },
  {
    id: "math2-2",
    title: "Mathematics Paper II - Paper 2",
    subject: "MATHEMATICS PAPER - II",
    facultyName: "",
    description: "Previous year question paper for Mathematics Paper - II",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1pvZ-V55wvBl89tOYp5sTH2IckTU12QQb",
  },
  {
    id: "math2-3",
    title: "Mathematics Paper II - Paper 3",
    subject: "MATHEMATICS PAPER - II",
    facultyName: "",
    description: "Previous year question paper for Mathematics Paper - II",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1bBRXADAfxMoQ3OIrXDfgLCtiNhKiM2Ex",
  },
  {
    id: "math2-4",
    title: "Mathematics Paper II - Paper 4",
    subject: "MATHEMATICS PAPER - II",
    facultyName: "",
    description: "Previous year question paper for Mathematics Paper - II",
    pages: 2,
    downloads: 0,
    year: "U1819",
    courseType: "ug",
    regulation: "R2024",
    driveFileId: "1A__hYCNGoUBzPR3-7kDfXXTTnl07Hr9w",
  },
];

const allPapers = [...DBMS_PAPERS, ...OS_PAPERS, ...DMT_PAPERS, ...ASPNET_PAPERS, ...JAVA_PAPERS, ...WEBTECH_PAPERS, ...ANDROID_PAPERS, ...STATS1_PAPERS, ...SE_PAPERS, ...STATS2_PAPERS, ...PYTHON_PAPERS, ...DIGITAL_ELECTRONICS_PAPERS, ...MATH1_PAPERS, ...AI_PAPERS, ...DS_PAPERS, ...CPP_PAPERS, ...MATH2_PAPERS];

function downloadPaperPdf(paper) {
  if (paper.driveFileId) {
    window.open(`https://drive.google.com/uc?export=download&id=${paper.driveFileId}`, '_blank');
    return;
  }
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
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const [previewing, setPreviewing] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();

  const yearData = selectedYear ? CURRICULUM[selectedYear] : null;
  const semesterData = selectedSemester && yearData ? yearData.semesters[selectedSemester] : null;
  const yearSubjects = semesterData ? semesterData.subjects : (selectedYear ? getSubjectsForYear(selectedYear) : []);
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
      const match = noteSubjLower.includes(subjLower);
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
            <span className="uppercase text-xs font-semibold text-gray-500">{courseType.toUpperCase()}</span>
            <FiChevronRight size={12} />
            <span className={ys.text}>{yearData.label}</span>
            <FiChevronRight size={12} />
            <span className={ys.text}>{semesterData.label}</span>
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
            <FiAward size={26} />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-gray-900 sm:text-2xl">{selectedSubject}</h1>
            <p className="text-xs text-gray-400">
              {courseType.toUpperCase()} · {yearData.label} · {semesterData.label}{" "}
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
                Papers for {selectedSubject} · {courseType.toUpperCase()} · {yearData.label} · {semesterData.label} will be uploaded soon
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
              <div className="flex-1 overflow-auto bg-white">
                {previewing.driveFileId ? (
                  <div className="aspect-[4/3] w-full sm:aspect-[16/10]">
                    <iframe
                      src={`https://drive.google.com/file/d/${previewing.driveFileId}/preview`}
                      title={previewing.title}
                      className="h-full w-full"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-gray-400 p-6">
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
                )}
              </div>
              <div className="border-t border-gray-100 px-4 py-2 text-center text-[11px] text-gray-400">
                {previewing.pages && <span>{previewing.pages} pages</span>} · {previewing.subject} · {previewing.year} · {previewing.regulation}
                {previewing.driveFileId && (
                  <span className="ml-2">
                    · <a
                      href={`https://drive.google.com/uc?export=download&id=${previewing.driveFileId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      Download PDF
                    </a>
                  </span>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
