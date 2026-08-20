// src/components/common/RealWebsiteTourVideo.jsx
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlayCircle,
  FiPause,
  FiPlay,
  FiVolume2,
  FiVolumeX,
  FiMaximize2,
  FiX,
  FiYoutube,
  FiCheckCircle,
  FiStar,
  FiSearch,
  FiBookOpen,
  FiUserCheck,
  FiShield,
  FiAward,
} from "react-icons/fi";
import watchVideoBtnImg from "../../assets/watch-video-btn.png";
import csPortalLogo from "../../assets/cs-portal-logo-transparent.png";

// Real Web Development & CS Portal Overview Video Playlist (YouTube & HTML5 Video fallbacks)
const TOUR_VIDEOS = [
  {
    id: "tour-v1",
    title: "CS Academic Portal — Full Website Tour & Feature Guide",
    subtitle: "Complete walkthrough of Student, Faculty, and Admin portals",
    youtubeId: "LAUi8pPlcUM", // Real CS & Web Dev Portal Video Stream
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    poster: watchVideoBtnImg,
    badge: "Official Portal Guide 2026",
    duration: "2:45",
    chapters: [
      { time: "0:00", name: "1. Global Search & Public Hub", desc: "Notes, E-Content, Q-Papers & Placement drives" },
      { time: "0:45", name: "2. Student Dashboard & Tools", desc: "Bookmarks, Recently Viewed & CGPA Calculator" },
      { time: "1:30", name: "3. Faculty Upload Suite", desc: "Quick Upload FAB, Video Lessons & CIA Papers" },
      { time: "2:15", name: "4. Admin Center & RAG AI", desc: "User Roles, Analytics & Groq Llama 3.3 AI Bot" },
    ],
  },
];

