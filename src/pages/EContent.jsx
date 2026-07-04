// src/pages/EContent.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMonitor, FiUploadCloud, FiPlay, FiEye, FiHeart, FiCalendar, FiClock, FiUser, FiFilm, FiX, FiYoutube } from "react-icons/fi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const subjects = ["DBMS", "OPERATING SYSTEM", "ASP.NET", "DMT"];

const subjectColors = {
  "DBMS": { bg: "from-blue-600 to-blue-800", badge: "bg-blue-50 text-blue-700" },
  "OPERATING SYSTEM": { bg: "from-blue-700 to-blue-900", badge: "bg-blue-50 text-blue-700" },
  "ASP.NET": { bg: "from-cyan-500 to-blue-600", badge: "bg-cyan-50 text-cyan-600" },
  "DMT": { bg: "from-blue-500 to-cyan-500", badge: "bg-blue-50 text-blue-700" },
};

// Real educational YouTube video IDs from verified channels
const youtubeVideos = {
  "DBMS": [
    "kBdlM6hNDAE", // Gate Smashers - DBMS Syllabus
    "3EJlovevfcA", // Gate Smashers - Introduction to DBMS
    "OMwgGL3lHlI", // Neso Academy - Intro to DBMS
    "08vIyac4_RY", // Neso Academy - Three Schema Architecture
    "T7AxM7Vqvaw", // Jenny's Lectures - Introduction to DBMS
    "dR-jJimWWHA", // Jenny's Lectures - Functional Dependency
    "O16btnzfuYU", // Jenny's Lectures - Second Normal Form
    "wjfeGxqAQOY", // Education 4u - DBMS tutorial
    "oEJMJuFD204", // Education 4u - What is database
    "p8iRFHfkI_Q", // Education 4u - Primary key in dbms
  ],
  "OPERATING SYSTEM": [
    "WJ-UaAaumNA", // Gate Smashers - Intro to Operating System
    "c-yJ0iY8Z9k", // Gate Smashers - Batch Operating System
    "bkSWJJZNgf8", // Gate Smashers - OS Syllabus Discussion
    "vBURTt97EkA", // Neso Academy - Introduction to OS
    "VjPgYcQqqN0", // Neso Academy - Basics of OS
    "d9WyerblWQc", // Neso Academy - Main Memory
    "RozoeWzT7IM", // Jenny's Lectures - OS Introduction
    "PY6zEUELn8s", // Jenny's Lectures - Types of OS
    "QhRPNO2f0g0", // Easy Engineering - Introduction to OS
    "L7r7318W5wE", // Easy Engineering - Batch OS
  ],
  "ASP.NET": [
    "4IgC2Q5-yDE", // kudvenkat - ASP.NET Core Tutorial
    "f72ookCWhsQ", // kudvenkat - ASP.NET Core MVC
    "egITMrwMOPU", // kudvenkat - ASP.NET Identity
    "BfEjDD8mWYg", // freeCodeCamp - ASP.NET Crash Course
    "6SAFgcMie4U", // freeCodeCamp - Beginner to Advanced
    "f63mo1ZRobM", // freeCodeCamp - ASP.NET Core 8.0
    "AhAxLiGC7Pc", // DotNetMastery - Full Course .NET 8
    "yt8lqei9xyg", // Code with Mosh - ASP.NET + Angular
    "E7Voso411Vs", // Code with Mosh - MVC Tutorial
    "YbRe4iIVYJk", // DotNetMastery - Full Course .NET 10
  ],
  "DMT": [
    "uFDUXQ3JFBs", // Gate Smashers - Data Warehouse Syllabus
    "h2x755o-Gz8", // Gate Smashers - Data Preprocessing
    "jhqLc50MpTI", // Gate Smashers - Outliers in DM
    "bK6z2sQxM0I", // Gate Smashers - Apriori Algorithm
    "i4zK77qJc6E", // 5 Minutes Engineering - Apriori Algorithm
    "a5G99sWkC7M", // 5 Minutes Engineering - Data Cleaning
    "u2qf7gH0n2M", // 5 Minutes Engineering - K-Means
    "nY-lmdvixqk", // iNeuron - Data Preparation
    "qkVsBGErdT8", // iNeuron - ML Full Course Intro
    "NGnst2LDlUo", // Great Learning - DM Tutorial
  ],
};

