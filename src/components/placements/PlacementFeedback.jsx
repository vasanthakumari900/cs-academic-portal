// src/components/placements/PlacementFeedback.jsx
// Placement Experience sharing — form, cards, search, filter, file upload, auth

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiShare2, FiX, FiSend, FiSearch,
  FiUser, FiBriefcase, FiDollarSign,
  FiTrash2, FiFile, FiUpload,
  FiMessageSquare, FiThumbsUp, FiBook,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { feedbackService } from "../../services/feedbackService";
import { uploadFile } from "../../services/storageService";
import { STORAGE_PATHS } from "../../utils/constants";
import { formatDate } from "../../utils/helpers";

const ITEMS_PER_PAGE = 6;

const DIFFICULTY_COLORS = {
  "Very Easy": { badge: "bg-emerald-500/20 text-emerald-300", dot: "bg-emerald-400" },
  Easy: { badge: "bg-emerald-500/20 text-emerald-300", dot: "bg-emerald-400" },
  Medium: { badge: "bg-amber-500/20 text-amber-300", dot: "bg-amber-400" },
  Hard: { badge: "bg-rose-500/20 text-rose-300", dot: "bg-rose-400" },
  "Very Hard": { badge: "bg-red-500/20 text-red-300", dot: "bg-red-400" },
};

const RESOURCES_OPTIONS = [
  "LeetCode", "HackerRank", "GeeksforGeeks", "CodeChef", "NPTEL",
  "YouTube", "College Notes", "InterviewBit", "Coursera", "Udemy",
];

const EMPTY_FORM = {
  fullName: "", rollNumber: "", batch: "",
  companyName: "", jobRole: "", package: "",
  interviewDate: "",
  selectionProcess: "", aptitudePrep: "", aptitudeTopics: "",
  techInterviewExp: "", techQuestions: "",
  hrInterviewExp: "", hrQuestions: "",
  projectsDiscussed: "", techTested: "",
  difficulties: "", tips: "", resources: [],
  overallDifficulty: "", recommend: "",
  comments: "",
};