export default function RealWebsiteTourVideo({ onSelectDemoRole }) {
  const [isPlayingModal, setIsPlayingModal] = useState(false);
  const [isPlayingInline, setIsPlayingInline] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeChapter, setActiveChapter] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const videoRef = useRef(null);
  const currentVideo = TOUR_VIDEOS[0];

  // AI Voice Narration setup
  function speakNarration(text) {
    if (!("speechSynthesis" in window)) return;
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

  function handlePlayVideo() {
    setIsPlayingInline(true);
    const narrationText =
      "Welcome to the CS Academic Portal of Dwaraka Doss Goverdhan Doss Vaishnav College. In this video, discover how students access lecture notes and video lessons, faculty upload question papers, and admins manage department analytics with our built-in Groq AI Assistant.";
    speakNarration(narrationText);
  }

  function handleStopVideo() {
    setIsPlayingInline(false);
    stopNarration();
  }

  useEffect(() => {
    return () => stopNarration();
  }, []);

  return (
    <div className="w-full mx-auto max-w-5xl mb-8 overflow-hidden rounded-3xl bg-gradient-to-b from-[#0F172A] via-[#1E1015] to-[#0F060B] border-2 border-amber-400/40 shadow-[0_4px_30px_rgba(74,22,32,0.5)] text-white text-left">
      {/* Top Banner Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#1A0812] px-5 py-3.5 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#C50337] to-[#7F011F] text-amber-300 shadow-md border border-amber-400/30">
            <FiYoutube size={22} />
          </div>
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400 text-slate-950 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest font-heading">
              ★ Official Website Tour Video
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-white font-heading leading-tight mt-0.5">
              How CS Academic Portal Works &amp; Features Guide
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-red-600/80 px-2.5 py-1 text-[11px] font-black text-white uppercase tracking-wider shadow-sm flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-white animate-ping" />
            REAL VIDEO
          </span>
        </div>
      </div>

      {/* Video Display Container */}
      <div className="relative p-4 sm:p-6">
        {isPlayingInline ? (
          /* Active Embedded Video Stream Frame */
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border-2 border-amber-400/40 bg-black shadow-2xl">
            <iframe
              src={`https://www.youtube.com/embed/${currentVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
              title={currentVideo.title}
              className="absolute inset-0 h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            {/* Inline Stop Controls */}
            <div className="absolute top-3 right-3 z-20">
              <button
                onClick={handleStopVideo}
                className="flex items-center gap-1.5 rounded-xl bg-black/80 hover:bg-black px-3 py-1.5 text-xs font-bold text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer"
              >
                <FiX size={16} /> Close Video Stream
              </button>
            </div>
          </div>
        ) : (
          /* Video Thumbnail Banner (Matching DGVC E-Content Card style) */
          <div
            onClick={handlePlayVideo}
            className="group relative aspect-video w-full overflow-hidden rounded-2xl border-2 border-amber-400/30 bg-slate-950 cursor-pointer shadow-2xl"
          >
            {/* Poster Background image */}
            <img
              src={`https://img.youtube.com/vi/${currentVideo.youtubeId}/hqdefault.jpg`}
              alt={currentVideo.title}
              className="absolute inset-0 h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F060B] via-black/40 to-black/20 group-hover:bg-black/30 transition-colors" />

            {/* Center Pulsing Play Button */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
              <motion.div
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-gradient-to-tr from-[#C50337] via-[#A0022B] to-[#7F011F] text-white shadow-[0_0_40px_rgba(197,3,55,0.6)] border-4 border-amber-400 group-hover:border-white transition-all"
              >
                <FiPlayCircle size={48} className="ml-1 text-amber-300 drop-shadow-lg" />
              </motion.div>
              <span className="mt-4 rounded-full bg-amber-400 px-4 py-1 text-xs font-black text-slate-950 uppercase tracking-widest shadow-lg">
                ▶ Click to Play Full Video Tour
              </span>
              <p className="mt-2 text-xs font-semibold text-slate-200 drop-shadow-md">
                Includes AI Voice Narration &amp; Feature Highlights
              </p>
            </div>

            {/* Top Left Badge */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <img src={csPortalLogo} alt="CS Portal" className="h-9 w-auto rounded-lg bg-white/90 p-1 shadow-md" />
              <span className="rounded-lg bg-[#021C4F] px-3 py-1 text-xs font-black text-amber-300 border border-white/20 shadow-md">
                {currentVideo.badge}
              </span>
            </div>

            {/* Bottom Right Duration */}
            <div className="absolute bottom-4 right-4 rounded-md bg-black/80 px-2.5 py-1 font-mono text-xs font-bold text-amber-300 border border-white/10">
              ⏱ {currentVideo.duration}
            </div>
          </div>
        )}

        {/* AI Voice Narration Indicator Bar */}
        {isSpeaking && (
          <div className="mt-3 flex items-center justify-between rounded-xl bg-amber-500/10 border border-amber-500/30 p-3 backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-ping" />
              <span>🔊 AI Voice Narrator Active — Explaining Portal Features</span>
            </div>
            <button
              onClick={stopNarration}
              className="text-[11px] font-bold text-amber-200 underline hover:text-white cursor-pointer"
            >
              Mute Voice
            </button>
          </div>
        )}

        {/* Feature Chapters Grid */}
        <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {currentVideo.chapters.map((ch, idx) => (
            <div
              key={idx}
              onClick={() => {
                setActiveChapter(idx);
                handlePlayVideo();
              }}
              className="group rounded-xl border border-white/10 bg-white/5 p-3 hover:bg-white/15 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                <span>{ch.name}</span>
                <span className="font-mono text-[10px] text-white/50">{ch.time}</span>
              </div>
              <p className="mt-1 text-[11px] text-white/70 leading-relaxed group-hover:text-white">
                {ch.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Quick 1-Click Demo Login Selector Bar */}
        {onSelectDemoRole && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#1A0812] p-3.5 sm:px-5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-extrabold text-amber-200 font-heading">
                Try Website Demo Credentials:
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => onSelectDemoRole("student")}
                className="rounded-xl border border-emerald-500/40 bg-emerald-950/80 px-3.5 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-800 transition-all cursor-pointer font-heading shadow-sm"
              >
                🎓 Student Portal Demo
              </button>
              <button
                onClick={() => onSelectDemoRole("faculty")}
                className="rounded-xl border border-rose-500/40 bg-rose-950/80 px-3.5 py-1.5 text-xs font-bold text-rose-300 hover:bg-rose-800 transition-all cursor-pointer font-heading shadow-sm"
              >
                👩‍🏫 Faculty Portal Demo
              </button>
              <button
                onClick={() => onSelectDemoRole("admin")}
                className="rounded-xl border border-cyan-500/40 bg-cyan-950/80 px-3.5 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-800 transition-all cursor-pointer font-heading shadow-sm"
              >
                ⚡ Admin Dashboard Demo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
