// src/pages/Placements.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import toast from "react-hot-toast";

import PlacementHeader from "../components/placements/PlacementHeader";
import PlacementDrivesTab from "../components/placements/PlacementDrivesTab";
import PlacementDashboardTab from "../components/placements/PlacementDashboardTab";
import PlacementPrepHubTab from "../components/placements/PlacementPrepHubTab";
import PlacementCareerToolkitTab from "../components/placements/PlacementCareerToolkitTab";
import PlacementExperiencesTab from "../components/placements/PlacementExperiencesTab";
import CgpaCalculatorTab from "../components/placements/CgpaCalculatorTab";

import CompanyDetailsModal from "../components/placements/CompanyDetailsModal";
import PlacementFeedback from "../components/placements/PlacementFeedback";

const mcqQuestions = [
  {
    id: 1,
    question: "If all cats are animals and some animals are pets, which of the following must be true?",
    options: ["All cats are pets", "Some cats are pets", "All pets are cats", "Some animals are cats"],
    correct: 3,
  },
  {
    id: 2,
    question: "A train travels 360 km in 4 hours. What is its speed in m/s?",
    options: ["20 m/s", "25 m/s", "30 m/s", "15 m/s"],
    correct: 1,
  },
  {
    id: 3,
    question: "If APARTMENT is coded as BQBUSFOU, how is BUILDING coded?",
    options: ["CVJMEJOH", "CVILEJOH", "CVJMEIOH", "BVILEJOH"],
    correct: 0,
  },
  {
    id: 4,
    question: "In a class of 40 students, 25 like Maths, 20 like Physics, and 10 like both. How many like neither?",
    options: ["5", "10", "15", "20"],
    correct: 0,
  },
  {
    id: 5,
    question: "A clock shows 3:15. What is the angle between the hour and minute hands?",
    options: ["0°", "7.5°", "15°", "30°"],
    correct: 1,
  },
];

