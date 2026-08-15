// src/components/placements/PlacementExperiencesTab.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { FiMessageSquare, FiAward, FiUsers, FiPlus } from "react-icons/fi";
import InterviewExperiences from "../../pages/InterviewExperiences";
import AlumniStoriesTab from "./AlumniStoriesTab";
import ShareInterviewModal from "../dashboard/ShareInterviewModal";

export default function PlacementExperiencesTab() {
  const [subTab, setSubTab] = useState("reviews");
  const [showShareModal, setShowShareModal] = useState(false);

  return (
    <div className="space-y-6 text-left">
      {/* Sub-Header Navigation */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
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

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-2 rounded-xl bg-[#7F011F] hover:bg-[#990227] px-4 py-2.5 text-xs font-extrabold text-white shadow-md transition-all cursor-pointer"
          >
            <FiPlus size={16} /> Share Your Experience
          </button>

          {/* Sub-Tab Selector */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setSubTab("reviews")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-black transition-all cursor-pointer ${
                subTab === "reviews"
                  ? "bg-[#7F011F] text-white shadow-md"
                  : "text-slate-800 dark:text-slate-100 hover:text-[#7F011F]"
              }`}
            >
              <FiMessageSquare size={15} /> Senior Interview Logs
            </button>

            <button
              onClick={() => setSubTab("alumni")}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-black transition-all cursor-pointer ${
                subTab === "alumni"
                  ? "bg-[#7F011F] text-white shadow-md"
                  : "text-slate-800 dark:text-slate-100 hover:text-[#7F011F]"
              }`}
            >
              <FiAward size={15} /> Alumni Success Stories
            </button>
          </div>
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

      <ShareInterviewModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </div>
  );
}
