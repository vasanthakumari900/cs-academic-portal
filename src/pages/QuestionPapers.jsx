import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiFileText, FiDownload, FiEye, FiBookOpen,
  FiCalendar, FiSearch, FiAward, FiArrowLeft,
  FiChevronRight, FiLayers, FiClock, FiUser, FiUploadCloud,
} from "react-icons/fi";
import { FACULTY_NAMES } from "../utils/constants";
import { useAuth } from "../context/AuthContext";
import { questionPaperService } from "../services/questionPaperService";
import { STORAGE_PATHS } from "../utils/constants";
import { useFirestoreList } from "../hooks/useFirestoreList";
import { uploadFile } from "../services/storageService";
import toast from "react-hot-toast";
import { downloadDriveFile, getDriveEmbedUrl, getDriveViewUrl } from "../utils/downloadUtils";
import PdfFileCard from "../components/common/PdfFileCard";
import { getSubjectIcon } from "../utils/subjectIcons";


const CURRICULUM = {
  1: { label: "1st Year", icon: "Ⅰ", semesters: { 1: { label: "Semester 1", subjects: ["TAMIL", "Foundation English - I", "Mathematics Paper I", "Python Programming Essentials", "Data Structures"] }, 2: { label: "Semester 2", subjects: ["OBJECT ORIENTED PROGRAMMING USING C++","WEB TECHNOLOGY","MATHEMATICS PAPER - II","TAMIL","ENGLISH"] } } },
  2: { label: "2nd Year", icon: "Ⅱ", semesters: { 1: { label: "Semester 1", subjects: ["Object Oriented Programming Concepts using JAVA", "Web Application Development using AngularJS and Node.js", "Statistical Methods for Computer Science – I", "TAMIL", "Foundation English - III", "Principles of operating Systems", "Web Application Development using ReactJS and Node.js"] }, 2: { label: "Semester 2", subjects: ["ANDROID APP DEVELOPMENT","SOFTWARE ENGINEERING","STATISTICAL METHODS FOR COMPUTER SCIENCE - II","ARTIFICIAL INTELLIGENCE AND EXPERT SYSTEMS","TAMIL","ENGLISH"] } } },
  3: { label: "3rd Year", icon: "Ⅲ", semesters: { 1: { label: "Semester 1", subjects: ["OPERATING SYSTEM","DATA MINING TECHNIQUES","ASP.NET","DATABASE MANAGEMENT SYSTEM"] }, 2: { label: "Semester 2", subjects: ["PROGRAMMING IN PHP","CLOUD COMPUTING","COMPUTER NETWORKS","INTRODUCTION TO DATA SCIENCE","UNIFIED MODELING LANGUAGE","DIGITAL IMAGE PROCESSING"] } } },
};

const CURRICULUM_PG = {
  1: {
    label: "1st Year",
    icon: "Ⅰ",
    semesters: {
      1: {
        label: "Semester 1",
        subjects: [
          "Advanced Design and Analysis of Algorithms",
          "Advanced Software Engineering",
          "Contemporary Web Technologies",
          "Data Communication and Networking",
          "Python for Data Science",
          "Mobile Network System",
          "Artificial Neural Network",
        ],
      },
      2: {
        label: "Semester 2",
        subjects: [
          "Digital Image Processing",
          "Java Enterprise Edition",
          "Data Mining Techniques",
          "Advanced Database Management System",
          "Distributed Databases",
          "Cloud Web Services",
          "IoT and its Applications",
          "High Speed Networks",
          "Social Network Analysis",
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
          "Artificial Intelligence and Machine Learning Techniques",
          "DOT NET Technology",
          "Big Data Analytics",
          "Cyber Forensics",
          "Ethical Hacking",
          "Information Security",
        ],
      },
      2: { label: "Semester 2", subjects: [] },
    },
  },
};

function getSubjectsForYear(year, curr = CURRICULUM) { const yr = curr[year]; if (!yr) return []; const all = []; Object.values(yr.semesters).forEach((sem) => { sem.subjects.forEach((s) => { if (!all.includes(s)) all.push(s); }); }); return all; }

const yearStyles = {
  1: { bg: "bg-[#0F4C81] text-white border-[#0A3356]", text: "text-[#0F4C81]" },
  2: { bg: "bg-[#0F4C81] text-white border-[#0A3356]", text: "text-[#0F4C81]" },
  3: { bg: "bg-[#0F4C81] text-white border-[#0A3356]", text: "text-[#0F4C81]" },
};

const subjectColors = [
  { from: "bg-[#F0F4F8]", to: "text-[#0F4C81] border-[#D9E2EC]", badge: "bg-[#F0F4F8] text-[#0F4C81]" },
  { from: "bg-[#E8F5E9]", to: "text-[#2E7D32] border-[#C8E6C9]", badge: "bg-[#E8F5E9] text-[#2E7D32]" },
  { from: "bg-[#FFF3E0]", to: "text-amber-800 border-[#FFE0B2]", badge: "bg-[#FFF3E0] text-amber-800" },
  { from: "bg-[#FFEBEE]", to: "text-red-800 border-[#FFCDD2]", badge: "bg-[#FFEBEE] text-red-800" },
  { from: "bg-[#E8EAF6]", to: "text-[#303F9F] border-[#C5CAE9]", badge: "bg-[#E8EAF6] text-[#303F9F]" },
];

const FACULTY_MAP = {
  "OPERATING SYSTEM": "Ms. Dr. DHARANI", "DATA MINING TECHNIQUES": "Ms. V. PONNILA",
  "ASP.NET": "Ms. R. SARANYA", "DATABASE MANAGEMENT SYSTEM": "Ms. M.P. SUDHA",
  "ADVANCED DESIGN AND ANALYSIS OF ALGORITHMS": "Ms. P. REVATHI",
  "ADVANCED SOFTWARE ENGINEERING": "Ms. Dr. N.M. Sangeetha",
  "CONTEMPORARY WEB TECHNOLOGIES": "Ms. P. SUGANYA",
  "CONTEMPORARY WEB TECHNOLOGIES LAB": "Ms. P. SUGANYA",
  "DATA COMMUNICATION AND NETWORKING": "Ms. M.P. SUDHA",
  "PYTHON FOR DATA SCIENCE": "Ms. S. Karthika",
  "PYTHON FOR DATA SCIENCE LAB": "Ms. S. Karthika",
  "DIGITAL IMAGE PROCESSING": "Ms. Dr. DHARANI",
  "JAVA ENTERPRISE EDITION": "Ms. K. DURGADEVI",
  "ADVANCED DATABASE MANAGEMENT SYSTEM": "Ms. M.P. SUDHA",
  "DISTRIBUTED DATABASES": "Ms. M.P. SUDHA",
  "CLOUD WEB SERVICES": "Ms. R. SARANYA",
  "IOT AND ITS APPLICATIONS": "Ms. P. REVATHI",
  "INTERNET OF THINGS AND ITS APPLICATIONS": "Ms. P. REVATHI",
  "HIGH SPEED NETWORKS": "Ms. V. PONNILA",
  "SOCIAL NETWORK ANALYSIS": "Ms. Dr. N.M. Sangeetha",
  "ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING TECHNIQUES": "Mrs. R. Karthika",
  "DOT NET TECHNOLOGY": "Mrs. P. Revathi",
  "DOT NET  TECHNOLOGY": "Mrs. P. Revathi",
  "BIG DATA ANALYTICS": "Mrs. R. Lalitha",
  "CYBER FORENSICS": "Department of CS",
  "ETHICAL HACKING": "Mrs. R. Poojitha Shree",
  "INFORMATION SECURITY": "Department of CS",
  "Advanced Design and Analysis of Algorithms": "Ms. P. REVATHI",
  "Advanced Software Engineering": "Ms. Dr. N.M. Sangeetha",
  "Contemporary Web Technologies": "Ms. P. SUGANYA",
  "Contemporary Web Technologies lab": "Ms. P. SUGANYA",
  "Data Communication and Networking": "Ms. M.P. SUDHA",
  "Python for Data Science": "Ms. S. Karthika",
  "Python for Data Science lab": "Ms. S. Karthika",
  "Digital Image Processing": "Ms. Dr. DHARANI",
  "Java Enterprise Edition": "Ms. K. DURGADEVI",
  "Data Mining Techniques": "Ms. V. PONNILA",
  "Advanced Database Management System": "Ms. M.P. SUDHA",
  "Distributed Databases": "Ms. M.P. SUDHA",
  "Cloud Web Services": "Ms. R. SARANYA",
  "IoT and its Applications": "Ms. P. REVATHI",
  "High Speed Networks": "Ms. V. PONNILA",
  "Social Network Analysis": "Ms. Dr. N.M. Sangeetha",
  "Artificial Intelligence and Machine Learning Techniques": "Mrs. R. Karthika",
  "DOT NET Technology": "Mrs. P. Revathi",
  "Big Data Analytics": "Mrs. R. Lalitha",
  "Cyber Forensics": "Department of CS",
  "Ethical Hacking": "Mrs. R. Poojitha Shree",
  "Information Security": "Department of CS",
};

const SUBJECT_CODES = {
  "ADVANCED DESIGN AND ANALYSIS OF ALGORITHMS": "2627101",
  "ADVANCED SOFTWARE ENGINEERING": "2627105(A)",
  "CONTEMPORARY WEB TECHNOLOGIES": "2627103",
  "CONTEMPORARY WEB TECHNOLOGIES LAB": "2627107",
  "DATA COMMUNICATION AND NETWORKING": "2627104(A)",
  "PYTHON FOR DATA SCIENCE": "2627102",
  "PYTHON FOR DATA SCIENCE LAB": "2627106",
  "DIGITAL IMAGE PROCESSING": "2627201",
  "JAVA ENTERPRISE EDITION": "2627202",
  "DATA MINING TECHNIQUES": "2627203",
  "ADVANCED DATABASE MANAGEMENT SYSTEM": "2627204(A)",
  "DISTRIBUTED DATABASES": "2627204(B)",
  "CLOUD WEB SERVICES": "2627204(C)",
  "IOT AND ITS APPLICATIONS": "2627205(A)",
  "INTERNET OF THINGS AND ITS APPLICATIONS": "2627205(A)",
  "HIGH SPEED NETWORKS": "2627205(B)",
  "SOCIAL NETWORK ANALYSIS": "2627205(C)",
  "ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING TECHNIQUES": "2627301",
  "DOT NET TECHNOLOGY": "2627302",
  "DOT NET  TECHNOLOGY": "2627302",
  "BIG DATA ANALYTICS": "2627303",
  "CYBER FORENSICS": "2627304(A)",
  "ETHICAL HACKING": "2627304(B)",
  "INFORMATION SECURITY": "2627304(C)",
  "Advanced Design and Analysis of Algorithms": "2627101",
  "Advanced Software Engineering": "2627105(A)",
  "Contemporary Web Technologies": "2627103",
  "Contemporary Web Technologies lab": "2627107",
  "Data Communication and Networking": "2627104(A)",
  "Python for Data Science": "2627102",
  "Python for Data Science lab": "2627106",
  "Digital Image Processing": "2627201",
  "Java Enterprise Edition": "2627202",
  "Data Mining Techniques": "2627203",
  "Advanced Database Management System": "2627204(A)",
  "Distributed Databases": "2627204(B)",
  "Cloud Web Services": "2627204(C)",
  "IoT and its Applications": "2627205(A)",
  "High Speed Networks": "2627205(B)",
  "Social Network Analysis": "2627205(C)",
  "Artificial Intelligence and Machine Learning Techniques": "2627301",
  "DOT NET Technology": "2627302",
  "Big Data Analytics": "2627303",
  "Cyber Forensics": "2627304(A)",
  "Ethical Hacking": "2627304(B)",
  "Information Security": "2627304(C)",
};

function getFacultyName(subject) {
  if (!subject) return null;
  const upper = subject.toUpperCase();
  if (upper.includes("DBMS") || upper.includes("DATABASE")) return FACULTY_NAMES.DBMS;
  if (upper.includes("ASP") || upper.includes(".NET")) return FACULTY_NAMES.ASPNET;
  if (upper.includes("OPERATING") || upper.includes("OS")) return FACULTY_NAMES.OS;
  if (upper.includes("DMT") || upper.includes("DATA MINING")) return FACULTY_NAMES.DMT;
  return FACULTY_MAP[subject] || FACULTY_MAP[upper] || null;
}

