import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCode, FiBriefcase,
  FiSend, FiCheckCircle,
  FiX, FiAlertCircle, FiClock,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { SAMPLE_PLACEMENTS } from "../utils/constants";
import { formatDate } from "../utils/helpers";
import PlacementFeedback from "../components/placements/PlacementFeedback";

const mcqQuestions = [
  { id: 1, question: "If all cats are animals and some animals are pets, which of the following must be true?", options: ["All cats are pets", "Some cats are pets", "All pets are cats", "Some animals are cats"], correct: 3 },
  { id: 2, question: "A train travels 360 km in 4 hours. What is its speed in m/s?", options: ["20 m/s", "25 m/s", "30 m/s", "15 m/s"], correct: 1 },
  { id: 3, question: "If APARTMENT is coded as BQBUSFOU, how is BUILDING coded?", options: ["CVJMEJOH", "CVILEJOH", "CVJMEIOH", "BVILEJOH"], correct: 0 },
  { id: 4, question: "In a class of 40 students, 25 like Maths, 20 like Physics, and 10 like both. How many like neither?", options: ["5", "10", "15", "20"], correct: 0 },
  { id: 5, question: "A clock shows 3:15. What is the angle between the hour and minute hands?", options: ["0°", "7.5°", "15°", "30°"], correct: 1 },
];

