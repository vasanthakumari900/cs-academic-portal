// src/components/common/WebsiteTourVideo.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlay,
  FiPause,
  FiVolume2,
  FiVolumeX,
  FiMaximize2,
  FiSkipForward,
  FiSkipBack,
  FiCheckCircle,
  FiSearch,
  FiBookOpen,
  FiPlayCircle,
  FiBriefcase,
  FiUserCheck,
  FiShield,
  FiMessageSquare,
  FiAward,
  FiTv,
  FiZap,
} from "react-icons/fi";

const CHAPTERS = [
  {
    id: 1,
    title: "1. Public Hub & Global Search",
    timestamp: "0:00",
    duration: 35,
    tag: "Public Access",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    icon: FiSearch,
    headline: "Browse Notes, E-Content, Question Papers & Search Instantly",
    subtitle:
      "Anyone can explore semester lecture notes, video lectures, CIA papers, and placement drives with global search.",
    mockup: {
      type: "search",
      items: [
        { title: "Data Structures & Algorithms (Unit 3 Notes)", type: "PDF Note", rating: "4.9 ★" },
        { title: "Operating Systems — Process Scheduling Video", type: "E-Content", rating: "4.8 ★" },
        { title: "2024 End-Sem Question Paper (DBMS)", type: "Q-Paper", rating: "5.0 ★" },
        { title: "TCS Ninja & Digital Campus Drive 2026", type: "Placement", rating: "4.9 ★" },
      ],
    },
    captions: [
      "Welcome to the CS Academic Portal tour! Explore all learning resources without barriers.",
      "Use Global Search (Ctrl + K) to search across notes, video lectures, and placement drives instantly.",
    ],
  },
  {
    id: 2,
    title: "2. Student Learning & CGPA Tools",
    timestamp: "0:35",
    duration: 40,
    tag: "Student Role",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    icon: FiBookOpen,
    headline: "Personalized Student Dashboard, Bookmarks & CGPA Calculator",
    subtitle:
      "Log in with your Roll Number & Date of Birth to access your personal dashboard, saved notes, and grade predictor.",
    mockup: {
      type: "student",
      stats: [
        { label: "Bookmarked Notes", val: "12 PDFs" },
        { label: "Videos Watched", val: "28 Hours" },
        { label: "Estimated CGPA", val: "8.95 SGPA" },
        { label: "Assignments Due", val: "2 Pending" },
      ],
    },
    captions: [
      "Students login easily using Roll Number and Date of Birth.",
      "Access your bookmarks, recently viewed files, assignment submission portal, and CGPA calculator in one place.",
    ],
  },
  {
    id: 3,
    title: "3. Faculty Upload Suite",
    timestamp: "1:15",
    duration: 35,
    tag: "Faculty Role",
    badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    icon: FiUserCheck,
    headline: "Fast Floating Upload FAB & Content Management",
    subtitle:
      "Faculty members can upload video lectures, lecture PDF notes, CIA test question papers, and assign student tasks.",
    mockup: {
      type: "faculty",
      actions: [
        { name: "Upload Video Lecture", desc: "MP4 / YouTube Embed with auto thumbnail" },
        { name: "Upload Lecture Notes PDF", desc: "Auto page-count preview & OCR parsing" },
        { name: "Publish CIA Question Paper", desc: "Tagged by Semester, Regulation & Year" },
      ],
    },
    captions: [
      "Faculty can use the quick Floating Action Button (FAB) from any page to upload study materials.",
      "Track upload views, manage student assignment submissions, and publish model answer keys effortlessly.",
    ],
  },
  {
    id: 4,
    title: "4. Admin Control & AI Assistant",
    timestamp: "1:50",
    duration: 40,
    tag: "Admin & AI",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    icon: FiShield,
    headline: "Role Management, Department Analytics & Llama 3.3 AI Assistant",
    subtitle:
      "Admins manage users, monitor analytics, and every user can ask the built-in AI Chatbot for syllabus answers.",
    mockup: {
      type: "admin",
      features: [
        { name: "Role Control", text: "Promote Students to Faculty, assign Admin badges" },
        { name: "Department Analytics", text: "Track monthly downloads, top notes, and video views" },
        { name: "Groq RAG AI Chatbot", text: "Instant Q&A over uploaded syllabus PDFs and documents" },
      ],
    },
    captions: [
      "Admins have complete control over student/faculty roles, CIA timetables, and placement feeds.",
      "The integrated Groq AI Assistant gives instant answers, syllabus summaries, and document Q&A 24/7!",
    ],
  },
];

