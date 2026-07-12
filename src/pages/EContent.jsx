import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlayCircle, FiBookOpen, FiArrowLeft, FiMonitor,
  FiYoutube, FiX, FiFilm, FiChevronRight, FiBook, FiLayers,
  FiStar, FiAward, FiVideo, FiUploadCloud, FiFileText,
} from "react-icons/fi";
import { useFirestoreList } from "../hooks/useFirestoreList";
import { videoService } from "../services/videoService";
import { useAuth } from "../context/AuthContext";
import { STORAGE_PATHS } from "../utils/constants";
import { uploadFile } from "../services/storageService";
import toast from "react-hot-toast";
import { CURRICULUM, NOTES_DATA, SEMESTER_UNITS, NAME_ONLY_MAP } from "./Notes";

const FACULTY_MAP = {
  "OPERATING SYSTEM": "DR DHARANI",
  "DATA MINING TECHNIQUES": "V PONNILA",
  "ASP.NET": "R SARANYA",
  "DATABASE MANAGEMENT SYSTEM": "M P SUDHA",
};

// CURRICULUM imported from Notes.jsx

const yearStyles = {
  1: { gradient: "from-emerald-500 to-teal-600", light: "from-emerald-50 to-teal-50", text: "text-emerald-700" },
  2: { gradient: "from-violet-500 to-purple-600", light: "from-violet-50 to-purple-50", text: "text-violet-700" },
  3: { gradient: "from-amber-500 to-orange-600", light: "from-amber-50 to-orange-50", text: "text-amber-700" },
};

const subjectColors = [
  { from: "from-indigo-500", to: "to-violet-600", badge: "bg-indigo-500/20 text-indigo-300" },
  { from: "from-rose-500", to: "to-pink-600", badge: "bg-rose-100 text-rose-800" },
  { from: "from-cyan-500", to: "to-sky-600", badge: "bg-cyan-100 text-cyan-800" },
  { from: "from-amber-500", to: "to-yellow-600", badge: "bg-amber-100 text-amber-800" },
  { from: "from-lime-500", to: "to-green-600", badge: "bg-lime-100 text-lime-800" },
];

// SYLLABUS parsed dynamically from NOTES_DATA

