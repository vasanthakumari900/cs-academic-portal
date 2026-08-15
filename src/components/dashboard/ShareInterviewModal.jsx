// src/components/dashboard/ShareInterviewModal.jsx
// Modal form for students to post interview experiences for campus visiting companies.

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiCheck } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { createInterviewExperience } from "../../services/interviewService";
import Button from "../ui/Button";
import toast from "react-hot-toast";

export default function ShareInterviewModal({ isOpen, onClose, onSuccess }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company: "",
    role: "Software Engineer (SDE)",
    batch: "2025",
    ctc: "6.5 LPA",
    difficulty: "Medium",
    verdict: "Selected",
    roundsCount: 3,
    roundsDetail: "",
    questionsAsked: "",
    preparationTips: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.company.trim()) {
      toast.error("Please enter company name");
      return;
    }

    setLoading(true);
    try {
      await createInterviewExperience({
        ...formData,
        studentName: user?.displayName || user?.email?.split("@")[0] || "Anonymous Student",
        studentId: user?.uid,
      });

      toast.success("Interview Experience Shared! Thank you for helping peers! 🎉");
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Failed to post interview experience:", err);
      toast.error("Failed to submit experience. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-left"
      >
        <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Share Interview Experience</h2>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Help fellow CS students prepare for campus recruitment drives.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-pointer">
            <FiX size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-black text-slate-800 dark:text-slate-200 mb-1 uppercase tracking-wider text-[10px]">Company Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. TCS, ZoHo, Infosys, Amazon"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#7F011F]"
              />
            </div>
            <div>
              <label className="block font-black text-slate-800 dark:text-slate-200 mb-1 uppercase tracking-wider text-[10px]">Job Role *</label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#7F011F]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-black text-slate-800 dark:text-slate-200 mb-1 uppercase tracking-wider text-[10px]">Package (CTC)</label>
              <input
                type="text"
                value={formData.ctc}
                onChange={(e) => setFormData({ ...formData, ctc: e.target.value })}
                className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#7F011F]"
              />
            </div>
            <div>
              <label className="block font-black text-slate-800 dark:text-slate-200 mb-1 uppercase tracking-wider text-[10px]">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="block font-black text-slate-800 dark:text-slate-200 mb-1 uppercase tracking-wider text-[10px]">Verdict</label>
              <select
                value={formData.verdict}
                onChange={(e) => setFormData({ ...formData, verdict: e.target.value })}
                className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="Selected">Selected ✅</option>
                <option value="Rejected">Rejected ❌</option>
                <option value="Pending">Pending ⏳</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-black text-slate-800 dark:text-slate-200 mb-1 uppercase tracking-wider text-[10px]">Interview Rounds Breakdown</label>
            <textarea
              rows={3}
              placeholder="e.g. Round 1: Online Aptitude & Coding, Round 2: Technical Interview (Data Structures & DBMS), Round 3: HR Interview"
              value={formData.roundsDetail}
              onChange={(e) => setFormData({ ...formData, roundsDetail: e.target.value })}
              className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#7F011F]"
            />
          </div>

          <div>
            <label className="block font-black text-slate-800 dark:text-slate-200 mb-1 uppercase tracking-wider text-[10px]">Specific Questions Asked</label>
            <textarea
              rows={3}
              placeholder="e.g. Reverse a Linked List, Explain ACID properties, SQL Join query for highest salary..."
              value={formData.questionsAsked}
              onChange={(e) => setFormData({ ...formData, questionsAsked: e.target.value })}
              className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#7F011F]"
            />
          </div>

          <div>
            <label className="block font-black text-slate-800 dark:text-slate-200 mb-1 uppercase tracking-wider text-[10px]">Preparation Tips & Advice</label>
            <textarea
              rows={2}
              placeholder="e.g. Focus heavily on LeetCode Medium array problems and SQL queries."
              value={formData.preparationTips}
              onChange={(e) => setFormData({ ...formData, preparationTips: e.target.value })}
              className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#7F011F]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[#7F011F] hover:bg-[#990227] px-5 py-2.5 text-xs font-black text-white shadow-md cursor-pointer"
            >
              {loading ? "Submitting..." : "Publish Experience"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
