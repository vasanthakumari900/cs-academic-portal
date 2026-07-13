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

const CURRICULUM = {
  1: { label: "1st Year", icon: "Ⅰ", semesters: { 1: { label: "Semester 1", subjects: ["FUNDAMENTALS OF PYTHON PROGRAMMING","FUNDAMENTALS OF DIGITAL ELECTRONICS","MATHEMATICS PAPER - I","TAMIL","ENGLISH"] }, 2: { label: "Semester 2", subjects: ["OBJECT ORIENTED PROGRAMMING USING C++","DATA STRUCTURES","MATHEMATICS PAPER - II","TAMIL","ENGLISH"] } } },
  2: { label: "2nd Year", icon: "Ⅱ", semesters: { 1: { label: "Semester 1", subjects: ["JAVA PROGRAMMING","WEB TECHNOLOGY","STATISTICAL METHODS FOR COMPUTER SCIENCE - I","TAMIL","ENGLISH"] }, 2: { label: "Semester 2", subjects: ["ANDROID APP DEVELOPMENT","SOFTWARE ENGINEERING","STATISTICAL METHODS FOR COMPUTER SCIENCE - II","ARTIFICIAL INTELLIGENCE AND EXPERT SYSTEMS","TAMIL","ENGLISH"] } } },
  3: { label: "3rd Year", icon: "Ⅲ", semesters: { 1: { label: "Semester 1", subjects: ["OPERATING SYSTEM","DATA MINING TECHNIQUES","ASP.NET","DATABASE MANAGEMENT SYSTEM"] }, 2: { label: "Semester 2", subjects: ["PROGRAMMING IN PHP","CLOUD COMPUTING","COMPUTER NETWORKS","INTRODUCTION TO DATA SCIENCE","UNIFIED MODELING LANGUAGE","DIGITAL IMAGE PROCESSING"] } } },
};

function getSubjectsForYear(year) { const yr = CURRICULUM[year]; if (!yr) return []; const all = []; Object.values(yr.semesters).forEach((sem) => { sem.subjects.forEach((s) => { if (!all.includes(s)) all.push(s); }); }); return all; }

const yearStyles = {
  1: { gradient: "from-emerald-500 to-teal-600", light: "from-emerald-50 to-teal-50", text: "text-emerald-700" },
  2: { gradient: "from-violet-500 to-purple-600", light: "from-violet-50 to-purple-50", text: "text-violet-700" },
  3: { gradient: "from-amber-500 to-orange-600", light: "from-amber-50 to-orange-50", text: "text-amber-700" },
};

const subjectColors = [
  { from: "from-indigo-500", to: "to-violet-600", badge: "bg-indigo-500/20 text-indigo-300" },
  { from: "from-rose-500", to: "to-pink-600", badge: "bg-rose-500/20 text-rose-300" },
  { from: "from-cyan-500", to: "to-sky-600", badge: "bg-cyan-500/20 text-cyan-300" },
  { from: "from-amber-500", to: "to-yellow-600", badge: "bg-amber-500/20 text-amber-300" },
  { from: "from-lime-500", to: "to-green-600", badge: "bg-lime-500/20 text-lime-300" },
];

const FACULTY_MAP = {
  "OPERATING SYSTEM": "DR DHARANI", "DATA MINING TECHNIQUES": "V PONNILA",
  "ASP.NET": "R SARANYA", "DATABASE MANAGEMENT SYSTEM": "M P SUDHA",
};

