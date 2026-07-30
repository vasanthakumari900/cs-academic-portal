// src/components/placements/LiveMockTestModule.jsx
// Professional Live Mock Test Engine for CS Academic Portal Placements.

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiClock, FiCheckCircle, FiXCircle, FiPlay, FiRotateCcw,
  FiAward, FiHelpCircle, FiChevronLeft, FiChevronRight,
  FiSkipForward, FiAlertCircle, FiCheck, FiBarChart2, FiLayers,
} from "react-icons/fi";
import toast from "react-hot-toast";

// Rich Mock Test Suites
export const MOCK_TEST_SUITES = [
  {
    id: "test-full",
    title: "Full-Length Campus Recruitment Mock Test 2026",
    category: "Full Mock Test",
    questionCount: 15,
    timeLimitMins: 15,
    difficulty: "Medium",
    badgeColor: "bg-[#7F011F] text-white",
    description: "Complete 15-question comprehensive test covering Aptitude, Logic, Verbal, and Core CS Technical subjects.",
  },
  {
    id: "test-cs-core",
    title: "Core Computer Science Technical Assessment",
    category: "Technical MCQs",
    questionCount: 12,
    timeLimitMins: 12,
    difficulty: "Hard",
    badgeColor: "bg-[#990227] text-white",
    description: "Deep-dive questions in OS, DBMS, Computer Networks, Data Structures, Software Engineering & C/C++/Java/Python.",
  },
  {
    id: "test-web-tech",
    title: "Web Technologies & SQL Coding Quiz",
    category: "Technical MCQs",
    questionCount: 10,
    timeLimitMins: 10,
    difficulty: "Medium",
    badgeColor: "bg-emerald-700 text-white",
    description: "Hands-on questions on HTML, CSS, JavaScript ES6+, SQL Queries & Relational Database Design.",
  },
  {
    id: "test-ai",
    title: "Python, AI & Data Science Fundamentals Test",
    category: "AI & Emerging Tech",
    questionCount: 10,
    timeLimitMins: 10,
    difficulty: "Easy",
    badgeColor: "bg-purple-700 text-white",
    description: "Test your knowledge on Python syntax, Machine Learning concepts, Neural Networks & AI fundamentals.",
  },
  {
    id: "test-aptitude-sprint",
    title: "Aptitude, Logic & Verbal Speed Sprint",
    category: "Aptitude & Verbal",
    questionCount: 10,
    timeLimitMins: 8,
    difficulty: "Easy",
    badgeColor: "bg-amber-700 text-white",
    description: "Time-bound sprint covering Speed-Distance, Syllogisms, Blood Relations, and Vocabulary.",
  },
];