export default function PlacementFeedback() {
  const { user } = useAuth();
  const isStudent = user?.type === "student";
  const canDelete = user?.type === "faculty" || user?.type === "admin";

  // ─── State ───
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCompany, setFilterCompany] = useState("");
  const [filterBatch, setFilterBatch] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);

  // ─── Form state ───
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [selectedResources, setSelectedResources] = useState([]);
  const [uploadFileObj, setUploadFileObj] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // ─── Fetch feedbacks ───
  useEffect(() => {
    async function fetch() {
      try {
        const data = await feedbackService.list({ max: 100 });
        setFeedbacks(data);
      } catch (err) {
        console.error("Failed to fetch feedback:", err);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  // ─── Filter & Search ───
  const filteredFeedbacks = feedbacks.filter((f) => {
    const matchesSearch = !searchQuery ||
      f.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.jobRole?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCompany = !filterCompany || f.companyName === filterCompany;
    const matchesBatch = !filterBatch || f.batch === filterBatch;
    const matchesDifficulty = !filterDifficulty || f.overallDifficulty === filterDifficulty;
    return matchesSearch && matchesCompany && matchesBatch && matchesDifficulty;
  });

  // Sort by newest first
  const sortedFeedbacks = [...filteredFeedbacks].sort(
    (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
  );

  const totalPages = Math.ceil(sortedFeedbacks.length / ITEMS_PER_PAGE);
  const paginatedFeedbacks = sortedFeedbacks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Unique values for filters
  const uniqueCompanies = [...new Set(feedbacks.map((f) => f.companyName).filter(Boolean))];
  const uniqueBatches = [...new Set(feedbacks.map((f) => f.batch).filter(Boolean))];

  // ─── Resource toggle ───
  function toggleResource(res) {
    setSelectedResources((prev) =>
      prev.includes(res) ? prev.filter((r) => r !== res) : [...prev, res]
    );
  }

  // ─── Field change helper (captures value immediately) ───
  function handleFieldChange(field) {
    return (e) => {
      const value = e.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
    };
  }

  // ─── Form submit ───
  async function handleSubmit(e) {
    e.preventDefault();
    if (!isStudent) {
      toast.error("Only students can submit placement feedback.");
      return;
    }

    // Validate required fields
    const required = ["fullName", "rollNumber", "batch", "companyName", "jobRole", "package",
      "selectionProcess", "aptitudePrep", "tips", "overallDifficulty", "recommend"];
    const missing = required.filter((f) => !form[f]?.trim());
    if (missing.length > 0) {
      toast.error(`Please fill in: ${missing.join(", ")}`);
      return;
    }

    setSubmitting(true);
    try {
      let fileUrl = "";
      if (uploadFileObj) {
        fileUrl = await uploadFile(STORAGE_PATHS.PLACEMENT_FEEDBACK, uploadFileObj, (p) =>
          setUploadProgress(p)
        );
      }

      await feedbackService.create({
        ...form,
        resources: selectedResources,
        resourceFileUrl: fileUrl,
        submittedBy: user?.rollNumber || user?.name || "anonymous",
        submittedByName: user?.name || form.fullName,
      });

      toast.success("Placement experience shared successfully!");
      setForm({ ...EMPTY_FORM });
      setSelectedResources([]);
      setUploadFileObj(null);
      setUploadProgress(0);
      setShowForm(false);

      // Refresh
      const data = await feedbackService.list({ max: 100 });
      setFeedbacks(data);
    } catch (err) {
      toast.error(err.message || "Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  }

  // ─── Delete feedback with confirmation ───
  async function confirmDelete(id) {
    if (!canDelete) return;
    if (deletingId !== id) {
      setDeletingId(id);
      setTimeout(() => setDeletingId((prev) => prev === id ? null : prev), 3000);
      return;
    }
    setDeletingId(null);
    try {
      await feedbackService.remove(id);
      setFeedbacks((prev) => prev.filter((f) => f.id !== id));
      setSelectedFeedback((prev) => (prev?.id === id ? null : prev));
      toast.success("Feedback deleted");
    } catch (err) {
      toast.error("Failed to delete feedback");
    }
  }

  // ─── Pagination reset on filter change ───
  useEffect(() => { setCurrentPage(1); }, [searchQuery, filterCompany, filterBatch, filterDifficulty]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-2 text-white/50">
          <div className="h-2 w-2 animate-bounce rounded-full bg-indigo-400" />
          <div className="h-2 w-2 animate-bounce rounded-full bg-indigo-400" style={{ animationDelay: "0.15s" }} />
          <div className="h-2 w-2 animate-bounce rounded-full bg-indigo-400" style={{ animationDelay: "0.3s" }} />
        </div>
      </div>
    );
  }

  return (
    <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} className="mt-24">
      {/* ── Header ── */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg">
          <FiMessageSquare size={28} />
        </div>
        <h2 className="font-display text-2xl font-bold text-white">
          Placement <span className="text-gradient-primary">Experiences</span>
        </h2>
        <p className="mt-1 text-sm text-white/50">
          Learn from seniors who've been through the process
        </p>
      </div>

      {/* ── Share Button ── */}
      {isStudent && (
        <div className="mb-10 text-center">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:shadow-indigo-500/30"
          >
            <FiShare2 size={16} />
            Feedback Form
          </motion.button>
        </div>
      )}

      {/* ── Search & Filter Bar ── */}
      {sortedFeedbacks.length > 0 && (
        <div className="mb-8 flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
          <div className="relative flex-1 min-w-[200px]">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={14} />
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by company, name, role..."
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-9 pr-3 text-xs text-white placeholder-white/30 outline-none focus:border-indigo-400/40 transition-all"
            />
          </div>
          <select value={filterCompany} onChange={(e) => setFilterCompany(e.target.value)}
            className="w-full sm:w-auto rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-white outline-none focus:border-indigo-400/40 transition-all">
            <option value="">All Companies</option>
            {uniqueCompanies.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filterBatch} onChange={(e) => setFilterBatch(e.target.value)}
            className="w-full sm:w-auto rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-white outline-none focus:border-indigo-400/40 transition-all">
            <option value="">All Batches</option>
            {uniqueBatches.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
          <select value={filterDifficulty} onChange={(e) => setFilterDifficulty(e.target.value)}
            className="w-full sm:w-auto rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-white outline-none focus:border-indigo-400/40 transition-all">
            <option value="">All Difficulties</option>
            <option value="Very Easy">Very Easy</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
            <option value="Very Hard">Very Hard</option>
          </select>
          <span className="text-[11px] text-white/40 whitespace-nowrap">
            {sortedFeedbacks.length} experience{sortedFeedbacks.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* ── Empty State ── */}
      {sortedFeedbacks.length === 0 && !loading && (
        <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-white/10 bg-white/5 py-16">
          <FiMessageSquare size={48} className="mb-3 text-white/30" />
          <p className="text-sm font-medium text-white/50">No placement experiences yet</p>
          {isStudent && (
            <button onClick={() => setShowForm(true)}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-xs font-bold text-white shadow-md transition-all hover:shadow-lg"
            >
              <FiShare2 size={13} /> Be the first to share!
            </button>
          )}
        </div>
      )}

      {/* ── Experience Cards ── */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {paginatedFeedbacks.map((fb, i) => (
          <motion.div key={fb.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <div className="group relative h-full rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:shadow-xl hover:border-indigo-400/20">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl" />

              {/* Header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-xs font-bold text-white shadow-md">
                  {fb.fullName?.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-white">{fb.fullName}</p>
                  <p className="text-[11px] text-white/40">{fb.batch || "Batch not specified"}</p>
                </div>
                <DifficultyBadge level={fb.overallDifficulty} />
              </div>

              {/* Company & Role */}
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-500/20 px-2.5 py-1 text-[11px] font-bold text-indigo-300">
                  <FiBriefcase size={11} /> {fb.companyName}
                </span>
                <span className="text-[11px] text-white/50">{fb.jobRole}</span>
                <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/20 px-2.5 py-1 text-[11px] font-bold text-emerald-300">
                  <FiDollarSign size={11} /> {fb.package} LPA
                </span>
              </div>

              {/* Preview */}
              <p className="text-xs text-white/60 leading-relaxed line-clamp-3">
                {truncate(fb.selectionProcess, 200)}
              </p>

              {/* Recommended or not */}
              <div className="mt-3 flex items-center gap-2">
                {fb.recommend === "Strongly Recommend" || fb.recommend === "Yes" ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                    <FiThumbsUp size={10} /> {fb.recommend === "Strongly Recommend" ? "Strongly Recommends" : "Recommends"}
                  </span>
                ) : fb.recommend === "No" || fb.recommend === "Strongly Not Recommend" ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-400">
                    <FiX size={10} /> {fb.recommend === "Strongly Not Recommend" ? "Strongly Does Not Recommend" : "Does not recommend"}
                  </span>
                ) : fb.recommend === "Neutral" ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-400">
                    <FiThumbsUp size={10} /> Neutral
                  </span>
                ) : null}
                <span className="ml-auto text-[10px] text-white/30">
                  {fb.createdAt?.seconds ? formatDate(new Date(fb.createdAt.seconds * 1000).toISOString()) : "Recently"}
                </span>
              </div>

              {/* Actions */}
              <div className="mt-4 flex items-center gap-2 pt-3 border-t border-white/10">
                <button onClick={() => setSelectedFeedback(fb)}
                  className="flex-1 rounded-xl border border-white/15 bg-white/5 py-2 text-[11px] font-semibold text-white/60 transition-all hover:bg-white/10 hover:text-white active:scale-95"
                >
                  Read More
                </button>
                {canDelete && (
                  <button onClick={() => confirmDelete(fb.id)}
                    className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all active:scale-95 ${
                      deletingId === fb.id
                        ? "bg-rose-500/30 text-rose-400 animate-pulse"
                        : "text-white/30 hover:bg-rose-500/20 hover:text-rose-400"
                    }`}
                    title={deletingId === fb.id ? "Click again to confirm" : "Delete"}
                  >
                    {deletingId === fb.id ? <FiX size={13} /> : <FiTrash2 size={13} />}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button key={page} onClick={() => setCurrentPage(page)}
              className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold transition-all ${
                currentPage === page
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md"
                  : "border border-white/10 bg-white/5 text-white/50 hover:bg-white/10"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {/* ── Submit Feedback Form Modal ── */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center overflow-auto bg-gray-900/80 p-4 backdrop-blur-sm"
            onClick={() => { if (!submitting) setShowForm(false); }}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="my-8 w-full max-w-3xl rounded-2xl border border-white/10 bg-[#0F172A]/95 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
            >
              {/* Form Header */}
              <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-indigo-600/20 to-violet-600/20 px-6 py-4">
                <div>
                  <h3 className="text-base font-bold text-white">Feedback Form</h3>
                  <p className="text-xs text-white/50">Share your placement experience to help juniors prepare</p>
                </div>
                <button onClick={() => setShowForm(false)} disabled={submitting}
                  className="rounded-full bg-white/10 p-2 text-white/50 transition-all hover:bg-white/20 hover:text-white">
                  <FiX size={16} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto p-6 space-y-6">

                {/* ── Student Information ── */}
                <div>
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
                    <FiUser size={14} className="text-indigo-400" /> Student Information
                  </h4>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <FormField label="Full Name" required>
                      <input value={form.fullName} onChange={handleFieldChange('fullName')}
                        placeholder="e.g. John Doe" className="input-premium" />
                    </FormField>
                    <FormField label="Roll Number" required>
                      <input value={form.rollNumber} onChange={handleFieldChange('rollNumber')}
                        placeholder="e.g. 24E3001" className="input-premium" />
                    </FormField>
                    <FormField label="Batch (Year of Passing)" required>
                      <input value={form.batch} onChange={handleFieldChange('batch')}
                        placeholder="e.g. 2026" className="input-premium" />
                    </FormField>
                    <FormField label="Company Name" required>
                      <input value={form.companyName} onChange={handleFieldChange('companyName')}
                        placeholder="e.g. Google" className="input-premium" />
                    </FormField>
                    <FormField label="Job Role" required>
                      <input value={form.jobRole} onChange={handleFieldChange('jobRole')}
                        placeholder="e.g. SDE-1" className="input-premium" />
                    </FormField>
                    <FormField label="Package (LPA)" required>
                      <input value={form.package} onChange={handleFieldChange('package')}
                        placeholder="e.g. 32" type="number" step="0.1" className="input-premium" />
                    </FormField>
                    <FormField label="Interview Date">
                      <input value={form.interviewDate} onChange={handleFieldChange('interviewDate')}
                        type="date" className="input-premium" />
                    </FormField>
                  </div>
                </div>

                {/* ── Placement Experience ── */}
                <div>
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
                    <FiMessageSquare size={14} className="text-indigo-400" /> Placement Experience
                  </h4>
                  <div className="space-y-4">
                    <FormField label="How did you get selected?" required>
                      <textarea value={form.selectionProcess} onChange={handleFieldChange('selectionProcess')}
                        rows={2} placeholder="Describe how you got selected for this company..." className="input-premium" />
                    </FormField>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField label="Aptitude preparation strategy" required>
                        <textarea value={form.aptitudePrep} onChange={handleFieldChange('aptitudePrep')}
                          rows={2} placeholder="How did you prepare for aptitude?" className="input-premium" />
                      </FormField>
                      <FormField label="Aptitude topics asked">
                        <textarea value={form.aptitudeTopics} onChange={handleFieldChange('aptitudeTopics')}
                          rows={2} placeholder="e.g. Quantitative, Logical, Verbal, Coding..." className="input-premium" />
                      </FormField>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField label="Technical interview experience">
                        <textarea value={form.techInterviewExp} onChange={handleFieldChange('techInterviewExp')}
                          rows={3} placeholder="Describe your technical interview..." className="input-premium" />
                      </FormField>
                      <FormField label="Technical questions asked">
                        <textarea value={form.techQuestions} onChange={handleFieldChange('techQuestions')}
                          rows={3} placeholder="What technical questions were asked?" className="input-premium" />
                      </FormField>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField label="HR interview experience">
                        <textarea value={form.hrInterviewExp} onChange={handleFieldChange('hrInterviewExp')}
                          rows={2} placeholder="Describe your HR interview..." className="input-premium" />
                      </FormField>
                      <FormField label="HR questions asked">
                        <textarea value={form.hrQuestions} onChange={handleFieldChange('hrQuestions')}
                          rows={2} placeholder="What HR questions were asked?" className="input-premium" />
                      </FormField>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField label="Projects discussed">
                        <textarea value={form.projectsDiscussed} onChange={handleFieldChange('projectsDiscussed')}
                          rows={2} placeholder="What projects did you discuss?" className="input-premium" />
                      </FormField>
                      <FormField label="Technologies tested">
                        <textarea value={form.techTested} onChange={handleFieldChange('techTested')}
                          rows={2} placeholder="Languages/technologies tested?" className="input-premium" />
                      </FormField>
                    </div>

                    <FormField label="Difficulties faced during recruitment">
                      <textarea value={form.difficulties} onChange={handleFieldChange('difficulties')}
                        rows={2} placeholder="What difficulties did you face?" className="input-premium" />
                    </FormField>

                    <FormField label="Tips for juniors" required>
                      <textarea value={form.tips} onChange={handleFieldChange('tips')}
                        rows={2} placeholder="What tips would you give to juniors?" className="input-premium" />
                    </FormField>

                    {/* Resources */}
                    <FormField label="Resources that helped you prepare">
                      <div className="flex flex-wrap gap-2">
                        {RESOURCES_OPTIONS.map((r) => (
                          <button key={r} type="button" onClick={() => toggleResource(r)}
                            className={`rounded-xl border px-3 py-1.5 text-[11px] font-semibold transition-all ${
                              selectedResources.includes(r)
                                ? "border-indigo-400/40 bg-indigo-500/20 text-indigo-300"
                                : "border-white/10 bg-white/5 text-white/50 hover:border-white/20"
                            }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </FormField>

                    {/* File Upload */}
                    <FormField label="Upload supporting file (PDF)">
                      <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-white/10 bg-white/5 px-4 py-3 transition-all hover:border-indigo-400/30 hover:bg-white/10">
                        <FiUpload className="text-indigo-400 shrink-0" size={18} />
                        <span className="text-xs text-white/50">
                          {uploadFileObj ? uploadFileObj.name : "Choose PDF or document..."}
                        </span>
                        <input type="file" accept=".pdf,.doc,.docx,.txt" className="hidden"
                          onChange={(e) => setUploadFileObj(e.target.files?.[0] || null)} />
                      </label>
                      {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
                          <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all" style={{ width: `${uploadProgress}%` }} />
                        </div>
                      )}
                    </FormField>

                    {/* Difficulty & Recommend */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField label="Overall Difficulty" required>
                        <select value={form.overallDifficulty} onChange={handleFieldChange('overallDifficulty')}
                          className="input-premium">
                          <option value="">Select difficulty</option>
                          <option value="Very Easy">Very Easy</option>
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                          <option value="Very Hard">Very Hard</option>
                        </select>
                      </FormField>
                      <FormField label="Recommend this company?" required>
                        <select value={form.recommend} onChange={handleFieldChange('recommend')}
                          className="input-premium">
                          <option value="">Select</option>
                          <option value="Strongly Recommend">Strongly Recommend</option>
                          <option value="Yes">Yes</option>
                          <option value="Neutral">Neutral</option>
                          <option value="No">No</option>
                          <option value="Strongly Not Recommend">Strongly Not Recommend</option>
                        </select>
                      </FormField>
                    </div>

                    <FormField label="Additional comments">
                      <textarea value={form.comments} onChange={handleFieldChange('comments')}
                        rows={2} placeholder="Any other suggestions..." className="input-premium" />
                    </FormField>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-4">
                  <button type="button" onClick={() => setShowForm(false)} disabled={submitting}
                    className="rounded-xl border border-white/15 px-5 py-2.5 text-xs font-semibold text-white/50 transition-all hover:bg-white/10">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:shadow-lg active:scale-95 disabled:opacity-60"
                  >
                    {submitting ? "Submitting..." : <><FiSend size={13} /> Submit Experience</>}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Read More Modal ── */}
      <AnimatePresence>
        {selectedFeedback && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center overflow-auto bg-gray-900/80 p-4 backdrop-blur-sm"
            onClick={() => setSelectedFeedback(null)}
          >
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.97 }}
              onClick={(e) => e.stopPropagation()}
              className="my-8 w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0F172A]/95 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
            >
              <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-indigo-600/20 to-violet-600/20 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-xs font-bold text-white shadow-md">
                    {selectedFeedback.fullName?.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{selectedFeedback.fullName}</p>
                    <p className="text-[11px] text-white/40">{selectedFeedback.companyName} · {selectedFeedback.jobRole}</p>
                  </div>
                  <DifficultyBadge level={selectedFeedback.overallDifficulty} />
                  {canDelete && (
                    <button onClick={() => confirmDelete(selectedFeedback.id)}
                      className={`ml-2 rounded-lg p-1.5 transition-all ${
                        deletingId === selectedFeedback.id
                          ? "bg-rose-500/30 text-rose-400 animate-pulse"
                          : "text-white/30 hover:bg-rose-500/20 hover:text-rose-400"
                      }`}
                      title={deletingId === selectedFeedback.id ? "Click again to confirm" : "Delete"}
                    >
                      {deletingId === selectedFeedback.id ? <FiX size={14} /> : <FiTrash2 size={14} />}
                    </button>
                  )}
                </div>
                <button onClick={() => setSelectedFeedback(null)}
                  className="rounded-full bg-white/10 p-2 text-white/50 transition-all hover:bg-white/20 hover:text-white">
                  <FiX size={16} />
                </button>
              </div>

              <div className="max-h-[65vh] overflow-y-auto p-6 space-y-5 text-sm">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-lg bg-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-300">
                    <FiBriefcase size={12} className="inline mr-1" />{selectedFeedback.companyName}
                  </span>
                  <span className="rounded-lg bg-white/10 px-3 py-1 text-xs text-white/60">{selectedFeedback.jobRole}</span>
                  <span className="rounded-lg bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300">
                    <FiDollarSign size={12} className="inline mr-1" />{selectedFeedback.package} LPA
                  </span>
                  <span className="rounded-lg bg-white/10 px-3 py-1 text-xs text-white/60">
                    <FiUser size={12} className="inline mr-1" />{selectedFeedback.batch}
                  </span>
                </div>

                {selectedFeedback.selectionProcess && <Section title="Selection Process" text={selectedFeedback.selectionProcess} />}
                {selectedFeedback.aptitudePrep && <Section title="Aptitude Preparation" text={selectedFeedback.aptitudePrep} />}
                {selectedFeedback.aptitudeTopics && <Section title="Aptitude Topics Asked" text={selectedFeedback.aptitudeTopics} />}
                {selectedFeedback.techInterviewExp && <Section title="Technical Interview Experience" text={selectedFeedback.techInterviewExp} />}
                {selectedFeedback.techQuestions && <Section title="Technical Questions Asked" text={selectedFeedback.techQuestions} />}
                {selectedFeedback.hrInterviewExp && <Section title="HR Interview Experience" text={selectedFeedback.hrInterviewExp} />}
                {selectedFeedback.hrQuestions && <Section title="HR Questions Asked" text={selectedFeedback.hrQuestions} />}
                {selectedFeedback.projectsDiscussed && <Section title="Projects Discussed" text={selectedFeedback.projectsDiscussed} />}
                {selectedFeedback.techTested && <Section title="Technologies Tested" text={selectedFeedback.techTested} />}
                {selectedFeedback.difficulties && <Section title="Difficulties Faced" text={selectedFeedback.difficulties} />}
                {selectedFeedback.tips && <Section title="Tips for Juniors" text={selectedFeedback.tips} />}

                {selectedFeedback.resources?.length > 0 && (
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-white/50">Resources Used</p>
                    <div className="flex flex-wrap gap-2">
                      {(selectedFeedback.resources || []).map((r) => (
                        <span key={r} className="rounded-lg bg-indigo-500/20 px-3 py-1 text-[11px] font-semibold text-indigo-300">
                          <FiBook size={11} className="inline mr-1" />{r}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedFeedback.resourceFileUrl && (
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-white/50">Attached File</p>
                    <a href={selectedFeedback.resourceFileUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-indigo-500/20 px-4 py-2 text-xs font-semibold text-indigo-300 transition-all hover:bg-indigo-500/30"
                    >
                      <FiFile size={14} /> View Attachment
                    </a>
                  </div>
                )}

                {selectedFeedback.comments && <Section title="Additional Comments" text={selectedFeedback.comments} />}

                <div className="flex items-center gap-2 pt-2">
                  {selectedFeedback.recommend === "Strongly Recommend" || selectedFeedback.recommend === "Yes" ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400"><FiThumbsUp size={12} /> {selectedFeedback.recommend === "Strongly Recommend" ? "Strongly recommends this company" : "Recommends this company"}</span>
                  ) : selectedFeedback.recommend === "No" || selectedFeedback.recommend === "Strongly Not Recommend" ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-400"><FiX size={12} /> {selectedFeedback.recommend === "Strongly Not Recommend" ? "Strongly does not recommend" : "Does not recommend this company"}</span>
                  ) : selectedFeedback.recommend === "Neutral" ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400"><FiThumbsUp size={12} /> Neutral about this company</span>
                  ) : null}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

// ─── Difficulty badge ───
function DifficultyBadge({ level }) {
  const style = DIFFICULTY_COLORS[level] || DIFFICULTY_COLORS.Medium;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${style.badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {level}
    </span>
  );
}

// ─── Form field helper ───
function FormField({ label, required, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-white/50">
        {label} {required && <span className="text-rose-400">*</span>}
      </label>
      {children}
    </div>
  );
}

// ─── Truncate text ───
function truncate(text, len = 120) {
  if (!text) return "";
  return text.length > len ? text.substring(0, len) + "..." : text;
}

// ─── Section helper for Read More modal ───
function Section({ title, text }) {
  if (!text) return null;
  return (
    <div>
      <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-indigo-300/70">{title}</p>
      <p className="text-sm text-white/80 leading-relaxed">{text}</p>
    </div>
  );
}
