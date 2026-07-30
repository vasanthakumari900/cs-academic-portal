// src/components/placements/PlacementExperiencesTab.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { FiMessageSquare, FiAward, FiUsers } from "react-icons/fi";
import InterviewExperiences from "../../pages/InterviewExperiences";
import AlumniStoriesTab from "./AlumniStoriesTab";

export default function PlacementExperiencesTab() {
  const [subTab, setSubTab] = useState("reviews");

  return (
    <div className="space-y-6 text-left">
      {/* Sub-Header Navigation */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-600 dark:text-rose-400 mb-2">
            <FiUsers size={14} /> Peer Reviews &amp; Alumni Guidance Repository
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
            Interview Logs &amp; Alumni Network
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Read authentic interview experience logs from placed senior students and connect with DDGDVC Computer Science alumni.
          </p>
        </div>

        {/* Sub-Tab Selector */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
          <button
            onClick={() => setSubTab("reviews")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              subTab === "reviews"
                ? "bg-[#C50337] text-white shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <FiMessageSquare size={15} /> Senior Interview Logs
          </button>

          <button
            onClick={() => setSubTab("alumni")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              subTab === "alumni"
                ? "bg-[#C50337] text-white shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <FiAward size={15} /> Alumni Success Stories
          </button>
        </div>
      </div>

      {/* Dynamic Content */}
      <motion.div
        key={subTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {subTab === "reviews" && <InterviewExperiences />}
        {subTab === "alumni" && <AlumniStoriesTab />}
      </motion.div>
    </div>
  );
}