// 15 Comprehensive Questions across all requested topics
export const MOCK_QUESTION_BANK = [
  {
    id: 1,
    subject: "Aptitude",
    category: "Aptitude",
    question: "A train running at a speed of 72 km/hr passes a telegraph pole in 15 seconds. What is the length of the train?",
    options: ["250 meters", "300 meters", "350 meters", "200 meters"],
    correct: 1,
    explanation: "Speed in m/s = 72 * (5/18) = 20 m/s. Distance = Speed * Time = 20 * 15 = 300 meters.",
  },
  {
    id: 2,
    subject: "Logical Reasoning",
    category: "Logical Reasoning",
    question: "Looking at a portrait, a man said, 'I have no brother or sister, but that man's father is my father's son.' Whose portrait was it?",
    options: ["His own", "His son's", "His father's", "His nephew's"],
    correct: 1,
    explanation: "'My father's son' = Himself (since he has no brother). So, 'that man's father' is himself. Thus, it is his son's portrait.",
  },
  {
    id: 3,
    subject: "Verbal Ability",
    category: "Verbal Ability",
    question: "Choose the word that is most nearly OPPOSITE in meaning to 'METICULOUS':",
    options: ["Careful", "Sloppy", "Detailed", "Conscientious"],
    correct: 1,
    explanation: "'Meticulous' means taking extreme care about details. Its exact antonym is 'Sloppy' or careless.",
  },
  {
    id: 4,
    subject: "C Programming",
    category: "Technical MCQs",
    question: "What is the output of printf('%d', sizeof('A')) in a standard C compiler (GCC 32/64-bit)?",
    options: ["1", "4 (or int size)", "2", "Undefined Behavior"],
    correct: 1,
    explanation: "In C language, character literals like 'A' are of type int, so sizeof('A') equals sizeof(int), which is typically 4 bytes.",
  },
  {
    id: 5,
    subject: "C++ Programming",
    category: "Technical MCQs",
    question: "Which of the following virtual function features allows runtime polymorphism in C++?",
    options: ["Static binding", "Late binding (VTABLE / VPTR)", "Inline expansion", "Function Overloading"],
    correct: 1,
    explanation: "C++ uses VTABLE (Virtual Table) pointers (VPTR) to achieve Late Binding / Dynamic Dispatch at runtime for virtual functions.",
  },
  {
    id: 6,
    subject: "Java",
    category: "Technical MCQs",
    question: "What happens when you execute System.out.println(10 + 20 + 'Java'); in Java?",
    options: ["1020Java", "30Java", "Java30", "Compile Error"],
    correct: 1,
    explanation: "Evaluation happens left to right: (10 + 20) yields integer 30, then 30 + 'Java' concatenates string to '30Java'.",
  },
  {
    id: 7,
    subject: "Python",
    category: "Technical MCQs",
    question: "What is the output of print(type([1, (2, 3), {4: 5}][1])) in Python 3?",
    options: ["<class 'list'>", "<class 'tuple'>", "<class 'dict'>", "<class 'int'>"],
    correct: 1,
    explanation: "Index 1 of the outer list is the element (2, 3), which is of type 'tuple'.",
  },
  {
    id: 8,
    subject: "DBMS",
    category: "Technical MCQs",
    question: "Which Normal Form eliminates Transitive Functional Dependencies (X -> Y and Y -> Z)?",
    options: ["1NF", "2NF", "3NF", "BCNF"],
    correct: 2,
    explanation: "Third Normal Form (3NF) requires a relation to be in 2NF and have NO transitive functional dependencies for non-prime attributes.",
  },
  {
    id: 9,
    subject: "Operating Systems",
    category: "Technical MCQs",
    question: "Which CPU Scheduling Algorithm is strictly non-preemptive and guarantees minimum average waiting time for a given set of processes?",
    options: ["Round Robin (RR)", "First-Come First-Served (FCFS)", "Non-preemptive Shortest Job First (SJF)", "Priority Scheduling"],
    correct: 2,
    explanation: "Shortest Job First (SJF) is mathematically optimal regarding minimum average waiting time for a given set of processes.",
  },
  {
    id: 10,
    subject: "Computer Networks",
    category: "Technical MCQs",
    question: "At which layer of the OSI model does the Address Resolution Protocol (ARP) operate?",
    options: ["Network Layer (Layer 3)", "Data Link Layer (Layer 2 / 2.5)", "Transport Layer (Layer 4)", "Application Layer (Layer 7)"],
    correct: 1,
    explanation: "ARP operates at Layer 2 (Data Link Layer), mapping 32-bit IPv4 addresses to 48-bit MAC addresses.",
  },
  {
    id: 11,
    subject: "Data Structures",
    category: "Technical MCQs",
    question: "What is the worst-case time complexity of QuickSort algorithm when the pivot chosen is always the extreme (smallest or largest) element?",
    options: ["O(N log N)", "O(N)", "O(N²)", "O(log N)"],
    correct: 2,
    explanation: "In worst case (e.g. sorted input with worst pivot choice), QuickSort degrades to O(N²) time complexity.",
  },
  {
    id: 12,
    subject: "Software Engineering",
    category: "Technical MCQs",
    question: "In Agile Scrum methodology, who is directly responsible for prioritizing the Product Backlog items?",
    options: ["Scrum Master", "Product Owner", "Lead Developer", "QA Engineer"],
    correct: 1,
    explanation: "The Product Owner maintains and prioritizes the Product Backlog according to business value and stakeholder needs.",
  },
  {
    id: 13,
    subject: "HTML & CSS",
    category: "Technical MCQs",
    question: "In CSS Box Model, which property specifies the space between the element's content and its border?",
    options: ["margin", "padding", "gap", "outline"],
    correct: 1,
    explanation: "'padding' controls space inside the border, while 'margin' controls space outside the border.",
  },
  {
    id: 14,
    subject: "JavaScript & SQL",
    category: "Technical MCQs",
    question: "What will Array.isArray(null) return in modern JavaScript?",
    options: ["true", "false", "TypeError", "undefined"],
    correct: 1,
    explanation: "Array.isArray(null) evaluates to false. (Note: typeof null === 'object', but null is not an Array).",
  },
  {
    id: 15,
    subject: "Artificial Intelligence",
    category: "AI & Emerging Tech",
    question: "Which Search Algorithm uses a heuristic function h(n) alongside path cost g(n) to guarantee optimal pathfinding?",
    options: ["Breadth-First Search (BFS)", "Depth-First Search (DFS)", "A* Search Algorithm", "Hill Climbing Search"],
    correct: 2,
    explanation: "A* Search evaluates f(n) = g(n) + h(n), where g(n) is actual cost from start and h(n) is admissible heuristic estimate.",
  },
];

