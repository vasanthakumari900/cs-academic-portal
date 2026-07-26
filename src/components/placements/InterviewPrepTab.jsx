// src/components/placements/InterviewPrepTab.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiUsers,
  FiFileText,
  FiPlayCircle,
  FiMessageSquare,
  FiCheckCircle,
  FiHelpCircle,
  FiBookOpen,
} from "react-icons/fi";
import { INTERVIEW_PREP_DATA } from "../../utils/placementMockData";

export default function InterviewPrepTab() {
  const [activeSection, setActiveSection] = useState("hr");

  return (
    <div className="space-y-6 text-left">
      {/* Top Header */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FiUsers className="text-[#0F4C81] dark:text-sky-400" /> Comprehensive Interview Preparation Guide
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Crack HR and Technical rounds with curated sample questions, GD topics, mock interview videos, and body language tips.
          </p>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: "hr", label: "HR Interview Questions", icon: FiMessageSquare },
            { id: "tech", label: "Technical Q&A", icon: FiBookOpen },
            { id: "gd", label: "Group Discussion Topics", icon: FiUsers },
            { id: "videos", label: "Mock Interview Videos", icon: FiPlayCircle },
          ].map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  isActive
                    ? "bg-[#0F4C81] text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                <Icon size={14} /> {sec.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 1: HR Questions */}
      {activeSection === "hr" && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Top HR Interview Questions & Frameworks
          </h3>

          <div className="space-y-4">
            {INTERVIEW_PREP_DATA.hrQuestions.map((hr, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-2"
              >
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <FiHelpCircle className="text-[#C50337]" /> {idx + 1}. {hr.q}
                </h4>
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong>💡 How to Answer:</strong> {hr.guide}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 2: Technical Questions */}
      {activeSection === "tech" && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Core Computer Science Technical Q&A
          </h3>

          <div className="space-y-4">
            {INTERVIEW_PREP_DATA.techQuestions.map((tq, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-2"
              >
                <span className="rounded-md bg-[#0F4C81]/10 text-[#0F4C81] dark:bg-sky-950 dark:text-sky-300 px-2.5 py-0.5 text-[10px] font-bold">
                  {tq.topic}
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{tq.q}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl leading-relaxed">
                  <strong>Answer:</strong> {tq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 3: Group Discussion Topics */}
      {activeSection === "gd" && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Current GD Topics & Key Arguments
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {INTERVIEW_PREP_DATA.gdTopics.map((gd, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3"
              >
                <span className="rounded-md bg-amber-500/10 text-amber-600 px-2.5 py-0.5 text-[10px] font-bold">
                  {gd.category}
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{gd.title}</h4>
                <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
                  {gd.keyPoints.map((pt, pIdx) => (
                    <li key={pIdx}>{pt}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 4: Mock Videos */}
      {activeSection === "videos" && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Mock Interview Video Workshops
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { title: "Full Technical Interview Mock — TCS & Infosys", duration: "42 Mins", link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
              { title: "HR Behavioral Round STAR Method Tutorial", duration: "25 Mins", link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
            ].map((vid, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3 flex items-center justify-between"
              >
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{vid.title}</h4>
                  <span className="text-xs text-slate-500">{vid.duration}</span>
                </div>
                <a
                  href={vid.link}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl bg-[#0F4C81] p-3 text-white hover:bg-[#1E88E5] transition-all"
                >
                  <FiPlayCircle size={20} />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
