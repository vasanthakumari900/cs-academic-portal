// src/components/placements/PlacementCareerToolkitTab.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { FiCheckCircle, FiFileText, FiAward } from "react-icons/fi";
import EligibilityCheckerTab from "./EligibilityCheckerTab";
import ResumeBuilderTab from "./ResumeBuilderTab";

export default function PlacementCareerToolkitTab({ onApplyCompany }) {
  const [activeTool, setActiveTool] = useState("eligibility");

  return (
    <div className="space-y-6 text-left">
      {/* Sub-Header Navigation */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-2">
            <FiAward size={14} /> Student Career Tools &amp; Qualification Matrix
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
            Career Toolkit &amp; Eligibility
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Test your company eligibility criteria &amp; generate an ATS-ready professional resume.
          </p>
        </div>

        {/* Tool Switcher */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
          <button
            onClick={() => setActiveTool("eligibility")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              activeTool === "eligibility"
                ? "bg-[#C50337] text-white shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <FiCheckCircle size={15} /> Eligibility Checker
          </button>

          <button
            onClick={() => setActiveTool("resume")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              activeTool === "resume"
                ? "bg-[#C50337] text-white shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <FiFileText size={15} /> ATS Resume Builder
          </button>
        </div>
      </div>

      {/* Dynamic Content */}
      <motion.div
        key={activeTool}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTool === "eligibility" && (
          <EligibilityCheckerTab onApplyCompany={onApplyCompany} />
        )}
        {activeTool === "resume" && <ResumeBuilderTab />}
      </motion.div>
    </div>
  );
}
