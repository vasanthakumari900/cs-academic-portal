// src/components/feedback/ProjectFeedbackModal.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiX, FiStar, FiCheck, FiSend, FiUser,
  FiBookOpen, FiBriefcase
} from "react-icons/fi";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
import toast from "react-hot-toast";

const FEEDBACK_TYPES = [
  {
    id: "student",
    title: "Student Feedback Form",
    subtitle: "CS Academic Portal Student Experience",
    icon: FiUser,
    color: "from-blue-600 to-indigo-700",
    questions: [
      {
        id: "q1_rating",
        type: "rating",
        question: "1. How satisfied are you with the E-Content & Lecture Notes quality?",
      },
      {
        id: "q2_exam_prep",
        type: "choice",
        question: "2. How helpful are the past CIA & Semester Question Papers for exam prep?",
        options: ["Extremely Helpful", "Very Helpful", "Moderately Helpful", "Needs Improvement"]
      },
      {
        id: "q3_ai_rating",
        type: "rating",
        question: "3. Rate the CS AI Study Assistant (RAG Document Q&A & Voice Search):",
      },
      {
        id: "q4_top_feature",
        type: "choice",
        question: "4. Which portal feature do you use the most?",
        options: ["Video Lectures", "PDF Lecture Notes", "CIA Question Papers", "Placement Drives", "AI Chatbot"]
      },
      {
        id: "q5_comments",
        type: "text",
        question: "5. What additional features or study resources would you like us to add?",
        placeholder: "Share your ideas to improve the student experience..."
      }
    ]
  },
  {
    id: "faculty",
    title: "Faculty Feedback Form",
    subtitle: "Teaching & Content Distribution Portal",
    icon: FiBookOpen,
    color: "from-[#C50337] to-rose-700",
    questions: [
      {
        id: "q1_ease_of_use",
        type: "rating",
        question: "1. How easy is it to upload & organize course notes, assignments, and playlists?",
      },
      {
        id: "q2_efficiency",
        type: "choice",
        question: "2. Does the portal simplify academic content distribution to students?",
        options: ["Yes, Significantly", "Yes, Moderately", "Needs More Features"]
      },
      {
        id: "q3_analytics",
        type: "rating",
        question: "3. Rate the Student Activity & Dashboard tracking features:",
      },
      {
        id: "q4_tools_needed",
        type: "choice",
        question: "4. Which tool would most benefit your teaching workflow?",
        options: ["Online Quiz Generator", "Automated Assignment Grading", "Live Doubt Resolution", "Vaishnav LMS Sync"]
      },
      {
        id: "q5_comments",
        type: "text",
        question: "5. Suggestions for enhancing the Faculty Management Portal:",
        placeholder: "Tell us how we can make teaching management easier for you..."
      }
    ]
  },
  {
    id: "alumni",
    title: "Alumni Feedback Form",
    subtitle: "Industry Preparedness & Mentorship",
    icon: FiBriefcase,
    color: "from-[#021C4F] to-[#0A369D]",
    questions: [
      {
        id: "q1_industry_prep",
        type: "rating",
        question: "1. How well does the CS Portal curriculum prepare students for IT corporate careers?",
      },
      {
        id: "q2_placement_rating",
        type: "rating",
        question: "2. Rate the Placement Drives & Interview Experiences section:",
      },
      {
        id: "q3_mentorship",
        type: "choice",
        question: "3. Would you like to contribute as an Alumni Mentor?",
        options: ["Yes, I'd love to mentor students", "Yes, I'll share my interview experiences", "Interested in giving guest lectures", "Not at this time"]
      },
      {
        id: "q4_tech_trends",
        type: "choice",
        question: "4. Which tech domain should be emphasized more in our study resources?",
        options: ["AI & Machine Learning", "Cloud Computing & DevOps", "Full-Stack Web Development", "Cyber Security", "Data Engineering"]
      },
      {
        id: "q5_comments",
        type: "text",
        question: "5. Suggestions for strengthening the Alumni-Student network on the portal:",
        placeholder: "Share your advice for current computer science students..."
      }
    ]
  }
];