function getFacultyName(subject) {
  const upper = subject.toUpperCase();
  if (upper.includes("DBMS") || upper.includes("DATABASE")) return FACULTY_NAMES.DBMS;
  if (upper.includes("ASP") || upper.includes(".NET")) return FACULTY_NAMES.ASPNET;
  if (upper.includes("OPERATING") || upper.includes("OS")) return FACULTY_NAMES.OS;
  if (upper.includes("DMT") || upper.includes("DATA MINING")) return FACULTY_NAMES.DMT;
  return null;
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

const allPapers = [...DBMS_PAPERS, ...OS_PAPERS, ...DMT_PAPERS, ...ASPNET_PAPERS, ...JAVA_PAPERS, ...WEBTECH_PAPERS, ...ANDROID_PAPERS, ...STATS1_PAPERS, ...SE_PAPERS, ...STATS2_PAPERS, ...PYTHON_PAPERS, ...DIGITAL_ELECTRONICS_PAPERS, ...MATH1_PAPERS, ...AI_PAPERS, ...DS_PAPERS, ...CPP_PAPERS, ...MATH2_PAPERS];

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

 const uploadedPapers = [];
const refetch = () => {};
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
        courseType: courseType,
        fileUrl,
        facultyName: user.name || "Faculty",
        facultyId: user.uid || "faculty-id",
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

  const yearData = selectedYear ? CURRICULUM[selectedYear] : null;
  const semesterData = selectedSemester && yearData ? yearData.semesters[selectedSemester] : null;
  const yearSubjects = courseType === "pg" ? [] : (semesterData ? semesterData.subjects : (selectedYear ? getSubjectsForYear(selectedYear) : []));
  const ys = selectedYear ? yearStyles[selectedYear] : yearStyles[1];

  const combinedPapers = useMemo(() => {
    const mappedFirestore = uploadedPapers
      .filter((p) => {
        const matchesSubject = !selectedSubject || p.subject?.toUpperCase() === selectedSubject.toUpperCase();
        const matchesCourse = !courseType || p.courseType === courseType;
        const matchesYear = !selectedYear || p.year === selectedYear;
        const matchesSem = !selectedSemester || p.semester === selectedSemester;
        return matchesSubject && matchesCourse && matchesYear && matchesSem;
      })
      .map((p) => ({
        id: p.id,
        title: p.title,
        subject: p.subject,
        facultyName: p.facultyName || "Faculty",
        description: p.description || "Previous year question paper",
        year: p.year || "U1819",
        regulation: p.regulation || "R2024",
        fileUrl: p.fileUrl,
        fromFirestore: true,
      }));

    const mappedLocal = allPapers
      .filter((p) => {
        const matchesSubject = !selectedSubject || p.subject?.toUpperCase() === selectedSubject.toUpperCase();
        const matchesCourse = !courseType || p.courseType === courseType;
        return matchesSubject && matchesCourse;
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
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-[0_8px_32px_rgba(244,63,94,0.2)]">
            <FiAward size={36} />
          </div>
          <h1 className="font-display text-4xl font-bold text-white">Question Papers</h1>
          <p className="mt-2 text-sm text-white/60">Select your course to browse previous year exam papers</p>
        </motion.div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {COURSE_OPTIONS.map((course, i) => (
            <motion.button key={course.value}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.12 }}
              whileHover={{ y: -6, scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => setCourseType(course.value)}
              className="group relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-glass transition-all duration-500 hover:shadow-xl hover:bg-white/10"
            >
              <div className={`absolute inset-0 ${course.value === "ug" ? "bg-gradient-to-br from-emerald-50 to-teal-50" : "bg-gradient-to-br from-purple-50 to-violet-50"} opacity-50 group-hover:opacity-80 transition-opacity`} />
              <div className="relative p-8 text-center">
                <div className={`mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br ${course.value === "ug" ? "from-emerald-500 to-teal-600" : "from-purple-500 to-violet-600"} text-3xl font-bold text-white shadow-lg transition-all group-hover:scale-110`}>{course.value === "ug" ? "UG" : "PG"}</div>
                <h2 className={`text-xl font-bold ${course.value === "ug" ? "text-emerald-700" : "text-violet-700"}`}>{course.label}</h2>
                <p className="mt-1.5 text-xs text-white/50">{course.desc}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">Browse Papers <FiChevronRight size={12} /></div>
              </div>
              <div className={`absolute bottom-0 left-0 right-0 h-1 ${course.value === "ug" ? "bg-gradient-to-r from-emerald-500 to-teal-600" : "bg-gradient-to-r from-purple-500 to-violet-600"} scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500`} />
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  if (!selectedYear) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          onClick={() => { setCourseType(null); setSelectedYear(null); setSelectedSubject(null); }}
          className="mb-8 inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm px-4 py-2 text-xs font-semibold text-white/60 hover:bg-white/5 transition-all"
        ><FiArrowLeft size={14} /> Back to Course</motion.button>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-lg"><FiAward size={28} /></div>
          <h1 className="font-display text-2xl font-bold text-white">{courseType.toUpperCase()} — Select Year</h1>
          <p className="mt-1 text-sm text-white/60">Choose your academic year</p>
        </motion.div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {[1, 2, 3].map((year, i) => {
            const s = yearStyles[year];
            return (
              <motion.button key={year}
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedYear(year)}
                className="group relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-glass transition-all duration-500 hover:shadow-xl hover:bg-white/10"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${s.light} opacity-50 group-hover:opacity-80 transition-opacity`} />
                <div className="relative p-8 text-center">
                  <div className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${s.gradient} text-2xl font-bold text-white shadow-lg transition-all group-hover:scale-110`}>{CURRICULUM[year].icon}</div>
                  <h2 className={`text-lg font-bold ${s.text}`}>{CURRICULUM[year].label}</h2>
                  {courseType !== "pg" && <p className="mt-1 text-xs text-white/50">{getSubjectsForYear(year).length} subjects</p>}
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
          className="mb-8 inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm px-4 py-2 text-xs font-semibold text-white/60 hover:bg-white/5 transition-all"
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
              className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-glass transition-all duration-300 hover:shadow-xl hover:bg-white/10"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${ys.light} opacity-50 group-hover:opacity-80 transition-opacity`} />
              <div className="relative p-8 text-center">
                <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br ${ys.gradient} text-xl font-bold text-white shadow-md`}>{semKey === 1 ? "I" : "II"}</div>
                <h2 className={`text-lg font-bold ${ys.text}`}>{semData.label}</h2>                  {courseType !== "pg" && <p className="mt-1 text-xs text-white/50">{semData.subjects.length} subjects</p>}
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
          className="mb-8 inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm px-4 py-2 text-xs font-semibold text-white/60 hover:bg-white/5 transition-all"
        ><FiArrowLeft size={14} /> Back to Semesters</motion.button>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 text-xs text-white/50 mb-3">
            <span className="uppercase font-semibold text-white/60">{courseType.toUpperCase()}</span><FiChevronRight size={10} />
            <span className={ys.text}>{yearData.label}</span><FiChevronRight size={10} /><span className={ys.text}>{semesterData.label}</span>
          </div>
          <h1 className={`font-display text-2xl font-bold ${ys.text}`}>Select Subject</h1>
          <p className="mt-1 text-sm text-white/60">Choose a subject to view its previous year question papers</p>
        </motion.div>
        {yearSubjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/15 bg-white/5 py-20">
            <FiBookOpen size={48} className="mb-3 text-white/40" />
            <p className="text-sm font-medium text-white/60">No subjects available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {yearSubjects.map((subject, i) => {
              const sc = subjectColors[i % subjectColors.length];
              return (
                <motion.button key={subject}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedSubject(subject)}
                  className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-glass transition-all duration-300 hover:shadow-xl hover:bg-white/10"
                >
                  <div className="relative flex items-start gap-4 p-5">
                    <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${sc.from} ${sc.to} text-white shadow-md transition-all group-hover:scale-105 group-hover:shadow-lg`}><FiFileText size={22} /></div>
                    <div className="min-w-0 flex-1 pt-1">
                      <h3 className="font-display font-bold text-sm text-white leading-snug">{subject}</h3>
                      {FACULTY_MAP[subject] && <p className="mt-0.5 text-[11px] font-semibold tracking-wide text-white/60">{FACULTY_MAP[subject]}</p>}
                      <div className="mt-3 flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 rounded-full ${sc.badge} px-2.5 py-0.5 text-[10px] font-semibold`}><FiAward size={10} /> VIEW PAPERS</span>
                        <FiChevronRight size={14} className="text-white/40 group-hover:text-indigo-400 transition-colors ml-auto" />
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          onClick={() => setSelectedSubject(null)} className="mb-4 inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm px-4 py-2 text-xs font-semibold text-white/60 hover:bg-white/5 transition-all"
        ><FiArrowLeft size={14} /> Back to Subjects</motion.button>
        <div className="flex items-center gap-2 text-xs text-white/50">
          <span className="uppercase font-semibold text-white/60">{courseType.toUpperCase()}</span><FiChevronRight size={10} />
          <span className={ys.text}>{yearData.label}</span><FiChevronRight size={10} /><span className={ys.text}>{semesterData.label}</span><FiChevronRight size={10} />
          <span className="text-white/80 font-semibold">{selectedSubject}</span>
        </div>
      </motion.div>

      {/* ─── Faculty Upload Section ─── */}
      {isFaculty && selectedSubject && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          {!showUploadForm ? (
            <button
              onClick={() => setShowUploadForm(true)}
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 px-5 py-3 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:shadow-rose-500/30 hover:from-rose-500 hover:to-pink-500 active:scale-[0.97]"
            >
              <FiUploadCloud size={18} />
              Upload Question Papers
            </button>
          ) : (
            <form onSubmit={handleUpload} className="space-y-4 rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 shadow-md">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
                  <FiUploadCloud size={18} className="text-rose-400" />
                  Upload Question Paper — {selectedSubject}
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
                    placeholder="e.g. November 2024 Exam Paper"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400/20 focus:bg-white/10 transition-all"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-white/50">Description</label>
                  <textarea
                    value={uploadDescription}
                    onChange={(e) => setUploadDescription(e.target.value)}
                    placeholder="Brief description of the question paper"
                    rows={2}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400/20 focus:bg-white/10 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-white/50">Exam Year</label>
                    <input
                      value={uploadYearVal}
                      onChange={(e) => setUploadYearVal(e.target.value)}
                      required
                      placeholder="e.g. U1819"
                      className="w-full rounded-xl border border-white/15 bg-[#0F172A] px-4 py-2.5 text-sm text-white outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-white/50">Regulation</label>
                    <input
                      value={uploadRegulation}
                      onChange={(e) => setUploadRegulation(e.target.value)}
                      required
                      placeholder="e.g. R2024"
                      className="w-full rounded-xl border border-white/15 bg-[#0F172A] px-4 py-2.5 text-sm text-white outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-white/50">Select PDF File</label>
                  <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-white/15 bg-white/5 px-4 py-6 text-center transition-all hover:border-rose-500/50 hover:bg-white/10">
                    <FiUploadCloud size={24} className="text-rose-400" />
                    <span className="text-xs text-white/50">
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
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div className="h-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all" style={{ width: `${progress}%` }} />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 py-3 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg hover:shadow-rose-500/20 disabled:opacity-50"
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
          <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${sc.from} ${sc.to} text-white shadow-lg`}><FiAward size={28} /></div>
          <div>
            <h1 className="font-display text-2xl font-bold text-white">{selectedSubject}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-white/60">{courseType.toUpperCase()} · {yearData.label} · {semesterData.label}</span>
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
            { icon: FiFileText, label: "Total Papers", value: filtered.length, color: "from-indigo-600 to-violet-600" },
            { icon: FiCalendar, label: "Exam Years", value: new Set(filtered.map((p) => p.year)).size, color: "from-amber-500 to-orange-600" },
            { icon: FiAward, label: "Subjects", value: new Set(filtered.map((p) => p.subject)).size, color: "from-rose-500 to-pink-600" },
            { icon: FiLayers, label: "Regulations", value: new Set(filtered.map((p) => p.regulation)).size, color: "from-violet-500 to-purple-600" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-glass p-4 text-center"
            >
              <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${s.color}`} />
              <p className="font-display text-lg font-bold text-white">{s.value}</p>
              <p className="text-[11px] text-white/50 mt-0.5">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="relative max-w-md">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50" size={14} />
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search papers by title, subject…"
            className="w-full rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm py-2.5 pl-9 pr-4 text-sm outline-none ring-1 ring-gray-200/50 focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-300 transition-all"
          />
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div key={selectedSubject + searchQuery}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((paper, i) => (
            <motion.div key={paper.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <div className="group relative flex flex-col gap-3 overflow-hidden rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-glass transition-all duration-300 hover:shadow-xl hover:bg-white/10 p-5">
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${sc.from} ${sc.to} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="flex items-start gap-3">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${sc.from} ${sc.to} text-white shadow-sm`}><FiFileText size={20} /></div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-display text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors">{paper.title}</h3>
                    <p className="mt-0.5 flex items-center gap-2 text-[11px] text-white/50">
                      <span>{paper.subject}</span>
                      <span className="text-white/40">·</span>
                      <span className="flex items-center gap-1"><FiUser size={10} /> {paper.facultyName}</span>
                    </p>
                  </div>
                </div>
                <p className="line-clamp-1 text-xs text-white/60">{paper.description}</p>
                <div className="flex flex-wrap gap-1.5 text-[10px]">
                  {paper.pages && <span className="rounded-md bg-white/5 px-2 py-0.5 font-medium text-white/60">📄 {paper.pages}p</span>}
                  <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 font-semibold text-indigo-300">{paper.year}</span>
                  <span className="rounded-md bg-white/5 px-2 py-0.5 font-medium text-white/60">{paper.regulation}</span>
                </div>
                <div className="mt-auto flex gap-2 pt-1">
                  <button onClick={() => setPreviewing(paper)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 py-2 text-xs font-semibold text-white/70 transition-all hover:border-white/30 hover:bg-white hover:text-gray-800 active:scale-95"
                  ><FiEye size={13} /> Preview</button>
                  <button onClick={() => {
                    if (paper.fileUrl) {
                      window.open(paper.fileUrl, '_blank');
                    } else {
                      setDownloadingId(paper.id);
                      setTimeout(() => {
                        window.open(`https://drive.google.com/uc?export=download&id=${paper.driveFileId}`, '_blank');
                        setDownloadingId(null);
                      }, 400);
                    }
                  }}
                    disabled={downloadingId === paper.id}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r ${sc.from} ${sc.to} py-2 text-xs font-semibold text-white shadow-md transition-all hover:shadow-lg active:scale-95 disabled:opacity-60`}
                  >{downloadingId === paper.id ? <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> : <><FiDownload size={13} /> Download</>}</button>
                </div>
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full flex flex-col items-center py-16 text-white/50">
              <FiAward size={48} className="mb-3 opacity-30" />
              <p className="text-sm font-medium text-white/60">No question papers available yet</p>
              <p className="mt-1 text-xs text-white/50">Papers will be uploaded soon</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {previewing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 p-2 sm:p-4 backdrop-blur-sm"
            onClick={() => setPreviewing(null)}
          >
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
            >
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gradient-to-r from-indigo-600/20 to-violet-600/20">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-bold text-white">{previewing.title}</h3>
                  <p className="text-[11px] text-white/60">{previewing.subject} · {previewing.regulation}</p>
                </div>
                <button onClick={() => setPreviewing(null)} className="rounded-full bg-white/5 p-1.5 text-white/60 hover:bg-gray-100 hover:text-white/80 transition-all">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </div>
              <div className="aspect-[4/3] w-full bg-gray-100 sm:aspect-[16/10] lg:aspect-[16/9]">
                {previewing.driveFileId ? (
                  <iframe src={`https://drive.google.com/file/d/${previewing.driveFileId}/preview`} title={previewing.title} className="h-full w-full" allowFullScreen />
                ) : (
                  <iframe src={previewing.fileUrl} title={previewing.title} className="h-full w-full" allowFullScreen />
                )}
              </div>
              <div className="border-t border-gray-100 px-5 py-2.5 text-center text-[11px] text-white/50">
                {previewing.pages && <span>{previewing.pages} pages</span>} · {previewing.subject} · {previewing.year}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
