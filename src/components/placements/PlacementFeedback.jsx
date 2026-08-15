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

const MOCK_FEEDBACKS = [
  {
    id: "fb-1",
    fullName: "Vasanth K",
    batch: "2025",
    companyName: "Zoho Corporation",
    jobRole: "Software Developer (MTS)",
    package: 8.5,
    overallDifficulty: "Hard",
    selectionProcess: "Round 1: C/C++ Written Logic Test. Round 2: 5 Basic Coding Problems. Round 3: Advanced Console Application (Design Railway Ticket Booking System in Java). Round 4: Technical & HR Discussion.",
    tips: "Focus on dry running loops and pointers on paper without relying on IDE autocompletion.",
    recommend: "Strongly Recommend",
    createdAt: { seconds: Date.now() / 1000 - 86400 },
  },
  {
    id: "fb-2",
    fullName: "Priya Dharshini R",
    batch: "2025",
    companyName: "TCS Digital",
    jobRole: "Systems Engineer",
    package: 7.0,
    overallDifficulty: "Medium",
    selectionProcess: "Round 1: TCS NQT Advanced Aptitude & Coding. Round 2: Technical Interview on SQL, DBMS, and Final Year Project. Round 3: HR Interview.",
    tips: "Be 100% prepared with your academic project architecture and SQL subqueries.",
    recommend: "Yes",
    createdAt: { seconds: Date.now() / 1000 - 172800 },
  },
  {
    id: "fb-3",
    fullName: "Karthik Raja S",
    batch: "2024",
    companyName: "Cognizant (CTS)",
    jobRole: "GenC Next Developer",
    package: 6.75,
    overallDifficulty: "Medium",
    selectionProcess: "Round 1: GenC Technical Test (DSA & SQL). Round 2: Live Technical Interview on OOPs & Web Development. Round 3: HR Round.",
    tips: "Practice DSA array and string problems on LeetCode.",
    recommend: "Yes",
    createdAt: { seconds: Date.now() / 1000 - 259200 },
  },
];

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
        setFeedbacks(data.length > 0 ? data : MOCK_FEEDBACKS);
      } catch (err) {
        console.error("Failed to fetch feedback:", err);
        setFeedbacks(MOCK_FEEDBACKS);
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
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-16 text-left pb-16">
      <div className="mb-8 text-center border-t-2 border-slate-200 dark:border-slate-800 pt-12">
        <h2 className="font-sans text-3xl sm:text-4xl font-black text-[#7F011F] dark:text-rose-400 tracking-tight">
          Placement Experiences
        </h2>
        <p className="mt-2 text-sm sm:text-base font-extrabold text-slate-800 dark:text-slate-100 max-w-xl mx-auto">
          Learn from seniors who&apos;ve been through the recruitment process
        </p>
      </div>

      {/* ── Share Button (Always Visible) ── */}
      <div className="mb-10 text-center">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2.5 rounded-xl bg-[#7F011F] hover:bg-[#990227] px-7 py-3.5 text-sm font-extrabold text-white shadow-lg transition-all cursor-pointer"
        >
          <FiShare2 size={18} />
          Share Your Experience
        </motion.button>
      </div>

      {/* ── Search & Filter Bar ── */}
      {feedbacks.length > 0 && (
        <div className="mb-8 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm text-left">
          <div className="relative flex-1 min-w-[200px]">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by company, name, role..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-2 pl-9 pr-3 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-[#7F011F] transition-all font-medium"
            />
          </div>
          <select value={filterCompany} onChange={(e) => setFilterCompany(e.target.value)}
            className="w-full sm:w-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-[#7F011F] transition-all font-bold">
            <option value="">All Companies</option>
            {uniqueCompanies.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filterBatch} onChange={(e) => setFilterBatch(e.target.value)}
            className="w-full sm:w-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-[#7F011F] transition-all font-bold">
            <option value="">All Batches</option>
            {uniqueBatches.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
          <select value={filterDifficulty} onChange={(e) => setFilterDifficulty(e.target.value)}
            className="w-full sm:w-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-[#7F011F] transition-all font-bold">
            <option value="">All Difficulties</option>
            <option value="Very Easy">Very Easy</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
            <option value="Very Hard">Very Hard</option>
          </select>
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 ml-auto">
            {sortedFeedbacks.length} experience{sortedFeedbacks.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* ── Empty State (Always with Visible Share Button) ── */}
      {sortedFeedbacks.length === 0 && !loading && (
        <div className="flex flex-col items-center rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 py-16 px-6 text-center shadow-sm">
          <FiMessageSquare size={48} className="mb-3 text-[#7F011F] dark:text-sky-400" />
          <p className="text-base font-extrabold text-slate-900 dark:text-slate-100">No placement experiences shared yet</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
            Be the first student to share your recruitment journey with fellow Computer Science peers!
          </p>
          <button onClick={() => setShowForm(true)}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#7F011F] hover:bg-[#990227] px-5 py-2.5 text-xs font-extrabold text-white shadow-md transition-all cursor-pointer"
          >
            <FiShare2 size={15} /> Be the first to share!
          </button>
        </div>
      )}

      {/* ── Experience Cards ── */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {paginatedFeedbacks.map((fb, i) => (
          <motion.div key={fb.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <div className="group relative h-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col text-left space-y-3">

              {/* Header */}
              <div className="flex items-center gap-3 mb-1">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#7F011F] to-[#021C4F] text-xs font-black text-white shadow-md">
                  {fb.fullName?.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <p className="truncate text-sm font-black text-slate-900 dark:text-white">{fb.fullName}</p>
                  <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300">{fb.batch ? `${fb.batch} Passing Batch` : "Batch not specified"}</p>
                </div>
                <DifficultyBadge level={fb.overallDifficulty} />
              </div>

              {/* Company & Role */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-lg bg-rose-500/10 text-[#7F011F] dark:text-rose-300 border border-rose-500/20 px-2.5 py-1 text-xs font-extrabold">
                  <FiBriefcase size={12} /> {fb.companyName}
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{fb.jobRole}</span>
                {fb.package && (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 px-2.5 py-1 text-xs font-black">
                    <FiDollarSign size={12} /> ₹{fb.package} LPA
                  </span>
                )}
              </div>

              {fb.selectionProcess && (
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300 line-clamp-3 leading-relaxed flex-1 text-left">
                  {fb.selectionProcess}
                </p>
              )}

              {/* Footer */}
              <div className="mt-auto border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                  {fb.createdAt ? formatDate(fb.createdAt) : "Just now"}
                </span>
                <button
                  onClick={() => setSelectedFeedback(fb)}
                  className="inline-flex items-center gap-1 text-xs font-extrabold text-[#7F011F] hover:text-[#990227] dark:text-sky-400 transition-colors cursor-pointer"
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
                  : "bg-white border border-[#E5E7EB] text-[#4B5563] hover:bg-[#F8FAFC]"
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
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 backdrop-blur-md p-4 sm:p-6"
            onClick={() => { if (!submitting) setShowForm(false); }}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="my-auto w-full max-w-3xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl text-left overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Form Header (Fixed Sticky Top) */}
              <div className="shrink-0 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-[#4A0014] via-[#7F011F] to-[#1E293B] px-6 py-4 text-white z-10">
                <div>
                  <h3 className="text-base font-black text-white">Share Experience Feedback</h3>
                  <p className="text-xs font-medium text-slate-200">Share your placement experience to help juniors prepare</p>
                </div>
                <button onClick={() => setShowForm(false)} disabled={submitting}
                  className="rounded-full bg-white/10 p-2 text-white/80 hover:bg-white/20 hover:text-white transition-all cursor-pointer">
                  <FiX size={16} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">

                {/* ── Student Information ── */}
                <div>
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-black text-[#7F011F] dark:text-rose-400">
                    <FiUser size={15} /> Student &amp; Recruitment Information
                  </h4>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <FormField label="Full Name" required>
                      <input value={form.fullName} onChange={handleFieldChange('fullName')}
                        placeholder="e.g. John Doe" className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#7F011F] focus:outline-none transition-all" />
                    </FormField>
                    <FormField label="Roll Number" required>
                      <input value={form.rollNumber} onChange={handleFieldChange('rollNumber')}
                        placeholder="e.g. 24E3001" className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#7F011F] focus:outline-none transition-all" />
                    </FormField>
                    <FormField label="Batch (Year of Passing)" required>
                      <input value={form.batch} onChange={handleFieldChange('batch')}
                        placeholder="e.g. 2026" className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#7F011F] focus:outline-none transition-all" />
                    </FormField>
                    <FormField label="Company Name" required>
                      <input value={form.companyName} onChange={handleFieldChange('companyName')}
                        placeholder="e.g. Google" className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#7F011F] focus:outline-none transition-all" />
                    </FormField>
                    <FormField label="Job Role" required>
                      <input value={form.jobRole} onChange={handleFieldChange('jobRole')}
                        placeholder="e.g. SDE-1" className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#7F011F] focus:outline-none transition-all" />
                    </FormField>
                    <FormField label="Package (LPA)" required>
                      <input value={form.package} onChange={handleFieldChange('package')}
                        placeholder="e.g. 32" type="number" step="0.1" className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#7F011F] focus:outline-none transition-all" />
                    </FormField>
                    <FormField label="Interview Date">
                      <input value={form.interviewDate} onChange={handleFieldChange('interviewDate')}
                        type="date" className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none" />
                    </FormField>
                  </div>
                </div>

                {/* ── Selection Process ── */}
                <div>
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-black text-[#7F011F] dark:text-rose-400">
                    <FiBriefcase size={15} /> Selection Process
                  </h4>
                  <div className="space-y-4">
                    <FormField label="Overall Selection Process" required>
                      <textarea value={form.selectionProcess} onChange={handleFieldChange('selectionProcess')}
                        rows={3} placeholder="Describe the rounds (e.g. Online Test, Technical, HR)..." className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#7F011F] focus:outline-none transition-all" />
                    </FormField>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField label="Aptitude Preparation">
                        <textarea value={form.aptitudePrep} onChange={handleFieldChange('aptitudePrep')}
                          rows={2} placeholder="How did you prepare for aptitude?" className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#7F011F] focus:outline-none transition-all" />
                      </FormField>
                      <FormField label="Aptitude Topics Asked">
                        <textarea value={form.aptitudeTopics} onChange={handleFieldChange('aptitudeTopics')}
                          rows={2} placeholder="e.g. Probability, Time & Work, Puzzles..." className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#7F011F] focus:outline-none transition-all" />
                      </FormField>
                    </div>
                  </div>
                </div>

                {/* ── Interview Details ── */}
                <div>
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-black text-[#7F011F] dark:text-rose-400">
                    <FiMessageSquare size={15} /> Interview Details
                  </h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField label="Technical Interview Experience">
                        <textarea value={form.techInterviewExp} onChange={handleFieldChange('techInterviewExp')}
                          rows={3} placeholder="Describe your technical rounds..." className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#7F011F] focus:outline-none transition-all" />
                      </FormField>
                      <FormField label="Technical Questions Asked">
                        <textarea value={form.techQuestions} onChange={handleFieldChange('techQuestions')}
                          rows={3} placeholder="List some questions (e.g. OOPs, DSA, DBMS)..." className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#7F011F] focus:outline-none transition-all" />
                      </FormField>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField label="HR Interview Experience">
                        <textarea value={form.hrInterviewExp} onChange={handleFieldChange('hrInterviewExp')}
                          rows={2} placeholder="Describe your HR round..." className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#7F011F] focus:outline-none transition-all" />
                      </FormField>
                      <FormField label="HR Questions Asked">
                        <textarea value={form.hrQuestions} onChange={handleFieldChange('hrQuestions')}
                          rows={2} placeholder="e.g. Tell me about yourself, Strengths..." className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#7F011F] focus:outline-none transition-all" />
                      </FormField>
                    </div>
                  </div>
                </div>

                {/* ── Preparation & Advice ── */}
                <div>
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-black text-[#7F011F] dark:text-rose-400">
                    <FiBook size={15} /> Preparation &amp; Advice
                  </h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField label="Projects Discussed">
                        <textarea value={form.projectsDiscussed} onChange={handleFieldChange('projectsDiscussed')}
                          rows={2} placeholder="Details about projects they questioned..." className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#7F011F] focus:outline-none transition-all" />
                      </FormField>
                      <FormField label="Technologies & Languages Tested">
                        <textarea value={form.techTested} onChange={handleFieldChange('techTested')}
                          rows={2} placeholder="e.g. Java, Python, React, SQL..." className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#7F011F] focus:outline-none transition-all" />
                      </FormField>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField label="Difficulties Faced">
                        <textarea value={form.difficulties} onChange={handleFieldChange('difficulties')}
                          rows={2} placeholder="What was the toughest part?" className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#7F011F] focus:outline-none transition-all" />
                      </FormField>
                      <FormField label="Tips for Juniors">
                        <textarea value={form.tips} onChange={handleFieldChange('tips')}
                          rows={2} placeholder="What should juniors focus on?" className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#7F011F] focus:outline-none transition-all" />
                      </FormField>
                    </div>

                    {/* Resources */}
                    <FormField label="Resources Used">
                      <div className="flex flex-wrap gap-2 pt-1.5">
                        {RESOURCES_OPTIONS.map((res) => (
                          <button key={res} type="button" onClick={() => handleResourceToggle(res)}
                            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                              selectedResources.includes(res)
                                ? "bg-[#7F011F] text-white shadow-sm"
                                : "bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200"
                            }`}
                          >
                            {res}
                          </button>
                        ))}
                      </div>
                    </FormField>

                    {/* File Upload */}
                    <FormField label="Upload supporting file (PDF)">
                      <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-3 transition-all hover:border-[#7F011F]/50">
                        <FiUpload className="text-[#7F011F] dark:text-rose-400 shrink-0" size={18} />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          {uploadFileObj ? uploadFileObj.name : "Choose PDF or document..."}
                        </span>
                        <input type="file" accept=".pdf,.doc,.docx,.txt" className="hidden"
                          onChange={(e) => setUploadFileObj(e.target.files?.[0] || null)} />
                      </label>
                      {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                          <div className="h-full bg-[#7F011F] transition-all" style={{ width: `${uploadProgress}%` }} />
                        </div>
                      )}
                    </FormField>

                    {/* Difficulty & Recommend */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField label="Overall Difficulty" required>
                        <select value={form.overallDifficulty} onChange={handleFieldChange('overallDifficulty')}
                          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none">
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
                          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none">
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
                        rows={2} placeholder="Any other suggestions..." className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#7F011F] focus:outline-none transition-all" />
                    </FormField>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800 pt-4">
                  <button type="button" onClick={() => setShowForm(false)} disabled={submitting}
                    className="rounded-lg border border-[#E5E7EB] bg-white px-5 py-2.5 text-xs font-semibold text-[#4B5563] transition-all hover:bg-[#F8FAFC]">
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

                <div className="flex items-center gap-2 pt-2 border-t border-[#E5E7EB]/50">
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
      <label className="mb-1.5 block text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
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
      <p className="mb-1.5 text-xs font-black uppercase tracking-wider text-[#7F011F] dark:text-rose-400">{title}</p>
      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">{text}</p>
    </div>
  );
}
