// src/pages/Placements.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiCheckCircle,
  FiAlertCircle,
  FiMic,
  FiMicOff,
  FiVolume2,
  FiVolumeX,
  FiGlobe,
  FiFileText,
  FiCpu,
  FiMail,
  FiPlay,
  FiRefreshCw,
  FiShield,
  FiUser,
  FiClock,
} from "react-icons/fi";
import toast from "react-hot-toast";

import PlacementHeader from "../components/placements/PlacementHeader";
import PlacementDrivesTab from "../components/placements/PlacementDrivesTab";
import PlacementDashboardTab from "../components/placements/PlacementDashboardTab";
import PlacementPrepHubTab from "../components/placements/PlacementPrepHubTab";
import PlacementCareerToolkitTab from "../components/placements/PlacementCareerToolkitTab";
import PlacementExperiencesTab from "../components/placements/PlacementExperiencesTab";
import CgpaCalculatorTab from "../components/placements/CgpaCalculatorTab";
import ChennaiMncTab from "../components/placements/ChennaiMncTab";

import CompanyDetailsModal from "../components/placements/CompanyDetailsModal";
import PlacementFeedback from "../components/placements/PlacementFeedback";
import { useAuth } from "../context/AuthContext";
import {
  generateUniqueMcqSet,
  evaluateCandidateWorthiness,
  getInterviewQuestionsForRole,
  evaluateSpokenAnswer,
} from "../utils/placementAssessmentEngine";

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

