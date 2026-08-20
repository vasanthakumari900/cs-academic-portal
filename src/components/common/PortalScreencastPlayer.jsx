// src/components/common/PortalScreencastPlayer.jsx
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlay,
  FiPause,
  FiVolume2,
  FiVolumeX,
  FiMaximize2,
  FiSkipForward,
  FiSkipBack,
  FiSearch,
  FiBookOpen,
  FiPlayCircle,
  FiBriefcase,
  FiUserCheck,
  FiShield,
  FiAward,
  FiFileText,
  FiCheckCircle,
  FiArrowRight,
  FiLayers,
  FiStar,
  FiMessageSquare,
  FiUser,
  FiCalendar,
} from "react-icons/fi";
import collegeLogo from "../../assets/college-logo.jpg";
import csPortalLogo from "../../assets/cs-portal-logo-transparent.png";

const SCREENCAST_SCENES = [
  {
    id: 1,
    title: "1. Login Page & Role Authentication",
    timestamp: "0:00",
    pageTitle: "Login Portal (Student / Faculty)",
    narration:
      "Welcome to the CS Academic Portal login screen. Students log in using their 7-digit Roll Number and Date of Birth. Faculty and Admins can log in using dedicated password credentials. Watch how demo credentials populate and verify instantly.",
    preview: {
      type: "login",
      roll: "24E3006",
      dob: "15/08/2004",
      status: "Verified Student: 3rd Year B.Sc. Computer Science",
    },
  },
  {
    id: 2,
    title: "2. Student Dashboard & Academic Stats",
    timestamp: "0:25",
    pageTitle: "Student Dashboard & Quick Access",
    narration:
      "Once logged in, the Student Dashboard presents key academic stats, bookmarked materials, recently viewed lecture notes, assignment deadlines, and an integrated CGPA score calculator.",
    preview: {
      type: "dashboard",
      stats: [
        { label: "Bookmarked Notes", val: "14 PDFs", icon: FiFileText, color: "text-amber-400" },
        { label: "E-Content Watched", val: "32 Hours", icon: FiPlayCircle, color: "text-rose-400" },
        { label: "Target CGPA", val: "9.10 SGPA", icon: FiAward, color: "text-emerald-400" },
        { label: "Active Drives", val: "6 Companies", icon: FiBriefcase, color: "text-cyan-400" },
      ],
    },
  },
  {
    id: 3,
    title: "3. E-Content Video Lectures",
    timestamp: "0:50",
    pageTitle: "Video Lectures & Subject Playlists",
    narration:
      "The E-Content page offers structured video lecture playlists for B.Sc. and M.Sc. Computer Science subjects, plus 14 official DGVC Department YouTube video series with full HD video players.",
    preview: {
      type: "econtent",
      subjects: [
        { name: "Python Programming Essentials", prof: "Dr. K. Angayarkanni", videos: "18 Lectures" },
        { name: "Data Structures & Algorithms", prof: "Prof. S. Sathishkumar", videos: "24 Lectures" },
        { name: "Operating System Concepts", prof: "Dr. R. Shankar", videos: "15 Lectures" },
        { name: "Web Application Dev (React/Node)", prof: "Prof. P. Karnan", videos: "20 Lectures" },
      ],
    },
  },
  {
    id: 4,
    title: "4. Semester Lecture Notes (PDF Hub)",
    timestamp: "1:15",
    pageTitle: "Lecture Notes & Unit-Wise PDFs",
    narration:
      "The Notes module categorizes all syllabus units into downloadable PDFs. Students can search, preview PDF page counts in real-time, and bookmark unit notes for quick offline revision.",
    preview: {
      type: "notes",
      files: [
        { title: "Data Structures Unit 1 — Linear Lists & Stacks.pdf", pages: "42 Pages", size: "2.4 MB" },
        { title: "Operating Systems Unit 3 — Process Management.pdf", pages: "38 Pages", size: "1.9 MB" },
        { title: "DBMS Unit 2 — SQL Queries & Normalization.pdf", pages: "54 Pages", size: "3.1 MB" },
      ],
    },
  },
  {
    id: 5,
    title: "5. Semester & CIA Question Papers",
    timestamp: "1:40",
    pageTitle: "CIA & End-Semester Question Papers",
    narration:
      "Access previous year semester question papers (2021–2025) and CIA continuous internal assessment test papers sorted by semester, regulation, and year with official answer keys.",
    preview: {
      type: "qpapers",
      papers: [
        { title: "2024 End-Sem Question Paper — Python Programming", year: "2024", reg: "Reg 2023" },
        { title: "CIA Test 1 Model Paper — Data Structures", year: "2025", reg: "Reg 2023" },
        { title: "2023 End-Sem Question Paper — Database Systems", year: "2023", reg: "Reg 2021" },
      ],
    },
  },
  {
    id: 6,
    title: "6. Placement Details & Campus Drives",
    timestamp: "2:05",
    pageTitle: "Placement Hub & Company Drives",
    narration:
      "The Placement Details hub displays upcoming campus recruitment drives, company eligibility criteria, CTC packages, application deadlines, and student interview experience reports.",
    preview: {
      type: "placements",
      drives: [
        { company: "TCS Ninja & Digital", ctc: "7.0 LPA", role: "Software Engineer", date: "Apply by Aug 28" },
        { company: "Zoho Corporation", ctc: "8.5 LPA", role: "Product Developer", date: "Apply by Sep 05" },
        { company: "Cognizant GenC Next", ctc: "6.7 LPA", role: "Full Stack Developer", date: "Apply by Sep 12" },
      ],
    },
  },
  {
    id: 7,
    title: "7. Groq RAG AI Chatbot Assistant",
    timestamp: "2:30",
    pageTitle: "24/7 Llama 3.3 AI Assistant",
    narration:
      "Mounted on every page, the Groq RAG AI Chatbot answers questions directly from your uploaded syllabus documents, generates study summaries, and helps students prepare for exams 24/7.",
    preview: {
      type: "ai",
      q: "Explain B-Trees vs Binary Search Trees from Unit 3 notes?",
      a: "B-Trees are self-balancing search trees designed for disk storage with multiple keys per node, whereas BSTs have at most two child nodes...",
    },
  },
];

