// src/components/placements/CodingPracticeTab.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCode,
  FiTerminal,
  FiPlay,
  FiCheckCircle,
  FiXCircle,
  FiFileText,
  FiDatabase,
  FiCpu,
  FiLayers,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { CODING_PRACTICE_PROBLEMS } from "../../utils/placementMockData";

export default function CodingPracticeTab() {
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [activeProblem, setActiveProblem] = useState(CODING_PRACTICE_PROBLEMS[0]);
  const [userCode, setUserCode] = useState(
    CODING_PRACTICE_PROBLEMS[0].starterCode.python || ""
  );
  const [codeLanguage, setCodeLanguage] = useState("python");
  const [running, setRunning] = useState(false);
  const [outputResult, setOutputResult] = useState(null);

  const languages = ["All", "C", "C++", "Java", "Python", "SQL", "Data Structures", "Algorithms"];

  function handleSelectProblem(prob) {
    setActiveProblem(prob);
    setOutputResult(null);

    const defaultLang = Object.keys(prob.starterCode || {})[0] || "python";
    setCodeLanguage(defaultLang);
    setUserCode(prob.starterCode?.[defaultLang] || "");
  }

  function handleLanguageChange(langKey) {
    setCodeLanguage(langKey);
    if (activeProblem.starterCode?.[langKey]) {
      setUserCode(activeProblem.starterCode[langKey]);
    }
  }

  function handleRunCode() {
    setRunning(true);
    setOutputResult(null);

    setTimeout(() => {
      setRunning(false);
      setOutputResult({
        status: "Accepted",
        runtime: "38 ms",
        memory: "16.4 MB",
        output: activeProblem.sampleOutput,
        passedCases: "3/3 Test cases passed",
      });
      toast.success("Code compiled & executed successfully!");
    }, 1200);
  }

  return (
    <div className="space-y-6 text-left">
      {/* Top Header & Language Selector Pills */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FiCode className="text-[#0F4C81] dark:text-sky-400" /> LeetCode-Style Coding Practice Arena
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Solve top interview problems in C, C++, Java, Python, SQL, Data Structures & Algorithms with instant code simulation.
          </p>
        </div>

        {/* Language Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                selectedLanguage === lang
                  ? "bg-[#0F4C81] text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Layout: Left Problems List, Right IDE Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Problem List (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 border-b pb-2">
            Curated Problem Set ({CODING_PRACTICE_PROBLEMS.length})
          </h3>

          <div className="space-y-2">
            {CODING_PRACTICE_PROBLEMS.map((prob) => {
              const isSelected = activeProblem.id === prob.id;
              return (
                <div
                  key={prob.id}
                  onClick={() => handleSelectProblem(prob)}
                  className={`cursor-pointer rounded-xl border p-3.5 transition-all text-xs space-y-1.5 ${
                    isSelected
                      ? "border-[#0F4C81] bg-[#0F4C81]/10 dark:bg-sky-950/60 font-bold"
                      : "border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-800 dark:text-slate-100">{prob.title}</h4>
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-extrabold ${
                        prob.difficulty === "Easy"
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-amber-500/10 text-amber-600"
                      }`}
                    >
                      {prob.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{prob.topic}</span>
                    <span>{prob.language}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Code Editor & Problem Detail (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">
          {/* Problem Statement */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="rounded-md bg-emerald-500/10 text-emerald-600 px-2 py-0.5 text-[10px] font-bold">
                  {activeProblem.difficulty}
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                  {activeProblem.title}
                </h3>
              </div>

              {/* Code Language Dropdown */}
              <select
                value={codeLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200"
              >
                {Object.keys(activeProblem.starterCode || {}).map((langKey) => (
                  <option key={langKey} value={langKey}>
                    {langKey.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {activeProblem.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3">
                <span className="font-bold text-slate-500 block text-[10px] uppercase">Sample Input</span>
                <code className="text-slate-800 dark:text-slate-200 font-mono text-[11px]">
                  {activeProblem.sampleInput}
                </code>
              </div>

              <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3">
                <span className="font-bold text-slate-500 block text-[10px] uppercase">Expected Output</span>
                <code className="text-slate-800 dark:text-slate-200 font-mono text-[11px]">
                  {activeProblem.sampleOutput}
                </code>
              </div>
            </div>
          </div>

          {/* Interactive Code Editor Area */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1 font-bold">
                <FiTerminal size={14} /> Interactive Code Editor ({codeLanguage})
              </span>
              <span>Font: Monospace</span>
            </div>

            <textarea
              rows={9}
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              className="w-full rounded-xl bg-slate-900 text-slate-100 font-mono text-xs p-4 focus:outline-none focus:ring-2 focus:ring-[#0F4C81] leading-relaxed shadow-inner"
              spellCheck="false"
            />

            {/* Run & Submit Bar */}
            <div className="flex items-center justify-between pt-2">
              <button
                disabled={running}
                onClick={handleRunCode}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-6 py-2.5 text-xs font-bold text-white shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                <FiPlay size={14} /> {running ? "Compiling & Running..." : "Run Code"}
              </button>
            </div>
          </div>

          {/* Execution Result Box */}
          {outputResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-xs text-slate-800 dark:text-slate-100 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <FiCheckCircle size={16} /> Status: {outputResult.status}
                </span>
                <span className="text-[11px] text-slate-500">
                  Runtime: <strong>{outputResult.runtime}</strong> · Memory: <strong>{outputResult.memory}</strong>
                </span>
              </div>

              <div className="bg-slate-900 text-emerald-400 p-2.5 rounded-lg font-mono text-[11px]">
                Output: {outputResult.output}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