const DBMS_PAPERS = [
  { id: "dbms-u1819", title: "DBMS - U1819", subject: "DATABASE MANAGEMENT SYSTEM", facultyName: "M P Sudha", description: "Previous year question paper for Database Management System", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1Cp68ANRP_doVafYZC5cw-myc-tGh8yPZ" },
  { id: "dbms-u1819-1", title: "DBMS - U1819 Set 1", subject: "DATABASE MANAGEMENT SYSTEM", facultyName: "M P Sudha", description: "Previous year question paper Set 1", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1S5815UhqWp5Rh0LvGMApKXUS7iua0VHo" },
  { id: "dbms-u1819-2", title: "DBMS - U1819 Set 2", subject: "DATABASE MANAGEMENT SYSTEM", facultyName: "M P Sudha", description: "Previous year question paper Set 2", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1RXMrycEqt10WHukIOYU8RgOiek-1MwwZ" },
  { id: "dbms-u1819-3", title: "DBMS - U1819 Set 3", subject: "DATABASE MANAGEMENT SYSTEM", facultyName: "M P Sudha", description: "Previous year question paper Set 3", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1oXeenpoCMrbmn-kzYzZI7-NCrSy5kCZP" },
];
const OS_PAPERS = [
  { id: "os-1", title: "Operating Systems - Paper 1", subject: "OPERATING SYSTEM", facultyName: "Dr Dharani", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1dWKCFsNml6heTR_OSL_NTw9R3tlNnzbH" },
  { id: "os-2", title: "Operating Systems - Paper 2", subject: "OPERATING SYSTEM", facultyName: "Dr Dharani", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1cLy_amz1L_Jw8sRc6PwN1qvim41v7UbS" },
  { id: "os-3", title: "Operating Systems - Paper 3", subject: "OPERATING SYSTEM", facultyName: "Dr Dharani", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1t5SuYyqfYIDGAL0hmuqJ35GkJ9R6kJlw" },
  { id: "os-4", title: "Operating Systems - Paper 4", subject: "OPERATING SYSTEM", facultyName: "Dr Dharani", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1Vwu1e9nzOOJUBN5B2WNNmdHVsUAvJfd8" },
  { id: "os-5", title: "Operating Systems - Paper 5", subject: "OPERATING SYSTEM", facultyName: "Dr Dharani", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1YFk496U3Wv1jzBr6eYi4IIPOQeKPUgKc" },
  { id: "os-6", title: "Operating Systems - Paper 6", subject: "OPERATING SYSTEM", facultyName: "Dr Dharani", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1UFNbBQuvaWjg-d8iug7zQQGw3sUODxAj" },
];
const DMT_PAPERS = [
  { id: "dmt-1", title: "Data Mining Techniques - Paper 1", subject: "DATA MINING TECHNIQUES", facultyName: "V Ponnila", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1eUnnWP3zTfBi0tUcv55W77NaTV32pNru" },
  { id: "dmt-2", title: "Data Mining Techniques - Paper 2", subject: "DATA MINING TECHNIQUES", facultyName: "V Ponnila", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1BltdeHc_PEiwNkdEJWhqOrHevKO5kkfr" },
  { id: "dmt-3", title: "Data Mining Techniques - Paper 3", subject: "DATA MINING TECHNIQUES", facultyName: "V Ponnila", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1LwxS2cRZFuEi88EnR97JHSkIdtjnu-t-" },
  { id: "dmt-4", title: "Data Mining Techniques - Paper 4", subject: "DATA MINING TECHNIQUES", facultyName: "V Ponnila", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1SGNhkMBw_uYUDd6g7moccCvmIP60P4aA" },
  { id: "dmt-5", title: "Data Mining Techniques - Paper 5", subject: "DATA MINING TECHNIQUES", facultyName: "V Ponnila", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1bks-vmoF824Vhw8oKI7oqOunhWLqnsZH" },
  { id: "dmt-6", title: "Data Mining Techniques - Paper 6", subject: "DATA MINING TECHNIQUES", facultyName: "V Ponnila", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1dY5Dlyx71fEXUJTop7Rer4xIWbHn_zXw" },
];
const ASPNET_PAPERS = [
  { id: "aspnet-1", title: "ASP.NET - Paper 1", subject: "ASP.NET", facultyName: "R Saranya", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1-zlOLsuXsYIwX-eGopeUinrsjbofTJRp" },
  { id: "aspnet-2", title: "ASP.NET - Paper 2", subject: "ASP.NET", facultyName: "R Saranya", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1VGfqCbntp335IOAt-w04LV-643iJ3_TX" },
  { id: "aspnet-3", title: "ASP.NET - Paper 3", subject: "ASP.NET", facultyName: "R Saranya", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1sWi0UvGVOSpA_DaK7JgJ-PKHHdkAgGRh" },
  { id: "aspnet-4", title: "ASP.NET - Paper 4", subject: "ASP.NET", facultyName: "R Saranya", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1ddRnBA1IyzRinn847bf1cf1KwKNwauop" },
  { id: "aspnet-5", title: "ASP.NET - Paper 5", subject: "ASP.NET", facultyName: "R Saranya", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1LSKjWGCIj-OtAIJ-fBRC7xdQd80lXwtp" },
  { id: "aspnet-6", title: "ASP.NET - Paper 6", subject: "ASP.NET", facultyName: "R Saranya", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1kNfOw9vK2iZy4aHUq4DLzBw0pHV5t1--" },
];
const JAVA_PAPERS = [
  { id: "java-1", title: "Java Programming - Paper 1", subject: "JAVA PROGRAMMING", facultyName: "", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1jUVgImh2xSnbOaWyL5SOgkU45gqpekO-" },
  { id: "java-2", title: "Java Programming - Paper 2", subject: "JAVA PROGRAMMING", facultyName: "", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1Yen9go0xCsZztkRWNvvEj65gUCsNFaG4" },
  { id: "java-3", title: "Java Programming - Paper 3", subject: "JAVA PROGRAMMING", facultyName: "", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1WqI5g9tkcfDnFVQ3aD5ConYNNrIK0PBz" },
  { id: "java-4", title: "Java Programming - Paper 4", subject: "JAVA PROGRAMMING", facultyName: "", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1O-tDSsg3KSlo1XROmBAzvJT7QE_i70K9" },
  { id: "java-5", title: "Java Programming - Paper 5", subject: "JAVA PROGRAMMING", facultyName: "", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1C0TRBHRHjsmTHVwAO4T4fcBTalsWK22t" },
  { id: "java-6", title: "Java Programming - Paper 6", subject: "JAVA PROGRAMMING", facultyName: "", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "12ndwwfEA7yxEh8qVar_wdKLWyitefupH" },
];
const WEBTECH_PAPERS = [
  { id: "webtech-1", title: "Web Technology - Paper 1", subject: "WEB TECHNOLOGY", facultyName: "", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1k9OOUdhRCPMhmvHGrEs-kKyFaJtKd4Cs" },
  { id: "webtech-2", title: "Web Technology - Paper 2", subject: "WEB TECHNOLOGY", facultyName: "", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1c4p1JjCmfKGQuY7_HkDjlyc-ipR73vuf" },
  { id: "webtech-3", title: "Web Technology - Paper 3", subject: "WEB TECHNOLOGY", facultyName: "", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1ZN2zHGtPg4z3SpPcIx4WrIPDmL0WPzGZ" },
  { id: "webtech-4", title: "Web Technology - Paper 4", subject: "WEB TECHNOLOGY", facultyName: "", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1MrJiJpOwrQg6Swyldfb_1R790nwf2foo" },
  { id: "webtech-5", title: "Web Technology - Paper 5", subject: "WEB TECHNOLOGY", facultyName: "", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1xWfFOVdz9WtCyDClR7-XsgnrV_NWhBzZ" },
  { id: "webtech-6", title: "Web Technology - Paper 6", subject: "WEB TECHNOLOGY", facultyName: "", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1Jj7zE77oeKWOgMJ94YOSBn9Fqto9NEdY" },
];
const ANDROID_PAPERS = [
  { id: "android-1", title: "Android App Development - Paper 1", subject: "ANDROID APP DEVELOPMENT", facultyName: "", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "17am2OfoImHY139oyoZ7PwgI60fFTPlio" },
  { id: "android-2", title: "Android App Development - Paper 2", subject: "ANDROID APP DEVELOPMENT", facultyName: "", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "10AWHldygH6_rgg_GV73hBYEyZsO3kBu-" },
  { id: "android-3", title: "Android App Development - Paper 3", subject: "ANDROID APP DEVELOPMENT", facultyName: "", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1maJnSuM1qMrvWDnKvbaql2KfsoKsyHGR" },
];
const STATS1_PAPERS = [
  { id: "stats1-1", title: "Statistical Methods for CS - I - Paper 1", subject: "STATISTICAL METHODS FOR COMPUTER SCIENCE - I", facultyName: "", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1X_VRk6AgYnAKv7fMrv6NMgnXl8BaRHE5" },
  { id: "stats1-2", title: "Statistical Methods for CS - I - Paper 2", subject: "STATISTICAL METHODS FOR COMPUTER SCIENCE - I", facultyName: "", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1Cjpmlsqu6SnxDBxYYc0xoubto81IpbR0" },
  { id: "stats1-3", title: "Statistical Methods for CS - I - Paper 3", subject: "STATISTICAL METHODS FOR COMPUTER SCIENCE - I", facultyName: "", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1v75G4l7Ue1qrPVzAjFlXBT-CIOXBJRnE" },
  { id: "stats1-4", title: "Statistical Methods for CS - I - Paper 4", subject: "STATISTICAL METHODS FOR COMPUTER SCIENCE - I", facultyName: "", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1Hn9Fjv6lqn45J2dmPGzRgupHSRYySHPl" },
  { id: "stats1-5", title: "Statistical Methods for CS - I - Paper 5", subject: "STATISTICAL METHODS FOR COMPUTER SCIENCE - I", facultyName: "", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1pNZNVipT_Yk0HLEy3B1iPumNyM4fwQ5z" },
];
const SE_PAPERS = [
  { id: "se-1", title: "Software Engineering - Paper 1", subject: "SOFTWARE ENGINEERING", facultyName: "", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1rpM2BMCth8Jman-wmlE4WJK_KrCX5F6r" },
  { id: "se-2", title: "Software Engineering - Paper 2", subject: "SOFTWARE ENGINEERING", facultyName: "", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1PbV6XtasCjKh6BymjMuigDoGILyBZXKN" },
  { id: "se-3", title: "Software Engineering - Paper 3", subject: "SOFTWARE ENGINEERING", facultyName: "", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1wGJmEp9Z5zP7hmhnj9D6Bkz9TjMgOf3S" },
  { id: "se-4", title: "Software Engineering - Paper 4", subject: "SOFTWARE ENGINEERING", facultyName: "", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1Y6MoIpg5G9ZONPCq-GhvgBISfgyL08zF" },
  { id: "se-5", title: "Software Engineering - Paper 5", subject: "SOFTWARE ENGINEERING", facultyName: "", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1KVhiuJz0Dq-XKiF96KcAasfgl46DxKo9" },
  { id: "se-6", title: "Software Engineering - Paper 6", subject: "SOFTWARE ENGINEERING", facultyName: "", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1qyJMPXu-WnePNyqAtib3ep69Q2SmT2L4" },
];
const STATS2_PAPERS = [
  { id: "stats2-1", title: "Statistical Methods for CS - II - Paper 1", subject: "STATISTICAL METHODS FOR COMPUTER SCIENCE - II", facultyName: "", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1loHS32UEASmrvrvHQERJu4hZjKlm1eDD" },
  { id: "stats2-2", title: "Statistical Methods for CS - II - Paper 2", subject: "STATISTICAL METHODS FOR COMPUTER SCIENCE - II", facultyName: "", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "19KbU3TqzaghgyGlaMAMgOykhJ8aDI-tJ" },
  { id: "stats2-3", title: "Statistical Methods for CS - II - Paper 3", subject: "STATISTICAL METHODS FOR COMPUTER SCIENCE - II", facultyName: "", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1TPwIj4s8aY-OyYfPWCejeKhunVDO0ZUX" },
];
const PYTHON_PAPERS = [
  { id: "python-1", title: "Python Programming - Paper 1", subject: "FUNDAMENTALS OF PYTHON PROGRAMMING", facultyName: "", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1wFiahReZ1PAjUVgOMiTFpso22pTOv2Q-" },
  { id: "python-2", title: "Python Programming - Paper 2", subject: "FUNDAMENTALS OF PYTHON PROGRAMMING", facultyName: "", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1u1P3lBvCyHckAi9cAEVbEQqrDzefjygU" },
  { id: "python-3", title: "Python Programming - Paper 3", subject: "FUNDAMENTALS OF PYTHON PROGRAMMING", facultyName: "", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1qMNOXeyw6uXUJoEpaC9WPwIb3jtA9Mrm" },
  { id: "python-4", title: "Python Programming - Paper 4", subject: "FUNDAMENTALS OF PYTHON PROGRAMMING", facultyName: "", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1gSJW7kY4fNKi5idas-Op7f9mO-8Ehg-_" },
  { id: "python-5", title: "Python Programming - Paper 5", subject: "FUNDAMENTALS OF PYTHON PROGRAMMING", facultyName: "", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1FQSVnQXv2xNicuiF5OCOjxgk2ej2--DW" },
  { id: "python-6", title: "Python Programming - Paper 6", subject: "FUNDAMENTALS OF PYTHON PROGRAMMING", facultyName: "", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1Ehfe16NUO-qze_FjqxCYA6vXDBgS9zvM" },
];
const DIGITAL_ELECTRONICS_PAPERS = [
  { id: "de-1", title: "Digital Electronics - Paper 1", subject: "FUNDAMENTALS OF DIGITAL ELECTRONICS", facultyName: "", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1nbc1ERrNHYrG9wlwayKWR4KIccXByRJp" },
  { id: "de-2", title: "Digital Electronics - Paper 2", subject: "FUNDAMENTALS OF DIGITAL ELECTRONICS", facultyName: "", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1eHvjvzflmnqgCHbZFgEmU400_AePprC3" },
  { id: "de-3", title: "Digital Electronics - Paper 3", subject: "FUNDAMENTALS OF DIGITAL ELECTRONICS", facultyName: "", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1VcQhK0dphEViXrFqLajiIqKan4BScx0G" },
  { id: "de-4", title: "Digital Electronics - Paper 4", subject: "FUNDAMENTALS OF DIGITAL ELECTRONICS", facultyName: "", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1QjbvJsQL6fvWGgmgrwOiSH6EWy7hPA4j" },
];
const MATH1_PAPERS = [
  { id: "math1-1", title: "Mathematics Paper I - Paper 1", subject: "MATHEMATICS PAPER - I", facultyName: "", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1vuXboLXscJMNb5MZc8E9mLrm43piiNG4" },
  { id: "math1-2", title: "Mathematics Paper I - Paper 2", subject: "MATHEMATICS PAPER - I", facultyName: "", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1TaBSsLgeFP1PJcbT9-ue2FinvtkM5xq0" },
  { id: "math1-3", title: "Mathematics Paper I - Paper 3", subject: "MATHEMATICS PAPER - I", facultyName: "", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1Bxmd8bmvSaiMO8nmDsjLiiegi3J6n-eZ" },
  { id: "math1-4", title: "Mathematics Paper I - Paper 4", subject: "MATHEMATICS PAPER - I", facultyName: "", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "12Z2Kms6Pr7w2zClr2g9kUpsBrcQbBXT9" },
];
const DS_PAPERS = [
  { id: "ds-1", title: "Data Structures - Paper 1", subject: "DATA STRUCTURES", facultyName: "", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1qtKOHStqtBY5i-f0-uf7oQNYSK7N_n57" },
  { id: "ds-2", title: "Data Structures - Paper 2", subject: "DATA STRUCTURES", facultyName: "", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1jF9CnZeZ6oyh6CGRXrt700hoC_o8sOAd" },
  { id: "ds-3", title: "Data Structures - Paper 3", subject: "DATA STRUCTURES", facultyName: "", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1hy0DZliAZXc6PFiz73EA0sdnDXtXmvxH" },
];
const CPP_PAPERS = [
  { id: "cpp-1", title: "OOP Using C++ - Paper 1", subject: "OBJECT ORIENTED PROGRAMMING USING C++", facultyName: "", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1Nt0SM0S-G0kZYWxpvZH0zjPm89R6y18v" },
  { id: "cpp-2", title: "OOP Using C++ - Paper 2", subject: "OBJECT ORIENTED PROGRAMMING USING C++", facultyName: "", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1CfhaOsqr3rkn-g51scMCxkzQQLuWB4He" },
  { id: "cpp-3", title: "OOP Using C++ - Paper 3", subject: "OBJECT ORIENTED PROGRAMMING USING C++", facultyName: "", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1BtWJsAEAo3q4NdWlH-pyTzxa6wKf-hjW" },
];
const MATH2_PAPERS = [
  { id: "math2-1", title: "Mathematics Paper II - Paper 1", subject: "MATHEMATICS PAPER - II", facultyName: "", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1X8A-hO3EdFNmC7OqS8ozCrOYhEmuBOT5" },
  { id: "math2-2", title: "Mathematics Paper II - Paper 2", subject: "MATHEMATICS PAPER - II", facultyName: "", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1pvZ-V55wvBl89tOYp5sTH2IckTU12QQb" },
  { id: "math2-3", title: "Mathematics Paper II - Paper 3", subject: "MATHEMATICS PAPER - II", facultyName: "", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1bBRXADAfxMoQ3OIrXDfgLCtiNhKiM2Ex" },
];
const AI_PAPERS = [
  { id: "ai-1", title: "AI and Expert Systems - Paper 1", subject: "ARTIFICIAL INTELLIGENCE AND EXPERT SYSTEMS", facultyName: "", description: "Previous year question paper", pages: 2, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1n4lo9IGkAXclSguIG78bIeExrTMvsl29" },
];
const TAMIL_PAPERS = [
  // ================= 1st Year Semester 1 (Paper I) =================
  { id: "tamil-sem1-nov23", title: "1st Year Sem 1 Tamil - November 2023", subject: "TAMIL", facultyName: "Dept of Tamil", description: "Foundation Tamil Paper I (Nov 2023)", pages: 3, downloads: 0, year: "Nov 2023", courseType: "ug", regulation: "U03", driveFileId: "17Bzl6NmO-VPo9IBnm9yaw4QaP8jpZnnv", academicYear: 1, semester: 1 },
  { id: "tamil-sem1-apr24", title: "1st Year Sem 1 Tamil - April 2024", subject: "TAMIL", facultyName: "Dept of Tamil", description: "Foundation Tamil Paper I (Apr 2024)", pages: 3, downloads: 0, year: "Apr 2024", courseType: "ug", regulation: "U03", driveFileId: "1-bFHtFUadQooBvDNX-monMAbQxz0JuVA", academicYear: 1, semester: 1 },
  { id: "tamil-sem1-nov24", title: "1st Year Sem 1 Tamil - November 2024", subject: "TAMIL", facultyName: "Dept of Tamil", description: "Foundation Tamil Paper I (Nov 2024)", pages: 3, downloads: 0, year: "Nov 2024", courseType: "ug", regulation: "U03", driveFileId: "17Bzl6NmO-VPo9IBnm9yaw4QaP8jpZnnv", academicYear: 1, semester: 1 },
  { id: "tamil-sem1-apr25", title: "1st Year Sem 1 Tamil - April 2025", subject: "TAMIL", facultyName: "Dept of Tamil", description: "Foundation Tamil Paper I (Apr 2025)", pages: 3, downloads: 0, year: "Apr 2025", courseType: "ug", regulation: "U03", driveFileId: "1-bFHtFUadQooBvDNX-monMAbQxz0JuVA", academicYear: 1, semester: 1 },
  { id: "tamil-sem1-nov25", title: "1st Year Sem 1 Tamil - November 2025 (U01)", subject: "TAMIL", facultyName: "Dept of Tamil", description: "Foundation Tamil Paper I (Nov 2025)", pages: 3, downloads: 0, year: "Nov 2025", courseType: "ug", regulation: "U01", driveFileId: "1llM4bEj1w_WPQSx8trpVv2VHjKFvpEIm", academicYear: 1, semester: 1 },
  { id: "tamil-sem1-apr26", title: "1st Year Sem 1 Tamil - April 2026 (U01)", subject: "TAMIL", facultyName: "Dept of Tamil", description: "Foundation Tamil Paper I (Apr 2026)", pages: 3, downloads: 0, year: "Apr 2026", courseType: "ug", regulation: "U01", driveFileId: "1D9rCum1a_37ufef9_oVJLczbFj_IrOdm", academicYear: 1, semester: 1 },

  // ================= 1st Year Semester 2 (Paper II) =================
  { id: "tamil-sem2-nov23", title: "1st Year Sem 2 Tamil - November 2023", subject: "TAMIL", facultyName: "Dept of Tamil", description: "Foundation Tamil Paper II (Nov 2023)", pages: 3, downloads: 0, year: "Nov 2023", courseType: "ug", regulation: "U06", driveFileId: "1fY8lzmUGyA-J2Uej14-dhiHskI6tfMC7", academicYear: 1, semester: 2 },
  { id: "tamil-sem2-apr24", title: "1st Year Sem 2 Tamil - April 2024", subject: "TAMIL", facultyName: "Dept of Tamil", description: "Foundation Tamil Paper II (Apr 2024)", pages: 3, downloads: 0, year: "Apr 2024", courseType: "ug", regulation: "U06", driveFileId: "1PE8Yr6sKBsMK9FbCqdSXoAOK7C3gIZdu", academicYear: 1, semester: 2 },
  { id: "tamil-sem2-nov24", title: "1st Year Sem 2 Tamil - November 2024", subject: "TAMIL", facultyName: "Dept of Tamil", description: "Foundation Tamil Paper II (Nov 2024)", pages: 3, downloads: 0, year: "Nov 2024", courseType: "ug", regulation: "U06", driveFileId: "1fY8lzmUGyA-J2Uej14-dhiHskI6tfMC7", academicYear: 1, semester: 2 },
  { id: "tamil-sem2-apr25", title: "1st Year Sem 2 Tamil - April 2025", subject: "TAMIL", facultyName: "Dept of Tamil", description: "Foundation Tamil Paper II (Apr 2025)", pages: 3, downloads: 0, year: "Apr 2025", courseType: "ug", regulation: "U06", driveFileId: "1PE8Yr6sKBsMK9FbCqdSXoAOK7C3gIZdu", academicYear: 1, semester: 2 },
  { id: "tamil-sem2-nov25", title: "1st Year Sem 2 Tamil - November 2025 (U02)", subject: "TAMIL", facultyName: "Dept of Tamil", description: "Foundation Tamil Paper II (Nov 2025)", pages: 3, downloads: 0, year: "Nov 2025", courseType: "ug", regulation: "U02", driveFileId: "1xKrlSuVNun_PXDelxV5TKw17spz8ZcBJ", academicYear: 1, semester: 2 },
  { id: "tamil-sem2-apr26", title: "1st Year Sem 2 Tamil - April 2026 (U02)", subject: "TAMIL", facultyName: "Dept of Tamil", description: "Foundation Tamil Paper II (Apr 2026)", pages: 3, downloads: 0, year: "Apr 2026", courseType: "ug", regulation: "U02", driveFileId: "1q4gGj6afGZhV0Ws7n-7nzV6e060CjQRb", academicYear: 1, semester: 2 },

  // ================= 2nd Year Semester 1 / Sem 3 (Paper III) =================
  { id: "tamil-sem3-nov23", title: "2nd Year Sem 1 (Sem 3) Tamil - November 2023", subject: "TAMIL", facultyName: "Dept of Tamil", description: "Foundation Tamil Paper III (Nov 2023)", pages: 3, downloads: 0, year: "Nov 2023", courseType: "ug", regulation: "U09", driveFileId: "1Ba-NevLEqpgs2LBkZ4-JRAhmjzeOYTAZ", academicYear: 2, semester: 1 },
  { id: "tamil-sem3-apr24", title: "2nd Year Sem 1 (Sem 3) Tamil - April 2024", subject: "TAMIL", facultyName: "Dept of Tamil", description: "Foundation Tamil Paper III (Apr 2024)", pages: 3, downloads: 0, year: "Apr 2024", courseType: "ug", regulation: "U09", driveFileId: "1LRzR4FOTwGoYbVBs2cfOfkWifdD3sdEy", academicYear: 2, semester: 1 },
  { id: "tamil-sem3-nov24", title: "2nd Year Sem 1 (Sem 3) Tamil - November 2024", subject: "TAMIL", facultyName: "Dept of Tamil", description: "Foundation Tamil Paper III (Nov 2024)", pages: 3, downloads: 0, year: "Nov 2024", courseType: "ug", regulation: "U09", driveFileId: "1Ba-NevLEqpgs2LBkZ4-JRAhmjzeOYTAZ", academicYear: 2, semester: 1 },
  { id: "tamil-sem3-apr25", title: "2nd Year Sem 1 (Sem 3) Tamil - April 2025", subject: "TAMIL", facultyName: "Dept of Tamil", description: "Foundation Tamil Paper III (Apr 2025)", pages: 3, downloads: 0, year: "Apr 2025", courseType: "ug", regulation: "U09", driveFileId: "1LRzR4FOTwGoYbVBs2cfOfkWifdD3sdEy", academicYear: 2, semester: 1 },
  { id: "tamil-sem3-nov25", title: "2nd Year Sem 1 (Sem 3) Tamil - November 2025 (U03)", subject: "TAMIL", facultyName: "Dept of Tamil", description: "Foundation Tamil Paper III (Nov 2025)", pages: 3, downloads: 0, year: "Nov 2025", courseType: "ug", regulation: "U03", driveFileId: "1bfNxmWALz_GyfZH5nbKreq0uI23_814d", academicYear: 2, semester: 1 },
  { id: "tamil-sem3-apr26", title: "2nd Year Sem 1 (Sem 3) Tamil - April 2026 (U03)", subject: "TAMIL", facultyName: "Dept of Tamil", description: "Foundation Tamil Paper III (Apr 2026)", pages: 3, downloads: 0, year: "Apr 2026", courseType: "ug", regulation: "U03", driveFileId: "1TKuQHv_5MPR9Kzz1ImjaRnMTerDPWLAu", academicYear: 2, semester: 1 },

  // ================= 2nd Year Semester 2 / Sem 4 (Paper IV) =================
  { id: "tamil-sem4-nov23-p1", title: "2nd Year Sem 2 (Sem 4) Tamil - November 2023 (P1)", subject: "TAMIL", facultyName: "Dept of Tamil", description: "Foundation Tamil Paper IV (Nov 2023 - Part 1)", pages: 3, downloads: 0, year: "Nov 2023", courseType: "ug", regulation: "U10", driveFileId: "1v8h91QSZBLRxhtdL4fQ07zjlTN84LnF6", academicYear: 2, semester: 2 },
  { id: "tamil-sem4-nov23-p2", title: "2nd Year Sem 2 (Sem 4) Tamil - November 2023 (P2)", subject: "TAMIL", facultyName: "Dept of Tamil", description: "Foundation Tamil Paper IV (Nov 2023 - Part 2)", pages: 3, downloads: 0, year: "Nov 2023", courseType: "ug", regulation: "U12", driveFileId: "1xqf8XFgBnE83rQ2vHk7LmdsBmT_KuuEw", academicYear: 2, semester: 2 },
  { id: "tamil-sem4-apr24", title: "2nd Year Sem 2 (Sem 4) Tamil - April 2024", subject: "TAMIL", facultyName: "Dept of Tamil", description: "Foundation Tamil Paper IV (Apr 2024)", pages: 3, downloads: 0, year: "Apr 2024", courseType: "ug", regulation: "U12", driveFileId: "1eqbd81t4DDOIHy1oFSlc58dalM_oKDXa", academicYear: 2, semester: 2 },
  { id: "tamil-sem4-nov24-p1", title: "2nd Year Sem 2 (Sem 4) Tamil - November 2024 (P1)", subject: "TAMIL", facultyName: "Dept of Tamil", description: "Foundation Tamil Paper IV (Nov 2024 - Part 1)", pages: 3, downloads: 0, year: "Nov 2024", courseType: "ug", regulation: "U10", driveFileId: "1v8h91QSZBLRxhtdL4fQ07zjlTN84LnF6", academicYear: 2, semester: 2 },
  { id: "tamil-sem4-nov24-p2", title: "2nd Year Sem 2 (Sem 4) Tamil - November 2024 (P2)", subject: "TAMIL", facultyName: "Dept of Tamil", description: "Foundation Tamil Paper IV (Nov 2024 - Part 2)", pages: 3, downloads: 0, year: "Nov 2024", courseType: "ug", regulation: "U12", driveFileId: "1xqf8XFgBnE83rQ2vHk7LmdsBmT_KuuEw", academicYear: 2, semester: 2 },
  { id: "tamil-sem4-apr25", title: "2nd Year Sem 2 (Sem 4) Tamil - April 2025", subject: "TAMIL", facultyName: "Dept of Tamil", description: "Foundation Tamil Paper IV (Apr 2025)", pages: 3, downloads: 0, year: "Apr 2025", courseType: "ug", regulation: "U12", driveFileId: "1eqbd81t4DDOIHy1oFSlc58dalM_oKDXa", academicYear: 2, semester: 2 },
  { id: "tamil-sem4-apr26", title: "2nd Year Sem 2 (Sem 4) Tamil - April 2026 (U04)", subject: "TAMIL", facultyName: "Dept of Tamil", description: "Foundation Tamil Paper IV (Apr 2026)", pages: 3, downloads: 0, year: "Apr 2026", courseType: "ug", regulation: "U04", driveFileId: "1m5DVCBkY3IU7NOM-AgeaFBYicK5Ez3HW", academicYear: 2, semester: 2 }
];
const CLOUD_PAPERS = [
  { id: "cloud-1", title: "Cloud Computing - Paper 1", subject: "CLOUD COMPUTING", facultyName: "", description: "Previous year question paper", pages: 3, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "12oyzU49IEPdjy9M6XyoXgKSqkPBEE5L7", academicYear: 3, semester: 2 },
  { id: "cloud-2", title: "Cloud Computing - Paper 2", subject: "CLOUD COMPUTING", facultyName: "", description: "Previous year question paper", pages: 3, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1psQp-f1SnS51UxMrq1y1ccR1ywSROsKp", academicYear: 3, semester: 2 },
  { id: "cloud-3", title: "Cloud Computing - Paper 3", subject: "CLOUD COMPUTING", facultyName: "", description: "Previous year question paper", pages: 3, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1b_mAX0bq5vSZwJ-urXXDPnaZEGUX9o4x", academicYear: 3, semester: 2 }
];
const NETWORKS_PAPERS = [
  { id: "net-1", title: "Computer Networks - Paper 1", subject: "COMPUTER NETWORKS", facultyName: "", description: "Previous year question paper", pages: 3, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1QRgdBK3pCjFSuqCk6QrGJbVuQxBUI6o0", academicYear: 3, semester: 2 },
  { id: "net-2", title: "Computer Networks - Paper 2", subject: "COMPUTER NETWORKS", facultyName: "", description: "Previous year question paper", pages: 3, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1dL9LjKCFipMWv5JBoDAwXQfbuf3qTw2b", academicYear: 3, semester: 2 },
  { id: "net-3", title: "Computer Networks - Paper 3", subject: "COMPUTER NETWORKS", facultyName: "", description: "Previous year question paper", pages: 3, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1bCNtBR3UHmavdOhFtKgl8pESodkOSq1h", academicYear: 3, semester: 2 },
  { id: "net-4", title: "Computer Networks - Paper 4", subject: "COMPUTER NETWORKS", facultyName: "", description: "Previous year question paper", pages: 3, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1Bh_2kBij_UlMxqW77lbYUCrsYDPqvjF4", academicYear: 3, semester: 2 },
  { id: "net-5", title: "Computer Networks - Paper 5", subject: "COMPUTER NETWORKS", facultyName: "", description: "Previous year question paper", pages: 3, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1JP_hDVk55J0icR7KQZbgqZ3vFoZbW3EF", academicYear: 3, semester: 2 }
];
const DATASCIENCE_PAPERS = [
  { id: "ds-sci-1", title: "Introduction to Data Science - Paper 1", subject: "INTRODUCTION TO DATA SCIENCE", facultyName: "", description: "Previous year question paper", pages: 3, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1rBg0r-AjT27UzNwHGHKyEhvqjmoAVpIG", academicYear: 3, semester: 2 },
  { id: "ds-sci-2", title: "Introduction to Data Science - Paper 2", subject: "INTRODUCTION TO DATA SCIENCE", facultyName: "", description: "Previous year question paper", pages: 3, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "10j2i-vW0U98sWUIAq9JXOJU5z9H-T8GX", academicYear: 3, semester: 2 },
  { id: "ds-sci-3", title: "Introduction to Data Science - Paper 3", subject: "INTRODUCTION TO DATA SCIENCE", facultyName: "", description: "Previous year question paper", pages: 3, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1si5k_olvGdGCAxnjX1Cb-4Y1DSAcw_fJ", academicYear: 3, semester: 2 }
];
const PHP_PAPERS = [
  { id: "php-1", title: "Programming in PHP - Paper 1", subject: "PROGRAMMING IN PHP", facultyName: "", description: "Previous year question paper", pages: 3, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1r6Rh29aZFXu8C5A7dvQBA82vDbdZlMfD", academicYear: 3, semester: 2 },
  { id: "php-2", title: "Programming in PHP - Paper 2", subject: "PROGRAMMING IN PHP", facultyName: "", description: "Previous year question paper", pages: 3, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1n8Jz1eRNcEoTL6P0nyE8rI3apsvrhfsL", academicYear: 3, semester: 2 },
  { id: "php-3", title: "Programming in PHP - Paper 3", subject: "PROGRAMMING IN PHP", facultyName: "", description: "Previous year question paper", pages: 3, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1lo6eLJr0HocInCWFPH8uzdA6PTeZpb8h", academicYear: 3, semester: 2 },
  { id: "php-4", title: "Programming in PHP - Paper 4", subject: "PROGRAMMING IN PHP", facultyName: "", description: "Previous year question paper", pages: 3, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1KzWkN7TyT9U49cldL-8MsWh-SM0IMBBJ", academicYear: 3, semester: 2 },
  { id: "php-5", title: "Programming in PHP - Paper 5", subject: "PROGRAMMING IN PHP", facultyName: "", description: "Previous year question paper", pages: 3, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1SQ5hlCDET19jkCoVNZdpc5m6xi75_gZH", academicYear: 3, semester: 2 },
  { id: "php-6", title: "Programming in PHP - Paper 6", subject: "PROGRAMMING IN PHP", facultyName: "", description: "Previous year question paper", pages: 3, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1TQ4TqpqCWQ19qgoyaiGDeYyORiYixAvz", academicYear: 3, semester: 2 }
];
const DIP_PAPERS = [
  { id: "dip-1", title: "Digital Image Processing - Paper 1", subject: "DIGITAL IMAGE PROCESSING", facultyName: "", description: "Previous year question paper", pages: 3, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1HdwywBsHdp_UWMuF0lcNVbgJn8_GjLxo", academicYear: 3, semester: 2 },
  { id: "dip-2", title: "Digital Image Processing - Paper 2", subject: "DIGITAL IMAGE PROCESSING", facultyName: "", description: "Previous year question paper", pages: 3, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1uq6BZKJY9sl8TODFzNU0kOGZ16Mka2Db", academicYear: 3, semester: 2 },
  { id: "dip-3", title: "Digital Image Processing - Paper 3", subject: "DIGITAL IMAGE PROCESSING", facultyName: "", description: "Previous year question paper", pages: 3, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1aDDWqBNexLoVPFiGDejbrt9GtuNWIHwS", academicYear: 3, semester: 2 },
  { id: "dip-4", title: "Digital Image Processing - Paper 4", subject: "DIGITAL IMAGE PROCESSING", facultyName: "", description: "Previous year question paper", pages: 3, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1oymxVtefcOJNa-tDuSz1hnXSHK9swCA6", academicYear: 3, semester: 2 }
];
const UML_PAPERS = [
  { id: "uml-1", title: "Unified Modeling Language - Paper 1", subject: "UNIFIED MODELING LANGUAGE", facultyName: "", description: "Previous year question paper", pages: 3, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1UjGLXsBXcgoBseFGrOeKdvNdftbL3kQ_", academicYear: 3, semester: 2 },
  { id: "uml-2", title: "Unified Modeling Language - Paper 2", subject: "UNIFIED MODELING LANGUAGE", facultyName: "", description: "Previous year question paper", pages: 3, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "13nKZzkjfae3Hat_dkZQS0cjO_6Gx2_u3", academicYear: 3, semester: 2 },
  { id: "uml-3", title: "Unified Modeling Language - Paper 3", subject: "UNIFIED MODELING LANGUAGE", facultyName: "", description: "Previous year question paper", pages: 3, downloads: 0, year: "U1819", courseType: "ug", regulation: "R2024", driveFileId: "1NYliVjvrD3pzPCwGghpGLmAeJGzOOYoW", academicYear: 3, semester: 2 }
];

const ENGLISH_SEM1_PAPERS = [
  { id: "english-sem1-u103", title: "1st Year Sem 1 English - Paper U103", subject: "FOUNDATION ENGLISH - I", facultyName: "Dept of English", description: "Foundation English Paper I (U103)", pages: 12, downloads: 0, year: "U103", courseType: "ug", regulation: "U103", fileUrl: "/question_papers/english_sem1/U103.pdf", academicYear: 1, semester: 1 },
  { id: "english-sem1-u103-1", title: "1st Year Sem 1 English - Paper U103 (Set 1)", subject: "FOUNDATION ENGLISH - I", facultyName: "Dept of English", description: "Foundation English Paper I (U103 Set 1)", pages: 14, downloads: 0, year: "U103", courseType: "ug", regulation: "U103", fileUrl: "/question_papers/english_sem1/U103_1.pdf", academicYear: 1, semester: 1 },
  { id: "english-sem1-u103-2", title: "1st Year Sem 1 English - Paper U103 (Set 2)", subject: "FOUNDATION ENGLISH - I", facultyName: "Dept of English", description: "Foundation English Paper I (U103 Set 2)", pages: 10, downloads: 0, year: "U103", courseType: "ug", regulation: "U103", fileUrl: "/question_papers/english_sem1/U103_1_1.pdf", academicYear: 1, semester: 1 },
  { id: "english-sem1-u103-3", title: "1st Year Sem 1 English - Paper U103 (Set 3)", subject: "FOUNDATION ENGLISH - I", facultyName: "Dept of English", description: "Foundation English Paper I (U103 Set 3)", pages: 12, downloads: 0, year: "U103", courseType: "ug", regulation: "U103", fileUrl: "/question_papers/english_sem1/U103_2.pdf", academicYear: 1, semester: 1 },
];

const ENGLISH_SEM2_PAPERS = [
  { id: "english-sem2-1", title: "1st Year Sem 2 English - Paper 1", subject: "ENGLISH", facultyName: "Dept of English", description: "Foundation English Paper II (Set 1)", pages: 14, downloads: 0, year: "Sem 2", courseType: "ug", regulation: "R2024", fileUrl: "/question_papers/english_sem2/sem2_1.pdf", academicYear: 1, semester: 2 },
  { id: "english-sem2-2", title: "1st Year Sem 2 English - Paper 2", subject: "ENGLISH", facultyName: "Dept of English", description: "Foundation English Paper II (Set 2)", pages: 14, downloads: 0, year: "Sem 2", courseType: "ug", regulation: "R2024", fileUrl: "/question_papers/english_sem2/sem2_2.pdf", academicYear: 1, semester: 2 },
  { id: "english-sem2-3", title: "1st Year Sem 2 English - Paper 3", subject: "ENGLISH", facultyName: "Dept of English", description: "Foundation English Paper II (Set 3)", pages: 14, downloads: 0, year: "Sem 2", courseType: "ug", regulation: "R2024", fileUrl: "/question_papers/english_sem2/sem2_3.pdf", academicYear: 1, semester: 2 },
];

const ENGLISH_YR2_SEM1_PAPERS = [
  { id: "english-yr2-sem1-eng", title: "2nd Year Sem 1 English - Paper 1 (Eng)", subject: "Foundation English - III", facultyName: "Dept of English", description: "Foundation English Paper III (Paper 1)", pages: 12, downloads: 0, year: "Sem 3", courseType: "ug", regulation: "R2024", fileUrl: "/question_papers/english_yr2_sem1/eng.pdf", academicYear: 2, semester: 1 },
  { id: "english-yr2-sem1-eng1", title: "2nd Year Sem 1 English - Paper 2 (Eng 1)", subject: "Foundation English - III", facultyName: "Dept of English", description: "Foundation English Paper III (Paper 2)", pages: 12, downloads: 0, year: "Sem 3", courseType: "ug", regulation: "R2024", fileUrl: "/question_papers/english_yr2_sem1/eng1.pdf", academicYear: 2, semester: 1 },
];

const ENGLISH_YR2_SEM2_PAPERS = [
  { id: "english-yr2-sem2-u112", title: "2nd Year Sem 2 English - Paper U112", subject: "ENGLISH", facultyName: "Dept of English", description: "Foundation English Paper IV (U112)", pages: 8, downloads: 0, year: "Sem 4", courseType: "ug", regulation: "U112", fileUrl: "/question_papers/english_yr2_sem2/U112.pdf", academicYear: 2, semester: 2 },
];

const PG_CWT_PAPERS = [
  { id: "pg-cwt-1", title: "Contemporary Web Technologies - Paper 1", subject: "Contemporary Web Technologies", description: "Previous year question paper for Contemporary Web Technologies", pages: 3, downloads: 0, year: "2024", courseType: "pg", regulation: "2627103", driveFileId: "1JZi8yoVLAwJm5lqPtMtEfGcIC51JVepT", academicYear: 1, semester: 1 },
];
const PG_ASE_PAPERS = [
  { id: "pg-ase-1", title: "Advanced Software Engineering - Paper 1", subject: "Advanced Software Engineering", description: "Previous year question paper for Advanced Software Engineering", pages: 3, downloads: 0, year: "2024", courseType: "pg", regulation: "2627105(A)", driveFileId: "1kaS8vlnBc1r-CzMTQlPg6S00Qo7UNLml", academicYear: 1, semester: 1 },
];
const PG_ADAA_PAPERS = [
  { id: "pg-adaa-1", title: "Advanced Design and Analysis of Algorithms - Paper 1", subject: "Advanced Design and Analysis of Algorithms", description: "Previous year question paper (Set 1)", pages: 3, downloads: 0, year: "2024", courseType: "pg", regulation: "2627101", driveFileId: "1WH6_Eplje_2Rc6XEwvwuVf0VMok0Ghiq", academicYear: 1, semester: 1 },
  { id: "pg-adaa-2", title: "Advanced Design and Analysis of Algorithms - Paper 2", subject: "Advanced Design and Analysis of Algorithms", description: "Previous year question paper (Set 2)", pages: 3, downloads: 0, year: "2024", courseType: "pg", regulation: "2627101", driveFileId: "1eNRqMWa68VrhT3gaAXI1B-7liK3OyHz0", academicYear: 1, semester: 1 },
  { id: "pg-adaa-3", title: "Advanced Design and Analysis of Algorithms - Paper 3", subject: "Advanced Design and Analysis of Algorithms", description: "Previous year question paper (Set 3)", pages: 3, downloads: 0, year: "2024", courseType: "pg", regulation: "2627101", driveFileId: "128czfz0ahngxlAxtHarTohMnSfE6RIyM", academicYear: 1, semester: 1 },
  { id: "pg-adaa-4", title: "Advanced Design and Analysis of Algorithms - Paper 4", subject: "Advanced Design and Analysis of Algorithms", description: "Previous year question paper (Set 4)", pages: 3, downloads: 0, year: "2024", courseType: "pg", regulation: "2627101", driveFileId: "1D0v1eGC0PntefaHskvDenhGMpzn5OEve", academicYear: 1, semester: 1 },
];
const PG_DCN_PAPERS = [
  { id: "pg-dcn-1", title: "Data Communication and Networking - Paper 1", subject: "Data Communication and Networking", description: "Previous year question paper for Data Communication and Networking", pages: 3, downloads: 0, year: "2024", courseType: "pg", regulation: "2627104(A)", driveFileId: "1D0v1eGC0PntefaHskvDenhGMpzn5OEve", academicYear: 1, semester: 1 },
];
const PG_PYTHON_PAPERS = [
  { id: "pg-py-1", title: "Python for Data Science - Paper 1", subject: "Python for Data Science", description: "Previous year question paper (Set 1)", pages: 3, downloads: 0, year: "2024", courseType: "pg", regulation: "2627102", driveFileId: "1In45ROQ75_Aptzkv7YeMURnJ-HJTozrx", academicYear: 1, semester: 1 },
  { id: "pg-py-2", title: "Python for Data Science - Paper 2", subject: "Python for Data Science", description: "Previous year question paper (Set 2)", pages: 3, downloads: 0, year: "2024", courseType: "pg", regulation: "2627102", driveFileId: "1XAH0o0izYqqzdlFTKWwqEeNaocuMtlYL", academicYear: 1, semester: 1 },
  { id: "pg-py-3", title: "Python for Data Science - Paper 3", subject: "Python for Data Science", description: "Previous year question paper (Set 3)", pages: 3, downloads: 0, year: "2024", courseType: "pg", regulation: "2627102", driveFileId: "1TwSRki6nKrNYgUjOPMUUUUP3bpnY1Rql", academicYear: 1, semester: 1 },
  { id: "pg-py-4", title: "Python for Data Science - Paper 4", subject: "Python for Data Science", description: "Previous year question paper (Set 4)", pages: 3, downloads: 0, year: "2024", courseType: "pg", regulation: "2627102", driveFileId: "1rKrNPPNBxOUIOgj6fbesICpedgdqj3Ut", academicYear: 1, semester: 1 },
];

// PG 1st Year Semester 2 Question Papers
const PG_ADBMS_PAPERS = [
  { id: "pg-adbms-1", title: "Advanced Database Management System - Paper 1", subject: "Advanced Database Management System", description: "PG 1st Year Sem 2 Question Paper (Set 1)", pages: 3, downloads: 0, year: "2024", courseType: "pg", regulation: "2627204(A)", driveFileId: "1PFskDcIdUMC_itZONAC4XqFGn_VByOEx", academicYear: 1, semester: 2 },
  { id: "pg-adbms-2", title: "Advanced Database Management System - Paper 2", subject: "Advanced Database Management System", description: "PG 1st Year Sem 2 Question Paper (Set 2)", pages: 3, downloads: 0, year: "2024", courseType: "pg", regulation: "2627204(A)", driveFileId: "1_IYQkZD-6EpQjjp5vRfAQHYgm3xTam-K", academicYear: 1, semester: 2 },
  { id: "pg-adbms-3", title: "Advanced Database Management System - Paper 3", subject: "Advanced Database Management System", description: "PG 1st Year Sem 2 Question Paper (Set 3)", pages: 3, downloads: 0, year: "2024", courseType: "pg", regulation: "2627204(A)", driveFileId: "1N6AUSiAQgU1TL6a5t0gd9IXw4HKKi70V", academicYear: 1, semester: 2 },
  { id: "pg-adbms-4", title: "Advanced Database Management System - Paper 4", subject: "Advanced Database Management System", description: "PG 1st Year Sem 2 Question Paper (Set 4)", pages: 3, downloads: 0, year: "2024", courseType: "pg", regulation: "2627204(A)", driveFileId: "16eUiDlC9WRyAyeP2C96yWJOEJW53lzBq", academicYear: 1, semester: 2 },
  { id: "pg-adbms-5", title: "Advanced Database Management System - Paper 5", subject: "Advanced Database Management System", description: "PG 1st Year Sem 2 Question Paper (Set 5)", pages: 3, downloads: 0, year: "2024", courseType: "pg", regulation: "2627204(A)", driveFileId: "1qkDPdcfmv88Eov3MxALkVy2KCKG6UXcZ", academicYear: 1, semester: 2 },
  { id: "pg-adbms-6", title: "Advanced Database Management System - Paper 6", subject: "Advanced Database Management System", description: "PG 1st Year Sem 2 Question Paper (Set 6)", pages: 3, downloads: 0, year: "2024", courseType: "pg", regulation: "2627204(A)", driveFileId: "1CUkj7f3I_1koEKA9YHr5jSm4W5780rQU", academicYear: 1, semester: 2 },
];

const PG_DIP_PAPERS = [
  { id: "pg-dip-1", title: "Digital Image Processing - Paper 1", subject: "Digital Image Processing", description: "PG 1st Year Sem 2 Question Paper (Set 1)", pages: 3, downloads: 0, year: "2024", courseType: "pg", regulation: "2627201", driveFileId: "1iOLFfC-YhtNBdyjSqKRJ-auQjhfAMQY6", academicYear: 1, semester: 2 },
  { id: "pg-dip-2", title: "Digital Image Processing - Paper 2", subject: "Digital Image Processing", description: "PG 1st Year Sem 2 Question Paper (Set 2)", pages: 3, downloads: 0, year: "2024", courseType: "pg", regulation: "2627201", driveFileId: "1Zyd_g8Xqpl7wNAKziEe8XOhdiB2XTKoc", academicYear: 1, semester: 2 },
  { id: "pg-dip-3", title: "Digital Image Processing - Paper 3", subject: "Digital Image Processing", description: "PG 1st Year Sem 2 Question Paper (Set 3)", pages: 3, downloads: 0, year: "2024", courseType: "pg", regulation: "2627201", driveFileId: "1NKdyOAgcSQMh5Qbv6Cr0kw3wDTlw4NSJ", academicYear: 1, semester: 2 },
  { id: "pg-dip-4", title: "Digital Image Processing - Paper 4", subject: "Digital Image Processing", description: "PG 1st Year Sem 2 Question Paper (Set 4)", pages: 3, downloads: 0, year: "2024", courseType: "pg", regulation: "2627201", driveFileId: "1kopc_jY2rmdaLUxv0rFPlYQqwyrDMNJX", academicYear: 1, semester: 2 },
  { id: "pg-dip-5", title: "Digital Image Processing - Paper 5", subject: "Digital Image Processing", description: "PG 1st Year Sem 2 Question Paper (Set 5)", pages: 3, downloads: 0, year: "2024", courseType: "pg", regulation: "2627201", driveFileId: "1KzX-0C8xnRd_1fyuQYygkLBS7glURIRA", academicYear: 1, semester: 2 },
];

const PG_DMT_PAPERS = [
  { id: "pg-dmt-1", title: "Data Mining Techniques - Paper 1", subject: "Data Mining Techniques", description: "PG 1st Year Sem 2 Question Paper (Set 1)", pages: 3, downloads: 0, year: "2024", courseType: "pg", regulation: "2627203", driveFileId: "1U5bCcL0ACI4m83yWNdgJs95rLJhJsFSl", academicYear: 1, semester: 2 },
  { id: "pg-dmt-2", title: "Data Mining Techniques - Paper 2", subject: "Data Mining Techniques", description: "PG 1st Year Sem 2 Question Paper (Set 2)", pages: 3, downloads: 0, year: "2024", courseType: "pg", regulation: "2627203", driveFileId: "1MrN0uiJLuX_s68aPoOzX6dQYInNibQKo", academicYear: 1, semester: 2 },
  { id: "pg-dmt-3", title: "Data Mining Techniques - Paper 3", subject: "Data Mining Techniques", description: "PG 1st Year Sem 2 Question Paper (Set 3)", pages: 3, downloads: 0, year: "2024", courseType: "pg", regulation: "2627203", driveFileId: "13ocMvwFuRpVHePQ6lHHh38QIdq8ck6y2", academicYear: 1, semester: 2 },
  { id: "pg-dmt-4", title: "Data Mining Techniques - Paper 4", subject: "Data Mining Techniques", description: "PG 1st Year Sem 2 Question Paper (Set 4)", pages: 3, downloads: 0, year: "2024", courseType: "pg", regulation: "2627203", driveFileId: "1Vy5mjeg3qXI2g6TLCS4qCQt5tptprNRi", academicYear: 1, semester: 2 },
];

const PG_JEE_PAPERS = [
  { id: "pg-jee-1", title: "Java Enterprise Edition - Paper 1", subject: "Java Enterprise Edition", description: "PG 1st Year Sem 2 Question Paper", pages: 3, downloads: 0, year: "2024", courseType: "pg", regulation: "2627202", driveFileId: "1L0_AD2N1XhLwIdr1V1larcEOU1WxdPGq", academicYear: 1, semester: 2 },
];

// PG 2nd Year Semester 1 Question Papers
const PG_AIML_PAPERS = [
  { id: "pg-aiml-1", title: "Artificial Intelligence and Machine Learning Techniques - Paper 1", subject: "Artificial Intelligence and Machine Learning Techniques", description: "PG 2nd Year Sem 1 Question Paper (Set 1)", pages: 3, downloads: 0, year: "2024", courseType: "pg", regulation: "2627301", driveFileId: "1-2T_Wv7rL7sYLGp2VnYZo3aeYXrq8J1V", academicYear: 2, semester: 1 },
  { id: "pg-aiml-2", title: "Artificial Intelligence and Machine Learning Techniques - Paper 2", subject: "Artificial Intelligence and Machine Learning Techniques", description: "PG 2nd Year Sem 1 Question Paper (Set 2)", pages: 3, downloads: 0, year: "2024", courseType: "pg", regulation: "2627301", driveFileId: "11ZSb-n8gEyYl2OnP6wdL73ohoVAt45Lm", academicYear: 2, semester: 1 },
  { id: "pg-aiml-3", title: "Artificial Intelligence and Machine Learning Techniques - Paper 3", subject: "Artificial Intelligence and Machine Learning Techniques", description: "PG 2nd Year Sem 1 Question Paper (Set 3)", pages: 3, downloads: 0, year: "2024", courseType: "pg", regulation: "2627301", driveFileId: "1KSBGyCrptbQujDrRfefQlosQ79rWKpKJ", academicYear: 2, semester: 1 },
];

const PG_DOTNET_PAPERS = [
  { id: "pg-dotnet-1", title: "DOT NET Technology - Paper 1", subject: "DOT NET Technology", description: "PG 2nd Year Sem 1 Question Paper (Set 1)", pages: 3, downloads: 0, year: "2024", courseType: "pg", regulation: "2627302", driveFileId: "17a4Hvznc-UTxZ8jv2bpNpqQqlA7NVOCy", academicYear: 2, semester: 1 },
  { id: "pg-dotnet-2", title: "DOT NET Technology - Paper 2", subject: "DOT NET Technology", description: "PG 2nd Year Sem 1 Question Paper (Set 2)", pages: 3, downloads: 0, year: "2024", courseType: "pg", regulation: "2627302", driveFileId: "1BhtMBEExYVpcN3VGdvIppLsgB1quQy2H", academicYear: 2, semester: 1 },
  { id: "pg-dotnet-3", title: "DOT NET Technology - Paper 3", subject: "DOT NET Technology", description: "PG 2nd Year Sem 1 Question Paper (Set 3)", pages: 3, downloads: 0, year: "2024", courseType: "pg", regulation: "2627302", driveFileId: "1ZC7VriXVkPuf4j9NmgueiaVJcVH2oFR9", academicYear: 2, semester: 1 },
  { id: "pg-dotnet-4", title: "DOT NET Technology - Paper 4", subject: "DOT NET Technology", description: "PG 2nd Year Sem 1 Question Paper (Set 4)", pages: 3, downloads: 0, year: "2024", courseType: "pg", regulation: "2627302", driveFileId: "1PmtI3yPiiHPFOilCPtYryo4XeabXKqic", academicYear: 2, semester: 1 },
];

const PG_BDA_PAPERS = [
  { id: "pg-bda-1", title: "Big Data Analytics - Paper 1", subject: "Big Data Analytics", description: "PG 2nd Year Sem 1 Question Paper (Set 1)", pages: 3, downloads: 0, year: "2024", courseType: "pg", regulation: "2627303", driveFileId: "17nMz93SmEkf9hUUv2D3gUJOkVL58FJdZ", academicYear: 2, semester: 1 },
  { id: "pg-bda-2", title: "Big Data Analytics - Paper 2", subject: "Big Data Analytics", description: "PG 2nd Year Sem 1 Question Paper (Set 2)", pages: 3, downloads: 0, year: "2024", courseType: "pg", regulation: "2627303", driveFileId: "17OfyUvvgwvWoQYu0KEmXAiRs3djrqSku", academicYear: 2, semester: 1 },
  { id: "pg-bda-3", title: "Big Data Analytics - Paper 3", subject: "Big Data Analytics", description: "PG 2nd Year Sem 1 Question Paper (Set 3)", pages: 3, downloads: 0, year: "2024", courseType: "pg", regulation: "2627303", driveFileId: "1ldKllqzjdp5onj4BqPTzdHAld-e--THB", academicYear: 2, semester: 1 },
  { id: "pg-bda-4", title: "Big Data Analytics - Paper 4", subject: "Big Data Analytics", description: "PG 2nd Year Sem 1 Question Paper (Set 4)", pages: 3, downloads: 0, year: "2024", courseType: "pg", regulation: "2627303", driveFileId: "1bKmOKPeqChuPyglLggz3uIhHpcaGecns", academicYear: 2, semester: 1 },
  { id: "pg-bda-5", title: "Big Data Analytics - Paper 5", subject: "Big Data Analytics", description: "PG 2nd Year Sem 1 Question Paper (Set 5)", pages: 3, downloads: 0, year: "2024", courseType: "pg", regulation: "2627303", driveFileId: "1GzPH7ZbZEAGZ5lfRzFoXOK0yPoj-kItS", academicYear: 2, semester: 1 },
];

const allPapers = [
  ...PG_CWT_PAPERS,
  ...PG_ASE_PAPERS,
  ...PG_ADAA_PAPERS,
  ...PG_DCN_PAPERS,
  ...PG_PYTHON_PAPERS,
  ...PG_ADBMS_PAPERS,
  ...PG_DIP_PAPERS,
  ...PG_DMT_PAPERS,
  ...PG_JEE_PAPERS,
  ...PG_AIML_PAPERS,
  ...PG_DOTNET_PAPERS,
  ...PG_BDA_PAPERS,
  ...DBMS_PAPERS,
  ...OS_PAPERS,
  ...TAMIL_PAPERS,
  ...ENGLISH_SEM1_PAPERS,
  ...ENGLISH_SEM2_PAPERS,
  ...ENGLISH_SEM2_PAPERS.map(p => ({ ...p, id: p.id + "-alias", subject: "Foundation English - II" })),
  ...ENGLISH_YR2_SEM1_PAPERS,
  ...ENGLISH_YR2_SEM1_PAPERS.map(p => ({ ...p, id: p.id + "-alias", subject: "ENGLISH" })),
  ...ENGLISH_YR2_SEM2_PAPERS,
  ...ENGLISH_YR2_SEM2_PAPERS.map(p => ({ ...p, id: p.id + "-alias", subject: "Foundation English - IV" })),
  ...CLOUD_PAPERS,
  ...NETWORKS_PAPERS,
  ...DATASCIENCE_PAPERS,
  ...PHP_PAPERS,
  ...DIP_PAPERS,
  ...UML_PAPERS,
  ...OS_PAPERS.map(p => ({ ...p, id: p.id + "-yr2", subject: "Principles of operating Systems" })),
  ...DMT_PAPERS,
  ...ASPNET_PAPERS,
  ...JAVA_PAPERS.map(p => ({ ...p, subject: "Object Oriented Programming Concepts using JAVA" })),
  ...WEBTECH_PAPERS,
  ...ANDROID_PAPERS,
  ...STATS1_PAPERS.map(p => ({ ...p, subject: "Statistical Methods for Computer Science – I" })),
  ...SE_PAPERS,
  ...STATS2_PAPERS,
  ...PYTHON_PAPERS.map(p => ({ ...p, subject: "Python Programming Essentials" })),
  ...DIGITAL_ELECTRONICS_PAPERS,
  ...MATH1_PAPERS.map(p => ({ ...p, subject: "Mathematics Paper I" })),
  ...AI_PAPERS,
  ...DS_PAPERS.map(p => ({ ...p, subject: "Data Structures" })),
  ...CPP_PAPERS,
  ...MATH2_PAPERS
];

const COURSE_OPTIONS = [
  { value: "ug", label: "UG", desc: "Bachelor of Science in Computer Science (B.Sc.)" },
  { value: "pg", label: "PG", desc: "Master of Science in Computer Science (M.Sc.)" },
];

export default function QuestionPapers() {
  const { user } = useAuth();
  const isFaculty = user?.type === "faculty";
  const [courseType, setCourseType] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [previewing, setPreviewing] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploadYearVal, setUploadYearVal] = useState("U1819");
  const [uploadRegulation, setUploadRegulation] = useState("R2024");
  const [uploadFileObj, setUploadFileObj] = useState(null);

  const { items: uploadedPapers, refetch } = useFirestoreList(questionPaperService);
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
      const fileUrl = await uploadFile(STORAGE_PATHS.QUESTION_PAPERS, uploadFileObj, setProgress);
      await questionPaperService.create({
        title: uploadTitle.trim(),
        description: uploadDescription.trim(),
        year: uploadYearVal,
        regulation: uploadRegulation,
        subject: selectedSubject,
        semester: Number(selectedSemester),
        academicYear: Number(selectedYear),
        courseType: courseType,
        fileUrl,
        facultyName: user?.name || "Faculty",
        facultyId: user?.uid || "faculty-id",
      });

      toast.success("Question paper uploaded successfully!");
      setUploadTitle("");
      setUploadDescription("");
      setUploadYearVal("U1819");
      setUploadRegulation("R2024");
      setUploadFileObj(null);
      setShowUploadForm(false);
      refetch();
    } catch (err) {
      toast.error(err.message || "Failed to upload question paper");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }

  const activeCurriculum = courseType === "pg" ? CURRICULUM_PG : CURRICULUM;
  const yearData = selectedYear ? activeCurriculum[selectedYear] : null;
  const semesterData = selectedSemester && yearData ? yearData.semesters[selectedSemester] : null;
  const yearSubjects = semesterData ? semesterData.subjects : (selectedYear ? getSubjectsForYear(selectedYear, activeCurriculum) : []);
  const ys = selectedYear ? yearStyles[selectedYear] : yearStyles[1];

  const combinedPapers = useMemo(() => {
    const mappedFirestore = (uploadedPapers || [])
      .filter((p) => {
        const matchesSubject = !selectedSubject || p.subject?.toUpperCase() === selectedSubject.toUpperCase();
        const matchesCourse = !courseType || p.courseType === courseType;
        const matchesYear = !selectedYear || String(p.year) === String(selectedYear) || Number(p.academicYear) === Number(selectedYear);
        const matchesSem = !selectedSemester || Number(p.semester) === Number(selectedSemester);
        return matchesSubject && matchesCourse && matchesYear && matchesSem;
      })
      .map((p) => ({
        id: p.id,
        title: p.title,
        subject: p.subject,
        facultyName: p.facultyName || "Faculty",
        description: p.description || "Uploaded question paper",
        year: p.year || "2024",
        regulation: p.regulation || "R2024",
        fileUrl: p.fileUrl,
        driveUrl: p.driveUrl || p.fileUrl,
        driveFileId: p.driveFileId,
        academicYear: p.academicYear || Number(selectedYear) || 1,
        semester: p.semester || Number(selectedSemester) || 1,
        fromFirestore: true,
      }));

    const mappedLocal = allPapers
      .filter((p) => {
        const matchesSubject = !selectedSubject || p.subject?.toUpperCase() === selectedSubject.toUpperCase();
        const matchesCourse = !courseType || p.courseType === courseType;
        const matchesSemester = !p.semester || !selectedSemester || p.semester === Number(selectedSemester);
        const matchesYear = !p.academicYear || !selectedYear || p.academicYear === Number(selectedYear);
        return matchesSubject && matchesCourse && matchesSemester && matchesYear;
      })
      .map((p) => ({
        ...p,
        facultyName: getFacultyName(p.subject) || p.facultyName,
      }));

    return [...mappedFirestore, ...mappedLocal];
  }, [uploadedPapers, selectedSubject, courseType, selectedYear, selectedSemester]);

  const filtered = useMemo(() => {
    return combinedPapers.filter((p) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return p.title.toLowerCase().includes(q) || p.subject.toLowerCase().includes(q);
      }
      return true;
    });
  }, [combinedPapers, searchQuery]);

  if (!courseType) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 bg-[#F8FAFC]">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center flex flex-col items-center justify-center">
          <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-tr from-[#011337] via-[#021C4F] to-[#7F011F] p-1.5 shadow-xl shadow-rose-950/20 ring-4 ring-amber-400/40 transition-transform hover:scale-105 duration-300">
            <div className="flex h-full w-full items-center justify-center rounded-[20px] bg-[#021C4F] text-amber-300">
              <FiAward size={48} className="text-amber-400 drop-shadow-md" />
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3 shadow-md">
            <FiAward size={14} /> EXAM QUESTION PAPERS
          </span>
          <h1 className="font-sans text-4xl font-extrabold text-[#021C4F]">Question Papers</h1>
          <p className="mt-2 text-sm text-[#6B7280]">Select your degree program to browse previous year semester exam papers</p>
        </motion.div>

        {/* 2 Main Course Cards: B.Sc. CS (UG) & M.Sc. CS (PG) */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 max-w-2xl mx-auto">
          {/* B.Sc. CS (UG) Card */}
          <motion.button
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 90 }}
            whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}
            onClick={() => setCourseType("ug")}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#C50337] via-[#A0022B] to-[#7F011F] border-2 border-amber-400 text-white shadow-lg transition-all duration-300 hover:shadow-xl text-center flex flex-col justify-between"
          >
            <div className="relative p-6 text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md text-2xl font-black text-amber-300 transition-all duration-300 group-hover:scale-110 shadow-md">
                UG
              </div>
              <span className="inline-block bg-amber-400 text-slate-900 text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full mb-2 shadow-xs">
                3 Years · 6 Semesters
              </span>
              <h2 className="text-lg font-black text-white leading-snug">B.Sc. Computer Science</h2>
              <p className="mt-1 text-[11px] text-rose-100 font-medium">Undergraduate Question Papers</p>
              <div className="mt-4 inline-flex items-center gap-1 text-[11px] font-black text-amber-300 uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                Browse UG <FiChevronRight size={12} />
              </div>
            </div>
          </motion.button>

          {/* M.Sc. CS (PG) Card */}
          <motion.button
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 90 }}
            whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}
            onClick={() => setCourseType("pg")}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#C50337] via-[#A0022B] to-[#7F011F] border-2 border-amber-400 text-white shadow-lg transition-all duration-300 hover:shadow-xl text-center flex flex-col justify-between"
          >
            <div className="relative p-6 text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md text-2xl font-black text-amber-300 transition-all duration-300 group-hover:scale-110 shadow-md">
                PG
              </div>
              <span className="inline-block bg-amber-400 text-slate-900 text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full mb-2 shadow-xs">
                2 Years · 4 Semesters
              </span>
              <h2 className="text-lg font-black text-white leading-snug">M.Sc. Computer Science</h2>
              <p className="mt-1 text-[11px] text-rose-100 font-medium">Postgraduate Question Papers</p>
              <div className="mt-4 inline-flex items-center gap-1 text-[11px] font-black text-amber-300 uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                Browse PG <FiChevronRight size={12} />
              </div>
            </div>
          </motion.button>
        </div>
      </div>
    );
  }

  if (!selectedYear) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          onClick={() => { setCourseType(null); setSelectedYear(null); setSelectedSubject(null); }}
          className="mb-8 inline-flex items-center gap-2 rounded-xl border-2 border-[#D1D5DB] bg-white px-5 py-2.5 text-sm sm:text-base font-extrabold text-[#374151] shadow-md hover:bg-[#F3F4F6] hover:scale-105 transition-all"
        ><FiArrowLeft size={20} /> Back to Course</motion.button>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center flex flex-col items-center justify-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-[#011337] via-[#021C4F] to-[#7F011F] p-1 shadow-xl ring-4 ring-amber-400/30 transition-transform hover:scale-105 duration-300">
            <div className="flex h-full w-full items-center justify-center rounded-[20px] bg-[#021C4F] text-amber-300">
              <FiAward size={38} className="text-amber-400" />
            </div>
          </div>
          <h1 className="font-sans text-3xl sm:text-4xl font-extrabold text-[#021C4F]">{courseType.toUpperCase()} — Select Year</h1>
          <p className="mt-1 text-sm text-[#6B7280]">Choose your academic year</p>
        </motion.div>
        <div className={`grid grid-cols-1 gap-6 ${courseType === "pg" ? "sm:grid-cols-2 max-w-2xl mx-auto" : "sm:grid-cols-3"}`}>
          {(courseType === "pg" ? [1, 2] : [1, 2, 3]).map((year, i) => {
            return (
              <motion.button key={year}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }}
                whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedYear(year)}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#C50337] via-[#A0022B] to-[#7F011F] border-2 border-amber-400 text-white shadow-xl transition-all duration-300 hover:shadow-2xl text-center flex flex-col justify-between"
              >
                <div className="relative p-8 text-center">
                  <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md text-3xl font-bold transition-all duration-300 group-hover:scale-110 shadow-md">
                    {activeCurriculum[year].icon}
                  </div>
                  <span className="inline-block bg-amber-400 text-slate-900 text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full mb-2 shadow-sm">
                    {getSubjectsForYear(year, activeCurriculum).length} Subjects
                  </span>
                  <h2 className="text-xl font-black text-white">{activeCurriculum[year].label}</h2>
                  <p className="mt-1.5 text-xs text-rose-100 font-medium">Semester Question Papers</p>
                  <div className="mt-4 inline-flex items-center gap-1 text-[11px] font-black text-amber-300 uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                    Browse Papers <FiChevronRight size={12} />
                  </div>
                </div>
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
          className="mb-8 inline-flex items-center gap-2 rounded-xl border-2 border-[#D1D5DB] bg-white px-5 py-2.5 text-sm sm:text-base font-extrabold text-[#374151] shadow-md hover:bg-[#F3F4F6] hover:scale-105 transition-all"
        ><FiArrowLeft size={20} /> Back to Years</motion.button>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center flex flex-col items-center justify-center">
          <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-tr from-[#011337] via-[#021C4F] to-[#7F011F] p-1.5 shadow-xl shadow-rose-950/20 ring-4 ring-amber-400/40 transition-transform hover:scale-105 duration-300">
            <div className="flex h-full w-full items-center justify-center rounded-[20px] bg-[#021C4F] text-amber-300">
              <FiAward size={48} className="text-amber-400 drop-shadow-md" />
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3 shadow-md">
            <FiAward size={14} /> QUESTION PAPERS SEMESTER SELECTION
          </span>
          <h1 className="font-sans text-3xl sm:text-4xl font-extrabold text-[#021C4F] tracking-tight">{yearData.label}</h1>
          <p className="mt-2 text-sm text-[#6B7280] font-medium">Choose a semester to access previous exam papers</p>
        </motion.div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {sems.map(([semKey, semData], i) => (
            <motion.button key={semKey}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }}
              whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedSemester(Number(semKey))}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#C50337] via-[#A0022B] to-[#7F011F] border-2 border-amber-400 text-white shadow-xl transition-all duration-300 hover:shadow-2xl text-center flex flex-col justify-between"
            >
              <div className="relative p-8 text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md text-2xl font-black text-amber-300 shadow-md">
                  {Number(semKey) === 1 ? "SEM I" : "SEM II"}
                </div>
                <h2 className="text-xl font-black text-white">{semData.label}</h2>
                <p className="mt-1.5 text-xs text-rose-100 font-medium">{semData.subjects.length} Subjects</p>
                <div className="mt-4 inline-flex items-center gap-1 text-[11px] font-black text-amber-300 uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                  Explore Subjects <FiChevronRight size={12} />
                </div>
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
          className="mb-8 inline-flex items-center gap-2 rounded-xl border-2 border-[#D1D5DB] bg-white px-5 py-2.5 text-sm sm:text-base font-extrabold text-[#374151] shadow-md hover:bg-[#F3F4F6] hover:scale-105 transition-all"
        ><FiArrowLeft size={20} /> Back to Semesters</motion.button>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 text-sm text-[#6B7280] mb-3">
            <span className="uppercase font-semibold text-[#6B7280]">{courseType.toUpperCase()}</span><FiChevronRight size={10} />
            <span className={ys.text}>{yearData.label}</span><FiChevronRight size={10} /><span className={ys.text}>{semesterData.label}</span>
          </div>
          <h1 className="font-sans text-2xl font-bold text-[#0F4C81]">Select Subject</h1>
          <p className="mt-1 text-sm text-[#6B7280]">Choose a subject to view its previous year question papers</p>
        </motion.div>
        {yearSubjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#E5E7EB] bg-white py-20 shadow-sm">
            <FiBookOpen size={48} className="mb-3 text-slate-350" />
            <p className="text-sm font-medium text-[#4B5563]">No subjects available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {yearSubjects.map((subject, i) => {
              const sc = subjectColors[i % subjectColors.length];
              const faculty = getFacultyName(subject);
              const code = SUBJECT_CODES[subject];
              return (
                <motion.button key={subject}
                  initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: i * 0.05, type: "spring", stiffness: 300, damping: 24 }}
                  whileHover={{ y: -5, scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedSubject(subject)}
                  className="group relative overflow-hidden rounded-xl bg-white border border-[#E5E7EB] shadow-sm transition-all duration-300 glow-amber-hover cursor-pointer"
                >
                  <div className="relative flex items-start gap-4 p-5 text-left">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#FAF7F2] border border-[#E6DAB8] shadow-sm transition-all">
                      {getSubjectIcon(subject, 26)}
                    </div>
                    <div className="min-w-0 flex-1 pt-1">
                      <h3 className="font-sans font-bold text-sm text-[#0F4C81] leading-snug">{subject}</h3>
                      {code && (
                        <span className="inline-block mt-1 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">
                          Code: {code}
                        </span>
                      )}
                      <div className="mt-3 flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 rounded-full ${sc.badge} px-2.5 py-0.5 text-[10px] font-semibold`}><FiAward size={10} /> VIEW PAPERS</span>
                        <FiChevronRight size={14} className="text-slate-400 group-hover:text-[#1E88E5] transition-colors ml-auto" />
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

  const sc = subjectColors[yearSubjects.indexOf(selectedSubject) % subjectColors.length];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-[#F8FAFC]">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          onClick={() => setSelectedSubject(null)}
          className="mb-4 inline-flex items-center gap-2 rounded-xl border-2 border-[#D1D5DB] bg-white px-5 py-2.5 text-sm sm:text-base font-extrabold text-[#374151] shadow-md hover:bg-[#F3F4F6] hover:scale-105 transition-all"
        ><FiArrowLeft size={20} /> Back to Subjects</motion.button>
        <div className="flex items-center gap-2 text-xs text-[#6B7280]">
          <span className="uppercase font-semibold text-[#6B7280]">{courseType.toUpperCase()}</span><FiChevronRight size={10} />
          <span className={ys.text}>{yearData.label}</span><FiChevronRight size={10} /><span className={ys.text}>{semesterData.label}</span><FiChevronRight size={10} />
          <span className="text-[#0F4C81] font-semibold">{selectedSubject}</span>
        </div>
      </motion.div>

      {/* ─── Faculty Upload Section ─── */}
      {isFaculty && selectedSubject && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          {!showUploadForm ? (
            <button
              onClick={() => setShowUploadForm(true)}
              className="group inline-flex items-center gap-2 rounded-lg bg-[#0F4C81] px-5 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#1E88E5] active:scale-[0.97]"
            >
              <FiUploadCloud size={18} />
              Upload Question Papers
            </button>
          ) : (
            <form onSubmit={handleUpload} className="space-y-4 rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3 mb-4">
                <h3 className="font-sans text-base font-bold text-[#0F4C81] flex items-center gap-2">
                  <FiUploadCloud size={18} className="text-[#0F4C81]" />
                  Upload Question Paper — {selectedSubject}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowUploadForm(false)}
                  className="rounded-lg px-3 py-1.5 text-xs font-semibold text-[#6B7280] hover:bg-[#F8FAFC] transition-all"
                >
                  Cancel
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">Title</label>
                  <input
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    required
                    placeholder="e.g. November 2024 Exam Paper"
                    className="w-full rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0F4C81] placeholder:text-[#6B7280]/60 outline-none focus:border-[#0F4C81] focus:ring-1 focus:ring-[#0F4C81]/15 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">Description</label>
                  <textarea
                    value={uploadDescription}
                    onChange={(e) => setUploadDescription(e.target.value)}
                    placeholder="Brief description of the question paper"
                    rows={2}
                    className="w-full rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0F4C81] placeholder:text-[#6B7280]/60 outline-none focus:border-[#0F4C81] focus:ring-1 focus:ring-[#0F4C81]/15 focus:bg-white transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">Exam Year</label>
                    <input
                      value={uploadYearVal}
                      onChange={(e) => setUploadYearVal(e.target.value)}
                      required
                      placeholder="e.g. U1819"
                      className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#0F4C81] outline-none focus:border-[#0F4C81] transition-all"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">Regulation</label>
                    <input
                      value={uploadRegulation}
                      onChange={(e) => setUploadRegulation(e.target.value)}
                      required
                      placeholder="e.g. R2024"
                      className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#0F4C81] outline-none focus:border-[#0F4C81] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">Select PDF File</label>
                  <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-[#E5E7EB] bg-[#F8FAFC] px-4 py-6 text-center transition-all hover:border-[#1E88E5]/50 hover:bg-slate-100">
                    <FiUploadCloud size={24} className="text-[#0F4C81]" />
                    <span className="text-xs text-[#6B7280]">
                      {uploadFileObj ? uploadFileObj.name : "Choose a PDF question paper..."}
                    </span>
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) => setUploadFileObj(e.target.files?.[0] ?? null)}
                      required={!uploading}
                    />
                  </label>
                </div>

                {uploading && progress > 0 && progress < 100 && (
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-150">
                    <div className="h-full bg-[#0F4C81] transition-all" style={{ width: `${progress}%` }} />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full rounded-lg bg-[#0F4C81] py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#1E88E5] disabled:opacity-50"
                >
                  {uploading ? `Uploading (${progress}%)...` : "Upload question paper"}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-4">
          {getSubjectIcon(selectedSubject, 36, "w-16 h-16 shadow-neu-raised rounded-2xl border-2 border-[#D97706]")}
          <div>
            <h1 className="font-mono text-2xl font-bold text-[#134E4A] dark:text-[#CCFBF1]">{selectedSubject}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-[#6B7280]">{courseType.toUpperCase()} · {yearData.label} · {semesterData.label}</span>
              <span className="badge-primary">{filtered.length} paper{filtered.length !== 1 ? "s" : ""}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {filtered.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {[
            { icon: FiFileText, label: "Total Papers", value: filtered.length, color: "bg-[#0F4C81]" },
            { icon: FiCalendar, label: "Exam Years", value: new Set(filtered.map((p) => p.year)).size, color: "bg-[#1E88E5]" },
            { icon: FiAward, label: "Subjects", value: new Set(filtered.map((p) => p.subject)).size, color: "bg-[#2E7D32]" },
            { icon: FiLayers, label: "Regulations", value: new Set(filtered.map((p) => p.regulation)).size, color: "bg-[#0F4C81]" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="relative overflow-hidden rounded-lg bg-white border border-[#E5E7EB] shadow-sm p-4 text-center"
            >
              <div className={`absolute top-0 left-0 right-0 h-0.5 ${s.color}`} />
              <p className="font-sans text-lg font-bold text-[#0F4C81]">{s.value}</p>
              <p className="text-[11px] text-[#6B7280] mt-0.5">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="relative max-w-md">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search papers by title, subject…"
            className="w-full rounded-lg border border-[#E5E7EB] bg-white py-2.5 pl-9 pr-4 text-sm outline-none ring-1 ring-gray-150 focus:ring-2 focus:ring-[#0F4C81]/15 focus:border-[#0F4C81] transition-all"
          />
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div key={selectedSubject + searchQuery}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((paper) => (
            <PdfFileCard
              key={paper.id}
              file={{
                ...paper,
                displayFileName: (paper.subject || selectedSubject || "document").toLowerCase(),
                subject: paper.subject || selectedSubject,
                academicYear: paper.academicYear || Number(selectedYear) || 1,
                semester: paper.semester || Number(selectedSemester) || 1,
                driveUrl: paper.driveFileId || paper.fileUrl,
              }}
              onView={(p) => setPreviewing(p)}
            />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full flex flex-col items-center py-16 text-[#6B7280]">
              <FiAward size={48} className="mb-3 opacity-30 text-slate-400" />
              <p className="text-sm font-medium text-[#4B5563]">
                {selectedSubject === "Web Application Development using AngularJS and Node.js"
                  ? "we will add later"
                  : "No question papers available yet"}
              </p>
              {selectedSubject !== "Web Application Development using AngularJS and Node.js" && (
                <p className="mt-1 text-xs text-[#6B7280]">Papers will be uploaded soon</p>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {previewing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4"
            onClick={() => setPreviewing(null)}
          >
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="flex w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white border border-[#E5E7EB] shadow-2xl"
            >
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E5E7EB] bg-[#0F4C81] text-white">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-bold text-white">{previewing.title}</h3>
                  <p className="text-[11px] text-white/80">{previewing.subject} · {previewing.regulation}</p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={getDriveViewUrl(previewing.fileUrl || previewing.driveUrl || previewing.driveFileId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-white/15 px-3 py-1 text-xs font-semibold text-white hover:bg-white/25 transition-all flex items-center gap-1"
                  >
                    Open PDF ↗
                  </a>
                  <button onClick={() => setPreviewing(null)} className="rounded-full bg-white/10 p-1.5 text-white/70 hover:bg-white/20 hover:text-white transition-all">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                </div>
              </div>
              <div className="aspect-[4/3] w-full bg-slate-900 sm:aspect-[16/10] lg:aspect-[16/9]">
                {(() => {
                  const targetUrl = previewing.fileUrl || previewing.driveUrl || previewing.driveFileId || "";
                  const isLocal = typeof targetUrl === "string" && targetUrl.startsWith("/");
                  if (isLocal) {
                    return (
                      <object
                        data={targetUrl}
                        type="application/pdf"
                        className="h-full w-full"
                      >
                        <div className="flex flex-col items-center justify-center h-full text-white p-6 text-center">
                          <p className="mb-3 text-sm">PDF Preview</p>
                          <a
                            href={getDriveViewUrl(targetUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-[#1E88E5] text-white rounded-lg text-xs font-bold shadow-md hover:bg-blue-600 transition-all"
                          >
                            Open PDF in New Tab ↗
                          </a>
                        </div>
                      </object>
                    );
                  }
                  return (
                    <iframe
                      src={getDriveEmbedUrl(targetUrl)}
                      title={previewing.title}
                      className="h-full w-full border-0"
                      allowFullScreen
                    />
                  );
                })()}
              </div>
              <div className="border-t border-[#E5E7EB] px-5 py-2.5 flex items-center justify-between text-[11px] text-[#6B7280] bg-[#F8FAFC]">
                <span>{previewing.subject} · {previewing.year || "2024"}</span>
                <a
                  href={getDriveViewUrl(previewing.fileUrl || previewing.driveUrl || previewing.driveFileId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0F4C81] font-bold hover:underline"
                >
                  Direct PDF Link ↗
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