export default function PortalScreencastPlayer({ onSelectDemoRole }) {
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const activeScene = SCREENCAST_SCENES[currentSceneIdx];

  // AI Voice Synthesis
  function speakNarration(text) {
    if (!("speechSynthesis" in window) || isMuted) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }

  function stopNarration() {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }

  // Handle scene playback progression
  useEffect(() => {
    let interval = null;
    if (isPlaying && !isCollapsed) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setCurrentSceneIdx((nextIdx) => {
              const next = (nextIdx + 1) % SCREENCAST_SCENES.length;
              speakNarration(SCREENCAST_SCENES[next].narration);
              return next;
            });
            return 0;
          }
          return prev + 3.3; // ~9s per scene
        });
      }, 300);
    } else {
      stopNarration();
    }
    return () => clearInterval(interval);
  }, [isPlaying, isMuted, isCollapsed]);

  // Initial narration on load
  useEffect(() => {
    if (isPlaying && !isMuted && !isCollapsed) {
      speakNarration(activeScene.narration);
    }
    return () => stopNarration();
  }, [currentSceneIdx, isCollapsed]);

  function jumpToScene(idx) {
    setCurrentSceneIdx(idx);
    setProgress(0);
    setIsPlaying(true);
    if (!isMuted) speakNarration(SCREENCAST_SCENES[idx].narration);
  }

  if (isCollapsed) {
    return (
      <div className="w-full mx-auto max-w-6xl mb-3 overflow-hidden rounded-2xl bg-[#090D16] border border-cyan-500/30 p-2.5 sm:px-4 text-white shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCollapsed(false)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C50337] to-[#7F011F] hover:from-rose-600 hover:to-rose-800 px-3.5 py-1.5 text-xs font-black text-white shadow-md transition-all active:scale-95 cursor-pointer font-heading"
            >
              <FiPlayCircle size={18} className="text-amber-300 animate-pulse" />
              <span>Watch Website Tour Video (2:50)</span>
            </button>
            <span className="hidden md:inline-block text-xs text-slate-300">
              Live recorded tour of all portal features
            </span>
          </div>

          {onSelectDemoRole && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-cyan-300 font-heading hidden sm:inline-block">Auto Fill:</span>
              <button
                onClick={() => onSelectDemoRole("student")}
                className="rounded-lg border border-emerald-500/40 bg-emerald-950/80 px-2.5 py-1 text-[11px] font-bold text-emerald-300 hover:bg-emerald-800 transition-all cursor-pointer font-heading"
              >
                🎓 Student Demo
              </button>
              <button
                onClick={() => onSelectDemoRole("faculty")}
                className="rounded-lg border border-rose-500/40 bg-rose-950/80 px-2.5 py-1 text-[11px] font-bold text-rose-300 hover:bg-rose-800 transition-all cursor-pointer font-heading"
              >
                👩‍🏫 Faculty Demo
              </button>
              <button
                onClick={() => setIsCollapsed(false)}
                className="rounded-lg border border-white/20 bg-white/10 hover:bg-white/20 px-2 py-1 text-[11px] font-bold text-white transition-all cursor-pointer"
                title="Expand Video Tour"
              >
                <FiMaximize2 size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto max-w-5xl mb-6 overflow-hidden rounded-3xl bg-[#090D16] border-2 border-amber-400/40 shadow-[0_4px_35px_rgba(74,22,32,0.6)] text-white text-left font-sans">
      {/* Screencast Player Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#140810] px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#C50337] to-[#7F011F] text-amber-300 shadow-md border border-amber-400/30">
            <FiPlayCircle size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-amber-400 text-slate-950 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest font-heading">
                ★ LIVE WEBSITE RECORDING TOUR
              </span>
              <span className="hidden sm:inline-block rounded-md bg-red-600/80 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider animate-pulse">
                REC 1080p
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-white font-heading mt-0.5">
              CS Academic Portal — Full Interactive Screencast Video
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCollapsed(true)}
            className="flex items-center gap-1 rounded-lg border border-white/20 bg-white/10 hover:bg-white/20 px-2.5 py-1 text-xs font-bold text-slate-200 transition-colors cursor-pointer"
            title="Minimize Video Bar"
          >
            Minimize Bar
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/15 text-white/80 transition-colors cursor-pointer"
            title={isFullscreen ? "Minimize Window" : "Full Screen Mode"}
          >
            <FiMaximize2 size={14} />
          </button>
        </div>
      </div>

      {/* Main Video Screen Frame */}
      <div className={`relative overflow-hidden bg-gradient-to-b from-[#090D16] via-[#111827] to-[#0F172A] p-4 sm:p-6 transition-all duration-300 ${isFullscreen ? "min-h-[480px]" : "min-h-[380px]"}`}>
        
        {/* Animated Mouse Cursor Simulation */}
        <motion.div
          animate={{
            x: [30, 180, 260, 90, 30],
            y: [40, 120, 90, 190, 40],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute z-30 flex items-center gap-1 text-amber-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
        >
          <div className="h-4 w-4 rounded-full bg-amber-400/80 border-2 border-white shadow-lg animate-ping" />
          <span className="rounded bg-black/80 px-1.5 py-0.5 text-[9px] font-bold text-white border border-amber-400/40">
            User Click
          </span>
        </motion.div>

        {/* Video Canvas Top Status Bar */}
        <div className="relative z-10 mb-4 flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <img src={csPortalLogo} alt="DDGDVC CS" className="h-8 w-auto rounded-lg bg-white/90 p-1 shadow" />
            <div>
              <span className="text-xs font-bold text-amber-300 font-heading block">
                {activeScene.pageTitle}
              </span>
              <span className="text-[10px] text-slate-400">
                http://localhost:5173 — {activeScene.timestamp}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono text-xs text-emerald-300 font-bold">
              SCENE {currentSceneIdx + 1} OF {SCREENCAST_SCENES.length}
            </span>
          </div>
        </div>

        {/* Real Dynamic Page Screencast Preview Display */}
        <div className="relative z-10 my-2 min-h-[220px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeScene.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl border border-cyan-500/30 bg-[#1E293B]/90 p-5 shadow-2xl backdrop-blur-xl"
            >
              {/* Scene 1: Login */}
              {activeScene.preview.type === "login" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <div className="flex items-center gap-2">
                      <img src={collegeLogo} alt="Logo" className="h-8 w-auto rounded-lg bg-white p-0.5" />
                      <span className="text-sm font-bold text-white font-heading">CS Academic Portal Login</span>
                    </div>
                    <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                      {activeScene.preview.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="rounded-xl bg-[#0F172A] p-3 border border-slate-700">
                      <span className="text-[10px] uppercase font-bold text-cyan-400 block mb-1">Roll Number</span>
                      <span className="font-mono text-sm font-bold text-white">{activeScene.preview.roll}</span>
                    </div>
                    <div className="rounded-xl bg-[#0F172A] p-3 border border-slate-700">
                      <span className="text-[10px] uppercase font-bold text-cyan-400 block mb-1">Date of Birth</span>
                      <span className="font-mono text-sm font-bold text-white">{activeScene.preview.dob}</span>
                    </div>
                  </div>

                  <div className="rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#0891B2] p-2.5 text-center font-bold text-xs text-slate-950 font-heading shadow-lg">
                    ✔ Authenticated & Redirecting to Student Dashboard…
                  </div>
                </div>
              )}

              {/* Scene 2: Dashboard */}
              {activeScene.preview.type === "dashboard" && (
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-sm font-extrabold text-white font-heading">Student Overview Dashboard</h4>
                    <span className="text-xs text-amber-300 font-bold">Welcome back, Mega Nathan 👋</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {activeScene.preview.stats.map((st, idx) => (
                      <div key={idx} className="rounded-xl bg-[#0F172A] p-3 border border-slate-700">
                        <st.icon className={`${st.color} mb-1`} size={18} />
                        <div className="text-[10px] uppercase font-bold text-slate-400">{st.label}</div>
                        <div className="font-mono text-sm font-bold text-white mt-0.5">{st.val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Scene 3: E-Content */}
              {activeScene.preview.type === "econtent" && (
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-sm font-extrabold text-white font-heading flex items-center gap-1.5">
                      <FiPlayCircle className="text-rose-400" /> Video Lectures & E-Content
                    </h4>
                    <span className="rounded bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-300 border border-rose-500/30">
                      14 Official DGVC YouTube Videos
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeScene.preview.subjects.map((sub, idx) => (
                      <div key={idx} className="rounded-xl bg-[#0F172A] p-3 border border-slate-700 flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-white truncate max-w-[200px]">{sub.name}</div>
                          <div className="text-[10px] text-slate-400">{sub.prof}</div>
                        </div>
                        <span className="rounded bg-amber-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-300 shrink-0">
                          {sub.videos}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Scene 4: Notes */}
              {activeScene.preview.type === "notes" && (
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-sm font-extrabold text-white font-heading flex items-center gap-1.5">
                      <FiFileText className="text-amber-400" /> Lecture Notes PDF Repository
                    </h4>
                    <span className="text-xs text-slate-300 font-bold">Real-time PDF Page Counter</span>
                  </div>

                  <div className="space-y-2">
                    {activeScene.preview.files.map((file, idx) => (
                      <div key={idx} className="rounded-xl bg-[#0F172A] p-3 border border-slate-700 flex items-center justify-between text-xs">
                        <span className="font-semibold text-white truncate mr-2">{file.title}</span>
                        <div className="flex items-center gap-2 shrink-0 font-mono text-[10px]">
                          <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-cyan-300 font-bold">{file.pages}</span>
                          <span className="text-slate-400">{file.size}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Scene 5: Question Papers */}
              {activeScene.preview.type === "qpapers" && (
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-sm font-extrabold text-white font-heading flex items-center gap-1.5">
                      <FiAward className="text-emerald-400" /> Question Papers & CIA Materials
                    </h4>
                    <span className="text-xs text-emerald-300 font-bold">2021 – 2025 Archives</span>
                  </div>

                  <div className="space-y-2">
                    {activeScene.preview.papers.map((paper, idx) => (
                      <div key={idx} className="rounded-xl bg-[#0F172A] p-3 border border-slate-700 flex items-center justify-between text-xs">
                        <span className="font-semibold text-white truncate mr-2">{paper.title}</span>
                        <div className="flex items-center gap-2 shrink-0 font-mono text-[10px]">
                          <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-emerald-300 font-bold">{paper.year}</span>
                          <span className="rounded bg-amber-500/20 px-2 py-0.5 text-amber-300 font-bold">{paper.reg}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Scene 6: Placements */}
              {activeScene.preview.type === "placements" && (
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-sm font-extrabold text-white font-heading flex items-center gap-1.5">
                      <FiBriefcase className="text-cyan-400" /> Placement Details & Campus Drives
                    </h4>
                    <span className="text-xs text-cyan-300 font-bold">6 Active Drives</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {activeScene.preview.drives.map((drv, idx) => (
                      <div key={idx} className="rounded-xl bg-[#0F172A] p-3 border border-slate-700">
                        <div className="text-xs font-bold text-white">{drv.company}</div>
                        <div className="text-[10px] text-amber-300 font-mono font-bold mt-0.5">CTC: {drv.ctc}</div>
                        <div className="text-[10px] text-slate-400 mt-1">{drv.role}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Scene 7: AI Chatbot */}
              {activeScene.preview.type === "ai" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5 font-heading">
                      <FiMessageSquare className="text-cyan-400" /> Groq Llama 3.3 RAG AI Assistant
                    </span>
                    <span className="text-[10px] text-cyan-300 font-mono font-bold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                      Syllabus Grounded Q&A
                    </span>
                  </div>

                  <div className="rounded-xl bg-[#0F172A] p-3 border border-slate-700 text-xs">
                    <div className="font-bold text-amber-300 mb-1">Q: {activeScene.preview.q}</div>
                    <div className="text-slate-200 leading-relaxed text-[11px]">A: {activeScene.preview.a}</div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Live Audio Narration Caption Strip */}
        <div className="relative z-10 mt-4 rounded-xl bg-black/80 border border-white/10 p-3 text-center backdrop-blur-md">
          <p className="text-xs font-medium text-amber-200 flex items-center justify-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping shrink-0" />
            "{activeScene.narration}"
          </p>
        </div>
      </div>

      {/* Progress Scrubber Bar */}
      <div className="relative h-1.5 w-full bg-white/10 cursor-pointer" onClick={() => setProgress(0)}>
        <div
          className="h-full bg-gradient-to-r from-cyan-400 via-amber-400 to-rose-500 transition-all duration-300"
          style={{ width: `${((currentSceneIdx * (100 / SCREENCAST_SCENES.length)) + (progress * (1 / SCREENCAST_SCENES.length)))}%` }}
        />
      </div>

      {/* Player Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#140810] px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-[#06B6D4] to-[#0891B2] hover:from-[#22D3EE] hover:to-[#06B6D4] text-slate-950 shadow-md transition-all active:scale-95 cursor-pointer font-bold"
            title={isPlaying ? "Pause Video" : "Play Video"}
          >
            {isPlaying ? <FiPause size={18} /> : <FiPlay size={18} className="ml-0.5" />}
          </button>

          <button
            onClick={() => jumpToScene(currentSceneIdx === 0 ? SCREENCAST_SCENES.length - 1 : currentSceneIdx - 1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/15 text-white/80 transition-colors cursor-pointer"
            title="Previous Scene"
          >
            <FiSkipBack size={14} />
          </button>

          <button
            onClick={() => jumpToScene((currentSceneIdx + 1) % SCREENCAST_SCENES.length)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/15 text-white/80 transition-colors cursor-pointer"
            title="Next Scene"
          >
            <FiSkipForward size={14} />
          </button>

          <button
            onClick={() => {
              setIsMuted(!isMuted);
              if (!isMuted) stopNarration();
              else speakNarration(activeScene.narration);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/15 text-white/80 transition-colors cursor-pointer"
            title={isMuted ? "Unmute Voice" : "Mute Voice"}
          >
            {isMuted ? <FiVolumeX size={14} /> : <FiVolume2 size={14} />}
          </button>

          <span className="font-mono text-xs text-white/70">
            {activeScene.timestamp} / 2:50
          </span>
        </div>

        {/* Demo Login Buttons */}
        {onSelectDemoRole && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-amber-200 font-heading">Auto Fill Demo:</span>
            <button
              onClick={() => onSelectDemoRole("student")}
              className="rounded-lg border border-emerald-500/40 bg-emerald-950/80 px-2.5 py-1 text-[11px] font-bold text-emerald-300 hover:bg-emerald-800 transition-all cursor-pointer font-heading"
            >
              🎓 Student Demo
            </button>
            <button
              onClick={() => onSelectDemoRole("faculty")}
              className="rounded-lg border border-rose-500/40 bg-rose-950/80 px-2.5 py-1 text-[11px] font-bold text-rose-300 hover:bg-rose-800 transition-all cursor-pointer font-heading"
            >
              👩‍🏫 Faculty Demo
            </button>
            <button
              onClick={() => onSelectDemoRole("admin")}
              className="rounded-lg border border-cyan-500/40 bg-cyan-950/80 px-2.5 py-1 text-[11px] font-bold text-cyan-300 hover:bg-cyan-800 transition-all cursor-pointer font-heading"
            >
              ⚡ Admin Demo
            </button>
          </div>
        )}
      </div>

      {/* Bottom Scene Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1 border-t border-white/10 bg-[#060308] p-2">
        {SCREENCAST_SCENES.map((sc, idx) => {
          const isActive = idx === currentSceneIdx;
          return (
            <button
              key={sc.id}
              onClick={() => jumpToScene(idx)}
              className={`rounded-lg px-2 py-1.5 text-left transition-all cursor-pointer ${
                isActive
                  ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 font-bold"
                  : "bg-white/5 hover:bg-white/10 text-white/60 text-[10px]"
              }`}
            >
              <div className="text-[10px] font-bold truncate font-heading">{sc.title}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