export default function EContent() {
  const { user } = useAuth();
  const isFaculty = user?.type === "faculty";
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showVideos, setShowVideos] = useState(false);
  const [playing, setPlaying] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDescription, setUploadDescription] = useState("");
  const [videoType, setVideoType] = useState("lecture");
  const [uploadMethod, setUploadMethod] = useState("youtube");
  const [youtubeId, setYoutubeId] = useState("");
  const [uploadFileObj, setUploadFileObj] = useState(null);

  async function handleUpload(e) {
    e.preventDefault();
    if (!uploadTitle.trim()) {
      toast.error("Please enter a title");
      return;
    }
    if (uploadMethod === "youtube" && !youtubeId.trim()) {
      toast.error("Please enter a YouTube video ID or link");
      return;
    }
    if (uploadMethod === "file" && !uploadFileObj) {
      toast.error("Please choose a video file to upload");
      return;
    }

    setUploading(true);
    try {
      let fileUrl = "";
      let finalYoutubeId = "";

      if (uploadMethod === "file") {
        fileUrl = await uploadFile(STORAGE_PATHS.VIDEOS, uploadFileObj, setProgress);
      } else {
        const match = youtubeId.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([^?&"'>]+)/);
        finalYoutubeId = match ? match[1] : youtubeId.trim();
      }

      await videoService.create({
        title: uploadTitle.trim(),
        description: uploadDescription.trim(),
        videoType,
        subject: selectedSubject,
        semester: Number(selectedSemester),
        year: Number(selectedYear),
        youtubeId: finalYoutubeId || null,
        fileUrl: fileUrl || null,
        facultyName: user.name || "Faculty",
        facultyId: user.uid || "faculty-id",
      });

      toast.success("Video uploaded successfully!");
      setUploadTitle("");
      setUploadDescription("");
      setYoutubeId("");
      setUploadFileObj(null);
      setShowUploadForm(false);
      refetch();
    } catch (err) {
      toast.error(err.message || "Failed to upload video");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }

  const yearData = selectedYear ? CURRICULUM[selectedYear] : null;
  const semesterData = selectedSemester && yearData ? yearData.semesters[selectedSemester] : null;
  const ys = selectedYear ? yearStyles[selectedYear] : yearStyles[1];
  const { items: firestoreVideos, refetch } = useFirestoreList(videoService);
  const isPlaceholder = selectedSubject && (
    NAME_ONLY_MAP[`${selectedYear}-${selectedSemester}`]?.has(selectedSubject)
  );

  const subjectVideos = selectedSubject && selectedYear && !isPlaceholder
    ? firestoreVideos.filter((v) => {
        const matchesSubject = v.subject?.toUpperCase() === selectedSubject;
        const matchesYear = v.year === selectedYear;
        const matchesSemester = !selectedSemester || v.semester === selectedSemester;
        return matchesSubject && matchesYear && matchesSemester;
      })
    : [];
  const syllabusData = useMemo(() => {
    if (!selectedSubject || isPlaceholder) return null;
    const subjectData = NOTES_DATA[selectedSubject];
    if (!subjectData || !subjectData.units) return null;
    const filter = SEMESTER_UNITS[`${selectedYear}-${selectedSemester}`]?.[selectedSubject];
    return Object.entries(subjectData.units)
      .filter(([key]) => !filter || filter.has(Number(key)))
      .map(([key, unit], idx) => ({
        sl: idx + 1,
        module: `${unit.title}${unit.subtitle ? ` - ${unit.subtitle}` : ""}: ${unit.syllabus || "Syllabus content to be updated."}`,
        hrs: unit.hrs || 15,
        co: unit.co || `CO${key}`,
      }));
  }, [selectedSubject, selectedYear, selectedSemester, isPlaceholder]);

  const subjectNotesData = selectedSubject && !isPlaceholder ? NOTES_DATA[selectedSubject] : null;
  const semesterUnitFilter = selectedSubject && !isPlaceholder ? SEMESTER_UNITS[`${selectedYear}-${selectedSemester}`]?.[selectedSubject] : null;

  if (!selectedYear) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-[0_8px_32px_rgba(79,70,229,0.2)]">
            <FiPlayCircle size={36} />
          </div>
          <h1 className="font-display text-4xl font-bold text-white">Video Lectures</h1>
          <p className="mt-2 text-sm text-white/60">Select your year to browse subject-wise lectures &amp; syllabus</p>
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
                className="group relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-glass transition-all duration-500 hover:shadow-xl hover:bg-white/90"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${s.light} opacity-60 group-hover:opacity-90 transition-opacity duration-500`} />
                <div className="relative p-8 text-center">
                  <div className={`mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br ${s.gradient} text-3xl font-bold text-white shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl`}>
                    {CURRICULUM[year].icon}
                  </div>
                  <h2 className={`text-xl font-bold ${s.text}`}>{CURRICULUM[year].label}</h2>
                  <p className="mt-1.5 text-xs text-white/50">{Object.keys(CURRICULUM[year].semesters).length} Semesters</p>
                  <div className="mt-4 inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-400 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                    Browse Lectures <FiChevronRight size={12} />
                  </div>
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
          className="mb-8 inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-white/5 transition-all"
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
              className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-glass transition-all duration-300 hover:shadow-xl hover:bg-white/90"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${ys.light} opacity-50 group-hover:opacity-80 transition-opacity`} />
              <div className="relative p-8 text-center">
                <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br ${ys.gradient} text-xl font-bold text-white shadow-glass`}>{semKey === 1 ? "I" : "II"}</div>
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
          className="mb-8 inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-white/5 transition-all"
        ><FiArrowLeft size={14} /> Back to Semesters</motion.button>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 text-sm text-white/50 mb-3">
            <span className={ys.text}>{yearData.label}</span><FiChevronRight size={12} /><span className={ys.text}>{semesterData.label}</span>
          </div>
          <h1 className={`font-display text-2xl font-bold ${ys.text}`}>Select Subject</h1>
          <p className="mt-1 text-sm text-white/60">Choose a subject to view its syllabus &amp; video lectures</p>
        </motion.div>
        {semesterData.subjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/15 bg-white/5 py-20">
            <FiBookOpen size={48} className="mb-3 text-gray-300" />
            <p className="text-sm font-medium text-white/60">Subjects will be added soon</p>
            <p className="mt-1 text-xs text-white/50">This semester's curriculum is being updated</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {semesterData.subjects.map((subject, i) => {
              const sc = subjectColors[i % subjectColors.length];
              return (
                <motion.button key={subject}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.97 }}
                  onClick={() => { setSelectedSubject(subject); setShowVideos(false); }}
                  className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-glass transition-all duration-300 hover:shadow-xl hover:bg-white/90"
                >
                  <div className="relative flex items-start gap-4 p-5">
                    <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${sc.from} ${sc.to} text-white shadow-glass transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg`}>
                      <FiBook size={22} />
                    </div>
                    <div className="min-w-0 flex-1 pt-1">
                      <h3 className="font-display font-bold text-sm text-white leading-snug">{subject}</h3>
                      {FACULTY_MAP[subject] && <p className="mt-0.5 text-[11px] font-semibold tracking-wide text-white/60">{FACULTY_MAP[subject]}</p>}
                      <div className="mt-3 flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 rounded-full ${sc.badge} px-2.5 py-0.5 text-[10px] font-semibold`}><FiBookOpen size={10} /> VIEW SYLLABUS</span>
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

  if (!showVideos) {
    const sc = subjectColors[semesterData.subjects.indexOf(selectedSubject) % subjectColors.length];
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          onClick={() => { setSelectedSubject(null); }}
          className="mb-8 inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-white/5 transition-all"
        ><FiArrowLeft size={14} /> Back to Subjects</motion.button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-4 flex items-center gap-2 text-xs text-white/50">
          <span className={ys.text}>{yearData.label}</span><FiChevronRight size={10} />
          <span className={ys.text}>{semesterData.label}</span><FiChevronRight size={10} />
          <span className="text-white/80 font-semibold">{selectedSubject}</span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-4">
            <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${sc.from} ${sc.to} text-white shadow-lg`}><FiBookOpen size={28} /></div>
            <div>
              <h1 className="font-display text-2xl font-bold text-white">{selectedSubject}</h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-white/60">{yearData.label} · {semesterData.label}</span>
                <span className="badge-primary">{syllabusData?.length || 0} modules</span>
              </div>
            </div>
          </div>
        </motion.div>

        {syllabusData ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="mb-8 overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-glass"
          >
            <div className="bg-gradient-to-r from-indigo-600 to-violet-700 px-5 py-3.5 flex items-center gap-2 text-white">
              <FiBookOpen size={15} />
              <span className="text-xs font-bold uppercase tracking-wider">Syllabus</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-white/5 text-white/70">
                    <th className="px-5 py-3 font-bold uppercase tracking-wider w-14">Sl No</th>
                    <th className="px-5 py-3 font-bold uppercase tracking-wider">Contents of Module</th>
                    <th className="px-5 py-3 font-bold uppercase tracking-wider text-center w-20">Hrs</th>
                    <th className="px-5 py-3 font-bold uppercase tracking-wider text-center w-20">COs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {syllabusData.map((row) => (
                    <tr key={row.sl} className="hover:bg-indigo-500/10 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-white/80 align-top">{row.sl}</td>
                      <td className="px-5 py-3.5 text-white/70 leading-relaxed font-medium">{row.module}</td>
                      <td className="px-5 py-3.5 text-center font-semibold text-white/80 align-top">{row.hrs}</td>
                      <td className="px-5 py-3.5 text-center font-bold text-indigo-400 align-top">{row.co}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          <div className="mb-8 rounded-2xl border border-dashed border-white/15 bg-white/5 py-16 text-center">
            <FiBookOpen size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="text-sm text-white/50">Syllabus not yet available for this subject</p>
          </div>
        )}

        {/* ─── Faculty Upload Section ─── */}
        {isFaculty && selectedSubject && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            {!showUploadForm ? (
              <button
                onClick={() => setShowUploadForm(true)}
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:shadow-indigo-500/30 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.97]"
              >
                <FiUploadCloud size={18} />
                Upload Videos
              </button>
            ) : (
              <form onSubmit={handleUpload} className="space-y-4 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6 shadow-md">
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
                    <FiUploadCloud size={18} className="text-indigo-400" />
                    Upload Videos — {selectedSubject}
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
                      placeholder="e.g. Binary Search Trees - Unit 1"
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/20 focus:bg-white/10 transition-all"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-white/50">Description</label>
                    <textarea
                      value={uploadDescription}
                      onChange={(e) => setUploadDescription(e.target.value)}
                      placeholder="Brief description of the lecture video"
                      rows={2}
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/20 focus:bg-white/10 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-white/50">Video Type</label>
                      <select
                        value={videoType}
                        onChange={(e) => setVideoType(e.target.value)}
                        className="w-full rounded-xl border border-white/15 bg-[#0F172A] px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/20 transition-all text-white/80"
                      >
                        <option value="lecture">Lecture</option>
                        <option value="class_recording">Class Recording</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-white/50">Upload Method</label>
                      <select
                        value={uploadMethod}
                        onChange={(e) => setUploadMethod(e.target.value)}
                        className="w-full rounded-xl border border-white/15 bg-[#0F172A] px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/20 transition-all text-white/80"
                      >
                        <option value="youtube">YouTube Link / ID</option>
                        <option value="file">Direct Video File Upload</option>
                      </select>
                    </div>
                  </div>

                  {uploadMethod === "youtube" ? (
                    <div>
                      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-white/50">YouTube Link or Video ID</label>
                      <input
                        value={youtubeId}
                        onChange={(e) => setYoutubeId(e.target.value)}
                        required
                        placeholder="e.g. dQw4w9WgXcQ or https://youtu.be/..."
                        className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/20 focus:bg-white/10 transition-all"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-white/50">Select Video File</label>
                      <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-white/15 bg-white/5 px-4 py-6 text-center transition-all hover:border-indigo-500/50 hover:bg-white/10">
                        <FiUploadCloud size={24} className="text-indigo-400" />
                        <span className="text-xs text-white/50">
                          {uploadFileObj ? uploadFileObj.name : "Choose a video file (.mp4, .webm)..."}
                        </span>
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => setUploadFileObj(e.target.files?.[0] ?? null)}
                          required={!uploading}
                        />
                      </label>
                    </div>
                  )}

                  {uploading && progress > 0 && progress < 100 && (
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all" style={{ width: `${progress}%` }} />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={uploading}
                    className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg hover:shadow-indigo-500/20 disabled:opacity-50"
                  >
                    {uploading ? `Uploading (${progress}%)...` : "Upload video"}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center">
          <button
            onClick={() => {
              if (subjectVideos.length === 0) {
                toast.error("Videos are not yet available for this subject");
                return;
              }
              setShowVideos(true);
            }}
            className={`group inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-bold text-white shadow-lg transition-all duration-300 active:scale-[0.97] ${
              subjectVideos.length === 0
                ? "bg-gray-700 cursor-not-allowed opacity-60"
                : "bg-gradient-to-r from-indigo-600 to-violet-700 hover:shadow-indigo-500/30 hover:from-indigo-500 hover:to-violet-600"
            }`}
          >
            <FiPlayCircle size={20} />
            Watch Videos
            <FiChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </button>
        </motion.div>
      </div>
    );
  }

  const sc = subjectColors[semesterData.subjects.indexOf(selectedSubject) % subjectColors.length];
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        onClick={() => setShowVideos(false)}
        className="mb-8 inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-white/5 transition-all"
      ><FiArrowLeft size={14} /> Back to Syllabus</motion.button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-4">
          <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${sc.from} ${sc.to} text-white shadow-lg`}><FiMonitor size={28} /></div>
          <div>
            <h1 className="font-display text-2xl font-bold text-white">{selectedSubject}</h1>
            <p className="text-xs text-white/60">{yearData.label} · {semesterData.label}</p>
          </div>
        </div>
      </motion.div>

      {subjectVideos.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/15 bg-white/5 py-24">
          <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/20 to-violet-500/20 shadow-glass">
            <FiYoutube size={44} className="text-indigo-300" />
          </div>
          <h3 className="text-lg font-bold text-white/80">No Videos Added Yet</h3>
          <p className="mt-1 max-w-md text-center text-sm text-white/50">Video lectures for {selectedSubject} will be uploaded soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {subjectVideos.map((video, i) => (
            <motion.div key={video.id || i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <button onClick={() => setPlaying(video)}
                className="group w-full overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-glass transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-left"
              >
                <div className="relative aspect-video w-full bg-gradient-to-br from-gray-800 to-gray-900">
                  {video.youtubeId ? (
                    <img src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`} alt={video.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-indigo-950/40 text-indigo-300">
                      <FiVideo size={36} className="opacity-45" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-lg transition-transform duration-300 group-hover:scale-110">
                      <FiPlayCircle size={24} className="text-indigo-400 ml-0.5" />
                    </div>
                  </div>
                  {video.duration && (
                    <span className="absolute bottom-3 right-3 rounded-lg bg-black/70 backdrop-blur-sm px-2.5 py-1 text-[10px] font-mono text-white border border-white/10">{video.duration}</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="line-clamp-1 font-display text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{video.title || "Lecture Video"}</h3>
                  {video.description && <p className="mt-0.5 text-xs text-gray-500 line-clamp-1">{video.description}</p>}
                  <div className="mt-2 flex items-center gap-2">
                    <span className="badge-primary">Lecture</span>
                    {video.facultyName && <span className="text-[10px] text-white/50">{video.facultyName}</span>}
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Related Lecture Notes */}
      {subjectNotesData && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-12">
          <h2 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
            <FiFileText className="text-emerald-400" />
            Syllabus &amp; Study Notes
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(subjectNotesData.units)
              .filter(([unitKey]) => !semesterUnitFilter || semesterUnitFilter.has(Number(unitKey)))
              .map(([unitKey, unit]) => {
                if (unit.files.length === 0) return null;
                return (
                  <div key={unitKey} className="rounded-2xl border border-white/5 bg-white/5 p-5 shadow-glass">
                    <h3 className="font-display text-sm font-bold text-white mb-3">{unit.title} - {unit.subtitle}</h3>
                    <div className="space-y-2">
                      {unit.files.map((file) => (
                        <a
                          key={file.id}
                          href={`https://drive.google.com/file/d/${file.fileId}/view`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2.5 rounded-xl bg-white/5 px-4 py-2.5 text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-all border border-white/10"
                        >
                          <FiFileText className="text-emerald-400 shrink-0" />
                          <span className="truncate flex-1">{file.title}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {playing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 p-4 backdrop-blur-sm"
            onClick={() => setPlaying(null)}
          >
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl overflow-hidden rounded-2xl bg-[#0F172A]/95 backdrop-blur-xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
            >
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-gradient-to-r from-indigo-600/20 to-violet-600/20">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-bold text-white">{playing.title || "Lecture"}</h3>
                  <p className="text-[11px] text-white/50">{selectedSubject}</p>
                </div>
                <button onClick={() => setPlaying(null)} className="rounded-full bg-white/10 p-2 text-white/50 hover:bg-white/20 hover:text-white transition-all"><FiX size={16} /></button>
              </div>
              <div className="aspect-video w-full bg-black">
                {playing.youtubeId ? (
                  <iframe src={`https://www.youtube.com/embed/${playing.youtubeId}?autoplay=1&rel=0`}
                    title={playing.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen className="h-full w-full" />
                ) : playing.fileUrl ? (
                  <video src={playing.fileUrl} controls autoPlay className="h-full w-full" />
                ) : (
                  <div className="flex h-full items-center justify-center text-white/50 text-sm">Video URL not available</div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