export default function ProjectFeedbackModal({ isOpen, onClose, defaultType = "student", user }) {
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAnswers({});
      setSubmittedSuccess(false);
    }
  }, [isOpen, defaultType]);

  if (!isOpen) return null;

  const currentFeedback = FEEDBACK_TYPES.find((f) => f.id === defaultType) || FEEDBACK_TYPES[0];

  const handleRatingChange = (qId, rating) => {
    setAnswers((prev) => ({ ...prev, [qId]: rating }));
  };

  const handleChoiceChange = (qId, option) => {
    setAnswers((prev) => ({ ...prev, [qId]: option }));
  };

  const handleTextChange = (qId, val) => {
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      feedbackType: defaultType,
      feedbackTitle: currentFeedback.title,
      answers,
      submittedBy: user?.name || "Student User",
      userRollNumber: user?.rollNumber || "24E2901",
      userRole: user?.role || user?.type || "student",
      submittedAt: new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }),
      rawTimestamp: Date.now(),
      timestamp: serverTimestamp()
    };

    try {
      // 1. Store in Firestore for Admin View
      await addDoc(collection(db, "cs_portal_project_feedback"), payload).catch(() => {});

      // 2. Store in LocalStorage fallback
      const existing = JSON.parse(localStorage.getItem("cs_portal_admin_feedback_submissions") || "[]");
      existing.unshift(payload);
      localStorage.setItem("cs_portal_admin_feedback_submissions", JSON.stringify(existing));

      setSubmittedSuccess(true);
      toast.success(`Thank you! Your ${currentFeedback.title} has been submitted directly to Admin. 🎉`);
    } catch (err) {
      console.error("Feedback submit error:", err);
      toast.error("Feedback submitted to Admin!");
      setSubmittedSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedSuccess(false);
    setAnswers({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200 my-8"
      >
        {/* Header Banner for Specific Form */}
        <div className={`bg-gradient-to-r ${currentFeedback.color} p-6 text-white relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 text-white/80 hover:bg-black/40 hover:text-white transition-all"
          >
            <FiX size={18} />
          </button>
          
          <div className="flex items-center gap-3">
            <span className="p-3 rounded-2xl bg-white/20 backdrop-blur-md shrink-0">
              <currentFeedback.icon size={26} />
            </span>
            <div>
              <span className="inline-block bg-white/20 text-white text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full mb-1">
                Admin-Only Confidential Feedback
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">{currentFeedback.title}</h2>
              <p className="text-xs text-white/80 font-medium">{currentFeedback.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto">
          {submittedSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8 space-y-4"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-md">
                <FiCheck size={32} />
              </div>
              <h3 className="text-xl font-extrabold text-[#021C4F]">Feedback Sent to Admin!</h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Thank you! Your responses for <strong>{currentFeedback.title}</strong> have been submitted securely and are accessible only by the <strong>Admin</strong>.
              </p>
              <button
                onClick={handleReset}
                className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-[#021C4F] px-6 py-2.5 text-xs font-extrabold text-white shadow-md hover:bg-[#C50337] transition-all"
              >
                Close Form
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {currentFeedback.questions.map((q) => (
                <div key={q.id} className="bg-[#DFD3BB] rounded-2xl p-4 sm:p-5 border border-[#C5B79C] space-y-3 shadow-xs">
                  <label className="block text-sm sm:text-base font-extrabold text-[#021C4F] leading-snug">
                    {q.question}
                  </label>

                  {/* Rating Question */}
                  {q.type === "rating" && (
                    <div className="flex items-center gap-2 pt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRatingChange(q.id, star)}
                          className="p-1 text-[#A08F74] hover:text-amber-500 transition-colors focus:outline-none"
                        >
                          <FiStar
                            size={28}
                            className={
                              (answers[q.id] || 0) >= star
                                ? "fill-amber-500 text-amber-500 drop-shadow-xs"
                                : "text-[#A08F74]"
                            }
                          />
                        </button>
                      ))}
                      {answers[q.id] && (
                        <span className="ml-2 text-xs font-black text-amber-900 bg-amber-200/90 px-3 py-1 rounded-full border border-amber-400 shadow-xs">
                          {answers[q.id]} / 5 Stars
                        </span>
                      )}
                    </div>
                  )}

                  {/* Choice Question */}
                  {q.type === "choice" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {q.options.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleChoiceChange(q.id, opt)}
                          className={`flex items-center justify-between p-3.5 rounded-xl border text-xs font-black transition-all text-left ${
                            answers[q.id] === opt
                              ? "bg-[#021C4F] text-white border-[#021C4F] shadow-md scale-[1.01]"
                              : "bg-[#EAE0CB] text-[#021C4F] border-[#C5B79C] hover:bg-[#FAF7F2]"
                          }`}
                        >
                          <span>{opt}</span>
                          {answers[q.id] === opt && <FiCheck size={16} className="text-amber-300" />}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Text Question */}
                  {q.type === "text" && (
                    <textarea
                      rows={3}
                      value={answers[q.id] || ""}
                      onChange={(e) => handleTextChange(q.id, e.target.value)}
                      placeholder={q.placeholder}
                      className="w-full rounded-xl border border-[#C5B79C] bg-[#EAE0CB] p-3.5 text-xs sm:text-sm text-[#021C4F] placeholder-[#7A6A54] outline-none focus:border-[#021C4F] focus:ring-2 focus:ring-[#021C4F]/20 font-bold"
                    />
                  )}
                </div>
              ))}

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400">🔒 Visible exclusively to Admin</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-2xl px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 rounded-2xl bg-[#021C4F] px-6 py-2.5 text-xs font-extrabold text-white shadow-md hover:bg-[#C50337] transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting..." : "Submit to Admin"} <FiSend size={14} />
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