function ApplyModal({ drive, onClose }) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState({});
  const [form, setForm] = useState({
    fullName: "Vasanth Kumar",
    email: "vasanth.cs23@ddgdvc.edu.in",
    phone: "9876543210",
    rollNumber: "24E3006",
    course: "B.Sc CS",
    year: "3",
    cgpa: "8.4",
  });

  const selectedQuestions = mcqQuestions.slice(0, 5);

  function handleFormChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleNextStep() {
    if (step === 1) {
      if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim()) {
        toast.error("Please fill in all required fields");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        toast.error("Enter a valid email address");
        return;
      }
      if (!/^\d{10}$/.test(form.phone)) {
        toast.error("Enter a valid 10-digit phone number");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      const unanswered = selectedQuestions.filter((q) => answers[q.id] === undefined);
      if (unanswered.length > 0) {
        toast.error("Please answer all questions before submitting");
        return;
      }
      setSubmitting(true);
      setTimeout(() => {
        setSubmitting(false);
        setStep(3);
        toast.success(`Application for ${drive.companyName} submitted successfully!`);
      }, 1200);
    }
  }

  function handleAnswer(questionId, optionIndex) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  }

  const correctCount = selectedQuestions.filter((q) => answers[q.id] === q.correct).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-left"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-[#021C4F] px-6 py-4 text-white">
          <div>
            <h3 className="text-base font-bold text-white">
              {step === 1
                ? "Campus Drive Application — Personal Details"
                : step === 2
                ? "Logical Reasoning Assessment"
                : "Application Confirmation"}
            </h3>
            <p className="text-xs text-white/80">
              {drive.companyName} · {drive.role}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-white/10 p-2 text-white/70 hover:bg-white/20 hover:text-white transition-all"
          >
            <FiX size={16} />
          </button>
        </div>

        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-6 py-3">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  step >= s
                    ? "bg-[#0F4C81] text-white shadow-sm"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-500"
                }`}
              >
                {step > s ? <FiCheckCircle size={14} /> : s}
              </div>
              <span
                className={`text-xs font-medium ${
                  step >= s ? "text-[#0F4C81] dark:text-sky-400 font-semibold" : "text-slate-500"
                }`}
              >
                {s === 1 ? "Student Details" : s === 2 ? "Aptitude Check" : "Submitted"}
              </span>
              {s < 3 && <span className="text-slate-300 dark:text-slate-700 mx-1">—</span>}
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-auto p-6 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
                  <div>
                    <label className="mb-1 block font-bold text-slate-700 dark:text-slate-300">
                      Full Name *
                    </label>
                    <input
                      value={form.fullName}
                      onChange={(e) => handleFormChange("fullName", e.target.value)}
                      placeholder="John Doe"
                      className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block font-bold text-slate-700 dark:text-slate-300">
                      Official Email *
                    </label>
                    <input
                      value={form.email}
                      onChange={(e) => handleFormChange("email", e.target.value)}
                      placeholder="john@ddgdvc.edu.in"
                      type="email"
                      className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block font-bold text-slate-700 dark:text-slate-300">
                      Phone Number *
                    </label>
                    <input
                      value={form.phone}
                      onChange={(e) => handleFormChange("phone", e.target.value)}
                      placeholder="9876543210"
                      maxLength={10}
                      className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block font-bold text-slate-700 dark:text-slate-300">
                      Roll Number
                    </label>
                    <input
                      value={form.rollNumber}
                      onChange={(e) => handleFormChange("rollNumber", e.target.value)}
                      placeholder="24E3006"
                      className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block font-bold text-slate-700 dark:text-slate-300">
                      Department
                    </label>
                    <select
                      value={form.course}
                      onChange={(e) => handleFormChange("course", e.target.value)}
                      className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 text-slate-800 dark:text-slate-100"
                    >
                      <option value="B.Sc CS">B.Sc Computer Science</option>
                      <option value="BCA">BCA</option>
                      <option value="M.Sc CS">M.Sc Computer Science</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block font-bold text-slate-700 dark:text-slate-300">
                      Current CGPA
                    </label>
                    <input
                      value={form.cgpa}
                      onChange={(e) => handleFormChange("cgpa", e.target.value)}
                      placeholder="8.4"
                      className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div className="rounded-xl border border-sky-500/30 bg-sky-500/10 p-3 text-xs text-sky-800 dark:text-sky-300 flex items-center gap-2 font-medium">
                  <FiAlertCircle size={14} className="shrink-0 text-sky-600" />
                  Answer all 5 questions to complete screening for {drive.companyName}.
                </div>

                {selectedQuestions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-4 space-y-2 shadow-sm"
                  >
                    <p className="text-xs font-bold text-[#0F4C81] dark:text-sky-300">
                      {idx + 1}. {q.question}
                    </p>
                    <div className="space-y-1.5">
                      {q.options.map((opt, oi) => (
                        <button
                          key={oi}
                          onClick={() => handleAnswer(q.id, oi)}
                          className={`flex w-full items-center gap-2.5 rounded-lg border px-3 py-2 text-xs text-left transition-all ${
                            answers[q.id] === oi
                              ? "border-[#0F4C81] bg-[#0F4C81]/10 font-bold text-[#0F4C81] dark:text-sky-300"
                              : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                              answers[q.id] === oi
                                ? "bg-[#0F4C81] text-white"
                                : "bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300"
                            }`}
                          >
                            {String.fromCharCode(65 + oi)}
                          </span>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center py-6 text-center space-y-3"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                  <FiCheckCircle size={36} />
                </div>
                <h3 className="text-xl font-extrabold text-[#0F4C81] dark:text-sky-300">
                  Application Successfully Registered!
                </h3>
                <p className="text-xs text-slate-500 max-w-md">
                  Your application for <strong>{drive.companyName}</strong> ({drive.role}) has been submitted to the placement cell.
                </p>

                <div className="grid grid-cols-2 gap-4 w-full max-w-xs text-center pt-3">
                  <div className="bg-slate-50 dark:bg-slate-800 border rounded-xl p-3">
                    <p className="text-xl font-bold text-emerald-600">{correctCount}/5</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">MCQ Score</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 border rounded-xl p-3">
                    <p className="text-xl font-bold text-[#0F4C81] dark:text-sky-400">
                      ₹{drive.package} LPA
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Package</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-6 py-4">
          {step < 3 ? (
            <>
              <button
                onClick={onClose}
                className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleNextStep}
                disabled={submitting}
                className="rounded-xl bg-[#0F4C81] hover:bg-[#1E88E5] px-5 py-2 text-xs font-bold text-white shadow-sm transition-all disabled:opacity-60"
              >
                {submitting ? "Submitting..." : step === 1 ? "Next: MCQ Screening" : "Submit Application"}
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="rounded-xl bg-[#0F4C81] hover:bg-[#1E88E5] px-6 py-2 text-xs font-bold text-white shadow-sm"
            >
              Done
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Placements() {
  const [activeTab, setActiveTab] = useState("drives");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedCompanyModal, setSelectedCompanyModal] = useState(null);
  const [applyModalCompany, setApplyModalCompany] = useState(null);

  function handleNavigateTab(tabId) {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSelectCompany(company) {
    setSelectedCompanyModal(company);
  }

  function handleApplyCompany(company) {
    setApplyModalCompany(company);
  }

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
          {/* Main Top Placement Header & Navigation */}
          <PlacementHeader
            activeTab={activeTab}
            setActiveTab={handleNavigateTab}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />

          {/* Active Sub-Tab View */}
          <main className="min-h-[60vh]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                {activeTab === "drives" && (
                  <PlacementDrivesTab
                    searchQuery={searchQuery}
                    onSelectCompany={handleSelectCompany}
                    onApplyCompany={handleApplyCompany}
                  />
                )}

                {activeTab === "cgpa" && <CgpaCalculatorTab />}

                {activeTab === "analytics" && (
                  <PlacementDashboardTab
                    onNavigateTab={handleNavigateTab}
                    onSelectCompany={handleSelectCompany}
                  />
                )}

                {activeTab === "prephub" && <PlacementPrepHubTab />}

                {activeTab === "toolkit" && (
                  <PlacementCareerToolkitTab onApplyCompany={handleApplyCompany} />
                )}

                {activeTab === "experiences" && <PlacementExperiencesTab />}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Placement Feedback Section */}
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
            <PlacementFeedback />
          </div>
        </div>

        {/* Company Detail Modal */}
        <AnimatePresence>
          {selectedCompanyModal && (
            <CompanyDetailsModal
              company={selectedCompanyModal}
              onClose={() => setSelectedCompanyModal(null)}
              onApply={(comp) => {
                setSelectedCompanyModal(null);
                setApplyModalCompany(comp);
              }}
            />
          )}
        </AnimatePresence>

        {/* Apply Application Modal */}
        <AnimatePresence>
          {applyModalCompany && (
            <ApplyModal
              drive={applyModalCompany}
              onClose={() => setApplyModalCompany(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
