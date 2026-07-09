// src/pages/Placements.jsx
// Premium glassmorphism Placements page with active drives, MCQ assessment, success stories
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCalendar, FiDollarSign, FiUsers,
  FiAward, FiStar, FiTrendingUp, FiCode, FiBriefcase,
  FiUser, FiMail, FiPhone, FiBook, FiSend, FiCheckCircle,
  FiX, FiAlertCircle, FiMapPin, FiClock,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { SAMPLE_PLACEMENTS } from "../utils/constants";
import { formatDate } from "../utils/helpers";
import AnimatedCounter from "../components/ui/AnimatedCounter";

// ─── MCQ Question Bank ───
const mcqQuestions = [
  { id: 1, question: "If all cats are animals and some animals are pets, which of the following must be true?", options: ["All cats are pets", "Some cats are pets", "All pets are cats", "Some animals are cats"], correct: 3 },
  { id: 2, question: "A train travels 360 km in 4 hours. What is its speed in m/s?", options: ["20 m/s", "25 m/s", "30 m/s", "15 m/s"], correct: 1 },
  { id: 3, question: "If APARTMENT is coded as BQBUSFOU, how is BUILDING coded?", options: ["CVJMEJOH", "CVILEJOH", "CVJMEIOH", "BVILEJOH"], correct: 0 },
  { id: 4, question: "In a class of 40 students, 25 like Maths, 20 like Physics, and 10 like both. How many like neither?", options: ["5", "10", "15", "20"], correct: 0 },
  { id: 5, question: "A clock shows 3:15. What is the angle between the hour and minute hands?", options: ["0°", "7.5°", "15°", "30°"], correct: 1 },
  { id: 6, question: "Which number comes next in the series: 2, 6, 12, 20, 30, ?", options: ["36", "40", "42", "48"], correct: 2 },
  { id: 7, question: "If 'PENCIL' is coded as 'QFOEJM', how is 'PAPER' coded?", options: ["QBQFS", "QBSFS", "QBQES", "PAQFS"], correct: 0 },
  { id: 8, question: "A man walks 5 km east, then 3 km north, then 5 km west. How far is he from his starting point?", options: ["2 km", "3 km", "5 km", "8 km"], correct: 1 },
  { id: 9, question: "If 3x + 7 = 22, what is the value of x?", options: ["3", "5", "7", "15"], correct: 1 },
  { id: 10, question: "In a certain language, 'GOOD' is coded as 'HPPE'. How is 'WORK' coded?", options: ["XPSL", "XQSL", "XPQL", "XQRL"], correct: 0 },
];

