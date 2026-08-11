// src/pages/student/ExamStudyPlanner.jsx
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCalendar,
  FiClock,
  FiCheckSquare,
  FiAlertTriangle,
  FiBookOpen,
  FiAward,
  FiZap,
  FiRefreshCw,
  FiCheckCircle,
  FiSliders,
  FiPrinter,
  FiTrendingUp,
  FiTarget,
  FiCheck,
  FiUser,
  FiTrash2,
  FiLayers,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import useActivityTracker from "../../hooks/useActivityTracker";

// CIA 1 = Semester 1 Subjects | CIA 2 = Semester 2 Subjects (Standard Format for all years)
const YEAR_SEMESTER_SUBJECTS = {
  1: {
    cia1: [
      "PYTHON PROGRAMMING ESSENTIALS",
      "MATHEMATICS PAPER I",
      "TAMIL",
      "FOUNDATION ENGLISH - I",
      "DATA STRUCTURES",
    ],
    cia2: [
      "OBJECT ORIENTED PROGRAMMING USING C++",
      "WEB TECHNOLOGY",
      "MATHEMATICS PAPER - II",
      "TAMIL",
      "ENGLISH",
    ],
  },
  2: {
    cia1: [
      "Object Oriented Programming Concepts using JAVA",
      "Web Application Development using AngularJS and Node.js",
      "Statistical Methods for Computer Science – I",
      "TAMIL",
      "Foundation English - III",
      "Principles of operating Systems",
    ],
    cia2: [
      "ANDROID APP DEVELOPMENT",
      "SOFTWARE ENGINEERING",
      "STATISTICAL METHODS FOR COMPUTER SCIENCE - II",
      "ARTIFICIAL INTELLIGENCE AND EXPERT SYSTEM",
      "TAMIL",
      "ENGLISH",
    ],
  },
  3: {
    cia1: [
      "OPERATING SYSTEM",
      "DATA MINING TECHNIQUES",
      "ASP.NET",
      "DATABASE MANAGEMENT SYSTEM",
    ],
    cia2: [
      "PROGRAMMING IN PHP",
      "CLOUD COMPUTING",
      "COMPUTER NETWORKS",
      "INTRODUCTION TO DATA SCIENCE",
      "DIGITAL IMAGE PROCESSING",
      "UNIFIED MODELING LANGUAGE",
    ],
  },
};

