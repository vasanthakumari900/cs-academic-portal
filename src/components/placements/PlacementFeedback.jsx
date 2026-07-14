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
  "Very Easy": { badge: "bg-emerald-50 text-emerald-700 border border-emerald-200", dot: "bg-emerald-600" },
  Easy: { badge: "bg-emerald-50 text-emerald-700 border border-emerald-200", dot: "bg-emerald-600" },
  Medium: { badge: "bg-amber-50 text-amber-800 border border-amber-200", dot: "bg-amber-650" },
  Hard: { badge: "bg-red-50 text-red-700 border border-red-200", dot: "bg-red-600" },
  "Very Hard": { badge: "bg-red-100 text-red-800 border border-red-300", dot: "bg-red-700" },
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

  const uniqueCompanies = Array.from(new Set(feedbacks.map((f) => f.companyName).filter(Boolean)));
  const uniqueBatches = Array.from(new Set(feedbacks.map((f) => f.batch).filter(Boolean)));

  const totalPages = Math.ceil(sortedFeedbacks.length / ITEMS_PER_PAGE);
  const paginatedFeedbacks = sortedFeedbacks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  function handleFieldChange(field) {
    return (e) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };
  }

  function handleResourceToggle(res) {
    setSelectedResources((prev) =>
      prev.includes(res) ? prev.filter((r) => r !== res) : [...prev, res]
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.fullName.trim() || !form.companyName.trim() || !form.jobRole.trim()) {
      toast.error("Please fill in the required fields.");
      return;
    }

    setSubmitting(true);
    try {
      let fileUrl = "";
      if (uploadFileObj) {
        fileUrl = await uploadFile(STORAGE_PATHS.FEEDBACK_DOCS, uploadFileObj, setUploadProgress);
      }

      await feedbackService.create({
        ...form,
        package: Number(form.package) || null,
        resources: selectedResources,
        resourceFileUrl: fileUrl,
      });

      toast.success("Thank you for sharing your experience!");
      setForm({ ...EMPTY_FORM });
      setSelectedResources([]);
      setUploadFileObj(null);
      setShowForm(false);

      // Refetch
      const updated = await feedbackService.list({ max: 100 });
      setFeedbacks(updated);
    } catch (err) {
      toast.error(err.message || "Failed to submit feedback.");
    } finally {
      setSubmitting(false);
      setUploadProgress(0);
    }
  }

  async function confirmDelete(id) {
    if (deletingId === id) {
      try {
        await feedbackService.remove(id);
        toast.success("Feedback deleted");
        setFeedbacks((prev) => prev.filter((f) => f.id !== id));
        setSelectedFeedback(null);
      } catch (err) {
        toast.error("Failed to delete");
      } finally {
        setDeletingId(null);
      }
    } else {
      setDeletingId(id);
      setTimeout(() => setDeletingId(null), 3000); // auto reset
    }
  }

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-16 text-left">
      <div className="mb-8 text-center border-t border-[#E5E7EB] pt-12">
        <h2 className="font-sans text-2xl font-bold text-[#1F2937]">
          Placement Experiences
        </h2>
        <p className="mt-1 text-sm text-[#6B7280]">
          Learn from seniors who've been through the recruitment process
        </p>
      </div>

      {/* ── Share Button ── */}
      {isStudent && (
        <div className="mb-10 text-center">
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0F4C81] hover:bg-[#1E88E5] px-6 py-3 text-sm font-bold text-white shadow-sm transition-all"
          >
            <FiShare2 size={16} />
            Share Your Experience
          </motion.button>
        </div>
      )}

      {/* ── Search & Filter Bar ── */}
      {feedbacks.length > 0 && (
        <div className="mb-8 flex flex-wrap items-center gap-3 rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm text-left">
          <div className="relative flex-1 min-w-[200px]">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by company, name, role..."
              className="w-full rounded-lg border border-[#E5E7EB] bg-slate-50 py-2 pl-9 pr-3 text-xs text-[#1F2937] placeholder-slate-400 outline-none focus:border-[#0F4C81] transition-all"
            />
          </div>
          <select value={filterCompany} onChange={(e) => setFilterCompany(e.target.value)}
            className="w-full sm:w-auto rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-xs text-[#4B5563] outline-none focus:border-[#0F4C81] transition-all">
            <option value="">All Companies</option>
            {uniqueCompanies.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filterBatch} onChange={(e) => setFilterBatch(e.target.value)}
            className="w-full sm:w-auto rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-xs text-[#4B5563] outline-none focus:border-[#0F4C81] transition-all">
            <option value="">All Batches</option>
            {uniqueBatches.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
          <select value={filterDifficulty} onChange={(e) => setFilterDifficulty(e.target.value)}
            className="w-full sm:w-auto rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-xs text-[#4B5563] outline-none focus:border-[#0F4C81] transition-all">
            <option value="">All Difficulties</option>
            <option value="Very Easy">Very Easy</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
            <option value="Very Hard">Very Hard</option>
          </select>
          <span className="text-[11px] text-[#6B7280] ml-auto">
            {sortedFeedbacks.length} experience{sortedFeedbacks.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* ── Empty State ── */}
      {sortedFeedbacks.length === 0 && !loading && (
        <div className="flex flex-col items-center rounded-xl border-2 border-dashed border-[#E5E7EB] bg-white py-16 text-center shadow-sm">
          <FiMessageSquare size={48} className="mb-3 text-slate-350" />
          <p className="text-sm font-medium text-[#4B5563]">No placement experiences yet</p>
          {isStudent && (
            <button onClick={() => setShowForm(true)}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#0F4C81] hover:bg-[#1E88E5] px-4 py-2 text-xs font-bold text-white shadow-sm"
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
            <div className="group relative h-full rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col text-left">

              {/* Header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#0F4C81] text-xs font-bold text-white shadow-sm">
                  {fb.fullName?.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <p className="truncate text-sm font-bold text-[#1F2937]">{fb.fullName}</p>
                  <p className="text-[11px] text-[#6B7280]">{fb.batch || "Batch not specified"}</p>
                </div>
                <DifficultyBadge level={fb.overallDifficulty} />
              </div>

              {/* Company & Role */}
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded bg-[#0F4C81]/10 px-2 py-1 text-[11px] font-bold text-[#0F4C81]">
                  <FiBriefcase size={11} /> {fb.companyName}
                </span>
                <span className="text-[11px] text-[#6B7280]">{fb.jobRole}</span>
                <span className="inline-flex items-center gap-1 rounded bg-[#2E7D32]/10 px-2 py-1 text-[11px] font-bold text-[#2E7D32]">
                  <FiDollarSign size={11} /> {fb.package} LPA
                </span>
              </div>

              {fb.selectionProcess && (
                <p className="mb-4 text-xs text-[#6B7280] line-clamp-3 leading-relaxed flex-1 text-left">
                  {truncate(fb.selectionProcess, 150)}
                </p>
              )}

              {/* Footer */}
              <div className="mt-auto border-t border-slate-100 pt-3 flex items-center justify-between">
                <span className="text-[10px] text-[#6B7280]">
                  {fb.createdAt ? formatDate(fb.createdAt) : "Just now"}
                </span>
                <button
                  onClick={() => setSelectedFeedback(fb)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#1E88E5] hover:text-[#0F4C81] transition-colors"
                >
                  Read full experience &rarr;
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={`h-8 w-8 rounded-lg text-xs font-bold transition-all ${
                currentPage === idx + 1
                  ? "bg-[#0F4C81] text-white shadow-sm"
                  : "bg-white border border-[#E5E7EB] text-[#4B5563] hover:bg-slate-50"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}

      {/* ── Submit Feedback Form Modal ── */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center overflow-auto bg-black/50 p-4"
            onClick={() => { if (!submitting) setShowForm(false); }}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="my-8 w-full max-w-3xl rounded-xl border border-[#E5E7EB] bg-white shadow-2xl text-left"
            >
              {/* Form Header */}
              <div className="flex items-center justify-between border-b border-[#E5E7EB] bg-[#0F4C81] px-6 py-4 text-white">
                <div>
                  <h3 className="text-base font-bold text-white">Share Experience Feedback</h3>
                  <p className="text-xs text-white/80">Share your placement experience to help juniors prepare</p>
                </div>
                <button onClick={() => setShowForm(false)} disabled={submitting}
                  className="rounded-full bg-white/10 p-2 text-white/70 hover:bg-white/20 hover:text-white transition-all">
                  <FiX size={16} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto p-6 space-y-6">

                {/* ── Student Information ── */}
                <div>
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#1F2937]">
                    <FiUser size={14} className="text-[#0F4C81]" /> Student & Recruitment Information
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
                        type="date" className="input-premium bg-white" />
                    </FormField>
                  </div>
                </div>

                {/* ── Selection Process ── */}
                <div>
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#1F2937]">
                    <FiBriefcase size={14} className="text-[#0F4C81]" /> Selection Process
                  </h4>
                  <div className="space-y-4">
                    <FormField label="Overall Selection Process" required>
                      <textarea value={form.selectionProcess} onChange={handleFieldChange('selectionProcess')}
                        rows={3} placeholder="Describe the rounds (e.g. Online Test, Technical, HR)..." className="input-premium" />
                    </FormField>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField label="Aptitude Preparation">
                        <textarea value={form.aptitudePrep} onChange={handleFieldChange('aptitudePrep')}
                          rows={2} placeholder="How did you prepare for aptitude?" className="input-premium" />
                      </FormField>
                      <FormField label="Aptitude Topics Asked">
                        <textarea value={form.aptitudeTopics} onChange={handleFieldChange('aptitudeTopics')}
                          rows={2} placeholder="e.g. Probability, Time & Work, Puzzles..." className="input-premium" />
                      </FormField>
                    </div>
                  </div>
                </div>

                {/* ── Interview Details ── */}
                <div>
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#1F2937]">
                    <FiMessageSquare size={14} className="text-[#0F4C81]" /> Interview Details
                  </h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField label="Technical Interview Experience">
                        <textarea value={form.techInterviewExp} onChange={handleFieldChange('techInterviewExp')}
                          rows={3} placeholder="Describe your technical rounds..." className="input-premium" />
                      </FormField>
                      <FormField label="Technical Questions Asked">
                        <textarea value={form.techQuestions} onChange={handleFieldChange('techQuestions')}
                          rows={3} placeholder="List some questions (e.g. OOPs, DSA, DBMS)..." className="input-premium" />
                      </FormField>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField label="HR Interview Experience">
                        <textarea value={form.hrInterviewExp} onChange={handleFieldChange('hrInterviewExp')}
                          rows={2} placeholder="Describe your HR round..." className="input-premium" />
                      </FormField>
                      <FormField label="HR Questions Asked">
                        <textarea value={form.hrQuestions} onChange={handleFieldChange('hrQuestions')}
                          rows={2} placeholder="e.g. Tell me about yourself, Strengths..." className="input-premium" />
                      </FormField>
                    </div>
                  </div>
                </div>

                {/* ── Preparation & Advice ── */}
                <div>
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#1F2937]">
                    <FiBook size={14} className="text-[#0F4C81]" /> Preparation & Advice
                  </h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField label="Projects Discussed">
                        <textarea value={form.projectsDiscussed} onChange={handleFieldChange('projectsDiscussed')}
                          rows={2} placeholder="Details about projects they questioned..." className="input-premium" />
                      </FormField>
                      <FormField label="Technologies & Languages Tested">
                        <textarea value={form.techTested} onChange={handleFieldChange('techTested')}
                          rows={2} placeholder="e.g. Java, Python, React, SQL..." className="input-premium" />
                      </FormField>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField label="Difficulties Faced">
                        <textarea value={form.difficulties} onChange={handleFieldChange('difficulties')}
                          rows={2} placeholder="What was the toughest part?" className="input-premium" />
                      </FormField>
                      <FormField label="Tips for Juniors">
                        <textarea value={form.tips} onChange={handleFieldChange('tips')}
                          rows={2} placeholder="What should juniors focus on?" className="input-premium" />
                      </FormField>
                    </div>

                    {/* Resources */}
                    <FormField label="Resources Used">
                      <div className="flex flex-wrap gap-2 pt-1.5">
                        {RESOURCES_OPTIONS.map((res) => (
                          <button key={res} type="button" onClick={() => handleResourceToggle(res)}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                              selectedResources.includes(res)
                                ? "bg-[#0F4C81] text-white shadow-sm"
                                : "bg-slate-50 border border-[#E5E7EB] text-[#4B5563] hover:bg-slate-100"
                            }`}
                          >
                            {res}
                          </button>
                        ))}
                      </div>
                    </FormField>

                    {/* File Upload */}
                    <FormField label="Upload supporting file (PDF)">
                      <label className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed border-[#E5E7EB] bg-slate-50 px-4 py-3 transition-all hover:border-[#1E88E5]/50 hover:bg-slate-100">
                        <FiUpload className="text-[#0F4C81] shrink-0" size={18} />
                        <span className="text-xs text-[#6B7280]">
                          {uploadFileObj ? uploadFileObj.name : "Choose PDF or document..."}
                        </span>
                        <input type="file" accept=".pdf,.doc,.docx,.txt" className="hidden"
                          onChange={(e) => setUploadFileObj(e.target.files?.[0] || null)} />
                      </label>
                      {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-150">
                          <div className="h-full bg-[#0F4C81] transition-all" style={{ width: `${uploadProgress}%` }} />
                        </div>
                      )}
                    </FormField>

                    {/* Difficulty & Recommend */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField label="Overall Difficulty" required>
                        <select value={form.overallDifficulty} onChange={handleFieldChange('overallDifficulty')}
                          className="input-premium bg-white">
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
                          className="input-premium bg-white">
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
                <div className="flex items-center justify-end gap-3 border-t border-[#E5E7EB] pt-4">
                  <button type="button" onClick={() => setShowForm(false)} disabled={submitting}
                    className="rounded-lg border border-[#E5E7EB] bg-white px-5 py-2.5 text-xs font-semibold text-[#4B5563] transition-all hover:bg-slate-50">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#0F4C81] hover:bg-[#1E88E5] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all"
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
            className="fixed inset-0 z-50 flex items-start justify-center overflow-auto bg-black/50 p-4"
            onClick={() => setSelectedFeedback(null)}
          >
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.97 }}
              onClick={(e) => e.stopPropagation()}
              className="my-8 w-full max-w-2xl rounded-xl border border-[#E5E7EB] bg-white shadow-2xl text-left"
            >
              <div className="flex items-center justify-between border-b border-[#E5E7EB] bg-[#0F4C81] px-6 py-4 text-white">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1E88E5] text-xs font-bold text-white shadow-sm">
                    {selectedFeedback.fullName?.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{selectedFeedback.fullName}</p>
                    <p className="text-[11px] text-white/80">{selectedFeedback.companyName} · {selectedFeedback.jobRole}</p>
                  </div>
                  <DifficultyBadge level={selectedFeedback.overallDifficulty} />
                  {canDelete && (
                    <button onClick={() => confirmDelete(selectedFeedback.id)}
                      className={`ml-2 rounded-lg p-1.5 transition-all ${
                        deletingId === selectedFeedback.id
                          ? "bg-red-500/20 text-red-500 animate-pulse"
                          : "text-white/60 hover:bg-white/10 hover:text-white"
                      }`}
                      title={deletingId === selectedFeedback.id ? "Click again to confirm" : "Delete"}
                    >
                      {deletingId === selectedFeedback.id ? <FiX size={14} /> : <FiTrash2 size={14} />}
                    </button>
                  )}
                </div>
                <button onClick={() => setSelectedFeedback(null)}
                  className="rounded-full bg-white/10 p-2 text-white/70 hover:bg-white/20 hover:text-white transition-all">
                  <FiX size={16} />
                </button>
              </div>

              <div className="max-h-[65vh] overflow-y-auto p-6 space-y-5 text-sm">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded bg-[#0F4C81]/10 px-3 py-1 text-xs font-bold text-[#0F4C81]">
                    <FiBriefcase size={12} className="inline mr-1" />{selectedFeedback.companyName}
                  </span>
                  <span className="rounded bg-[#F8FAFC] border border-[#E5E7EB] px-3 py-1 text-xs text-[#6B7280]">{selectedFeedback.jobRole}</span>
                  <span className="rounded bg-[#2E7D32]/10 px-3 py-1 text-xs font-bold text-[#2E7D32]">
                    <FiDollarSign size={12} className="inline mr-1" />{selectedFeedback.package} LPA
                  </span>
                  <span className="rounded bg-[#F8FAFC] border border-[#E5E7EB] px-3 py-1 text-xs text-[#6B7280]">
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
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#6B7280]">Resources Used</p>
                    <div className="flex flex-wrap gap-2">
                      {(selectedFeedback.resources || []).map((r) => (
                        <span key={r} className="rounded bg-[#0F4C81]/10 px-3 py-1 text-[11px] font-semibold text-[#0F4C81]">
                          <FiBook size={11} className="inline mr-1" />{r}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedFeedback.resourceFileUrl && (
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#6B7280]">Attached File</p>
                    <a href={selectedFeedback.resourceFileUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded bg-[#0F4C81]/10 px-4 py-2 text-xs font-semibold text-[#0F4C81] transition-all hover:bg-[#0F4C81]/20"
                    >
                      <FiFile size={14} /> View Attachment
                    </a>
                  </div>
                )}

                {selectedFeedback.comments && <Section title="Additional Comments" text={selectedFeedback.comments} />}

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  {selectedFeedback.recommend === "Strongly Recommend" || selectedFeedback.recommend === "Yes" ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#2E7D32]"><FiThumbsUp size={12} /> {selectedFeedback.recommend === "Strongly Recommend" ? "Strongly recommends this company" : "Recommends this company"}</span>
                  ) : selectedFeedback.recommend === "No" || selectedFeedback.recommend === "Strongly Not Recommend" ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-650"><FiX size={12} /> {selectedFeedback.recommend === "Strongly Not Recommend" ? "Strongly does not recommend" : "Does not recommend this company"}</span>
                  ) : selectedFeedback.recommend === "Neutral" ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600"><FiThumbsUp size={12} /> Neutral about this company</span>
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
      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

// ─── Section helper for Read More modal ───
function Section({ title, text }) {
  if (!text) return null;
  return (
    <div>
      <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-[#0F4C81]">{title}</p>
      <p className="text-sm text-[#4B5563] leading-relaxed">{text}</p>
    </div>
  );
}
