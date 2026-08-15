// src/pages/InterviewExperiences.jsx
// Interview Experience Repository page: Community-driven collection of interview experiences from visiting companies.

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FiBriefcase, FiPlus, FiThumbsUp, FiCheckCircle, FiXCircle, 
  FiClock, FiSearch, FiFilter, FiAward, FiMessageSquare, FiBookOpen 
} from "react-icons/fi";
import { getInterviewExperiences, upvoteInterviewExperience } from "../services/interviewService";
import { useAuth } from "../context/AuthContext";
import GlassCard from "../components/ui/GlassCard";
import Button from "../components/ui/Button";
import ShareInterviewModal from "../components/dashboard/ShareInterviewModal";
import toast from "react-hot-toast";

export default function InterviewExperiences() {
  const { user } = useAuth();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    fetchExperiences();
  }, []);

  async function fetchExperiences() {
    setLoading(true);
    try {
      const data = await getInterviewExperiences();
      setExperiences(data);
    } catch (err) {
      console.error("Error loading interview experiences:", err);
      toast.error("Failed to load interview experiences");
    } finally {
      setLoading(false);
    }
  }

  const handleUpvote = async (id) => {
    try {
      await upvoteInterviewExperience(id);
      setExperiences((prev) =>
        prev.map((exp) => (exp.id === id ? { ...exp, upvotes: (exp.upvotes || 0) + 1 } : exp))
      );
      toast.success("Helpful vote added! 👍");
    } catch (err) {
      toast.error("Failed to vote");
    }
  };

  const filtered = experiences.filter((exp) => {
    const matchesSearch =
      exp.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.questionsAsked?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDifficulty =
      filterDifficulty === "all" || exp.difficulty?.toLowerCase() === filterDifficulty.toLowerCase();

    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Banner Header */}
        <div className="rounded-3xl bg-gradient-to-r from-[#4A0014] via-[#7F011F] to-[#1E293B] p-8 text-white shadow-xl relative overflow-hidden border border-white/10">
          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-xs">
              <FiBriefcase size={12} /> Campus Recruitment Hub
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight">Interview Experience Repository</h1>
            <p className="text-sm text-slate-200 leading-relaxed">
              Real interview questions, round breakdowns, and preparation advice shared by CS students for top tech recruiters.
            </p>
            <button
              onClick={() => setShowShareModal(true)}
              className="mt-3 inline-flex items-center gap-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#021C4F] font-extrabold text-xs px-5 py-2.5 shadow-md transition-all cursor-pointer"
            >
              <FiPlus size={16} /> Share Your Experience
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search by company (e.g. TCS, ZoHo), role, or questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#021C4F]/20"
            />
          </div>
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none text-slate-700 font-medium"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Grid List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-56 bg-white dark:bg-slate-900 rounded-2xl animate-pulse border border-slate-200 dark:border-slate-800" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center py-16 px-6">
            <FiBriefcase className="mx-auto text-slate-400 dark:text-slate-500 mb-2" size={48} />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">No Interview Experiences Found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Be the first student to share your interview journey!</p>
            <button
              onClick={() => setShowShareModal(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#7F011F] text-white px-5 py-2.5 text-xs font-bold shadow-md hover:bg-[#990227]"
            >
              <FiPlus size={16} /> Share Experience
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map((exp) => (
              <div
                key={exp.id}
                className="flex flex-col justify-between rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl transition-all duration-300 space-y-4 text-left"
              >
                <div className="space-y-4">
                  {/* Card Top */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-extrabold text-[#021C4F] dark:text-sky-300">{exp.company}</h3>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                            exp.verdict === "Selected"
                              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                              : "bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                          }`}
                        >
                          {exp.verdict === "Selected" ? "✅ Selected" : "⏳ " + exp.verdict}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-0.5">
                        {exp.role} • CTC: <span className="font-bold text-emerald-600 dark:text-emerald-400">{exp.ctc}</span>
                      </p>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-extrabold border ${
                        exp.difficulty === "Easy"
                          ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                          : exp.difficulty === "Hard"
                          ? "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800"
                          : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                      }`}
                    >
                      {exp.difficulty}
                    </span>
                  </div>

                  {/* Interview Rounds Detail */}
                  {exp.roundsDetail && (
                    <div className="space-y-1">
                      <p className="text-[11px] font-extrabold uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <FiClock size={12} /> Rounds Breakdown ({exp.roundsCount || 3} Rounds)
                      </p>
                      <p className="text-xs text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700 whitespace-pre-wrap leading-relaxed font-medium">
                        {exp.roundsDetail}
                      </p>
                    </div>
                  )}

                  {/* Questions Asked */}
                  {exp.questionsAsked && (
                    <div className="space-y-1">
                      <p className="text-[11px] font-extrabold uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <FiMessageSquare size={12} /> Key Questions Asked
                      </p>
                      <p className="text-xs text-slate-800 dark:text-slate-100 bg-sky-50/70 dark:bg-sky-950/40 p-3 rounded-xl border border-sky-200/60 dark:border-sky-800/50 leading-relaxed font-mono">
                        {exp.questionsAsked}
                      </p>
                    </div>
                  )}

                  {/* Preparation Tips */}
                  {exp.preparationTips && (
                    <div className="space-y-1">
                      <p className="text-[11px] font-extrabold uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <FiBookOpen size={12} /> Preparation Advice
                      </p>
                      <p className="text-xs text-slate-700 dark:text-slate-300 italic font-medium bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                        &quot;{exp.preparationTips}&quot;
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer Meta */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>
                    Shared by: <strong className="text-slate-800 dark:text-slate-200 font-extrabold">{exp.studentName}</strong> ({exp.batch} Batch)
                  </span>
                  <button
                    onClick={() => handleUpvote(exp.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold transition-colors"
                  >
                    <FiThumbsUp size={14} className="text-[#0F4C81] dark:text-sky-400" /> Helpful ({exp.upvotes || 0})
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Share Modal */}
      <ShareInterviewModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        onSuccess={fetchExperiences}
      />
    </div>
  );
}