export default function WebsiteTourVideo({ onSelectDemoRole }) {
  const [currentChapterIdx, setCurrentChapterIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);

  const activeChapter = CHAPTERS[currentChapterIdx];

  // Auto playback timer
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setCurrentChapterIdx((nextIdx) => (nextIdx + 1) % CHAPTERS.length);
            return 0;
          }
          return prev + 2.5;
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  function handleNextChapter() {
    setCurrentChapterIdx((prev) => (prev + 1) % CHAPTERS.length);
    setProgress(0);
  }

  function handlePrevChapter() {
    setCurrentChapterIdx((prev) => (prev === 0 ? CHAPTERS.length - 1 : prev - 1));
    setProgress(0);
  }

  function selectChapter(index) {
    setCurrentChapterIdx(index);
    setProgress(0);
    setIsPlaying(true);
  }

  return (
    <div className="w-full mx-auto max-w-5xl mb-8 overflow-hidden rounded-2xl border border-amber-500/30 bg-[#0F060B] shadow-[0_4px_30px_rgba(74,22,32,0.4)] text-white">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#190B13] px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-md">
            <FiTv size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-amber-200 font-heading tracking-wide flex items-center gap-2">
              Website Interactive Video Tour
              <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-bold text-red-400 border border-red-500/30 animate-pulse">
                ● DEMO VIDEO
              </span>
            </h3>
            <p className="text-[11px] text-white/60">
              Watch how Students, Faculty & Admins use the CS Academic Portal
            </p>
          </div>
        </div>

        {/* Top Controls */}
        <div className="flex items-center gap-2">
          <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${activeChapter.badgeColor}`}>
            {activeChapter.tag}
          </span>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/15 text-white/80 transition-colors"
            title={isFullscreen ? "Exit Expanded View" : "Expand Video Player"}
          >
            <FiMaximize2 size={14} />
          </button>
        </div>
      </div>

      {/* Main Video Viewport Screen */}
      <div className={`relative overflow-hidden bg-gradient-to-b from-[#190B13] via-[#0F060B] to-[#140810] p-4 sm:p-6 transition-all duration-300 ${isFullscreen ? "min-h-[420px]" : "min-h-[320px]"}`}>
        {/* Animated Background Grid & Orbs */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-500/10 blur-[90px]" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-rose-500/10 blur-[90px]" />

        {/* Video Frame Overlay Header */}
        <div className="relative z-10 mb-4 flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono text-xs font-semibold text-white/90">
              {activeChapter.title}
            </span>
          </div>
          <span className="font-mono text-[11px] text-amber-300/80 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/20">
            HD 1080p · 60fps
          </span>
        </div>

        {/* Dynamic Chapter Mockup Display */}
        <div className="relative z-10 my-2 min-h-[160px] sm:min-h-[180px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeChapter.id}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.35 }}
              className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md"
            >
              <div className="mb-3 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#61182A] to-[#4A1620] text-amber-300 shadow-lg border border-amber-500/30">
                  <activeChapter.icon size={20} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-amber-200 font-heading">
                    {activeChapter.headline}
                  </h4>
                  <p className="mt-0.5 text-xs text-white/80 leading-relaxed">
                    {activeChapter.subtitle}
                  </p>
                </div>
              </div>

              {/* Mockup Items Grid */}
              {activeChapter.mockup.type === "search" && (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 mt-3">
                  {activeChapter.mockup.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs">
                      <span className="font-semibold text-white/90 truncate mr-2">{item.title}</span>
                      <span className="shrink-0 rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-300">{item.type}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeChapter.mockup.type === "student" && (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 mt-3">
                  {activeChapter.mockup.stats.map((st, idx) => (
                    <div key={idx} className="rounded-lg border border-emerald-500/20 bg-emerald-950/30 p-2.5 text-center">
                      <div className="text-[10px] uppercase font-bold text-emerald-300/80">{st.label}</div>
                      <div className="mt-1 font-mono text-sm font-bold text-emerald-200">{st.val}</div>
                    </div>
                  ))}
                </div>
              )}

              {activeChapter.mockup.type === "faculty" && (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 mt-3">
                  {activeChapter.mockup.actions.map((act, idx) => (
                    <div key={idx} className="rounded-lg border border-rose-500/20 bg-rose-950/30 p-2.5">
                      <div className="text-xs font-bold text-rose-200">{act.name}</div>
                      <div className="mt-0.5 text-[11px] text-white/70">{act.desc}</div>
                    </div>
                  ))}
                </div>
              )}

              {activeChapter.mockup.type === "admin" && (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 mt-3">
                  {activeChapter.mockup.features.map((feat, idx) => (
                    <div key={idx} className="rounded-lg border border-cyan-500/20 bg-cyan-950/30 p-2.5">
                      <div className="text-xs font-bold text-cyan-200">{feat.name}</div>
                      <div className="mt-0.5 text-[11px] text-white/70">{feat.text}</div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Video Subtitle / Caption Overlay */}
        <div className="relative z-10 mt-3 rounded-lg bg-black/60 border border-white/10 p-2.5 text-center backdrop-blur-md">
          <p className="text-xs font-medium text-amber-100 flex items-center justify-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping shrink-0" />
            "{activeChapter.captions[progress > 50 ? 1 : 0]}"
          </p>
        </div>
      </div>

      {/* Video Scrubber & Progress Bar */}
      <div className="relative h-1.5 w-full bg-white/10 cursor-pointer" onClick={() => setProgress(0)}>
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-rose-500 transition-all duration-300"
          style={{ width: `${((currentChapterIdx * 25) + (progress * 0.25))}%` }}
        />
      </div>

      {/* Video Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#140810] px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-b from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-white shadow-md transition-all active:scale-95 cursor-pointer"
            title={isPlaying ? "Pause Video" : "Play Video"}
          >
            {isPlaying ? <FiPause size={18} /> : <FiPlay size={18} className="ml-0.5" />}
          </button>

          <button
            onClick={handlePrevChapter}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/15 text-white/80 transition-colors cursor-pointer"
            title="Previous Chapter"
          >
            <FiSkipBack size={14} />
          </button>

          <button
            onClick={handleNextChapter}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/15 text-white/80 transition-colors cursor-pointer"
            title="Next Chapter"
          >
            <FiSkipForward size={14} />
          </button>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 hover:bg-white/15 text-white/80 transition-colors cursor-pointer"
            title={isMuted ? "Unmute" : "Mute Sound"}
          >
            {isMuted ? <FiVolumeX size={14} /> : <FiVolume2 size={14} />}
          </button>

          <span className="font-mono text-xs text-white/70">
            {activeChapter.timestamp} / 2:30
          </span>
        </div>

        {/* Quick Demo Role Selector Buttons */}
        {onSelectDemoRole && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-amber-200/90 font-heading">
              Instant Demo Fill:
            </span>
            <button
              onClick={() => onSelectDemoRole("student")}
              className="rounded-lg border border-emerald-500/40 bg-emerald-950/60 px-2.5 py-1 text-[11px] font-bold text-emerald-300 hover:bg-emerald-800/80 transition-all cursor-pointer"
            >
              🎓 Student Demo
            </button>
            <button
              onClick={() => onSelectDemoRole("faculty")}
              className="rounded-lg border border-rose-500/40 bg-rose-950/60 px-2.5 py-1 text-[11px] font-bold text-rose-300 hover:bg-rose-800/80 transition-all cursor-pointer"
            >
              👩‍🏫 Faculty Demo
            </button>
            <button
              onClick={() => onSelectDemoRole("admin")}
              className="rounded-lg border border-cyan-500/40 bg-cyan-950/60 px-2.5 py-1 text-[11px] font-bold text-cyan-300 hover:bg-cyan-800/80 transition-all cursor-pointer"
            >
              ⚡ Admin Demo
            </button>
          </div>
        )}
      </div>

      {/* Chapter Nav Tabs */}
      <div className="grid grid-cols-2 gap-1 border-t border-white/10 bg-[#0A0307] p-2 sm:grid-cols-4">
        {CHAPTERS.map((ch, idx) => {
          const isActive = idx === currentChapterIdx;
          return (
            <button
              key={ch.id}
              onClick={() => selectChapter(idx)}
              className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-left transition-all cursor-pointer ${
                isActive
                  ? "bg-amber-500/20 border border-amber-500/40 text-amber-200 font-bold"
                  : "bg-white/5 hover:bg-white/10 text-white/60 text-xs"
              }`}
            >
              <ch.icon size={14} className={isActive ? "text-amber-400" : "text-white/40"} />
              <span className="text-[11px] truncate font-heading">{ch.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