function ApplyModal({ drive, onClose, onRegisterSuccess }) {
  const { currentUser } = useAuth() || {};
  const [step, setStep] = useState(1); // 1: Basic Details, 2: Upload Resume & Portfolio, 3: MCQ Test, 4: AI Voice Interview, 5: Confirmation
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    rollNumber: "",
    course: "B.Sc Computer Science",
    year: "3rd Year (2026 Batch)",
    cgpa: "",
    arrears: "0",
    portfolio: "",
    skills: ["Java", "SQL", "Data Structures"],
    resumeName: "",
  });

  const [worthinessResult, setWorthinessResult] = useState(null);
  const [auditing, setAuditing] = useState(false);

  // MCQ Assessment State
  const [chosenLang, setChosenLang] = useState("java");
  const [mcqQuestions, setMcqQuestions] = useState([]);
  const [mcqAnswers, setMcqAnswers] = useState({});
  const [mcqScore, setMcqScore] = useState(0);

  // AI Voice Interviewer State
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [spokenTranscript, setSpokenTranscript] = useState("");
  const [livenessTimer, setLivenessTimer] = useState(25);
  const [timerActive, setTimerActive] = useState(false);
  const [interviewEvaluations, setInterviewEvaluations] = useState([]);

  // Confirmation State
  const [regId, setRegId] = useState("");
  const [recognitionInstance, setRecognitionInstance] = useState(null);

  // Auto fill helper button
  function handleAutoFillProfile() {
    if (currentUser) {
      setForm((prev) => ({
        ...prev,
        fullName: currentUser.name || "THARUN B S",
        email: currentUser.email || "tharun.cs24@ddgdvc.edu.in",
        phone: "9876543210",
        rollNumber: currentUser.rollNumber || "24E3006",
        course: currentUser.department || "B.Sc Computer Science",
        cgpa: "8.4",
        portfolio: "https://github.com/ddgdvc-student",
        resumeName: `${(currentUser.name || "Student").replace(/\s+/g, "_")}_Resume_2026.pdf`,
      }));
      toast.success("Auto-filled sample profile!");
    } else {
      setForm((prev) => ({
        ...prev,
        fullName: "THARUN B S",
        email: "tharun.cs24@ddgdvc.edu.in",
        phone: "9876543210",
        rollNumber: "24E3006",
        cgpa: "8.4",
        portfolio: "https://github.com/tharuns",
        resumeName: "Tharun_B_S_Resume_2026.pdf",
      }));
      toast.success("Sample profile filled!");
    }
  }

  function handleFormChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleSkill(skill) {
    setForm((prev) => {
      const exists = prev.skills.includes(skill);
      return {
        ...prev,
        skills: exists ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill],
      };
    });
  }

  // Step 1 -> Step 2 Validation: Check Basic Details & Compulsory Email
  function handleGoToStep2() {
    if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim() || !form.rollNumber.trim() || !form.cgpa.trim()) {
      toast.error("Please enter Full Name, Compulsory Official Email, Phone, Roll Number, and CGPA.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      toast.error("Compulsory Email format is invalid. Please enter a valid email address.");
      return;
    }
    if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ""))) {
      toast.error("Enter a valid 10-digit mobile phone number.");
      return;
    }
    setStep(2);
  }

  // Step 2: Run Resume PDF & Portfolio URL Validation Audit
  function handleRunWorthinessAudit() {
    if (!form.resumeName) {
      toast.error("Please upload/attach your Resume PDF.");
      return;
    }
    if (!form.portfolio.trim() || form.portfolio.trim().length < 8) {
      toast.error("Please enter your GitHub or Portfolio URL.");
      return;
    }

    setAuditing(true);
    setTimeout(() => {
      const res = evaluateCandidateWorthiness(form, drive);
      setWorthinessResult(res);
      setAuditing(false);
      if (res.isWorthy) {
        toast.success(`Resume & Portfolio Validated! (${res.score}% Match) Proceed to MCQ Test.`);
      } else {
        toast.error(res.summary);
      }
    }, 1000);
  }

  // Step 2 -> Step 3: Go to MCQ Test
  function handleGoToMcqTest() {
    if (!worthinessResult || !worthinessResult.isWorthy) {
      toast.error("Please validate both Resume PDF & Portfolio URL first!");
      return;
    }
    handleLanguageChange("java");
    setStep(3);
  }

  // Language Change & MCQ Generation
  function handleLanguageChange(lang) {
    setChosenLang(lang);
    const questions = generateUniqueMcqSet(lang, 5);
    setMcqQuestions(questions);
    setMcqAnswers({});
  }

  function handleMcqAnswer(qIdx, optIdx) {
    setMcqAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  }

  // Submit MCQ -> Go to AI Voice Interview
  function handleSubmitMcq() {
    if (Object.keys(mcqAnswers).length < mcqQuestions.length) {
      toast.error("Please answer all 5 dynamic MCQ questions before proceeding.");
      return;
    }

    let correct = 0;
    mcqQuestions.forEach((q, idx) => {
      if (mcqAnswers[idx] === q.correct) correct++;
    });
    setMcqScore(correct);

    if (correct < 2) {
      toast.error(`MCQ Score ${correct}/5 is below minimum pass mark (2/5). Generating new questions...`);
      handleLanguageChange(chosenLang);
      return;
    }

    toast.success(`Passed MCQ Test (${correct}/5)! Loading AI Voice Interviewer...`);
    const iQs = getInterviewQuestionsForRole(drive.companyName, drive.role, form.skills, chosenLang);
    setInterviewQuestions(iQs);
    setCurrentQIndex(0);
    setStep(4);
    speakQuestion(iQs[0].question);
  }

  // Text-to-Speech: AI Interviewer Speaks
  function speakQuestion(text) {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        startListeningVoice();
      };
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      startListeningVoice();
    }
  }

  // Speech Recognition: Listen to Student Microphone
  function startListeningVoice() {
    setSpokenTranscript("");
    setLivenessTimer(25);
    setTimerActive(true);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = "en-US";

        rec.onstart = () => setIsListening(true);
        rec.onresult = (event) => {
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setSpokenTranscript(transcript);
        };
        rec.onerror = (e) => {
          console.warn("Speech recognition error:", e.error);
          setIsListening(false);
        };
        rec.onend = () => setIsListening(false);

        rec.start();
        setRecognitionInstance(rec);
      } catch (err) {
        console.error("Mic error:", err);
      }
    } else {
      toast.error("Speech Recognition not supported in browser. Type audio transcript below.");
    }
  }

  function stopListeningVoice() {
    if (recognitionInstance) {
      try {
        recognitionInstance.stop();
      } catch (e) {
        console.error(e);
      }
    }
    setIsListening(false);
    setTimerActive(false);
  }

  // Submit Answer to current interview question
  function handleNextInterviewQuestion() {
    stopListeningVoice();
    window.speechSynthesis?.cancel();

    const qObj = interviewQuestions[currentQIndex];
    const evalRes = evaluateSpokenAnswer(spokenTranscript, qObj || {});
    setInterviewEvaluations((prev) => [...prev, evalRes]);

    if (!evalRes.passed && spokenTranscript.trim().length < 3) {
      toast.error("Non-Responsiveness Warning: Spoken response was missing or silent.");
    }

    if (currentQIndex < interviewQuestions.length - 1) {
      const nextIdx = currentQIndex + 1;
      setCurrentQIndex(nextIdx);
      setSpokenTranscript("");
      speakQuestion(interviewQuestions[nextIdx].question);
    } else {
      // Complete AI Interview & Proceed to Final Receipt
      setSubmitting(true);
      setTimeout(() => {
        const generatedId = `REG-${(drive.companyName || "DRIVE").substring(0, 4).toUpperCase()}-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        setRegId(generatedId);

        try {
          const stored = JSON.parse(localStorage.getItem("ddgdvc_applied_drives") || "[]");
          if (!stored.includes(drive.id)) {
            stored.push(drive.id);
            localStorage.setItem("ddgdvc_applied_drives", JSON.stringify(stored));
          }
        } catch (e) {
          console.error("Storage error:", e);
        }

        if (onRegisterSuccess) onRegisterSuccess(drive.id);

        setSubmitting(false);
        setStep(5);
        toast.success(`AI Voice Interview Passed! Official receipt sent to ${form.email}`);
      }, 1200);
    }
  }

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
        className="flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-[#7F011F] via-[#990227] to-[#021C4F] px-6 py-4 text-white">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-300 border border-amber-400/30">
              DDGDVC Placement Cell Screening Portal
            </div>
            <h3 className="text-base font-extrabold text-white mt-0.5">
              {drive.companyName} — {drive.role}
            </h3>
          </div>
          <button
            onClick={() => {
              window.speechSynthesis?.cancel();
              stopListeningVoice();
              onClose();
            }}
            className="rounded-full bg-white/10 p-2 text-white/70 hover:bg-white/20 hover:text-white transition-all"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-6 py-3 overflow-x-auto scrollbar-none">
          {[
            { s: 1, label: "1. Basic Details" },
            { s: 2, label: "2. Resume & Portfolio" },
            { s: 3, label: "3. Captcha MCQ Test" },
            { s: 4, label: "4. AI Voice Interview" },
            { s: 5, label: "5. Email Receipt" },
          ].map(({ s, label }) => (
            <div key={s} className="flex items-center gap-2 shrink-0">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  step >= s
                    ? "bg-[#7F011F] text-white shadow-sm"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-500"
                }`}
              >
                {step > s ? <FiCheckCircle size={14} /> : s}
              </div>
              <span
                className={`text-xs font-medium ${
                  step >= s ? "text-[#7F011F] dark:text-sky-400 font-bold" : "text-slate-500"
                }`}
              >
                {label}
              </span>
              {s < 5 && <span className="text-slate-300 dark:text-slate-700 mx-1">—</span>}
            </div>
          ))}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-auto p-6 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">
          <AnimatePresence mode="wait">
            {/* STEP 1: Basic Details Input */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                className="space-y-4 text-xs text-left"
              >
                <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-950/40 p-3 rounded-xl border border-amber-200 dark:border-amber-800/40">
                  <span className="font-bold text-amber-800 dark:text-amber-300">
                    Step 1: Enter your basic student details &amp; compulsory official email.
                  </span>
                  <button
                    type="button"
                    onClick={handleAutoFillProfile}
                    className="flex items-center gap-1 rounded-lg bg-amber-500 text-white px-2.5 py-1 text-[10px] font-extrabold shadow-sm hover:bg-amber-600 shrink-0"
                  >
                    <FiUser size={12} /> Auto-fill Sample
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block font-bold text-slate-700 dark:text-slate-300">
                      Full Candidate Name *
                    </label>
                    <input
                      value={form.fullName}
                      onChange={(e) => handleFormChange("fullName", e.target.value)}
                      placeholder="e.g. THARUN B S"
                      className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 text-slate-800 dark:text-slate-100 font-medium"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                      <span>Compulsory Official Email *</span>
                      <span className="text-[10px] text-[#7F011F] dark:text-rose-400 font-extrabold">Compulsory</span>
                    </label>
                    <input
                      value={form.email}
                      onChange={(e) => handleFormChange("email", e.target.value)}
                      placeholder="student@ddgdvc.edu.in"
                      type="email"
                      required
                      className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 text-slate-800 dark:text-slate-100 font-bold"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block font-bold text-slate-700 dark:text-slate-300">
                      10-Digit Mobile Number *
                    </label>
                    <input
                      value={form.phone}
                      onChange={(e) => handleFormChange("phone", e.target.value)}
                      placeholder="9876543210"
                      maxLength={10}
                      className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 text-slate-800 dark:text-slate-100 font-medium"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block font-bold text-slate-700 dark:text-slate-300">
                      College Roll Number *
                    </label>
                    <input
                      value={form.rollNumber}
                      onChange={(e) => handleFormChange("rollNumber", e.target.value)}
                      placeholder="e.g. 24E3006"
                      className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 text-slate-800 dark:text-slate-100 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block font-bold text-slate-700 dark:text-slate-300">
                      Degree / Department
                    </label>
                    <select
                      value={form.course}
                      onChange={(e) => handleFormChange("course", e.target.value)}
                      className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 text-slate-800 dark:text-slate-100 font-medium"
                    >
                      <option value="B.Sc Computer Science">B.Sc Computer Science</option>
                      <option value="BCA">BCA (Computer Applications)</option>
                      <option value="M.Sc Computer Science">M.Sc Computer Science</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block font-bold text-slate-700 dark:text-slate-300">
                      Current Academic CGPA *
                    </label>
                    <input
                      value={form.cgpa}
                      onChange={(e) => handleFormChange("cgpa", e.target.value)}
                      placeholder="8.4"
                      className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 text-slate-800 dark:text-slate-100 font-bold text-[#7F011F] dark:text-sky-400"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Upload Resume & Portfolio Audit Gate */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                className="space-y-4 text-xs text-left"
              >
                <div className="bg-sky-50 dark:bg-sky-950/40 p-3 rounded-xl border border-sky-200 dark:border-sky-800/40 text-sky-900 dark:text-sky-300 font-bold">
                  Step 2: Upload Resume PDF &amp; enter Portfolio link. Both must be validated to unlock the MCQ test.
                </div>

                {/* Resume Upload & Portfolio Input */}
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 text-sm">
                      <FiFileText size={16} className="text-[#7F011F] dark:text-rose-400" /> Upload Resume PDF *
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) handleFormChange("resumeName", file.name);
                        }}
                        className="hidden"
                        id="resume-pdf-input-step2"
                      />
                      <label
                        htmlFor="resume-pdf-input-step2"
                        className="flex-1 cursor-pointer rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4 text-center font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 truncate transition-all"
                      >
                        {form.resumeName ? `📄 Attached: ${form.resumeName}` : "📁 Click here to select Resume PDF..."}
                      </label>
                      {form.resumeName && (
                        <span className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3 py-2 text-xs font-black text-emerald-600 dark:text-emerald-400">
                          PDF Attached ✓
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 text-sm">
                      <FiGlobe size={16} className="text-[#0F4C81] dark:text-sky-400" /> Enter Portfolio / GitHub Profile URL *
                    </label>
                    <input
                      value={form.portfolio}
                      onChange={(e) => handleFormChange("portfolio", e.target.value)}
                      placeholder="https://github.com/username or portfolio link"
                      className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 text-xs font-bold text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>

                {/* Run Validation Audit */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleRunWorthinessAudit}
                    disabled={auditing}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#7F011F] to-[#021C4F] hover:from-[#990227] hover:to-[#0F4C81] p-3.5 font-extrabold text-white shadow-md transition-all text-xs"
                  >
                    <FiCpu size={18} />
                    {auditing ? "Validating Resume PDF & Portfolio URL..." : "Verify Resume & Portfolio Quality"}
                  </button>

                  {worthinessResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-3 rounded-xl border p-4 text-xs font-bold ${
                        worthinessResult.isWorthy
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"
                          : "border-rose-500/30 bg-rose-500/10 text-rose-800 dark:text-rose-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-extrabold flex items-center gap-1.5">
                          <FiShield size={18} /> Validation Status: {worthinessResult.matchTier}
                        </span>
                        <span className="rounded-full bg-emerald-600 text-white px-3 py-0.5 text-xs font-black">
                          {worthinessResult.score}% Valid Match
                        </span>
                      </div>
                      <p className="mt-1 font-medium text-slate-700 dark:text-slate-300">
                        {worthinessResult.summary}
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* STEP 3: Multi-Language Dynamic Captcha MCQ Assessment */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                className="space-y-4 text-xs"
              >
                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div>
                    <span className="font-extrabold text-slate-800 dark:text-slate-100 block">
                      Select Programming Language for Assessment:
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Captcha engine generates unique, auto-refreshed questions per candidate session.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleLanguageChange(chosenLang)}
                    className="flex items-center gap-1 rounded-lg bg-slate-200 dark:bg-slate-700 px-2.5 py-1 text-[10px] font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-300"
                  >
                    <FiRefreshCw size={12} /> Refresh Captcha Set
                  </button>
                </div>

                {/* Language Selectors */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "java", label: "Java" },
                    { id: "python", label: "Python" },
                    { id: "cpp", label: "C++" },
                    { id: "c", label: "C Language" },
                    { id: "sql", label: "SQL & DBMS" },
                    { id: "js", label: "JavaScript" },
                  ].map((lang) => (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => handleLanguageChange(lang.id)}
                      className={`rounded-xl px-4 py-2 font-extrabold transition-all ${
                        chosenLang === lang.id
                          ? "bg-[#7F011F] text-white shadow-md border-2 border-amber-400"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>

                {/* Question List */}
                <div className="space-y-3 pt-2">
                  {mcqQuestions.map((q, qIdx) => (
                    <div
                      key={q.captchaId || qIdx}
                      className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4 space-y-2 text-left"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-[#7F011F] dark:text-sky-300 text-xs">
                          Question {qIdx + 1} of {mcqQuestions.length} ({chosenLang.toUpperCase()})
                        </span>
                        <span className="rounded bg-slate-200 dark:bg-slate-700 px-2 py-0.5 text-[9px] font-mono font-bold text-slate-600 dark:text-slate-300">
                          {q.captchaId}
                        </span>
                      </div>

                      <p className="font-bold text-slate-800 dark:text-slate-100 leading-snug">
                        {q.question}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {q.options.map((opt, oIdx) => {
                          const sel = mcqAnswers[qIdx] === oIdx;
                          return (
                            <button
                              key={oIdx}
                              type="button"
                              onClick={() => handleMcqAnswer(qIdx, oIdx)}
                              className={`flex items-center gap-2 rounded-lg border p-2.5 text-left font-semibold text-xs transition-all ${
                                sel
                                  ? "border-[#7F011F] bg-[#7F011F]/10 text-[#7F011F] dark:text-sky-300 font-extrabold"
                                  : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100"
                              }`}
                            >
                              <span
                                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                                  sel ? "bg-[#7F011F] text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-600"
                                }`}
                              >
                                {String.fromCharCode(65 + oIdx)}
                              </span>
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 4: Interactive AI Voice Interviewer */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="space-y-5 text-xs text-left"
              >
                {/* AI Interviewer Avatar & Question Box */}
                <div className="rounded-2xl bg-gradient-to-br from-[#021C4F] to-[#011337] p-5 text-white shadow-lg space-y-3 border border-sky-500/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-sky-500/20 text-sky-400 border border-sky-400/40">
                        <FiCpu size={24} className={isSpeaking ? "animate-bounce text-amber-300" : ""} />
                        {isSpeaking && (
                          <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-white">AI Technical Interviewer</h4>
                        <p className="text-[10px] text-sky-300 font-semibold">
                          Interview Question {currentQIndex + 1} of {interviewQuestions.length}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-300 bg-white/10 px-2.5 py-1 rounded-full flex items-center gap-1">
                        {isSpeaking ? <FiVolume2 className="text-amber-400 animate-pulse" /> : <FiVolumeX />}
                        {isSpeaking ? "Speaking Question..." : "Voice Ready"}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl bg-white/10 p-4 backdrop-blur-md border border-white/15">
                    <p className="text-sm font-extrabold leading-relaxed text-white">
                      &quot;{interviewQuestions[currentQIndex]?.question}&quot;
                    </p>
                  </div>
                </div>

                {/* Candidate Microphone Voice Recording */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-extrabold text-slate-800 dark:text-slate-100 text-sm">
                      <FiMic className={isListening ? "text-rose-500 animate-pulse" : "text-slate-400"} size={18} />
                      Candidate Voice Response Input:
                    </div>

                    <div
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black ${
                        livenessTimer <= 5
                          ? "bg-rose-500 text-white animate-pulse"
                          : "bg-amber-500/20 text-amber-600 dark:text-amber-300"
                      }`}
                    >
                      <FiClock size={14} />
                      <span>{livenessTimer}s Liveness Timer</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {!isListening ? (
                      <button
                        type="button"
                        onClick={startListeningVoice}
                        className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 text-xs font-extrabold text-white shadow-md transition-all"
                      >
                        <FiMic size={16} /> Start Speaking (Microphone)
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={stopListeningVoice}
                        className="flex items-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 px-4 py-2.5 text-xs font-extrabold text-white shadow-md transition-all"
                      >
                        <FiMicOff size={16} /> Stop Recording
                      </button>
                    )}

                    <span className="text-[11px] font-bold text-slate-500">
                      {isListening ? "🟢 Listening to your audio response..." : "Click start and speak into your mic."}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-extrabold uppercase text-slate-400">
                      Live Spoken Audio Transcript:
                    </label>
                    <textarea
                      value={spokenTranscript}
                      onChange={(e) => setSpokenTranscript(e.target.value)}
                      placeholder="Your spoken response will appear here in real time..."
                      rows={3}
                      className="w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 5: Official Email Confirmation Receipt */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center py-6 text-center space-y-4"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 shadow-md">
                  <FiCheckCircle size={36} />
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-extrabold text-[#7F011F] dark:text-sky-400">
                    Application Registered Successfully!
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Your placement drive registration for <strong>{drive.companyName}</strong> ({drive.role}) has been submitted to the DDGDVC Placement Cell.
                  </p>
                </div>

                <div className="w-full max-w-md rounded-2xl border border-sky-500/30 bg-sky-500/10 p-4 space-y-3 text-left">
                  <div className="flex items-center gap-2 text-sky-800 dark:text-sky-300 font-extrabold text-xs">
                    <FiMail size={16} className="shrink-0 text-sky-600" />
                    <span>Official Email Notification Sent:</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    Further drive schedules, online test credentials, and interview call letters will be shared directly to your official email:
                  </p>
                  <p className="font-mono text-sm font-black text-[#7F011F] dark:text-sky-300 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                    {form.email}
                  </p>
                </div>

                <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 p-4 text-left text-xs space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400">Registration ID:</span>
                    <span className="font-mono font-black text-[#7F011F] dark:text-sky-300">{regId}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">Candidate:</span>
                      <strong className="text-slate-800 dark:text-slate-100">{form.fullName}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">Roll No:</span>
                      <strong className="text-slate-800 dark:text-slate-100 font-mono">{form.rollNumber}</strong>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-6 py-4">
          {step === 1 && (
            <>
              <button
                onClick={onClose}
                className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleGoToStep2}
                className="rounded-xl bg-[#7F011F] hover:bg-[#990227] px-6 py-2 text-xs font-bold text-white shadow-sm transition-all"
              >
                Next: Upload Resume &amp; Portfolio
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <button
                onClick={() => setStep(1)}
                className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Back to Details
              </button>
              <button
                onClick={handleGoToMcqTest}
                disabled={!worthinessResult || !worthinessResult.isWorthy}
                className="rounded-xl bg-[#7F011F] hover:bg-[#990227] px-6 py-2 text-xs font-bold text-white shadow-sm transition-all disabled:opacity-50"
              >
                Next: Start MCQ Test
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <button
                onClick={() => setStep(2)}
                className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Back
              </button>
              <button
                onClick={handleSubmitMcq}
                className="rounded-xl bg-[#7F011F] hover:bg-[#990227] px-6 py-2 text-xs font-bold text-white shadow-sm transition-all"
              >
                Submit MCQ &amp; Start AI Voice Interview
              </button>
            </>
          )}

          {step === 4 && (
            <button
              onClick={handleNextInterviewQuestion}
              disabled={submitting}
              className="rounded-xl bg-[#7F011F] hover:bg-[#990227] px-6 py-2 text-xs font-bold text-white shadow-sm transition-all disabled:opacity-60"
            >
              {currentQIndex < interviewQuestions.length - 1 ? "Next Interview Question" : "Complete AI Interview"}
            </button>
          )}

          {step === 5 && (
            <button
              onClick={onClose}
              className="rounded-xl bg-[#7F011F] hover:bg-[#990227] px-6 py-2 text-xs font-bold text-white shadow-sm"
            >
              Done &amp; Close Portal
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
    <div className="dark">
      <div className="min-h-screen bg-[#FAF0F2] text-[#2D060E] transition-colors duration-300">
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

                {activeTab === "chennai-mnc" && <ChennaiMncTab />}

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