function generateVideos(subject, count = 10) {
  const topics = {
    "DBMS": ["Introduction to DBMS", "ER Model & Diagrams", "Relational Algebra", "SQL Queries & Joins", "Normalization Forms", "Transaction Management", "Concurrency Control", "Indexing & Hashing", "File Organization", "Query Optimization"],
    "OPERATING SYSTEM": ["Process Management", "CPU Scheduling Algorithms", "Threads & Concurrency", "Synchronization & Deadlocks", "Memory Management", "Virtual Memory", "File Systems", "I/O Management", "Disk Scheduling", "OS Security"],
    "ASP.NET": ["Introduction to ASP.NET", "MVC Architecture", "Razor Views & Layouts", "Entity Framework Core", "Web API Development", "Authentication & Authorization", "State Management", "AJAX & jQuery", "Deployment & Hosting", "Performance Optimization"],
    "DMT": ["Data Mining Fundamentals", "Data Preprocessing", "Association Rule Mining", "Classification Algorithms", "Clustering Techniques", "Decision Trees", "Neural Networks", "Text Mining", "Web Mining", "Big Data Analytics"],
  };
  const ytIds = youtubeVideos[subject] || [];
  return Array.from({ length: count }, (_, i) => ({
    id: `vid-${subject}-${i + 1}`,
    title: topics[subject]?.[i] || `${subject} — Module ${i + 1}`,
    subject,
    semester: i < 5 ? "Odd" : "Even",
    year: i < 3 ? 1 : i < 6 ? 2 : 3,
    description: `Complete lecture on ${topics[subject]?.[i]?.toLowerCase() || `module ${i + 1}`} with practical examples.`,
    youtubeId: ytIds[i % ytIds.length] || "kBdlM6hNDAE",
    facultyName: (subject === "DBMS" ? "M P Sudha" : subject === "ASP.NET" ? "R Saranya" : subject === "OPERATING SYSTEM" ? "Dr Dharani" : "V Ponnila"),
    views: Math.floor(Math.random() * 5000) + 500,
    likes: Math.floor(Math.random() * 500) + 50,
    duration: `${Math.floor(Math.random() * 30) + 15}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
    videoType: i % 3 === 0 ? "class_recording" : "lecture",
  }));
}

const allVideos = {};
subjects.forEach((s) => { allVideos[s] = generateVideos(s, 10); });

function VideoThumbnail({ video, onPlay }) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onPlay(video)}
      className="group relative aspect-video w-full overflow-hidden rounded-t-xl bg-gray-100"
    >
      {/* YouTube thumbnail background */}
      <img
        src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
        alt={video.title}
        className="absolute inset-0 h-full w-full object-cover"
        onError={(e) => {
          e.target.style.display = "none";
          e.target.parentElement.classList.add("flex", "items-center", "justify-center");
          const fallback = document.createElement("div");
          fallback.className = `flex h-full w-full items-center justify-center bg-gradient-to-br ${
            subjectColors[video.subject]?.bg || "from-blue-500 to-indigo-500"
          }/10`;
          fallback.innerHTML = `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-300"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>`;
          e.target.parentElement.appendChild(fallback);
        }}
      />
      {video.videoType === "class_recording" && (
        <span className="absolute left-2 top-2 z-10 inline-flex items-center gap-1 rounded-full bg-blue-600/80 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
          <FiClock size={10} /> Recording
        </span>
      )}
      <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/30 group-hover:opacity-100">
        <motion.div
          initial={{ scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600/90 text-white shadow-lg"
        >
          <FiPlay size={24} className="ml-1" />
        </motion.div>
      </div>
      <span className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-mono text-white">
        {video.duration}
      </span>
    </motion.button>
  );
}

function VideoCardSmall({ video, onPlay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="group cursor-pointer premium-card-hover p-3"
      onClick={() => onPlay(video)}
    >
      <div className="flex items-start gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
          subjectColors[video.subject]?.badge || "bg-blue-50"
        }`}>
          <FiPlay size={16} />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {video.title}
          </h4>
          <p className="mt-0.5 flex items-center gap-2 text-[11px] text-gray-400">
            <span className="flex items-center gap-1"><FiUser size={10} /> {video.facultyName}</span>
            <span className="flex items-center gap-1"><FiEye size={10} /> {video.views}</span>
          </p>
        </div>
        <span className="text-[11px] font-mono text-gray-400">{video.duration}</span>
      </div>
    </motion.div>
  );
}

export default function EContent() {
  const [activeSubject, setActiveSubject] = useState("DBMS");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [playing, setPlaying] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const videos = allVideos[activeSubject] || [];
  const filtered = videos.filter((v) => {
    if (selectedYear && v.year !== Number(selectedYear)) return false;
    if (selectedSemester) {
      const semMatch = selectedSemester === "Odd" ? v.semester === "Odd" : v.semester === "Even";
      if (!semMatch) return false;
    }
    return true;
  });

  const featured = filtered.slice(0, 4);
  const rest = filtered.slice(4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-soft">
            <FiFilm size={22} />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl">E-Content Library</h1>
            <p className="text-xs text-gray-400">DDGD Vaishnav College · Department of Computer Science</p>
          </div>
        </div>
      </motion.div>

      {/* Action Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-8 flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white/80 p-4 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-3">
          <FiMonitor size={22} className="text-blue-600" />
          <div>
            <p className="font-semibold text-sm text-gray-900">Video Library</p>
            <p className="text-xs text-gray-400">Browse, stream, or upload new content</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {user ? (
            <button onClick={() => toast.success("Upload feature coming soon")} className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-2 text-xs font-semibold text-white shadow-soft hover:shadow-premium transition-all">
              <FiUploadCloud size={14} /> Upload Video
            </button>
          ) : (
            <button onClick={() => navigate("/login")} className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-50">
              <FiUploadCloud size={14} /> Login to Upload
            </button>
          )}
          {user && (
            <span className="flex items-center gap-1 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">
              <FiUser size={13} /> {user.rollNumber}
            </span>
          )}
        </div>
      </motion.div>

      {/* Subject Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="flex flex-wrap gap-2">
          {subjects.map((s, i) => (
            <motion.button
              key={s}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { setActiveSubject(s); setSelectedYear(""); setSelectedSemester(""); }}
              className={`relative rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
                activeSubject === s
                  ? `bg-gradient-to-r ${subjectColors[s]?.bg || "from-blue-600 to-blue-800"} text-white shadow-premium`
                  : "border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              }`}
            >
              {s}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="mb-6 flex flex-wrap gap-3"
      >
        <div className="flex items-center gap-2">
          <FiCalendar size={14} className="text-gray-400" />
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 outline-none focus:border-blue-400/60"
          >
            <option value="">All Years</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <FiClock size={14} className="text-gray-400" />
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 outline-none focus:border-blue-400/60"
          >
            <option value="">All Semesters</option>
            <option value="Odd">Odd Semester</option>
            <option value="Even">Even Semester</option>
          </select>
        </div>
        <span className="inline-flex items-center text-xs text-gray-400">
          {filtered.length} video{filtered.length !== 1 ? "s" : ""}
        </span>
      </motion.div>

      {/* Featured + List */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubject + selectedYear + selectedSemester}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3 }}
        >
          {featured.length > 0 && (
            <>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-gray-900">Featured Lectures</h2>
                <span className="text-xs text-gray-400">{activeSubject}</span>
              </div>
              <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {featured.map((video, i) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <div className="premium-card-hover flex flex-col overflow-hidden">
                      <VideoThumbnail video={video} onPlay={(v) => { if (!user) { toast.error("Login to watch"); navigate("/login"); return; } setPlaying(v); }} />
                      <div className="flex flex-col gap-2 p-3">
                        <h3 className="line-clamp-1 font-semibold text-sm text-gray-900">{video.title}</h3>
                        <div className="flex items-center justify-between text-[11px] text-gray-400">
                          <span className="flex items-center gap-1"><FiUser size={10} /> {video.facultyName}</span>
                          <span className="flex items-center gap-1"><FiEye size={10} /> {video.views}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            subjectColors[video.subject]?.badge || "bg-blue-50 text-blue-700"
                          }`}>
                            Year {video.year} · {video.semester}
                          </span>
                          <button onClick={() => toast.success("Liked!")} className="text-red-300 hover:text-red-500">
                            <FiHeart size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {rest.length > 0 && (
            <>
              <h2 className="mb-3 font-display text-lg font-semibold text-gray-900">All Videos ({activeSubject})</h2>
              <div className="space-y-2">
                {rest.map((video, i) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <VideoCardSmall video={video} onPlay={(v) => { if (!user) { toast.error("Login to watch"); navigate("/login"); return; } setPlaying(v); }} />
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <FiFilm size={48} className="mb-3 opacity-30" />
              <p className="text-sm">No videos match your filters.</p>
              <button onClick={() => { setSelectedYear(""); setSelectedSemester(""); }} className="mt-2 text-xs text-blue-600 hover:underline">
                Clear filters
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Video Player Modal */}
      <AnimatePresence>
        {playing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 p-4 backdrop-blur-sm"
            onClick={() => setPlaying(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-premium-lg"
            >
              {/* Header */}
              <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-gray-900">{playing.title}</h3>
                  <p className="text-[11px] text-gray-500">{playing.subject} · {playing.facultyName} · Year {playing.year} · {playing.semester}</p>
                </div>
                <button onClick={() => setPlaying(null)} className="ml-3 rounded-full bg-white/80 p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                  <FiX size={16} />
                </button>
              </div>

              {/* YouTube Embedded Player */}
              <div className="aspect-video w-full bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${playing.youtubeId}?autoplay=1&rel=0`}
                  title={playing.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>

              {/* Controls bar */}
              <div className="flex items-center justify-between border-t border-gray-100 bg-white px-4 py-3">
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><FiEye size={13} /> {playing.views} views</span>
                  <span className="flex items-center gap-1"><FiHeart size={13} /> {playing.likes} likes</span>
                </div>
                <span className="text-xs text-gray-400">{playing.duration}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