function ApplyModal({ drive, onClose }) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState({});
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", rollNumber: "", course: "", year: "", cgpa: "" });

  const selectedQuestions = mcqQuestions.slice(0, 5);

  function handleFormChange(field, value) { setForm((prev) => ({ ...prev, [field]: value })); }

  function handleNextStep() {
    if (step === 1) {
      if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim()) { toast.error("Please fill in all required fields"); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { toast.error("Enter a valid email address"); return; }
      if (!/^\d{10}$/.test(form.phone)) { toast.error("Enter a valid 10-digit phone number"); return; }
      setStep(2);
    } else if (step === 2) {
      const unanswered = selectedQuestions.filter((q) => answers[q.id] === undefined);
      if (unanswered.length > 0) { toast.error("Please answer all questions before submitting"); return; }
      setSubmitting(true);
      setTimeout(() => { setSubmitting(false); setStep(3); toast.success("Application submitted successfully!"); }, 1500);
    }
  }

  function handleAnswer(questionId, optionIndex) { setAnswers((prev) => ({ ...prev, [questionId]: optionIndex })); }

  const correctCount = selectedQuestions.filter((q) => answers[q.id] === q.correct).length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white border border-[#E5E7EB] shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-[#E5E7EB] bg-[#0F4C81] px-6 py-4 text-white">
          <div>
            <h3 className="text-base font-bold text-white">{step === 1 ? "Apply — Personal Details" : step === 2 ? "Logical Reasoning Assessment" : "Application Submitted"}</h3>
            <p className="text-xs text-white/80">{drive.companyName} · {drive.role}</p>
          </div>
          <button onClick={onClose} className="rounded-full bg-white/10 p-2 text-white/70 hover:bg-white/20 hover:text-white transition-all"><FiX size={16} /></button>
        </div>

        <div className="flex items-center gap-2 border-b border-[#E5E7EB] bg-[#F8FAFC] px-6 py-3">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${step >= s ? "bg-[#0F4C81] text-white shadow-sm" : "bg-slate-200 text-slate-500"}`}>{step > s ? <FiCheckCircle size={14} /> : s}</div>
              <span className={`text-xs font-medium ${step >= s ? "text-[#0F4C81] font-semibold" : "text-[#6B7280]"}`}>{s === 1 ? "Details" : s === 2 ? "MCQ Test" : "Submit"}</span>
              {s < 3 && <span className="text-[#E5E7EB] mx-1">—</span>}
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-auto p-6 bg-white">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4 text-left">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {[{field:"fullName",label:"Full Name *",placeholder:"John Doe",type:"text"},{field:"email",label:"Email *",placeholder:"john@college.edu",type:"email"},{field:"phone",label:"Phone *",placeholder:"9876543210",type:"tel",maxLength:10},{field:"rollNumber",label:"Roll Number",placeholder:"24E3001",type:"text"}].map(({field,label,placeholder,type,maxLength}) => (
                    <div key={field}>
                      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">{label}</label>
                      <input value={form[field]} onChange={(e) => handleFormChange(field, e.target.value)} placeholder={placeholder} type={type} maxLength={maxLength}
                        className="input-premium" />
                    </div>
                  ))}
                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">Course</label>
                    <select value={form.course} onChange={(e) => handleFormChange("course", e.target.value)} className="input-premium bg-white">
                      <option value="">Select Course</option>
                      <option value="B.Sc CS">B.Sc Computer Science</option>
                      <option value="BCA">BCA</option>
                      <option value="M.Sc CS">M.Sc Computer Science</option>
                    </select>
                  </div>
                  <div><label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">Year</label>
                    <select value={form.year} onChange={(e) => handleFormChange("year", e.target.value)} className="input-premium bg-white">
                      <option value="">Select Year</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                    </select></div>
                  <div><label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">CGPA</label>
                    <input value={form.cgpa} onChange={(e) => handleFormChange("cgpa", e.target.value)} placeholder="8.5"
                      className="input-premium" /></div>
                </div>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-5 text-left">
                <div className="rounded-lg border border-[#E5E7EB] bg-[#F0F4F8] p-3 text-xs text-[#0F4C81] flex items-center gap-2 font-medium">
                  <FiAlertCircle size={14} className="text-[#0F4C81] shrink-0" />
                  Answer all 5 logical reasoning questions.
                </div>
                {selectedQuestions.map((q, idx) => (
                  <div key={q.id} className="rounded-lg border border-[#E5E7EB] bg-white p-4 shadow-sm">
                    <p className="mb-3 text-sm font-semibold text-[#0F4C81]">{idx + 1}. {q.question}</p>
                    <div className="space-y-2">
                      {q.options.map((opt, oi) => (
                        <button key={oi} onClick={() => handleAnswer(q.id, oi)}
                          className={`flex w-full items-center gap-3 rounded-lg border px-3.5 py-2.5 text-xs text-left transition-all ${answers[q.id] === oi ? "border-[#0F4C81] bg-[#F0F4F8] text-[#0F4C81] shadow-sm font-semibold" : "border-[#E5E7EB] bg-white text-[#4B5563] hover:border-[#1E88E5]/30 hover:bg-[#F8FAFC]"}`}
                        >
                          <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-all ${answers[q.id] === oi ? "bg-[#0F4C81] text-white shadow-sm" : "bg-slate-200 text-slate-500"}`}>{String.fromCharCode(65 + oi)}</span>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center py-8 text-center"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#2E7D32]/10">
                  <FiCheckCircle size={32} className="text-[#2E7D32]" />
                </div>
                <h3 className="text-lg font-bold text-[#0F4C81]">Application Submitted!</h3>
                <p className="mt-2 text-sm text-[#6B7280]">Your application for {drive.companyName} — {drive.role} has been received.</p>
                <div className="mt-6 grid grid-cols-2 gap-4 text-center w-full max-w-sm">
                  <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 shadow-sm">
                    <p className="text-2xl font-bold text-[#2E7D32]">{correctCount}/5</p>
                    <p className="text-[10px] text-[#6B7280] font-medium uppercase tracking-wider">MCQ Score</p>
                  </div>
                  <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 shadow-sm">
                    <p className="text-2xl font-bold text-[#0F4C81]">{drive.package} LPA</p>
                    <p className="text-[10px] text-[#6B7280] font-medium uppercase tracking-wider">Package</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-[#E5E7EB] bg-[#F8FAFC] px-6 py-4">
          {step < 3 && (
            <>
              <button onClick={onClose} className="rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-xs font-semibold text-[#4B5563] hover:bg-[#F8FAFC] transition-all">Cancel</button>
              <button onClick={handleNextStep} disabled={submitting}
                className="rounded-lg bg-[#0F4C81] hover:bg-[#1E88E5] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all disabled:opacity-60"
              >{submitting ? "Submitting…" : step === 1 ? "Next: MCQ Test" : "Submit Application"}</button>
            </>
          )}
          {step === 3 && <button onClick={onClose} className="rounded-lg bg-[#0F4C81] hover:bg-[#1E88E5] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all">Done</button>}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Placements() {
  const [applyingTo, setApplyingTo] = useState(null);
  const displayItems = SAMPLE_PLACEMENTS;

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 bg-[#F8FAFC]">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-xl bg-[#0F4C81] text-white shadow-sm">
          <FiBriefcase size={36} />
        </div>
        <h1 className="font-sans text-4xl font-bold text-[#0F4C81]">Placements</h1>
        <p className="mt-2 text-sm text-[#6B7280]">Live drives, eligibility criteria and application links from recruiting companies</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0F4C81] text-white shadow-sm"><FiBriefcase size={18} /></div>
          <div className="text-left">
            <h2 className="font-sans text-xl font-bold text-[#0F4C81]">Active Drives</h2>
            <p className="text-[11px] text-[#6B7280]">{displayItems.length} companies currently recruiting</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {displayItems.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="h-full">
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm hover:shadow-sm transition-all duration-300 flex h-full flex-col gap-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-[#0F4C81] text-lg font-bold text-white shadow-sm">{p.companyName?.[0]}</div>
                  <div>
                    <h3 className="font-sans font-semibold text-sm text-[#0F4C81]">{p.companyName}</h3>
                    <p className="flex items-center gap-1 text-xs text-[#6B7280]"><FiBriefcase size={11} /> {p.role}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#0F4C81]/10 px-3 py-1 text-[11px] font-bold text-[#0F4C81]">₹{p.package} LPA</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700">{p.eligibility}</span>
                  {p.skills && <span className="inline-flex items-center gap-1 rounded-full bg-[#1E88E5]/10 px-3 py-1 text-[11px] font-semibold text-[#0F4C81]"><FiCode size={10} /> {p.skills}</span>}
                </div>
                <p className="flex items-center gap-1.5 text-xs text-[#6B7280]"><FiClock size={11} /> Deadline: {formatDate(p.deadline)}</p>
                <button onClick={() => setApplyingTo(p)}
                  className="mt-auto flex items-center justify-center gap-1.5 rounded-lg bg-[#0F4C81] hover:bg-[#1E88E5] py-2.5 text-xs font-bold text-white shadow-sm transition-all"
                >Apply Now <FiSend size={13} /></button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Placement Feedback Section ── */}
      <PlacementFeedback />

      <AnimatePresence>
        {applyingTo && <ApplyModal drive={applyingTo} onClose={() => setApplyingTo(null)} />}
      </AnimatePresence>
    </div>
  );
}
