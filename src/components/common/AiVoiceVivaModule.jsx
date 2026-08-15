// src/components/common/AiVoiceVivaModule.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMic,
  FiVolume2,
  FiVolumeX,
  FiCheckCircle,
  FiAward,
  FiRotateCcw,
  FiX,
  FiZap,
  FiBookOpen,
  FiCpu,
  FiHelpCircle,
  FiCode,
} from "react-icons/fi";
import toast from "react-hot-toast";

const VIVA_QUESTION_BANK = {
  "Python Programming": [
    {
      id: "py-1",
      question: "What is the key difference between a List and a Tuple in Python?",
      expectedKeywords: ["mutable", "immutable", "brackets", "performance", "parentheses"],
      modelAnswer: "Lists are mutable (can be changed after creation) and defined using square brackets []. Tuples are immutable (cannot be modified) and defined using parentheses (). Tuples are generally faster and memory efficient.",
    },
    {
      id: "py-2",
      question: "Explain the difference between deepcopy and shallowcopy in Python.",
      expectedKeywords: ["reference", "nested", "copy", "recursion", "independent"],
      modelAnswer: "A shallow copy creates a new object but inserts references to nested objects. A deep copy recursively duplicates all nested objects, creating completely independent copies.",
    },
    {
      id: "py-3",
      question: "What are Python Lambda functions and where are they used?",
      expectedKeywords: ["anonymous", "inline", "single expression", "map", "filter"],
      modelAnswer: "Lambda functions are small, anonymous single-expression functions defined using the lambda keyword. They are commonly used as short inline arguments for map(), filter(), or sorting operations.",
    },
  ],
  "C++ & Object Oriented Programming": [
    {
      id: "cpp-1",
      question: "What is a Virtual Function in C++ and why is it used?",
      expectedKeywords: ["polymorphism", "vtable", "override", "base class", "dynamic binding"],
      modelAnswer: "A virtual function is a member function in a base class that you expect to redefine in derived classes. It enables runtime polymorphism using a vtable (virtual table).",
    },
    {
      id: "cpp-2",
      question: "What is the difference between a pointer and a reference in C++?",
      expectedKeywords: ["null", "reassign", "address", "alias", "dereference"],
      modelAnswer: "A pointer holds the memory address of a variable, can be NULL, and can be reassigned. A reference is an immutable alias for an existing variable and cannot be NULL.",
    },
  ],
  "Java Concepts": [
    {
      id: "jv-1",
      question: "What is the difference between an Abstract Class and an Interface in Java?",
      expectedKeywords: ["multiple inheritance", "constructors", "abstract", "default", "fields"],
      modelAnswer: "An Abstract class can contain instance variables, constructors, and method implementations. An Interface defines a pure contract, supports multiple inheritance, and contains public abstract or default methods.",
    },
    {
      id: "jv-2",
      question: "Explain why strings are immutable in Java.",
      expectedKeywords: ["string pool", "security", "thread safety", "caching", "hashcode"],
      modelAnswer: "Java Strings are immutable for String Pool memory caching, security (preventing parameter tampering in database/network calls), thread safety, and fast hashCode caching.",
    },
  ],
  "Database Management System (DBMS)": [
    {
      id: "db-1",
      question: "Explain the four ACID properties in Database Management Systems.",
      expectedKeywords: ["atomicity", "consistency", "isolation", "durability", "transaction"],
      modelAnswer: "Atomicity ensures all-or-nothing execution. Consistency preserves database invariants. Isolation prevents concurrent transaction interference. Durability guarantees committed changes persist despite system crashes.",
    },
    {
      id: "db-2",
      question: "What is the difference between WHERE and HAVING clauses in SQL?",
      expectedKeywords: ["aggregate", "group by", "filter", "having", "where"],
      modelAnswer: "WHERE filters individual rows before grouping or aggregation. HAVING filters summarized groups after the GROUP BY clause has been evaluated.",
    },
  ],
  "Web Technologies": [
    {
      id: "web-1",
      question: "What is a JavaScript Closure and why is it useful?",
      expectedKeywords: ["lexical scope", "outer function", "variables", "encapsulation", "data privacy"],
      modelAnswer: "A closure is a function that retains access to variables in its outer lexical scope even after the outer function has finished executing. It is used for data encapsulation and private variables.",
    },
    {
      id: "web-2",
      question: "Explain the difference between flexbox and CSS grid layouts.",
      expectedKeywords: ["one dimensional", "two dimensional", "rows", "columns", "layout"],
      modelAnswer: "Flexbox is designed for 1-dimensional layouts (along a single row or column). CSS Grid is designed for 2-dimensional layouts controlling both rows and columns simultaneously.",
    },
  ],
  "Android App Development": [
    {
      id: "and-1",
      question: "Explain the Android Activity Lifecycle states.",
      expectedKeywords: ["onCreate", "onStart", "onResume", "onPause", "onStop", "onDestroy"],
      modelAnswer: "An Activity progresses through onCreate(), onStart(), onResume() (interactive state), onPause(), onStop(), and onDestroy() when destroyed by user or system.",
    },
  ],
  "General Computer Science": [
    {
      id: "gen-1",
      question: "What is Time Complexity and Space Complexity in Data Structures?",
      expectedKeywords: ["big o", "execution time", "memory", "algorithm", "input size"],
      modelAnswer: "Time complexity quantifies the amount of time taken by an algorithm as a function of input size N. Space complexity measures the total extra memory consumed during execution.",
    },
  ],
};

