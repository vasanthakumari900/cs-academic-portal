// src/pages/Placements.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCalendar, FiDollarSign, FiExternalLink, FiUsers,
  FiAward, FiStar, FiTrendingUp, FiCode, FiBriefcase,
  FiUser, FiMail, FiPhone, FiBook, FiSend, FiCheckCircle,
  FiX, FiAlertCircle,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { SAMPLE_PLACEMENTS } from "../utils/constants";
import StatCard from "../components/ui/StatCard";
import { formatDate } from "../utils/helpers";

// ============== MCQ Question Bank ==============
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
  {
    id: 6,
    question: "Which number comes next in the series: 2, 6, 12, 20, 30, ?",
    options: ["36", "40", "42", "48"],
    correct: 2,
  },
  {
    id: 7,
    question: "If 'PENCIL' is coded as 'QFOEJM', how is 'PAPER' coded?",
    options: ["QBQFS", "QBSFS", "QBQES", "PAQFS"],
    correct: 0,
  },
  {
    id: 8,
    question: "A man walks 5 km east, then 3 km north, then 5 km west. How far is he from his starting point?",
    options: ["2 km", "3 km", "5 km", "8 km"],
    correct: 1,
  },
  {
    id: 9,
    question: "If 3x + 7 = 22, what is the value of x?",
    options: ["3", "5", "7", "15"],
    correct: 1,
  },
  {
    id: 10,
    question: "In a certain language, 'GOOD' is coded as 'HPPE'. How is 'WORK' coded?",
    options: ["XPSL", "XQSL", "XPQL", "XQRL"],
    correct: 0,
  },
];

