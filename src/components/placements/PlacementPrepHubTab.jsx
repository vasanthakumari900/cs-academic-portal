// src/components/placements/PlacementPrepHubTab.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { FiBookOpen, FiCode, FiMessageSquare, FiAward, FiClock, FiBriefcase } from "react-icons/fi";
import LiveMockTestModule from "./LiveMockTestModule";
import AptitudePrepTab from "./AptitudePrepTab";
import CodingPracticeTab from "./CodingPracticeTab";
import InterviewPrepTab from "./InterviewPrepTab";
import CompanyQuestionBankModule from "./CompanyQuestionBankModule";

export default function PlacementPrepHubTab() {
  const [subTab, setSubTab] = useState("mocktest");

  return (
    <div className="space-y-6 text-left">
      {/* Sub-Header Navigation */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#7F011F]/10 px-3 py-1 text-xs font-black text-[#7F011F] dark:text-rose-400 mb-2 border border-[#7F011F]/20">
            <FiAward size={14} /> Official Placement Training &amp; Corporate Question Bank
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
            Placement Preparation Hub
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Everything you need to crack campus recruitment: Live Timed Mock Exams, Recruiter Question Bank, Aptitude Tests, Coding IDE, and Interview guides.
          </p>
        </div>

        {/* Sub-Tab Selector */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
          <button
            onClick={() => setSubTab("mocktest")}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-black transition-all cursor-pointer ${
              subTab === "mocktest"
                ? "bg-[#7F011F] text-white shadow-md"
                : "text-slate-800 dark:text-slate-100 hover:text-[#7F011F]"
            }`}
          >
            <FiClock size={14} /> Live Mock Tests
          </button>

          <button
            onClick={() => setSubTab("qbank")}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-black transition-all cursor-pointer ${
              subTab === "qbank"
                ? "bg-[#7F011F] text-white shadow-md"
                : "text-slate-800 dark:text-slate-100 hover:text-[#7F011F]"
            }`}
          >
            <FiBriefcase size={14} /> Recruiter Q&amp;A Bank
          </button>

          <button
            onClick={() => setSubTab("aptitude")}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-black transition-all cursor-pointer ${
              subTab === "aptitude"
                ? "bg-[#7F011F] text-white shadow-md"
                : "text-slate-800 dark:text-slate-100 hover:text-[#7F011F]"
            }`}
          >
            <FiBookOpen size={14} /> Aptitude Tests
          </button>

          <button
            onClick={() => setSubTab("coding")}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-black transition-all cursor-pointer ${
              subTab === "coding"
                ? "bg-[#7F011F] text-white shadow-md"
                : "text-slate-800 dark:text-slate-100 hover:text-[#7F011F]"
            }`}
          >
            <FiCode size={14} /> Coding IDE
          </button>

          <button
            onClick={() => setSubTab("interview")}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-black transition-all cursor-pointer ${
              subTab === "interview"
                ? "bg-[#7F011F] text-white shadow-md"
                : "text-slate-800 dark:text-slate-100 hover:text-[#7F011F]"
            }`}
          >
            <FiMessageSquare size={14} /> Interview Q&amp;A
          </button>
        </div>
      </div>

      {/* Dynamic Sub-Tab Content */}
      <motion.div
        key={subTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {subTab === "mocktest" && <LiveMockTestModule />}
        {subTab === "qbank" && <CompanyQuestionBankModule />}
        {subTab === "aptitude" && <AptitudePrepTab />}
        {subTab === "coding" && <CodingPracticeTab />}
        {subTab === "interview" && <InterviewPrepTab />}
      </motion.div>
    </div>
  );
}
