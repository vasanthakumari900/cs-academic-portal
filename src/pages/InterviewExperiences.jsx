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
        <div className="rounded-3xl bg-gradient-to-r from-[#021C4F] via-[#032B7A] to-[#C50337] p-8 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-xs">
              <FiBriefcase size={12} /> Campus Recruitment Hub
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight">Interview Experience Repository</h1>
            <p className="text-sm text-slate-200 leading-relaxed">
              Real interview questions, round breakdowns, and preparation advice shared by CS students for top tech recruiters.
            </p>
            {user && (
              <Button
                onClick={() => setShowShareModal(true)}
                className="mt-2 bg-white text-[#021C4F] hover:bg-slate-100 border-none font-bold gap-2"
              >
                <FiPlus size={18} /> Share Your Experience
              </Button>
            )}
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
              <div key={n} className="h-56 bg-white rounded-2xl animate-pulse border border-slate-100" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <GlassCard className="text-center py-16">
            <FiBriefcase className="mx-auto text-slate-300 mb-2" size={48} />
            <h3 className="text-lg font-bold text-slate-700">No Interview Experiences Found</h3>
            <p className="text-xs text-slate-500 mt-1">Be the first student to share your interview journey!</p>
            {user && (
              <Button onClick={() => setShowShareModal(true)} className="mt-4 gap-2">
                <FiPlus size={16} /> Share Experience
              </Button>
            )}
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map((exp) => (
              <GlassCard key={exp.id} className="flex flex-col justify-between hover:shadow-xl transition-all duration-300">
                <div className="space-y-4">
                  {/* Card Top */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-[#021C4F]">{exp.company}</h3>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            exp.verdict === "Selected"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {exp.verdict === "Selected" ? "✅ Selected" : "⏳ " + exp.verdict}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-500">{exp.role} • CTC: {exp.ctc}</p>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                        exp.difficulty === "Easy"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : exp.difficulty === "Hard"
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {exp.difficulty}
                    </span>
                  </div>

                  {/* Interview Rounds Detail */}
                  {exp.roundsDetail && (
                    <div className="space-y-1">
                      <p className="text-[11px] font-bold uppercase text-slate-400 flex items-center gap-1">
                        <FiClock size={12} /> Rounds Breakdown ({exp.roundsCount || 3} Rounds)
                      </p>
                      <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100 whitespace-pre-wrap leading-relaxed">
                        {exp.roundsDetail}
                      </p>
                    </div>
                  )}

                  {/* Questions Asked */}
                  {exp.questionsAsked && (
                    <div className="space-y-1">
                      <p className="text-[11px] font-bold uppercase text-slate-400 flex items-center gap-1">
                        <FiMessageSquare size={12} /> Key Questions Asked
                      </p>
                      <p className="text-xs text-slate-800 bg-blue-50/50 p-2.5 rounded-xl border border-blue-100/60 leading-relaxed font-mono">
                        {exp.questionsAsked}
                      </p>
                    </div>
                  )}

                  {/* Preparation Tips */}
                  {exp.preparationTips && (
                    <div className="space-y-1">
                      <p className="text-[11px] font-bold uppercase text-slate-400 flex items-center gap-1">
                        <FiBookOpen size={12} /> Preparation Advice
                      </p>
                      <p className="text-xs text-slate-600 italic">"{exp.preparationTips}"</p>
                    </div>
                  )}
                </div>

                {/* Footer Meta */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>Shared by: <strong className="text-slate-600">{exp.studentName}</strong> ({exp.batch} Batch)</span>
                  <button
                    onClick={() => handleUpvote(exp.id)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
                  >
                    <FiThumbsUp size={14} className="text-blue-600" /> Helpful ({exp.upvotes || 0})
                  </button>
                </div>
              </GlassCard>
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