const successStories = [
  { name: "Sanjana Patel", batch: "2024 Batch", company: "Google", role: "Software Engineer", package: "₹32 LPA", quote: "The portal's curated question papers and placement prep resources were instrumental in my interview preparation.", initials: "SP", color: "from-blue-500 to-indigo-600" },
  { name: "Vignesh Suresh", batch: "2024 Batch", company: "Microsoft", role: "SDE", package: "₹28 LPA", quote: "Having all placement drives listed in one place with clear eligibility criteria saved me weeks of chasing emails.", initials: "VS", color: "from-emerald-500 to-teal-600" },
  { name: "Divya Menon", batch: "2025 Batch", company: "Amazon", role: "SDE-1", package: "₹26 LPA", quote: "The portal made it easy to track deadlines and prepare systematically. The video lectures were a lifesaver.", initials: "DM", color: "from-amber-500 to-orange-600" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// ─── Apply Modal ───
function ApplyModal({ drive, onClose }) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState({});
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", rollNumber: "", course: "", year: "", cgpa: "" });

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

  const correctCount = selectedQuestions.filter((q) => answers[q.id] === q.correct).length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-premium-lg"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              {step === 1 ? "Apply — Personal Details" : step === 2 ? "Logical Reasoning Assessment" : "Application Submitted"}
            </h3>
            <p className="text-xs text-gray-500">{drive.companyName} · {drive.role}</p>
          </div>
          <button onClick={onClose} className="rounded-full bg-white/80 p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all">
            <FiX size={16} />
          </button>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-2 border-b border-gray-50 px-6 py-3">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${step >= s ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-sm" : "bg-gray-100 text-gray-400"}`}>
                {step > s ? <FiCheckCircle size={14} /> : s}
              </div>
              <span className={`text-xs font-medium ${step >= s ? "text-gray-700" : "text-gray-400"}`}>
                {s === 1 ? "Details" : s === 2 ? "MCQ Test" : "Submit"}
              </span>
              {s < 3 && <span className="text-gray-200 mx-1">—</span>}
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto p-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {[
                    { field: "fullName", label: "Full Name *", placeholder: "John Doe", type: "text" },
                    { field: "email", label: "Email *", placeholder: "john@college.edu", type: "email" },
                    { field: "phone", label: "Phone *", placeholder: "9876543210", type: "tel", maxLength: 10 },
                    { field: "rollNumber", label: "Roll Number", placeholder: "24E3001", type: "text" },
                  ].map(({ field, label, placeholder, type, maxLength }) => (
                    <div key={field}>
                      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-gray-500">{label}</label>
                      <input value={form[field]} onChange={(e) => handleFormChange(field, e.target.value)} placeholder={placeholder} type={type} maxLength={maxLength}
                        className="w-full rounded-xl border border-gray-200 bg-white/70 px-3.5 py-2.5 text-sm outline-none ring-1 ring-gray-200/50 focus:ring-2 focus:ring-blue-400/30 focus:border-blue-300 transition-all" />
                    </div>
                  ))}
                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-gray-500">Course</label>
                    <select value={form.course} onChange={(e) => handleFormChange("course", e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white/70 px-3.5 py-2.5 text-sm outline-none ring-1 ring-gray-200/50 focus:ring-2 focus:ring-blue-400/30 focus:border-blue-300 transition-all">
                      <option value="">Select Course</option>
                      <option value="B.Sc CS">B.Sc Computer Science</option>
                      <option value="B.Sc IT">B.Sc Information Technology</option>
                      <option value="BCA">BCA</option>
                      <option value="M.Sc CS">M.Sc Computer Science</option>
                      <option value="MCA">MCA</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-gray-500">Year</label>
                    <select value={form.year} onChange={(e) => handleFormChange("year", e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white/70 px-3.5 py-2.5 text-sm outline-none ring-1 ring-gray-200/50 focus:ring-2 focus:ring-blue-400/30 focus:border-blue-300 transition-all">
                      <option value="">Select Year</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-gray-500">CGPA</label>
                    <input value={form.cgpa} onChange={(e) => handleFormChange("cgpa", e.target.value)} placeholder="8.5"
                      className="w-full rounded-xl border border-gray-200 bg-white/70 px-3.5 py-2.5 text-sm outline-none ring-1 ring-gray-200/50 focus:ring-2 focus:ring-blue-400/30 focus:border-blue-300 transition-all" />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-5">
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-xs text-gray-600 flex items-center gap-2">
                  <FiAlertCircle size={14} className="text-blue-600 shrink-0" />
                  Answer all 5 logical reasoning questions. Each question has one correct answer.
                </div>
                {selectedQuestions.map((q, idx) => (
                  <div key={q.id} className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                    <p className="mb-3 text-sm font-semibold text-gray-900">{idx + 1}. {q.question}</p>
                    <div className="space-y-2">
                      {q.options.map((opt, oi) => (
                        <button key={oi} onClick={() => handleAnswer(q.id, oi)}
                          className={`flex w-full items-center gap-3 rounded-xl border px-3.5 py-2.5 text-xs text-left transition-all ${
                            answers[q.id] === oi
                              ? "border-blue-300 bg-blue-50 text-blue-700 shadow-sm"
                              : "border-gray-100 bg-white text-gray-600 hover:border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-all ${
                            answers[q.id] === oi ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-sm" : "bg-gray-100 text-gray-400"
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
              <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center py-8 text-center"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-teal-100">
                  <FiCheckCircle size={32} className="text-emerald-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Application Submitted!</h3>
                <p className="mt-2 text-sm text-gray-500">Your application for {drive.companyName} — {drive.role} has been received.</p>
                <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                  <div className="rounded-2xl bg-gray-50/80 backdrop-blur-glass border border-gray-100 p-4">
                    <p className="text-2xl font-bold text-blue-600">{correctCount}/5</p>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">MCQ Score</p>
                  </div>
                  <div className="rounded-2xl bg-gray-50/80 backdrop-blur-glass border border-gray-100 p-4">
                    <p className="text-2xl font-bold text-gray-700">{drive.package} LPA</p>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Package</p>
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
              <button onClick={onClose} className="rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-all">Cancel</button>
              <button onClick={handleNextStep} disabled={submitting}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 px-5 py-2.5 text-xs font-bold text-white shadow-soft transition-all hover:shadow-premium active:scale-95 disabled:opacity-60"
              >
                {submitting ? "Submitting…" : step === 1 ? "Next: MCQ Test" : "Submit Application"}
              </button>
            </>
          )}
          {step === 3 && (
            <button onClick={onClose} className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 px-5 py-2.5 text-xs font-bold text-white shadow-soft hover:shadow-premium transition-all">Done</button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Component ───
export default function Placements() {
  const [applyingTo, setApplyingTo] = useState(null);
  const displayItems = SAMPLE_PLACEMENTS;

  const topPackage = displayItems.reduce((max, p) => Math.max(max, Number(p.package) || 0), 0);
  const totalPackage = displayItems.reduce((sum, p) => sum + (Number(p.package) || 0), 0);
  const avgPackage = displayItems.length > 0 ? (totalPackage / displayItems.length) : 0;
  const placedCount = displayItems.length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-premium-lg">
          <FiBriefcase size={36} />
        </div>
        <h1 className="font-display text-4xl font-bold text-gray-900">Placements</h1>
        <p className="mt-2 text-sm text-gray-500">Live drives, eligibility criteria and application links from recruiting companies</p>
      </motion.div>

      {/* Stats with Animated Counters */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible"
        className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4"
      >
        {[
          { label: "Active Drives", numeric: placedCount, prefix: "", suffix: "", color: "from-blue-500 to-indigo-600", emoji: "🚀" },
          { label: "Highest Package", numeric: topPackage, prefix: "₹", suffix: " LPA", color: "from-emerald-500 to-teal-600", emoji: "🏆" },
          { label: "Average Package", numeric: avgPackage, prefix: "₹", suffix: " LPA", decimals: 1, color: "from-amber-500 to-orange-600", emoji: "📊" },
          { label: "Students Placed", numeric: placedCount, prefix: "", suffix: "", color: "from-rose-500 to-pink-600", emoji: "🎓" },
        ].map((s, i) => (
          <motion.div key={s.label} variants={itemVariants}
            className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-glass border border-white/30 shadow-glass p-5 text-center transition-all duration-300 hover:shadow-glass-lg"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-[0.03]`} />
            <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${s.color}`} />
            <p className="text-2xl mb-1">{s.emoji}</p>
            <p className="font-display text-xl font-bold text-gray-900">
              {s.numeric > 0 ? (
                <AnimatedCounter value={s.numeric} prefix={s.prefix} suffix={s.suffix} decimals={s.decimals || 0} />
              ) : (
                "—"
              )}
            </p>
            <p className="text-[11px] text-gray-400 font-medium mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Active Drives */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mb-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md">
            <FiBriefcase size={18} />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-gray-900">Active Drives</h2>
            <p className="text-[11px] text-gray-500">{displayItems.length} companies currently recruiting</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {displayItems.map((p, i) => (
            <motion.div key={p.id} variants={itemVariants}>
              <div className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl bg-white/80 backdrop-blur-glass border border-white/30 shadow-glass transition-all duration-300 hover:shadow-glass-lg hover:bg-white/90 p-5">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-bold text-white shadow-sm">
                    {p.companyName?.[0]}
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-sm text-gray-900">{p.companyName}</h3>
                    <p className="flex items-center gap-1 text-xs text-gray-500">
                      <FiBriefcase size={11} /> {p.role}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700">₹{p.package} LPA</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-[11px] font-semibold text-gray-700">{p.eligibility}</span>
                  {p.skills && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold text-indigo-700">
                      <FiCode size={10} /> {p.skills}
                    </span>
                  )}
                </div>

                <p className="flex items-center gap-1.5 text-xs text-gray-400">
                  <FiClock size={11} /> Deadline: {formatDate(p.deadline)}
                </p>

                <button onClick={() => setApplyingTo(p)}
                  className="mt-auto flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 py-2.5 text-xs font-bold text-white shadow-soft transition-all hover:shadow-premium active:scale-95"
                >
                  Apply Now <FiSend size={13} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Success Stories */}
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants} className="mt-20"
      >
        <div className="mb-8 text-center">
          <h2 className="font-display text-2xl font-bold text-gray-900">Success <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">Stories</span></h2>
          <p className="mt-1 text-sm text-gray-500">Our students placed at top companies across the globe</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {successStories.map((s, i) => (
            <motion.div key={s.name} variants={itemVariants}>
              <div className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl bg-white/80 backdrop-blur-glass border border-white/30 shadow-glass transition-all duration-300 hover:shadow-glass-lg p-5">
                <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-[0.02]`} />
                <div className="flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${s.color} text-xs font-bold text-white shadow-md`}>
                    {s.initials}
                  </div>
                  <div>
                    <p className="font-display text-sm font-bold text-gray-900">{s.name}</p>
                    <p className="text-xs text-gray-500">{s.batch}</p>
                  </div>
                  <FiStar className="ml-auto text-amber-400 shrink-0" size={16} />
                </div>
                <p className="text-xs italic text-gray-500 leading-relaxed">&ldquo;{s.quote}&rdquo;</p>
                <div className="mt-auto flex items-center gap-2 text-xs border-t border-gray-100 pt-3">
                  <span className="font-bold text-gray-900">{s.company}</span>
                  <span className="text-gray-300">·</span>
                  <span className="text-gray-500">{s.role}</span>
                  <span className="text-gray-300">·</span>
                  <span className="font-bold text-blue-600">{s.package}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Apply Modal */}
      <AnimatePresence>
        {applyingTo && <ApplyModal drive={applyingTo} onClose={() => setApplyingTo(null)} />}
      </AnimatePresence>
    </div>
  );
}