export default function LiveMockTestModule() {
  const [activeSuite, setActiveSuite] = useState(null);
  const [testActive, setTestActive] = useState(false);
  const [testFinished, setTestFinished] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [skippedQuestions, setSkippedQuestions] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);

  // Active question set
  const currentQuestions = MOCK_QUESTION_BANK;

  // Countdown timer effect
  useEffect(() => {
    let timerId = null;
    if (testActive && !testFinished && timeLeft > 0) {
      timerId = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerId);
            handleFinishTest(true); // Auto submit on expiry
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [testActive, testFinished, timeLeft]);

  function handleStartSuite(suite) {
    setActiveSuite(suite);
    setUserAnswers({});
    setSkippedQuestions({});
    setCurrentQIndex(0);
    setTimeLeft(suite.timeLimitMins * 60);
    setTestActive(true);
    setTestFinished(false);
    toast.success(`🚀 Started ${suite.title}. Good luck!`);
  }

  function handleSelectOption(questionId, optionIndex) {
    if (testFinished) return;
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    // Remove from skipped if answered
    setSkippedQuestions((prev) => {
      const copy = { ...prev };
      delete copy[questionId];
      return copy;
    });
  }

  function handleSkipQuestion(qId) {
    setSkippedQuestions((prev) => ({ ...prev, [qId]: true }));
    if (currentQIndex < currentQuestions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
    }
    toast("Question skipped", { icon: "⏭️" });
  }

  function handleFinishTest(autoSubmit = false) {
    if (testFinished) return;
    setTestFinished(true);
    if (autoSubmit) {
      toast.error("⏱️ Time expired! Test submitted automatically.");
    } else {
      toast.success("✅ Test submitted successfully!");
    }
  }

  // Calculate score & results
  const totalQuestions = currentQuestions.length;
  const score = currentQuestions.reduce((acc, q) => {
    return userAnswers[q.id] === q.correct ? acc + 1 : acc;
  }, 0);
  const percentage = Math.round((score / totalQuestions) * 100);
  const isPassed = percentage >= 60;

  // Category-wise performance breakdown
  const categoryStats = currentQuestions.reduce((acc, q) => {
    const cat = q.category || "General";
    if (!acc[cat]) acc[cat] = { total: 0, correct: 0 };
    acc[cat].total += 1;
    if (userAnswers[q.id] === q.correct) acc[cat].correct += 1;
    return acc;
  }, {});

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="space-y-6 text-left">
      {/* ── STAGE 1: Test Selection Dashboard ── */}
      {!testActive && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#E6DAB8] bg-white p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#F5EBD0] text-[#7F011F] px-3 py-1 text-xs font-black mb-2 border border-[#E6DAB8]">
                <FiAward size={14} /> Official Campus Recruitment Simulator
              </div>
              <h2 className="text-xl font-extrabold text-[#7F011F]">
                Live Placement Mock Tests
              </h2>
              <p className="text-xs text-[#6B4F45] mt-0.5 font-medium">
                Timed adaptive mock exams covering Aptitude, Logical Reasoning, Verbal Ability, and 14 Technical CS Subjects.
              </p>
            </div>
          </div>

          {/* Test Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_TEST_SUITES.map((suite) => (
              <motion.div
                key={suite.id}
                whileHover={{ y: -3 }}
                className="flex flex-col justify-between rounded-2xl border border-[#E6DAB8] bg-white p-6 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="rounded-full bg-[#F5EBD0] text-[#7F011F] border border-[#E6DAB8] px-2.5 py-0.5 text-[10px] font-black uppercase">
                      {suite.category}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {suite.difficulty}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#7F011F] leading-snug">
                    {suite.title}
                  </h3>

                  <p className="text-xs text-[#6B4F45]">
                    {suite.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs font-bold text-[#7F011F] pt-1">
                    <span className="flex items-center gap-1.5">
                      <FiHelpCircle size={14} /> {suite.questionCount} Questions
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FiClock size={14} /> {suite.timeLimitMins} Mins
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleStartSuite(suite)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#7F011F] to-[#990227] hover:from-[#660119] hover:to-[#7F011F] text-white font-extrabold text-xs py-3 shadow-md transition-all active:scale-[0.98] min-h-[44px]"
                >
                  <FiPlay size={15} /> Start Live Test Now
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ── STAGE 2: Active Test Execution View ── */}
      {testActive && !testFinished && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-[#E6DAB8] bg-white p-4 sm:p-8 shadow-md space-y-6"
        >
          {/* Active Header & Timer */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#E6DAB8]">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="rounded-md bg-[#7F011F] text-white px-2.5 py-1 text-xs font-black">
                  Q {currentQIndex + 1} of {totalQuestions}
                </span>
                <span className="text-xs font-black text-[#990227]">
                  {currentQuestions[currentQIndex].subject}
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#7F011F] mt-1">
                {activeSuite?.title}
              </h3>
            </div>

            {/* Countdown Timer Badge */}
            <div className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-mono font-black shadow-sm shrink-0 min-h-[44px] ${
              timeLeft < 120
                ? "bg-rose-600 text-white animate-pulse"
                : "bg-[#F5EBD0] text-[#7F011F] border border-[#E6DAB8]"
            }`}>
              <FiClock size={16} /> Time Remaining: {formatTime(timeLeft)}
            </div>
          </div>

          {/* Question Switcher Pills */}
          <div className="flex flex-wrap gap-1.5 pb-2 border-b border-[#E6DAB8]">
            {currentQuestions.map((q, idx) => {
              const isAnswered = userAnswers[q.id] !== undefined;
              const isSkipped = skippedQuestions[q.id];
              const isCurrent = idx === currentQIndex;

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQIndex(idx)}
                  className={`h-9 w-9 rounded-xl text-xs font-black transition-all flex items-center justify-center ${
                    isCurrent
                      ? "ring-2 ring-[#7F011F] bg-[#7F011F] text-white shadow-md"
                      : isAnswered
                      ? "bg-emerald-600 text-white"
                      : isSkipped
                      ? "bg-amber-400 text-slate-950"
                      : "bg-[#F5EBD0] text-[#7F011F] border border-[#E6DAB8]"
                  }`}
                  title={`Question ${idx + 1}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Current Question Block */}
          <div className="space-y-5">
            <h4 className="text-base sm:text-lg font-bold text-[#7F011F] leading-snug">
              {currentQIndex + 1}. {currentQuestions[currentQIndex].question}
            </h4>

            {/* 4 Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQuestions[currentQIndex].options.map((opt, oIdx) => {
                const qId = currentQuestions[currentQIndex].id;
                const isSelected = userAnswers[qId] === oIdx;

                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelectOption(qId, oIdx)}
                    className={`flex items-center gap-3 rounded-xl border p-4 text-xs sm:text-sm text-left transition-all min-h-[50px] ${
                      isSelected
                        ? "border-[#7F011F] bg-[#7F011F]/10 font-bold text-[#7F011F] ring-2 ring-[#7F011F]/30"
                        : "border-[#E6DAB8] bg-white hover:bg-[#F5EBD0]/50 text-[#7F011F]"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                        isSelected
                          ? "bg-[#7F011F] text-white"
                          : "bg-[#F5EBD0] text-[#7F011F] border border-[#E6DAB8]"
                      }`}
                    >
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span className="flex-1">{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation & Control Buttons Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E6DAB8]">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                disabled={currentQIndex === 0}
                onClick={() => setCurrentQIndex((prev) => prev - 1)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 rounded-xl border border-[#E6DAB8] bg-white px-4 py-2.5 text-xs font-extrabold text-[#7F011F] disabled:opacity-40 min-h-[44px]"
              >
                <FiChevronLeft size={16} /> Previous
              </button>

              <button
                onClick={() => handleSkipQuestion(currentQuestions[currentQIndex].id)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-xs font-extrabold text-amber-900 min-h-[44px]"
              >
                <FiSkipForward size={14} /> Skip
              </button>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {currentQIndex < totalQuestions - 1 ? (
                <button
                  onClick={() => setCurrentQIndex((prev) => prev + 1)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1 rounded-xl bg-[#7F011F] hover:bg-[#660119] px-6 py-2.5 text-xs font-extrabold text-white shadow-md min-h-[44px]"
                >
                  Next <FiChevronRight size={16} />
                </button>
              ) : (
                <button
                  onClick={() => handleFinishTest(false)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-6 py-2.5 text-xs font-extrabold text-white shadow-md min-h-[44px]"
                >
                  <FiCheckCircle size={16} /> Submit Live Test
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* ── STAGE 3: Test Results & Detailed Performance Dashboard ── */}
      {testActive && testFinished && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-[#E6DAB8] bg-white p-6 sm:p-8 shadow-xl space-y-8"
        >
          {/* Result Status Banner */}
          <div className={`rounded-2xl p-6 text-center space-y-3 border ${
            isPassed
              ? "bg-emerald-50 border-emerald-300 text-emerald-950"
              : "bg-rose-50 border-rose-300 text-rose-950"
          }`}>
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md">
              {isPassed ? (
                <FiCheckCircle size={36} className="text-emerald-600" />
              ) : (
                <FiXCircle size={36} className="text-rose-600" />
              )}
            </div>

            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 ${
                isPassed ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
              }`}>
                {isPassed ? "PASSED (Qualified)" : "NEEDS IMPROVEMENT"}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold">
                {isPassed ? "Congratulations! Benchmark Achieved 🎉" : "Keep Practicing! Review Answers Below"}
              </h2>
              <p className="text-xs sm:text-sm font-medium mt-1">
                You scored <span className="font-black text-lg">{score}</span> out of <span className="font-black text-lg">{totalQuestions}</span> ({percentage}%)
              </p>
            </div>
          </div>

          {/* Category Performance Breakdown */}
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-[#7F011F] flex items-center gap-2">
              <FiBarChart2 size={18} /> Category-Wise Performance Summary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(categoryStats).map(([cat, stat]) => {
                const catPct = Math.round((stat.correct / stat.total) * 100);
                return (
                  <div key={cat} className="rounded-xl border border-[#E6DAB8] bg-[#F5EBD0]/40 p-4 space-y-2">
                    <p className="text-xs font-extrabold text-[#7F011F] truncate">{cat}</p>
                    <div className="flex items-baseline justify-between text-xs font-black">
                      <span className="text-[#7F011F]">{stat.correct} / {stat.total} Correct</span>
                      <span className={catPct >= 60 ? "text-emerald-700" : "text-rose-700"}>{catPct}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[#E6DAB8] overflow-hidden">
                      <div
                        className={`h-full rounded-full ${catPct >= 60 ? "bg-emerald-600" : "bg-rose-600"}`}
                        style={{ width: `${catPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step-by-Step Question Review & Solutions */}
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-[#7F011F] flex items-center gap-2">
              <FiLayers size={18} /> Step-by-Step Answer Key & Explanations
            </h3>

            <div className="space-y-4">
              {currentQuestions.map((q, idx) => {
                const uAns = userAnswers[q.id];
                const isCorrect = uAns === q.correct;
                const isSkipped = uAns === undefined;

                return (
                  <div
                    key={q.id}
                    className={`rounded-2xl border p-5 space-y-3 ${
                      isCorrect
                        ? "border-emerald-300 bg-emerald-50/50"
                        : isSkipped
                        ? "border-amber-300 bg-amber-50/50"
                        : "border-rose-300 bg-rose-50/50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs sm:text-sm font-extrabold text-[#7F011F]">
                        {idx + 1}. {q.question}
                      </h4>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                        isCorrect
                          ? "bg-emerald-600 text-white"
                          : isSkipped
                          ? "bg-amber-500 text-slate-950"
                          : "bg-rose-600 text-white"
                      }`}>
                        {isCorrect ? "Correct (+1)" : isSkipped ? "Skipped (0)" : "Incorrect (0)"}
                      </span>
                    </div>

                    {/* Options list */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold">
                      {q.options.map((opt, oIdx) => {
                        const isRightOpt = oIdx === q.correct;
                        const isUserChoice = uAns === oIdx;

                        return (
                          <div
                            key={oIdx}
                            className={`flex items-center gap-2 rounded-xl p-3 border ${
                              isRightOpt
                                ? "border-emerald-600 bg-emerald-100 text-emerald-950 font-black"
                                : isUserChoice && !isRightOpt
                                ? "border-rose-500 bg-rose-100 text-rose-950 line-through font-bold"
                                : "border-slate-200 bg-white text-slate-700"
                            }`}
                          >
                            <span className="font-bold">{String.fromCharCode(65 + oIdx)}.</span>
                            <span className="flex-1">{opt}</span>
                            {isRightOpt && <FiCheck className="text-emerald-700 shrink-0" size={16} />}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    <div className="rounded-xl bg-white border border-[#E6DAB8] p-3 text-xs text-[#6B4F45]">
                      <span className="font-extrabold text-[#7F011F]">💡 Explanation: </span>
                      {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-[#E6DAB8]">
            <button
              onClick={() => {
                setTestActive(false);
                setTestFinished(false);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-[#7F011F] hover:bg-[#660119] px-6 py-3 text-xs font-extrabold text-white shadow-md transition-all min-h-[44px]"
            >
              <FiRotateCcw size={16} /> Choose Another Mock Test
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