const successStories = [
  {
    name: "Sanjana Patel",
    batch: "2024 Batch",
    company: "Google",
    role: "Software Engineer",
    package: "₹32 LPA",
    quote: "The portal's curated question papers and placement prep resources were instrumental in my interview preparation.",
    initials: "SP",
  },
  {
    name: "Vignesh Suresh",
    batch: "2024 Batch",
    company: "Microsoft",
    role: "SDE",
    package: "₹28 LPA",
    quote: "Having all placement drives listed in one place with clear eligibility criteria saved me weeks of chasing emails.",
    initials: "VS",
  },
  {
    name: "Divya Menon",
    batch: "2025 Batch",
    company: "Amazon",
    role: "SDE-1",
    package: "₹26 LPA",
    quote: "The portal made it easy to track deadlines and prepare systematically. The video lectures were a lifesaver.",
    initials: "DM",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// ============== Apply Modal Component ==============
function ApplyModal({ drive, onClose }) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState({});
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    rollNumber: "",
    course: "",
    year: "",
    cgpa: "",
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
        toast.success("Application submitted successfully!");
      }, 1500);
    }
  }

  function handleAnswer(questionId, optionIndex) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  }

  const correctCount = selectedQuestions.filter(
    (q) => answers[q.id] === q.correct
  ).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-premium-lg"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              {step === 1 ? "Apply — Personal Details" : step === 2 ? "Logical Reasoning Assessment" : "Application Submitted"}
            </h3>
            <p className="text-xs text-gray-500">{drive.companyName} · {drive.role}</p>
          </div>
          <button onClick={onClose} className="rounded-full bg-white/80 p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <FiX size={16} />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 border-b border-gray-50 px-6 py-3">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                step >= s ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"
              }`}>
                {step > s ? <FiCheckCircle size={14} /> : s}
              </div>
              <span className={`text-xs ${step >= s ? "text-gray-700" : "text-gray-400"}`}>
                {s === 1 ? "Details" : s === 2 ? "MCQ Test" : "Submit"}
              </span>
              {s < 3 && <span className="text-gray-200">—</span>}
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto p-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">Full Name *</label>
                    <input value={form.fullName} onChange={(e) => handleFormChange("fullName", e.target.value)} placeholder="John Doe" className="input-field" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">Email *</label>
                    <input value={form.email} onChange={(e) => handleFormChange("email", e.target.value)} placeholder="john@college.edu" className="input-field" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">Phone *</label>
                    <input value={form.phone} onChange={(e) => handleFormChange("phone", e.target.value)} placeholder="9876543210" maxLength={10} className="input-field" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">Roll Number</label>
                    <input value={form.rollNumber} onChange={(e) => handleFormChange("rollNumber", e.target.value)} placeholder="24E3001" className="input-field" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">Course</label>
                    <select value={form.course} onChange={(e) => handleFormChange("course", e.target.value)} className="input-field">
                      <option value="">Select Course</option>
                      <option value="B.Sc CS">B.Sc Computer Science</option>
                      <option value="B.Sc IT">B.Sc Information Technology</option>
                      <option value="BCA">BCA</option>
                      <option value="M.Sc CS">M.Sc Computer Science</option>
                      <option value="MCA">MCA</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">Year</label>
                    <select value={form.year} onChange={(e) => handleFormChange("year", e.target.value)} className="input-field">
                      <option value="">Select Year</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">CGPA</label>
                    <input value={form.cgpa} onChange={(e) => handleFormChange("cgpa", e.target.value)} placeholder="8.5" className="input-field" />
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
                className="space-y-6"
              >
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-gray-600">
                  <FiAlertCircle size={14} className="inline mr-1.5 text-blue-600" />
                  Answer all 5 logical reasoning questions. Each question has one correct answer.
                </div>
                {selectedQuestions.map((q, idx) => (
                  <div key={q.id} className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                    <p className="mb-3 text-sm font-semibold text-gray-900">
                      {idx + 1}. {q.question}
                    </p>
                    <div className="space-y-2">
                      {q.options.map((opt, oi) => (
                        <button
                          key={oi}
                          onClick={() => handleAnswer(q.id, oi)}
                          className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-xs transition-all ${
                            answers[q.id] === oi
                              ? "border-blue-300 bg-blue-50 text-blue-700"
                              : "border-gray-100 bg-white text-gray-600 hover:border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                            answers[q.id] === oi ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"
                          }`}>
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
                className="flex flex-col items-center py-8 text-center"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                  <FiCheckCircle size={32} className="text-green-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Application Submitted!</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Your application for {drive.companyName} — {drive.role} has been received.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                    <p className="text-2xl font-bold text-blue-600">{correctCount}/5</p>
                    <p className="text-[10px] text-gray-400">MCQ Score</p>
                  </div>
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                    <p className="text-2xl font-bold text-gray-700">{drive.package} LPA</p>
                    <p className="text-[10px] text-gray-400">Package</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
          {step < 3 && (
            <>
              <button onClick={onClose} className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={handleNextStep}
                disabled={submitting}
                className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 px-5 py-2 text-xs font-bold text-white shadow-premium hover:shadow-premium-lg disabled:opacity-60"
              >
                {submitting ? "Submitting…" : step === 1 ? "Next: MCQ Test" : "Submit Application"}
              </button>
            </>
          )}
          {step === 3 && (
            <button onClick={onClose} className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 px-5 py-2 text-xs font-bold text-white">
              Done
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============== Main Placements Component ==============
export default function Placements() {
  const [applyingTo, setApplyingTo] = useState(null);
  const displayItems = SAMPLE_PLACEMENTS;

  const topPackage = displayItems.reduce((max, p) => Math.max(max, Number(p.package) || 0), 0);
  const totalPackage = displayItems.reduce((sum, p) => sum + (Number(p.package) || 0), 0);
  const avgPackage = displayItems.length > 0 ? (totalPackage / displayItems.length) : 0;
  const placedCount = displayItems.length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="mb-1 font-display text-3xl font-bold text-gray-900">Placements</h1>
        <p className="mb-8 text-gray-500">
          Live drives, eligibility criteria and application links from recruiting companies.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={FiUsers} label="Active Drives" value={placedCount} accent="primary" />
        <StatCard icon={FiDollarSign} label="Highest Package" value={topPackage ? `₹${topPackage} LPA` : "—"} accent="success" />
        <StatCard icon={FiTrendingUp} label="Average Package" value={avgPackage ? `₹${avgPackage.toFixed(1)} LPA` : "—"} accent="accent" />
        <StatCard icon={FiAward} label="Students Placed" value={placedCount} accent="warning" />
      </div>

      {/* Active Drives */}
      <>
        <h2 className="mb-6 font-display text-2xl font-bold text-gray-900">Active Drives</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {displayItems.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div className="premium-card-hover flex h-full flex-col gap-3 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-blue-50">
                    <span className="font-display text-sm font-bold text-blue-600">{p.companyName?.[0]}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-900">{p.companyName}</h3>
                    <p className="flex items-center gap-1 text-xs text-gray-500">
                      <FiBriefcase size={11} /> {p.role}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 font-semibold text-blue-700">₹{p.package} LPA</span>
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 font-semibold text-gray-600">{p.eligibility}</span>
                  {p.skills && (
                    <span className="rounded-full bg-gray-50 px-2.5 py-1 font-semibold text-blue-600">{p.skills}</span>
                  )}
                </div>

                <p className="text-xs text-gray-400">
                  Deadline: {formatDate(p.deadline)}
                </p>

                <button
                  onClick={() => setApplyingTo(p)}
                  className="mt-auto flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 py-2 text-xs font-semibold text-white shadow-premium transition-all hover:shadow-premium-lg active:scale-95"
                >
                  Apply Now <FiSend size={13} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </>

      {/* Success Stories */}
      <motion.section
        initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
        className="mt-20"
      >
        <h2 className="mb-2 text-center font-display text-2xl font-bold text-gray-900">
          Success <span className="text-gradient">Stories</span>
        </h2>
        <p className="mb-10 text-center text-sm text-gray-500">
          Our students placed at top companies across the globe.
        </p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {successStories.map((s, i) => (
            <motion.div
              key={s.name}
              initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
              transition={{ delay: i * 0.1 }}
            >
              <div className="premium-card flex h-full flex-col p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-800 text-sm font-bold text-white">
                    {s.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{s.name}</p>
                    <p className="text-xs text-gray-500">{s.batch}</p>
                  </div>
                </div>
                <p className="mb-3 text-xs italic text-gray-500">&ldquo;{s.quote}&rdquo;</p>
                <div className="mt-auto flex items-center gap-2 text-xs">
                  <FiStar className="text-amber-400" size={14} />
                  <span className="font-semibold text-gray-900">{s.company}</span>
                  <span className="text-gray-300">·</span>
                  <span className="text-gray-500">{s.role}</span>
                  <span className="text-gray-300">·</span>
                  <span className="font-semibold text-blue-600">{s.package}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Apply Modal */}
      <AnimatePresence>
        {applyingTo && (
          <ApplyModal drive={applyingTo} onClose={() => setApplyingTo(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