// High-Yield Syllabus Topics per Subject, CIA Exam & Familiarity Level
const SUBJECT_SYLLABUS_MAP = {
  "PYTHON PROGRAMMING ESSENTIALS": {
    cia1: {
      weak: [
        { unit: "Unit I", topic: "Variables, Identifiers & Primitive Data Types (int, float, str, bool)", type: "2-Mark Definition", marks: 4, action: "Read basic definitions line-by-line. Practice variable declarations.", code: "x = 10  # int\nname = 'Alice'  # str\nprint(type(x))", timeSlot: "06:00 AM - 07:30 AM" },
        { unit: "Unit I", topic: "Operators & Expression Evaluation (Arithmetic, Relational, Logical)", type: "5-Mark Code", marks: 6, action: "Write basic arithmetic & logical expressions with output trace.", code: "a, b = 15, 4\nres = (a > 10) and (b < 5)\nprint(res)", timeSlot: "05:30 PM - 07:00 PM" },
        { unit: "Unit II", topic: "Decision Making (if-elif-else) & Basic Loops (for, while)", type: "5-Mark Code", marks: 7, action: "Memorize if-else syntax & simple loop counter programs.", code: "for i in range(1, 6):\n    if i % 2 == 0:\n        print('Even:', i)", timeSlot: "08:30 PM - 09:30 PM" }
      ],
      moderate: [
        { unit: "Unit I & II", topic: "Control Flow Logic & List Comprehensions", type: "CIA Past Paper 5-Mark", marks: 8, action: "Solve past CIA questions on nested loops & list comprehensions.", code: "evens = [x for x in range(10) if x % 2 == 0]", timeSlot: "06:30 AM - 07:45 AM" }
      ],
      good: [
        { unit: "Unit I & II", topic: "Full Unit I & II Revision & 10-Mark Essay Writing", type: "10-Mark Centum Essay", marks: 15, action: "Write complete essay answer covering data structures & control flow.", code: "Full program implementation with docstrings.", timeSlot: "07:00 AM - 08:00 AM" }
      ]
    }
  },
  "OPERATING SYSTEM": {
    cia1: {
      weak: [
        { unit: "Unit I", topic: "OS Objectives, Functions & System Call Interface (fork, read, write)", type: "Foundational 2-Mark & 5-Mark", marks: 7, action: "Learn OS kernel definitions & system call workflow diagram.", code: "[User Application] ──► System Call API ──► [OS Kernel]", timeSlot: "06:00 AM - 07:30 AM" },
        { unit: "Unit I", topic: "Operating System Architecture: Monolithic, Layered & Microkernel", type: "5-Mark Block Diagram", marks: 6, action: "Draw Microkernel vs Monolithic architecture diagrams.", code: "User Mode ──► Microkernel (IPC & Memory) ──► Hardware", timeSlot: "05:30 PM - 07:00 PM" },
        { unit: "Unit II", topic: "Process States & CPU Scheduling (FCFS, SJF, Round Robin)", type: "5-Mark & 10-Mark", marks: 9, action: "Practice FCFS & SJF Gantt Chart calculations.", code: "Gantt Chart: P1 [0-5] ──► P2 [5-8] ──► P3 [8-12]", timeSlot: "08:30 PM - 09:30 PM" }
      ],
      moderate: [
        { unit: "Unit I & II", topic: "CPU Scheduling Algorithm Comparison & Gantt Chart Problems", type: "CIA Past Paper 10-Mark", marks: 10, action: "Solve Round Robin & Priority Scheduling numerical problems.", code: "Calculate Average Waiting Time & Turnaround Time.", timeSlot: "06:30 AM - 07:45 AM" }
      ],
      good: [
        { unit: "Unit I & II", topic: "Full OS Unit I & II Essay Answers & System Call Code Tracing", type: "10-Mark Centum Essay", marks: 15, action: "Write comprehensive essay on OS Kernel, Process States & Scheduling.", code: "Complete architectural diagrams & Gantt chart proof.", timeSlot: "07:00 AM - 08:00 AM" }
      ]
    }
  }
};