// Map any subject name string fuzzy to an available question bank key
function resolveSubjectKey(subjectNameStr) {
  if (!subjectNameStr) return "General Computer Science";
  const s = String(subjectNameStr).toLowerCase();
  if (s.includes("c++") || s.includes("cpp")) return "C++ & Object Oriented Programming";
  if (s.includes("java")) return "Java Concepts";
  if (s.includes("python")) return "Python Programming";
  if (s.includes("database") || s.includes("dbms") || s.includes("sql")) return "Database Management System (DBMS)";
  if (s.includes("web") || s.includes("react") || s.includes("node") || s.includes("html")) return "Web Technologies";
  if (s.includes("android") || s.includes("mobile")) return "Android App Development";
  return "General Computer Science";
}

export default function AiVoiceVivaModule({ subjectName = "Python Programming", onClose }) {
  const initialKey = resolveSubjectKey(subjectName);
  const [selectedSubjectKey, setSelectedSubjectKey] = useState(initialKey);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [scoreHistory, setScoreHistory] = useState([]);

  const questions = VIVA_QUESTION_BANK[selectedSubjectKey] || VIVA_QUESTION_BANK["General Computer Science"];
  const currentQ = questions[currentIdx] || questions[0];

  // Text-to-Speech (TTS) Voice Synthesis (Triggered strictly on User Click to satisfy browser autoplay policy)
  const speakQuestion = (text) => {
    if (!("speechSynthesis" in window)) {
      toast.error("Text-to-speech not supported in this browser.");
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text || currentQ.question);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      toast.success("🔊 Reading question out loud...");
    } catch (err) {
      console.error("Speech synthesis error:", err);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Reset state when switching question or subject
  useEffect(() => {
    setUserAnswer("");
    setFeedback(null);
    stopSpeaking();
  }, [currentIdx, selectedSubjectKey]);

  // Speech Recognition (STT Microphone Input)
  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech Recognition not supported. Please type your answer.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        toast.success("Listening... Speak your viva answer now!");
      };

      recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setUserAnswer((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        toast.error("Speech recognition stopped.");
      };

      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch (err) {
      setIsListening(false);
    }
  };

  // AI Viva Answer Evaluation Engine
  const evaluateAnswer = () => {
    if (!userAnswer.trim()) {
      toast.error("Please speak or type your answer before submitting.");
      return;
    }

    const answerLower = userAnswer.toLowerCase();
    const matched = currentQ.expectedKeywords.filter((kw) =>
      answerLower.includes(kw.toLowerCase())
    );

    const matchRatio = matched.length / currentQ.expectedKeywords.length;
    let score = Math.min(10, Math.max(3, Math.round(matchRatio * 10)));
    if (userAnswer.length > 50 && score < 6) score = 6; // reward detailed answers

    let remark = "Excellent Answer! Deep technical understanding demonstrated.";
    if (score < 6) remark = "Needs Improvement. Include key technical terms.";
    else if (score < 8) remark = "Good attempt! Mentioning additional concepts will boost your score.";

    const evalResult = {
      score,
      matched,
      missing: currentQ.expectedKeywords.filter((kw) => !matched.includes(kw)),
      remark,
    };

    setFeedback(evalResult);
    setScoreHistory((prev) => [...prev, score]);
    toast.success(`Viva Answer Evaluated: Score ${score}/10`);
  };

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      toast.success("Viva Voce Session Completed!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 backdrop-blur-md p-4 text-left">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-3xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Top Header Banner */}
        <div className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-[#4A0014] via-[#7F011F] to-[#1E293B] px-6 py-4 text-white gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-0.5 text-[10px] font-black text-amber-300 uppercase tracking-widest border border-white/15">
              <FiCpu size={13} /> Practical Viva Examiner
            </div>
            <h3 className="text-lg font-black text-white mt-1">
              AI Voice Viva Voce Simulator
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedSubjectKey}
              onChange={(e) => {
                setSelectedSubjectKey(e.target.value);
                setCurrentIdx(0);
              }}
              className="rounded-xl bg-white/10 border border-white/20 px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:bg-slate-900 cursor-pointer"
            >
              {Object.keys(VIVA_QUESTION_BANK).map((k) => (
                <option key={k} value={k} className="bg-slate-900 text-white">
                  {k}
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                stopSpeaking();
                onClose();
              }}
              className="rounded-full bg-white/10 p-2 text-white/80 hover:bg-white/20 hover:text-white transition-all cursor-pointer shrink-0"
            >
              <FiX size={18} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Question Card & Voice Controls */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="rounded-full bg-[#7F011F]/10 text-[#7F011F] dark:text-rose-400 px-3 py-1 text-xs font-black border border-[#7F011F]/20">
                Viva Question {currentIdx + 1} of {questions.length}
              </span>
              <button
                onClick={() => (isSpeaking ? stopSpeaking() : speakQuestion(currentQ.question))}
                className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-black transition-all cursor-pointer ${
                  isSpeaking
                    ? "bg-amber-500 text-white animate-pulse"
                    : "bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-[#7F011F]"
                }`}
              >
                {isSpeaking ? <FiVolumeX size={15} /> : <FiVolume2 size={15} />}
                <span>{isSpeaking ? "Speaking Question..." : "Replay Spoken Question"}</span>
              </button>
            </div>

            <h4 className="text-base font-black text-slate-900 dark:text-white leading-relaxed">
              "{currentQ.question}"
            </h4>
          </div>

          {/* Student Answer Input Box & Mic Button */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase text-slate-500 tracking-wider">
                Your Viva Voce Answer:
              </label>
              <button
                onClick={toggleListening}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-black transition-all cursor-pointer ${
                  isListening
                    ? "bg-rose-600 text-white animate-pulse"
                    : "bg-rose-500/10 text-[#7F011F] dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500/20"
                }`}
              >
                <FiMic size={15} />
                <span>{isListening ? "Listening... Speak Now" : "Speak Answer via Mic"}</span>
              </button>
            </div>

            <textarea
              rows={4}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Speak via microphone or type your explanation here..."
              className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#7F011F] focus:outline-none transition-all"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={evaluateAnswer}
                className="rounded-xl bg-[#7F011F] hover:bg-[#990227] px-6 py-2.5 text-xs font-black text-white shadow-md transition-all cursor-pointer"
              >
                Submit for AI Evaluation
              </button>
            </div>
          </div>

          {/* AI Evaluation Feedback Card */}
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-md"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <FiAward className="text-amber-500" size={20} />
                  <h5 className="text-sm font-black text-slate-900 dark:text-white">
                    AI Examiner Evaluation &amp; Feedback
                  </h5>
                </div>
                <span className="rounded-xl bg-[#7F011F] text-white px-3 py-1 text-xs font-black">
                  Score: {feedback.score} / 10
                </span>
              </div>

              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {feedback.remark}
              </p>

              {/* Matched vs Missing Keywords */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400">
                    Keywords Spoken (✓):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {feedback.matched.length > 0 ? (
                      feedback.matched.map((kw) => (
                        <span key={kw} className="rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 text-[10px] font-black">
                          ✓ {kw}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-slate-400 font-bold">No key technical terms detected</span>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400">
                    Recommended Keywords (+):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {feedback.missing.map((kw) => (
                      <span key={kw} className="rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 px-2 py-0.5 text-[10px] font-bold">
                        + {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Model Viva Answer Reference */}
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 space-y-1 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-black uppercase text-[#7F011F] dark:text-rose-400 block">
                  Model Examiner Answer Reference:
                </span>
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                  {currentQ.modelAnswer}
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={nextQuestion}
                  className="rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-5 py-2 text-xs font-black transition-all cursor-pointer"
                >
                  Next Question →
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
