// src/components/placements/AptitudePrepTab.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiTrendingUp,
  FiCpu,
  FiMessageSquare,
  FiTerminal,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiFileText,
  FiPlayCircle,
  FiExternalLink,
  FiRotateCcw,
  FiAward,
  FiArrowLeft,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { APTITUDE_CATEGORIES, MOCK_QUIZ_QUESTIONS } from "../../utils/placementMockData";

export default function AptitudePrepTab() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [quizActive, setQuizActive] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 mins countdown

  useEffect(() => {
    let timer;
    if (quizActive && !quizFinished && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && quizActive && !quizFinished) {
      handleFinishQuiz();
    }
    return () => clearInterval(timer);
  }, [quizActive, quizFinished, timeLeft]);

  function handleStartQuiz() {
    setQuizActive(true);
    setQuizFinished(false);
    setCurrentQIndex(0);
    setUserAnswers({});
    setTimeLeft(300);
    toast.success("Interactive Aptitude Mock Test started!");
  }

  function handleAnswer(qId, optionIdx) {
    setUserAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  }

  function handleFinishQuiz() {
    setQuizFinished(true);
    toast.success("Mock Test Completed!");
  }

  const score = MOCK_QUIZ_QUESTIONS.reduce((acc, q) => {
    return userAnswers[q.id] === q.correct ? acc + 1 : acc;
  }, 0);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="space-y-8 text-left">
      {/* Category Cards Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              Aptitude & Technical MCQ Practice
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Master Quantitative, Logical Reasoning, Verbal Ability & CS MCQs with interactive mock tests.
            </p>
          </div>

          <button
            onClick={handleStartQuiz}
            className="inline-flex items-center gap-2 rounded-xl bg-[#C50337] hover:bg-[#a0022b] px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all active:scale-95 shrink-0"
          >
            <FiPlayCircle size={16} /> Take Live Mock Test
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {APTITUDE_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3 hover:border-[#0F4C81]/40 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#0F4C81] dark:text-sky-400">
                  {cat.questionCount}+ Questions
                </span>
                <span className="rounded-lg bg-slate-100 dark:bg-slate-800 p-2 text-[#0F4C81] dark:text-sky-400">
                  <FiTrendingUp size={18} />
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">{cat.name}</h3>

              <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                {cat.topics.slice(0, 3).map((t, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#C50337]" /> {t}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Mock Test Simulator Modal/Card */}
      <AnimatePresence>
        {quizActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xl space-y-6"
          >
            {!quizFinished ? (
              <div className="space-y-6">
                {/* Header with Timer */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <span className="rounded-md bg-[#0F4C81]/10 text-[#0F4C81] dark:bg-sky-950 dark:text-sky-300 px-2.5 py-1 text-xs font-bold">
                      Question {currentQIndex + 1} of {MOCK_QUIZ_QUESTIONS.length}
                    </span>
                    <h3 className="text-sm font-semibold text-slate-500 mt-1">
                      {MOCK_QUIZ_QUESTIONS[currentQIndex].category}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-700 dark:text-amber-400">
                    <FiClock size={15} /> Time Left: {formatTime(timeLeft)}
                  </div>
                </div>

                {/* Question Content */}
                <div className="space-y-4">
                  <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {MOCK_QUIZ_QUESTIONS[currentQIndex].question}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {MOCK_QUIZ_QUESTIONS[currentQIndex].options.map((opt, oIdx) => {
                      const qId = MOCK_QUIZ_QUESTIONS[currentQIndex].id;
                      const isSelected = userAnswers[qId] === oIdx;
                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleAnswer(qId, oIdx)}
                          className={`flex items-center gap-3 rounded-xl border p-4 text-xs text-left transition-all ${
                            isSelected
                              ? "border-[#0F4C81] bg-[#0F4C81]/10 dark:bg-sky-950 font-bold text-[#0F4C81] dark:text-sky-300"
                              : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${
                              isSelected
                                ? "bg-[#0F4C81] text-white"
                                : "bg-slate-200 dark:bg-slate-700 text-slate-600"
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

                {/* Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    disabled={currentQIndex === 0}
                    onClick={() => setCurrentQIndex((prev) => prev - 1)}
                    className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 disabled:opacity-40"
                  >
                    Previous
                  </button>

                  {currentQIndex < MOCK_QUIZ_QUESTIONS.length - 1 ? (
                    <button
                      onClick={() => setCurrentQIndex((prev) => prev + 1)}
                      className="rounded-xl bg-[#0F4C81] hover:bg-[#1E88E5] px-6 py-2 text-xs font-bold text-white shadow-sm"
                    >
                      Next Question
                    </button>
                  ) : (
                    <button
                      onClick={handleFinishQuiz}
                      className="rounded-xl bg-emerald-600 hover:bg-emerald-700 px-6 py-2 text-xs font-bold text-white shadow-md"
                    >
                      Submit Mock Test
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Score Card Result View */
              <div className="text-center space-y-6 py-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                  <FiAward size={36} />
                </div>

                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                    Mock Test Score: {score} / {MOCK_QUIZ_QUESTIONS.length}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Accuracy: {Math.round((score / MOCK_QUIZ_QUESTIONS.length) * 100)}%
                  </p>
                </div>

                {/* Answers Explanation Review */}
                <div className="space-y-3 text-left max-w-2xl mx-auto">
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Question Explanations:
                  </h4>
                  {MOCK_QUIZ_QUESTIONS.map((q, idx) => {
                    const userChoice = userAnswers[q.id];
                    const isCorrect = userChoice === q.correct;

                    return (
                      <div
                        key={q.id}
                        className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 text-xs space-y-1.5"
                      >
                        <p className="font-bold text-slate-800 dark:text-slate-200">
                          {idx + 1}. {q.question}
                        </p>
                        <p className="text-slate-500">
                          Your answer:{" "}
                          <strong className={isCorrect ? "text-emerald-600" : "text-rose-500"}>
                            {userChoice !== undefined ? q.options[userChoice] : "Unanswered"}
                          </strong>
                        </p>
                        <p className="text-slate-500">
                          Correct answer: <strong className="text-emerald-600">{q.options[q.correct]}</strong>
                        </p>
                        <p className="text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-2 rounded-md">
                          💡 <strong>Explanation:</strong> {q.explanation}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => setQuizActive(false)}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0F4C81] px-6 py-3 text-sm font-extrabold text-white shadow-md transition-all hover:bg-[#1E88E5] hover:scale-105"
                >
                  <FiArrowLeft size={18} /> Back to Practice Materials
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* PDF & Practice Links Section */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <FiFileText className="text-[#C50337]" /> Aptitude Cheat Sheets & Video Playlists
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-800 p-4 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-[#0F4C81]/40 transition-all"
          >
            <FiFileText className="text-rose-500" size={20} />
            <div>
              <p className="font-bold">Quant Formula PDF</p>
              <span className="text-[10px] text-slate-400">3.4 MB Download</span>
            </div>
            <FiExternalLink className="ml-auto text-slate-400" size={14} />
          </a>

          <a
            href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-800 p-4 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-[#0F4C81]/40 transition-all"
          >
            <FiPlayCircle className="text-sky-500" size={20} />
            <div>
              <p className="font-bold">Logical Reasoning Video</p>
              <span className="text-[10px] text-slate-400">45 Mins Bootcamp</span>
            </div>
            <FiExternalLink className="ml-auto text-slate-400" size={14} />
          </a>

          <a
            href="https://www.indiabix.com/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-800 p-4 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-[#0F4C81]/40 transition-all"
          >
            <FiExternalLink className="text-emerald-500" size={20} />
            <div>
              <p className="font-bold">Online IndiaBIX Practice</p>
              <span className="text-[10px] text-slate-400">External Quiz Bank</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