export default function ExamStudyPlanner() {
  const { user } = useAuth();
  useActivityTracker("Smart AI Exam Study Planner");

  // Logged-In Student Year (Default 3rd Year if not set)
  const studentYear = user?.year || 3;

  // Selected CIA Assessment Mode: "cia1" (Semester 1) or "cia2" (Semester 2)
  const [ciaMode, setCiaMode] = useState("cia1");

  // Filtered Subjects based on Year & CIA Mode (Sem 1 = CIA 1 | Sem 2 = CIA 2)
  const yearSemesterMap = YEAR_SEMESTER_SUBJECTS[studentYear] || YEAR_SEMESTER_SUBJECTS[3];
  const activeSemesterSubjects = yearSemesterMap[ciaMode] || yearSemesterMap["cia1"];

  // States
  const [selectedSubject, setSelectedSubject] = useState(() => activeSemesterSubjects[0] || "OPERATING SYSTEM");
  const [familiarity, setFamiliarity] = useState("weak"); // "weak" | "moderate" | "good"
  const [examDate, setExamDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split("T")[0];
  });

  // Generated Plan & Completed Tasks
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [completedTasks, setCompletedTasks] = useState({});
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Update selected subject when CIA mode or Year changes
  useEffect(() => {
    if (activeSemesterSubjects && activeSemesterSubjects.length > 0) {
      if (!activeSemesterSubjects.includes(selectedSubject)) {
        setSelectedSubject(activeSemesterSubjects[0]);
      }
    }
  }, [ciaMode, studentYear]);

  // Auto-generate plan when familiarity, subject, or CIA mode changes
  useEffect(() => {
    handleGeneratePlan(familiarity, selectedSubject, ciaMode);
  }, [familiarity, selectedSubject, ciaMode]);

  // Load saved state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`cs_portal_cia_planner_${studentYear}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.ciaMode) setCiaMode(parsed.ciaMode);
        if (parsed.selectedSubject) setSelectedSubject(parsed.selectedSubject);
        if (parsed.familiarity) setFamiliarity(parsed.familiarity);
        if (parsed.examDate) setExamDate(parsed.examDate);
        if (parsed.generatedPlan) setGeneratedPlan(parsed.generatedPlan);
        if (parsed.completedTasks) setCompletedTasks(parsed.completedTasks);
      }
    } catch (e) {
      console.warn("Failed to load planner state:", e);
    }
  }, [studentYear]);

  // Live Countdown Timer
  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date(`${examDate}T09:00:00`).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [examDate]);

  // Save State
  const savePlanState = (planToSave, tasksToSave, famLevel, activeCia) => {
    const dataToSave = {
      studentYear,
      ciaMode: activeCia || ciaMode,
      selectedSubject,
      familiarity: famLevel || familiarity,
      examDate,
      generatedPlan: planToSave !== undefined ? planToSave : generatedPlan,
      completedTasks: tasksToSave !== undefined ? tasksToSave : completedTasks,
    };
    localStorage.setItem(`cs_portal_cia_planner_${studentYear}`, JSON.stringify(dataToSave));
  };

  // Generate Auto-Fixed Study Schedule based on CIA Mode & Familiarity Level
  const handleGeneratePlan = (famLevel = familiarity, subName = selectedSubject, activeCia = ciaMode) => {
    const subMap = SUBJECT_SYLLABUS_MAP[subName] || SUBJECT_SYLLABUS_MAP["OPERATING SYSTEM"];
    const ciaMap = subMap[activeCia] || subMap["cia1"];
    const topicList = ciaMap[famLevel] || ciaMap["weak"];

    const startDateObj = new Date();
    const daysList = [];

    const daysCount = famLevel === "weak" ? 3 : famLevel === "moderate" ? 2 : 1;
    const semTitle = activeCia === "cia1" ? "Semester 1 (CIA 1)" : "Semester 2 (CIA 2)";

    for (let dayNum = 1; dayNum <= daysCount; dayNum++) {
      const currentDate = new Date(startDateObj.getTime() + (dayNum - 1) * 24 * 60 * 60 * 1000);
      const dateStr = currentDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

      const dayTasks = [];

      if (famLevel === "weak") {
        const item1 = topicList[(dayNum - 1) % topicList.length];
        dayTasks.push({
          id: `d${dayNum}_t1`,
          timeSlot: item1.timeSlot || "06:00 AM - 07:30 AM",
          unit: item1.unit,
          topic: item1.topic,
          type: item1.type,
          marks: item1.marks,
          action: item1.action,
          code: item1.code,
        });

        const item2 = topicList[dayNum % topicList.length];
        dayTasks.push({
          id: `d${dayNum}_t2`,
          timeSlot: "05:30 PM - 07:00 PM",
          unit: item2.unit,
          topic: item2.topic,
          type: item2.type,
          marks: item2.marks,
          action: item2.action,
          code: item2.code,
        });

        dayTasks.push({
          id: `d${dayNum}_t3`,
          timeSlot: "08:30 PM - 09:30 PM",
          unit: `${semTitle} Pass Drill`,
          topic: `${subName} 2-Mark & 5-Mark Memory Self-Test`,
          type: "Pass Drill",
          marks: 7,
          action: `Write core definitions & key code syntax from memory without notes.`,
          code: `Target: Secure 20+ Pass Marks in 50-mark ${activeCia.toUpperCase()} exam!`,
        });
      } else if (famLevel === "moderate") {
        const item1 = topicList[(dayNum - 1) % topicList.length];
        dayTasks.push({
          id: `d${dayNum}_t1`,
          timeSlot: item1.timeSlot || "06:30 AM - 07:45 AM",
          unit: item1.unit,
          topic: item1.topic,
          type: item1.type,
          marks: item1.marks,
          action: item1.action,
          code: item1.code,
        });

        dayTasks.push({
          id: `d${dayNum}_t2`,
          timeSlot: "06:00 PM - 07:15 PM",
          unit: `${semTitle} Practice`,
          topic: `Past ${activeCia.toUpperCase()} Question Solutions & Code Debugging`,
          type: "CIA Practice",
          marks: 10,
          action: `Solve previous ${activeCia.toUpperCase()} questions for ${subName}.`,
          code: `Target Goal: Secure 30+ Marks in ${activeCia.toUpperCase()} Exam!`,
        });
      } else {
        const item1 = topicList[0] || topicList[(dayNum - 1) % topicList.length];
        dayTasks.push({
          id: `d${dayNum}_t1`,
          timeSlot: "07:00 AM - 08:00 AM",
          unit: item1.unit,
          topic: item1.topic,
          type: item1.type,
          marks: item1.marks,
          action: item1.action,
          code: item1.code,
        });
      }

      daysList.push({
        dayNum,
        dateStr,
        tasks: dayTasks,
      });
    }

    const newPlan = {
      studentYear,
      ciaMode: activeCia,
      subject: subName,
      familiarity: famLevel,
      days: daysList,
    };

    setGeneratedPlan(newPlan);
    savePlanState(newPlan, completedTasks, famLevel, activeCia);
  };

  // Toggle Task Completion Checkbox
  const handleToggleTask = (taskId) => {
    const updated = {
      ...completedTasks,
      [taskId]: !completedTasks[taskId],
    };
    setCompletedTasks(updated);
    savePlanState(generatedPlan, updated);
  };

  // Accumulated Marks towards Pass Threshold
  const accumulatedMarks = useMemo(() => {
    if (!generatedPlan || !generatedPlan.days) return 0;
    let sum = 0;
    generatedPlan.days.forEach((day) => {
      day.tasks.forEach((t) => {
        if (completedTasks[t.id]) {
          sum += t.marks || 0;
        }
      });
    });
    return sum;
  }, [generatedPlan, completedTasks]);

  // Reset Plan
  const handleResetPlan = () => {
    if (window.confirm("Reset your study planner?")) {
      setGeneratedPlan(null);
      setCompletedTasks({});
      localStorage.removeItem(`cs_portal_cia_planner_${studentYear}`);
      toast.success("Study planner reset.");
    }
  };

  const getYearBadge = () => {
    if (studentYear === 1) return "1st Year (B.Sc. CS)";
    if (studentYear === 2) return "2nd Year (B.Sc. CS)";
    return "3rd Year (B.Sc. CS)";
  };

  return (
    <div className="min-h-screen bg-[#FAF0F2] py-8 px-4 sm:px-6 lg:px-8 text-[#2D060E] font-sans">
      <div className="mx-auto max-w-5xl space-y-8">
        
        {/* Sleek Hero Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-3xl bg-gradient-to-r from-[#011337] via-[#021C4F] to-[#7F011F] p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden border-2 border-amber-400/40">
          <div className="space-y-2 relative z-10">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 text-slate-950 px-3 py-1 text-xs font-bold uppercase tracking-widest shadow-md">
                <FiUser size={13} /> {getYearBadge()}
              </span>
              <span className="inline-flex items-center gap-1 bg-[#0D9488] text-white px-3 py-1 text-xs font-bold rounded-full">
                Semester Verified
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              🤖 Smart AI Exam Study Planner &amp; Time Fixer
            </h1>
            <p className="text-xs sm:text-sm text-teal-100 max-w-xl font-medium leading-relaxed">
              Select <strong>CIA 1 (Semester 1)</strong> or <strong>CIA 2 (Semester 2)</strong> to load your year&apos;s exact subjects ({activeSemesterSubjects.length} subjects). Tap your familiarity level for auto-fixed clock times!
            </p>
          </div>

          {/* Live Countdown Clock Badge */}
          <div className="bg-[#060D19]/90 backdrop-blur-md p-4.5 rounded-2xl border-2 border-amber-400 text-center shrink-0 space-y-1.5 shadow-xl">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 block">
              ⏱️ Exam Countdown ({selectedSubject.split(" ")[0]})
            </span>
            <div className="flex items-center justify-center gap-2 text-xl sm:text-2xl font-extrabold text-white">
              <div className="flex flex-col items-center">
                <span className="text-amber-400">{timeLeft.days}</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">Days</span>
              </div>
              <span className="text-amber-400">:</span>
              <div className="flex flex-col items-center">
                <span className="text-amber-400">{String(timeLeft.hours).padStart(2, "0")}</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">Hrs</span>
              </div>
              <span className="text-amber-400">:</span>
              <div className="flex flex-col items-center">
                <span className="text-amber-400">{String(timeLeft.minutes).padStart(2, "0")}</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">Mins</span>
              </div>
              <span className="text-amber-400">:</span>
              <div className="flex flex-col items-center">
                <span className="text-amber-400">{String(timeLeft.seconds).padStart(2, "0")}</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">Secs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Controls & Familiarity Selector Panel */}
        <div className="rounded-3xl bg-white border-2 border-slate-200 p-6 sm:p-8 shadow-xl space-y-6">
          
          {/* CIA 1 (Semester 1) vs CIA 2 (Semester 2) Assessment Selection Toggle */}
          <div className="space-y-3 border-b border-slate-200 pb-5">
            <label className="text-xs font-extrabold text-[#021C4F] flex items-center gap-2 uppercase tracking-wider">
              <FiAward size={16} className="text-amber-500" /> Select CIA Exam &amp; Semester
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => {
                  setCiaMode("cia1");
                  toast.success("CIA 1 Selected (Semester 1 Subjects)");
                }}
                className={`p-4 rounded-2xl border-2 transition-all text-left cursor-pointer flex items-center justify-between ${
                  ciaMode === "cia1"
                    ? "bg-[#021C4F] border-amber-400 ring-2 ring-amber-400/40 text-white shadow-xl scale-[1.01]"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:border-amber-400/60"
                }`}
              >
                <div>
                  <h3 className={`text-sm font-extrabold ${ciaMode === "cia1" ? "text-white" : "text-[#021C4F]"}`}>CIA 1 Assessment</h3>
                  <p className={`text-xs font-bold mt-0.5 ${ciaMode === "cia1" ? "text-amber-300" : "text-[#0D9488]"}`}>Semester 1 Subjects ({yearSemesterMap["cia1"].length} Subjects)</p>
                </div>
                {ciaMode === "cia1" && <FiCheckCircle size={20} className="text-amber-400" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setCiaMode("cia2");
                  toast.success("CIA 2 Selected (Semester 2 Subjects)");
                }}
                className={`p-4 rounded-2xl border-2 transition-all text-left cursor-pointer flex items-center justify-between ${
                  ciaMode === "cia2"
                    ? "bg-[#021C4F] border-teal-400 ring-2 ring-teal-400/40 text-white shadow-xl scale-[1.01]"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:border-teal-400/60"
                }`}
              >
                <div>
                  <h3 className={`text-sm font-extrabold ${ciaMode === "cia2" ? "text-white" : "text-[#021C4F]"}`}>CIA 2 Assessment</h3>
                  <p className={`text-xs font-bold mt-0.5 ${ciaMode === "cia2" ? "text-teal-300" : "text-[#0D9488]"}`}>Semester 2 Subjects ({yearSemesterMap["cia2"].length} Subjects)</p>
                </div>
                {ciaMode === "cia2" && <FiCheckCircle size={20} className="text-teal-400" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Subject Selector (Populated dynamically with Sem 1 for CIA 1 or Sem 2 for CIA 2) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#021C4F] flex items-center gap-1.5">
                <FiBookOpen className="text-amber-500" /> Select Subject ({ciaMode === "cia1" ? "Semester 1" : "Semester 2"})
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-xs font-bold text-[#021C4F] outline-none focus:border-[#021C4F] cursor-pointer shadow-xs"
              >
                {activeSemesterSubjects.map((subName) => (
                  <option key={subName} value={subName}>
                    {subName}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Exam Date */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#021C4F] flex items-center gap-1.5">
                <FiCalendar className="text-amber-500" /> {ciaMode.toUpperCase()} Exam Date
              </label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-xs font-bold text-slate-800 outline-none focus:border-[#021C4F] cursor-pointer shadow-xs"
              />
            </div>
          </div>

          {/* Interactive Familiarity Buttons (🔥 Weak, ⚡ Moderate, ✅ Good) */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-extrabold text-[#021C4F] flex items-center gap-2 uppercase tracking-wider">
              <FiTarget className="text-amber-500" size={16} /> How familiar are you with {selectedSubject}?
            </label>
            <p className="text-xs text-[#475569]">
              Clicking any option below automatically fixes your optimal study clock times and custom question tasks:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              {/* Weak Button Card */}
              <button
                type="button"
                onClick={() => {
                  setFamiliarity("weak");
                  toast.success("AI Fixed 3 Deep Study Sessions (4.5 Hours/Day)");
                }}
                className={`p-4 rounded-2xl border-2 transition-all text-left flex flex-col justify-between cursor-pointer ${
                  familiarity === "weak"
                    ? "bg-rose-50 border-rose-500 ring-2 ring-rose-500/40 shadow-md scale-[1.02]"
                    : "bg-slate-50 border-slate-200 hover:border-rose-400"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base font-black text-rose-600 flex items-center gap-1.5">
                    🔥 WEAK
                  </span>
                  {familiarity === "weak" && (
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping" />
                  )}
                </div>
                <p className="text-xs text-slate-700 mt-2 leading-relaxed font-medium">
                  Struggling with concepts. Needs deep foundational definitions, step-by-step code, and 3 study sessions.
                </p>
                <div className="mt-3 bg-rose-100 text-rose-800 text-xs font-bold px-2.5 py-1 rounded-lg">
                  ⏰ Auto-Fixed: 06:00 AM, 05:30 PM &amp; 08:30 PM
                </div>
              </button>

              {/* Moderate Button Card */}
              <button
                type="button"
                onClick={() => {
                  setFamiliarity("moderate");
                  toast.success("AI Fixed 2 Balanced Study Sessions (2.5 Hours/Day)");
                }}
                className={`p-4 rounded-2xl border-2 transition-all text-left flex flex-col justify-between cursor-pointer ${
                  familiarity === "moderate"
                    ? "bg-amber-50 border-amber-500 ring-2 ring-amber-500/40 shadow-md scale-[1.02]"
                    : "bg-slate-50 border-slate-200 hover:border-amber-400"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base font-black text-amber-700 flex items-center gap-1.5">
                    ⚡ MODERATE
                  </span>
                  {familiarity === "moderate" && (
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-ping" />
                  )}
                </div>
                <p className="text-xs text-slate-700 mt-2 leading-relaxed font-medium">
                  Knows basic concepts. Needs past CIA question paper drills and code debugging practice.
                </p>
                <div className="mt-3 bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-lg">
                  ⏰ Auto-Fixed: 06:30 AM &amp; 06:00 PM
                </div>
              </button>

              {/* Good Button Card */}
              <button
                type="button"
                onClick={() => {
                  setFamiliarity("good");
                  toast.success("AI Fixed 1 High-Speed Power Session (1 Hour/Day)");
                }}
                className={`p-4 rounded-2xl border-2 transition-all text-left flex flex-col justify-between cursor-pointer ${
                  familiarity === "good"
                    ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/40 shadow-md scale-[1.02]"
                    : "bg-slate-50 border-slate-200 hover:border-emerald-400"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base font-black text-emerald-700 flex items-center gap-1.5">
                    ✅ GOOD / STRONG
                  </span>
                  {familiarity === "good" && (
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                  )}
                </div>
                <p className="text-xs text-slate-700 mt-2 leading-relaxed font-medium">
                  Confident in subject. Needs high-speed 10-Mark essay writing &amp; centum top-score revision.
                </p>
                <div className="mt-3 bg-emerald-100 text-emerald-900 text-xs font-bold px-2.5 py-1 rounded-lg">
                  ⏰ Auto-Fixed: 07:00 AM Power Hour
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Generated Plan & Score Progress Card */}
        {generatedPlan && (
          <div className="space-y-6">
            {/* Target Score Meter */}
            <div className="rounded-3xl bg-[#021C4F] border-2 border-[#0D9488]/40 p-6 text-white shadow-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">
                    🎓 AI Study Timetable ({generatedPlan.subject})
                  </span>
                  <h2 className="text-xl font-black text-white mt-0.5">
                    Familiarity Mode: <span className="uppercase text-amber-400">{generatedPlan.familiarity}</span> ({generatedPlan.ciaMode.toUpperCase()} Pass Target = 20/50 Marks)
                  </h2>
                </div>

                <div className={`px-4 py-2 rounded-2xl border-2 font-black text-sm flex items-center gap-2 shadow-lg ${
                  accumulatedMarks >= 20
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-400"
                    : "bg-amber-500/20 text-amber-300 border-amber-400"
                }`}>
                  {accumulatedMarks >= 20 ? (
                    <>
                      <FiCheckCircle size={18} className="text-emerald-400 animate-bounce" />
                      <span>🎉 PASS GUARANTEED ({accumulatedMarks}/50 Marks)</span>
                    </>
                  ) : (
                    <>
                      <FiAlertTriangle size={18} className="text-amber-400" />
                      <span>Earned: {accumulatedMarks} / 20 Marks Needed to Pass</span>
                    </>
                  )}
                </div>
              </div>

              {/* Progress Meter Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-teal-200 flex items-center gap-1.5">
                    <FiTrendingUp className="text-amber-400" /> Accumulated Revision Score
                  </span>
                  <span className="text-amber-300">
                    {accumulatedMarks} Marks Completed (Pass Threshold = 20 Marks)
                  </span>
                </div>
                <div className="h-3.5 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-white/20 relative">
                  <div className="absolute top-0 bottom-0 left-[40%] w-0.5 bg-amber-400 z-10" title="20 Marks Pass Threshold" />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, Math.round((accumulatedMarks / 50) * 100))}%` }}
                    transition={{ duration: 0.8 }}
                    className={`h-full rounded-full transition-all shadow-md ${
                      accumulatedMarks >= 20 ? "bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-400" : "bg-gradient-to-r from-rose-500 to-amber-400"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Daily Schedule Cards with Auto-Fixed Clock Times & Custom Tasks */}
            <div className="space-y-4">
              {generatedPlan.days.map((day) => (
                <div
                  key={day.dayNum}
                  className="rounded-3xl bg-white border-2 border-slate-200 p-5 space-y-4 shadow-md"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400 text-slate-950 font-black text-sm shadow-md">
                        Day {day.dayNum}
                      </span>
                      <div>
                        <span className="text-xs font-bold text-slate-500">
                          {day.dateStr}
                        </span>
                        <h3 className="text-sm font-extrabold text-[#021C4F]">
                          {generatedPlan.subject} — Auto-Fixed Clock Schedule
                        </h3>
                      </div>
                    </div>

                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border ${
                      generatedPlan.familiarity === "weak"
                        ? "bg-rose-100 text-rose-800 border-rose-300"
                        : generatedPlan.familiarity === "moderate"
                        ? "bg-amber-100 text-amber-900 border-amber-300"
                        : "bg-emerald-100 text-emerald-900 border-emerald-300"
                    }`}>
                      {generatedPlan.familiarity} Mode
                    </span>
                  </div>

                  {/* Tasks with Fixed Clock Times */}
                  <div className="space-y-3">
                    {day.tasks.map((task) => {
                      const checked = !!completedTasks[task.id];

                      return (
                        <div
                          key={task.id}
                          onClick={() => handleToggleTask(task.id)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                            checked
                              ? "bg-emerald-50 border-emerald-400 text-slate-900 font-bold"
                              : "bg-slate-50 border-slate-200 hover:border-[#021C4F]"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => {}}
                                className="h-4 w-4 rounded accent-emerald-500 cursor-pointer"
                              />
                              <span className="bg-[#021C4F] text-amber-300 px-3 py-1 rounded-lg text-xs font-black flex items-center gap-1.5 shadow-xs border border-amber-400/30">
                                <FiClock size={13} className="text-amber-400" /> {task.timeSlot}
                              </span>
                              <span className="bg-teal-100 text-[#0F766E] px-2.5 py-1 rounded-lg text-xs font-bold border border-teal-200">
                                {task.unit}
                              </span>
                            </div>

                            <span className="bg-amber-400 text-slate-950 px-2.5 py-1 rounded-lg text-xs font-extrabold shadow-sm">
                              +{task.marks} Marks Weightage
                            </span>
                          </div>

                          <div className="space-y-1.5 pl-6">
                            <p className={`text-xs sm:text-sm font-bold ${checked ? "line-through text-emerald-800" : "text-[#0F172A]"}`}>
                              {task.action}
                            </p>

                            {task.code && (
                              <div className="bg-[#021C4F] p-3 rounded-xl border border-[#021C4F] text-[11px] text-emerald-300 whitespace-pre-wrap font-mono shadow-xs">
                                <span className="text-[10px] text-teal-300 font-bold block mb-1">Target Topic &amp; Key Code/Diagram:</span>
                                {task.code}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
