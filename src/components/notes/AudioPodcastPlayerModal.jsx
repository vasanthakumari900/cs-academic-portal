// src/components/notes/AudioPodcastPlayerModal.jsx
import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlay,
  FiPause,
  FiX,
  FiZap,
  FiRotateCcw,
  FiRotateCw,
  FiBookOpen,
  FiAward,
  FiCheckCircle,
  FiSliders,
  FiHelpCircle,
  FiVolume2,
  FiBook,
  FiCode,
  FiCheck,
  FiList,
  FiCopy,
  FiRepeat,
  FiSend,
  FiMessageSquare,
  FiTarget,
  FiRefreshCw,
  FiArrowRight,
  FiCommand,
} from "react-icons/fi";
import toast from "react-hot-toast";
import CanvasAudioVisualizer from "./CanvasAudioVisualizer";
import CommandPalette from "../common/CommandPalette";

import {
  cleanTextForSpeech,
  extractSyllabusTopics,
  generate7StepTeacherExplanation,
  buildFullAudioScript,
  generateExamPreparationBank,
  generateQuickRevisionData,
  generateUnitQuiz,
  loadUnitProgress,
  saveUnitProgress,
} from "../../services/aiTeacherPodcastEngine";
import { askAiTeacherForUnit, generateSyllabusPodcastLesson, isAiConfigured } from "../../services/groqService";


// Format Chat response cleanly without *** symbols
function formatTeacherResponse(text) {
  if (!text) return "";
  const cleaned = String(text)
    .replace(/\*{3,}/g, "")
    .replace(/^[-*_]{3,}\s*$/gm, "")
    .trim();

  const lines = cleaned.split("\n");
  return lines.map((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) return <div key={idx} className="h-1.5" />;

    const parts = trimmed.split(/(\*\*[^*]+\*\*)/g);
    const formattedLine = parts.map((part, pIdx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={pIdx} className="text-amber-300 font-extrabold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });

    if (trimmed.startsWith("•") || trimmed.startsWith("-") || trimmed.startsWith("*")) {
      return (
        <div key={idx} className="flex items-start gap-2 text-slate-200 py-0.5">
          <span className="text-amber-400 font-bold">•</span>
          <div>{formattedLine}</div>
        </div>
      );
    }

    return (
      <p key={idx} className="text-slate-200 leading-relaxed py-0.5">
        {formattedLine}
      </p>
    );
  });
}

// Animated Waveform Equalizer Component
function AudioEqualizer({ isPlaying }) {

  return (
    <div className="flex items-center justify-center gap-1.5 h-10 px-4 py-2 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-teal-500/30">
      {[0.4, 0.9, 0.6, 1.0, 0.5, 0.8, 0.3, 0.7, 0.9, 0.4].map((heightScale, i) => (
        <motion.div
          key={i}
          animate={{
            height: isPlaying
              ? [`${heightScale * 8}px`, `${heightScale * 28}px`, `${heightScale * 10}px`]
              : "6px",
          }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 0.4 + (i % 4) * 0.15,
            ease: "easeInOut",
          }}
          className="w-1.5 rounded-full bg-gradient-to-t from-teal-400 via-amber-300 to-rose-400"
        />
      ))}
    </div>
  );
}

export default function AudioPodcastPlayerModal({ unitData, subjectName, onClose }) {
  if (!unitData) return null;

  const rawUnitTitle = unitData.title || "Unit 1";
  const spokenUnitTitle = cleanTextForSpeech(rawUnitTitle);
  const unitSubtitle = unitData.subtitle || "Core Syllabus";
  const syllabusText = unitData.syllabus || "Introduction and core concepts.";
  const year = unitData.year || 1;
  const semester = unitData.semester || 1;

  // 1. Syllabus & Topic Engine Setup
  const filesList = unitData.files || [];
  const rawTopics = extractSyllabusTopics(syllabusText, subjectName, filesList);

  // Load saved topic progress from localStorage
  const savedProgress = loadUnitProgress(subjectName, rawUnitTitle);
  const [completedTopicIds, setCompletedTopicIds] = useState(
    savedProgress.completedTopics || []
  );

  const [topics, setTopics] = useState(rawTopics);
  const [activeTopicIndex, setActiveTopicIndex] = useState(
    Math.min(savedProgress.lastActiveIndex || 0, Math.max(0, rawTopics.length - 1))
  );

  // 7-step Teacher Lessons Breakdown
  const [lessons, setLessons] = useState(() =>
    rawTopics.map((t, idx) =>
      generate7StepTeacherExplanation(t, subjectName, rawUnitTitle, idx, rawTopics.length, rawTopics)
    )
  );

  // Lecture Scripts
  const [audioScriptObj, setAudioScriptObj] = useState(() =>
    buildFullAudioScript(subjectName, rawUnitTitle, unitSubtitle, rawTopics, lessons)
  );

  // Exam Preparation Q&A Bank
  const [examBank, setExamBank] = useState(() =>
    generateExamPreparationBank(rawTopics, subjectName, rawUnitTitle)
  );

  // Quick Revision Cards
  const [quickRevision, setQuickRevision] = useState(() =>
    generateQuickRevisionData(rawTopics, subjectName, rawUnitTitle)
  );

  // Unit Quiz Questions
  const [quizQuestions, setQuizQuestions] = useState(() =>
    generateUnitQuiz(rawTopics, subjectName, rawUnitTitle)
  );

  // Active UI Mode / Tab ("podcast" | "lessons" | "revision" | "exam" | "ask" | "quiz")
  const [activeTab, setActiveTab] = useState("podcast");
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const handlePaletteAction = (actionType) => {
    if (["podcast", "lessons", "revision", "exam", "ask", "quiz"].includes(actionType)) {
      setActiveTab(actionType);
    }
    setIsCommandPaletteOpen(false);
  };



  // Language & Voices
  const [language, setLanguage] = useState("en"); // "en" | "ta"
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

  // Audio Playback Controls
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [aiLoading, setAiLoading] = useState(false);

  // Ask AI Teacher Chat State
  const [chatMessages, setChatMessages] = useState([
    {
      sender: "teacher",
      text: `Hello! I am your AI Teacher for ${subjectName} (${rawUnitTitle}: ${unitSubtitle}). Ask me any doubt about this unit!`,
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // Quiz State
  const [userQuizAnswers, setUserQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const synthRef = useRef(window.speechSynthesis || null);

  // Sync state to LocalStorage
  const markTopicAsCompleted = (topicIdx) => {
    if (topicIdx < 0 || topicIdx >= topics.length) return;
    const topicName = topics[topicIdx];
    if (!completedTopicIds.includes(topicName)) {
      const updated = [...completedTopicIds, topicName];
      setCompletedTopicIds(updated);
      saveUnitProgress(subjectName, rawUnitTitle, updated, topicIdx);
    }
  };

  // Attempt Groq AI dynamic fetch to enrich teacher breakdown online
  useEffect(() => {
    let isMounted = true;
    if (isAiConfigured()) {
      setAiLoading(true);
      generateSyllabusPodcastLesson({
        subject: subjectName,
        year,
        semester,
        unitTitle: rawUnitTitle,
        unitSubtitle,
        syllabusText,
      })
        .then((aiRes) => {
          if (!isMounted || !aiRes || !aiRes.topics || aiRes.topics.length === 0) {
            setAiLoading(false);
            return;
          }
          const aiTopics = aiRes.topics.map((t) => t.name || "Syllabus Topic");
          const enrichedLessons = aiTopics.map((tName, idx) => {
            const base = generate7StepTeacherExplanation(
              tName,
              subjectName,
              rawUnitTitle,
              idx,
              aiTopics.length,
              aiTopics
            );
            const aiTopicObj = aiRes.topics[idx] || {};
            return {
              ...base,
              step2Concept: aiTopicObj.explanation || aiTopicObj.definition || base.step2Concept,
              codeOrDiagram: aiTopicObj.codeOrDiagram || base.codeOrDiagram,
              step3Example: aiTopicObj.importance
                ? `Importance: ${aiTopicObj.importance}`
                : base.step3Example,
              speechEn: cleanTextForSpeech(aiTopicObj.speechEn || base.speechEn),
              speechTa: cleanTextForSpeech(aiTopicObj.speechTa || base.speechTa),
            };
          });

          setTopics(aiTopics);
          setLessons(enrichedLessons);
          setAudioScriptObj(
            buildFullAudioScript(subjectName, rawUnitTitle, unitSubtitle, aiTopics, enrichedLessons)
          );
          setExamBank(generateExamPreparationBank(aiTopics, subjectName, rawUnitTitle));
          setQuickRevision(generateQuickRevisionData(aiTopics, subjectName, rawUnitTitle));
          setQuizQuestions(generateUnitQuiz(aiTopics, subjectName, rawUnitTitle));
          setAiLoading(false);
        })
        .catch(() => setAiLoading(false));
    }
    return () => {
      isMounted = false;
    };
  }, [rawUnitTitle, unitSubtitle, syllabusText, subjectName, year, semester]);

  // Active Speech Token Ref to prevent background speech leaks
  const activeSpeechTokenRef = useRef(0);

  const stopAllSpeech = () => {
    activeSpeechTokenRef.current++;
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsPlaying(false);
  };

  // Always cancel speech synthesis immediately when component unmounts, exits, or tab switches
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAllSpeech();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      stopAllSpeech();
    };
  }, []);

  // Load Voices
  useEffect(() => {
    if (!synthRef.current) return;

    const updateVoices = () => {
      const available = synthRef.current.getVoices();
      setVoices(available);

      if (!selectedVoice) {
        if (language === "ta") {
          const tamilVoice =
            available.find(
              (v) => v.lang.startsWith("ta") || v.name.includes("Tamil") || v.name.includes("தமிழ்")
            ) ||
            available.find(
              (v) => v.lang.includes("IN") && (v.name.includes("Google") || v.name.includes("Natural"))
            ) ||
            available[0];
          setSelectedVoice(tamilVoice);
        } else {
          const englishVoices = available.filter((v) => v.lang.startsWith("en"));
          const preferred =
            englishVoices.find((v) => v.name.includes("Google") || v.name.includes("Natural")) ||
            englishVoices.find(
              (v) =>
                v.name.includes("Zira") ||
                v.name.includes("Jenny") ||
                v.name.includes("Aria") ||
                v.name.includes("David")
            ) ||
            englishVoices[0] ||
            available[0];
          setSelectedVoice(preferred);
        }
      }
    };

    updateVoices();
    if (synthRef.current.onvoiceschanged !== undefined) {
      synthRef.current.onvoiceschanged = updateVoices;
    }
  }, [language]);

  // Speech Helper for Single Block with Token Check
  const speakTextWithVoice = (text, voiceToUse, langToUse, onEndCallback) => {
    if (!synthRef.current) {
      toast.error("Speech Synthesis is not supported in this browser.");
      return;
    }

    activeSpeechTokenRef.current++;
    const currentToken = activeSpeechTokenRef.current;
    synthRef.current.cancel();

    if (!text) return;

    const cleanStr = cleanTextForSpeech(text);
    const utterance = new SpeechSynthesisUtterance(cleanStr);

    const voice = voiceToUse || selectedVoice;
    const lang = langToUse || language;

    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang || (lang === "ta" ? "ta-IN" : "en-US");
    } else {
      utterance.lang = lang === "ta" ? "ta-IN" : "en-US";
    }

    utterance.rate = playbackRate;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      if (currentToken !== activeSpeechTokenRef.current) return;
      setIsPlaying(true);
    };

    utterance.onend = () => {
      if (currentToken !== activeSpeechTokenRef.current) return;
      setIsPlaying(false);
      if (onEndCallback) onEndCallback();
    };

    utterance.onerror = () => {
      if (currentToken !== activeSpeechTokenRef.current) return;
      setIsPlaying(false);
    };

    synthRef.current.speak(utterance);
    if (synthRef.current.paused) {
      synthRef.current.resume();
    }
  };

  const speakText = (text, onEndCallback) => {
    speakTextWithVoice(text, selectedVoice, language, onEndCallback);
  };

  // Speech Helper for Sequential Script with Token Check
  const currentScript = audioScriptObj.englishScript;

  const speakSequence = (scriptArray, startIndex = 0) => {
    if (!synthRef.current || !scriptArray || scriptArray.length === 0) return;

    activeSpeechTokenRef.current++;
    const currentToken = activeSpeechTokenRef.current;
    synthRef.current.cancel();

    const index = Math.max(0, Math.min(startIndex, scriptArray.length - 1));
    const sentence = scriptArray[index];

    const utterance = new SpeechSynthesisUtterance(cleanTextForSpeech(sentence));

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang || (language === "ta" ? "ta-IN" : "en-US");
    } else {
      utterance.lang = language === "ta" ? "ta-IN" : "en-US";
    }

    utterance.rate = playbackRate;

    utterance.onstart = () => {
      if (currentToken !== activeSpeechTokenRef.current) return;
      setIsPlaying(true);
      setCurrentParagraph(index);

      if (index >= 1 && index <= topics.length) {
        const topicIdx = index - 1;
        setActiveTopicIndex(topicIdx);
        markTopicAsCompleted(topicIdx);
      }
    };

    utterance.onend = () => {
      if (currentToken !== activeSpeechTokenRef.current) return;
      if (index + 1 < scriptArray.length) {
        speakSequence(scriptArray, index + 1);
      } else {
        setIsPlaying(false);
        toast.success("Lecture completed! 100% syllabus covered.");
      }
    };

    utterance.onerror = () => {
      if (currentToken !== activeSpeechTokenRef.current) return;
      setIsPlaying(false);
    };

    synthRef.current.speak(utterance);
    if (synthRef.current.paused) {
      synthRef.current.resume();
    }
  };

  // Instant Language Switching Handler
  const handleLanguageChange = (newLang) => {
    const wasPlaying = isPlaying;
    stopAllSpeech();

    setLanguage(newLang);

    const available = synthRef.current ? synthRef.current.getVoices() : [];
    let newVoice = null;

    if (newLang === "ta") {
      newVoice =
        available.find((v) => v.lang.startsWith("ta") || v.name.includes("Tamil") || v.name.includes("தமிழ்")) ||
        available.find((v) => v.lang.includes("IN") && (v.name.includes("Google") || v.name.includes("Natural"))) ||
        available[0];
      toast.success("🇮🇳 தமிழ் Tutor Mode Activated");
    } else {
      const englishVoices = available.filter((v) => v.lang.startsWith("en"));
      newVoice =
        englishVoices.find((v) => v.name.includes("Google") || v.name.includes("Natural")) ||
        englishVoices.find((v) => v.name.includes("Zira") || v.name.includes("Jenny") || v.name.includes("Aria")) ||
        englishVoices[0] ||
        available[0];
      toast.success("🌐 English Professor Mode Activated");
    }

    setSelectedVoice(newVoice);

    // If audio was playing, IMMEDIATELY restart speaking current topic in new language/voice!
    if (wasPlaying) {
      setTimeout(() => {
        const curLesson = lessons[activeTopicIndex];
        const textToSpeak = newLang === "ta"
          ? (curLesson?.speechTa || `தலைப்பு ${activeTopicIndex + 1}: ${topics[activeTopicIndex]}. ${curLesson?.step2Concept || ""}`)
          : (curLesson?.speechEn || curLesson?.step2Concept || `Now teaching Topic ${activeTopicIndex + 1}: ${topics[activeTopicIndex]}`);
        speakTextWithVoice(textToSpeak, newVoice, newLang);
      }, 80);
    }
  };

  // Instant Voice Selection Dropdown Handler
  const handleVoiceSelect = (voiceName) => {
    const chosen = voices.find((v) => v.name === voiceName);
    if (!chosen) return;

    const wasPlaying = isPlaying;
    stopAllSpeech();

    setSelectedVoice(chosen);
    const isTaVoice = chosen.lang.startsWith("ta") || chosen.name.includes("Tamil") || chosen.name.includes("தமிழ்");
    const newLang = isTaVoice ? "ta" : "en";
    setLanguage(newLang);
    toast.success(`Voice set to: ${chosen.name.split(" ")[0]}`);

    if (wasPlaying) {
      setTimeout(() => {
        const curLesson = lessons[activeTopicIndex];
        const textToSpeak = newLang === "ta"
          ? (curLesson?.speechTa || `தலைப்பு ${activeTopicIndex + 1}: ${topics[activeTopicIndex]}`)
          : (curLesson?.speechEn || curLesson?.step2Concept);
        speakTextWithVoice(textToSpeak, chosen, newLang);
      }, 80);
    }
  };

  // Controls
  const handlePlayPause = () => {
    if (!synthRef.current) return;
    if (isPlaying) {
      stopAllSpeech();
    } else {
      speakSequence(currentScript, currentParagraph);
    }
  };


  const handleNextTopic = () => {
    const nextIdx = Math.min(topics.length - 1, activeTopicIndex + 1);
    setActiveTopicIndex(nextIdx);
    markTopicAsCompleted(nextIdx);
    speakText(`Now teaching Topic ${nextIdx + 1}: ${topics[nextIdx]}. ${lessons[nextIdx]?.step2Concept || ""}`);
  };

  const handlePrevTopic = () => {
    const prevIdx = Math.max(0, activeTopicIndex - 1);
    setActiveTopicIndex(prevIdx);
    speakText(`Topic ${prevIdx + 1}: ${topics[prevIdx]}. ${lessons[prevIdx]?.step2Concept || ""}`);
  };

  const handleReplayTopic = () => {
    const curLesson = lessons[activeTopicIndex];
    if (curLesson) {
      speakText(curLesson.speechEn || curLesson.step2Concept);
    }
  };

  const changeSpeed = (newRate) => {
    setPlaybackRate(newRate);
    toast.success(`Speed set to ${newRate}x`);
    if (isPlaying) {
      speakSequence(currentScript, currentParagraph);
    }
  };

  const toggleSpeed = () => {
    const rates = [0.75, 1.0, 1.25, 1.5, 2.0];
    const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
    changeSpeed(rates[nextIdx]);
  };


  const handleJumpToTopic = (idx) => {
    setActiveTopicIndex(idx);
    markTopicAsCompleted(idx);
    const lesson = lessons[idx];
    if (lesson) {
      toast.success(`Jumped to Topic ${idx + 1}: ${lesson.name}`);
      speakText(lesson.speechEn || lesson.step2Concept);
    }
  };

  const handleAskTeacher = async (customPrompt) => {
    const promptToSend = customPrompt || chatInput;
    if (!promptToSend || promptToSend.trim().length === 0) return;

    const userMsg = { sender: "student", text: promptToSend };
    setChatMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setChatInput("");
    setChatLoading(true);

    const answer = await askAiTeacherForUnit({
      question: promptToSend,
      subject: subjectName,
      unitTitle: rawUnitTitle,
      unitSubtitle,
      syllabusText,
    });

    setChatLoading(false);
    setChatMessages((prev) => [...prev, { sender: "teacher", text: answer }]);
  };

  const handleQuizSubmit = () => {
    let score = 0;
    quizQuestions.forEach((q) => {
      if (userQuizAnswers[q.id] === q.correctIndex) {
        score += 1;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);
    toast.success(`Quiz Completed! Score: ${score}/${quizQuestions.length}`);
  };

  const handleClose = () => {
    if (synthRef.current) synthRef.current.cancel();
    setIsPlaying(false);
    onClose();
  };

  const coveragePercent = Math.round((completedTopicIds.length / topics.length) * 100);
  const is100PercentCovered = completedTopicIds.length >= topics.length;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[999999] flex items-start justify-center bg-slate-950/90 backdrop-blur-xl pt-12 sm:pt-16 pb-6 px-3 sm:px-6 text-left overflow-y-auto"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.94, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.94, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="flex w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-slate-900 border-2 border-teal-500/40 shadow-2xl text-white my-auto max-h-[calc(100vh-4rem)]"
        >
          {/* Top Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-gradient-to-r from-[#0D9488] via-[#0F766E] to-[#115E59] px-5 sm:px-6 py-3.5 border-b border-teal-500/30 shrink-0 gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-400 text-slate-950 font-black text-xl shadow-lg">
                🎙️
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase font-mono shadow-sm bg-amber-400 text-slate-950">
                    Teacher Mode: ON
                  </span>
                  <span className="text-xs text-teal-200 font-bold truncate">{subjectName}</span>
                </div>
                <h3 className="text-sm sm:text-base font-extrabold text-white truncate mt-0.5 font-mono">
                  {spokenUnitTitle}: {unitSubtitle}
                </h3>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-teal-400/20">
              {/* Language Switcher */}
              <div className="flex items-center bg-slate-950/90 rounded-xl p-1 border border-amber-400/50 font-mono text-xs shadow-md">
                <button
                  onClick={() => handleLanguageChange("en")}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    language === "en"
                      ? "bg-teal-500 text-white shadow-md scale-105"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  🌐 English
                </button>
                <button
                  onClick={() => handleLanguageChange("ta")}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    language === "ta"
                      ? "bg-amber-400 text-slate-950 shadow-md scale-105"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  🇮🇳 தமிழ்
                </button>
              </div>

              {/* Action Buttons: Command Palette (Ctrl+K) */}
              <button
                onClick={() => setIsCommandPaletteOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-950/80 text-teal-300 font-mono font-bold text-xs border border-teal-500/40 hover:bg-slate-800 transition-all cursor-pointer shrink-0"
                title="Open Command Palette (Ctrl+K)"
              >
                <FiCommand size={13} /> Ctrl+K
              </button>

              <button
                onClick={handleClose}
                className="rounded-full bg-slate-950/60 p-2 text-white/80 hover:bg-rose-600 hover:text-white transition-all shrink-0 cursor-pointer border border-white/20"
                title="Close AI Podcast"
              >
                <FiX size={18} />
              </button>
            </div>
          </div>

          {/* Hero Player & Now Teaching Display */}
          <div className="p-4 sm:p-5 bg-gradient-to-b from-slate-900 via-teal-950/30 to-slate-900 flex flex-col shrink-0 gap-3 border-b border-teal-500/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-2xl bg-slate-800/80 border border-teal-500/30 p-4 shadow-inner">
              <div className="space-y-1.5 text-center md:text-left flex-1 min-w-0">
                <div className="flex items-center gap-2 justify-center md:justify-start flex-wrap">
                  <span className="text-xs font-bold text-amber-400 font-mono flex items-center gap-1">
                    <FiZap size={14} /> Now Teaching:
                  </span>
                  <span className="text-sm font-extrabold text-white truncate font-mono">
                    {topics[activeTopicIndex] || "Overview"}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-mono">
                  Lesson {activeTopicIndex + 1} of {topics.length} • Progress: {completedTopicIds.length} / {topics.length} topics ({coveragePercent}%)
                </p>

                {/* Continue Learning Prompt if returning student */}
                {completedTopicIds.length > 0 && completedTopicIds.length < topics.length && (
                  <button
                    onClick={() => {
                      const firstUnfinished = topics.findIndex((t) => !completedTopicIds.includes(t));
                      if (firstUnfinished !== -1) handleJumpToTopic(firstUnfinished);
                    }}
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-300 hover:text-amber-200 underline font-mono cursor-pointer pt-0.5"
                  >
                    <FiArrowRight size={12} /> Continue Learning → {topics.find((t) => !completedTopicIds.includes(t))}
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* HTML5 Canvas Audio Frequency Visualizer */}
                <CanvasAudioVisualizer isPlaying={isPlaying} height={44} className="w-44 sm:w-56" />

                {voices.length > 0 && (
                  <select
                    value={selectedVoice?.name || ""}
                    onChange={(e) => handleVoiceSelect(e.target.value)}
                    className="bg-slate-950 text-amber-300 text-[11px] font-mono font-bold px-2.5 py-1.5 rounded-xl border border-teal-500/40 outline-none focus:border-amber-400 max-w-[150px] truncate cursor-pointer shadow-sm"
                  >
                    {voices.map((v) => (
                      <option key={v.name} value={v.name}>
                        {v.name.replace(/Microsoft|Google|English|Desktop/g, "").trim()} ({v.lang})
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>



            {/* Syllabus Coverage Tracker Bar */}
            <div className="bg-slate-950 p-3 rounded-2xl border border-teal-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                <FiCheckCircle className={is100PercentCovered ? "text-emerald-400" : "text-amber-400"} size={16} />
                <span className="font-bold text-white">Syllabus Coverage:</span>
                <span className={`font-black px-2 py-0.5 rounded-md ${is100PercentCovered ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" : "bg-amber-400/20 text-amber-300 border border-amber-400/40"}`}>
                  {coveragePercent}% {is100PercentCovered ? "(✓ Complete – 100% Syllabus Covered)" : `(${completedTopicIds.length}/${topics.length} Topics Explained)`}
                </span>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto max-w-full">
                {topics.map((tName, i) => {
                  const isDone = completedTopicIds.includes(tName);
                  const isActive = i === activeTopicIndex;
                  return (
                    <button
                      key={i}
                      onClick={() => handleJumpToTopic(i)}
                      className={`h-7 px-2.5 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                        isActive
                          ? "bg-amber-400 text-slate-950 ring-2 ring-amber-300 scale-105"
                          : isDone
                          ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/40"
                          : "bg-slate-800 text-slate-400 hover:text-white"
                      }`}
                      title={`Topic ${i + 1}: ${tName}`}
                    >
                      {isDone ? "✓" : i + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Tabs (6 Feature Modes) */}
            <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1 scrollbar-none">
              <button
                onClick={() => setActiveTab("podcast")}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black font-mono transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "podcast"
                    ? "bg-amber-400 text-slate-950 shadow-md border border-amber-300 scale-105"
                    : "bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white"
                }`}
              >
                🎧 {language === "ta" ? "முழு விரிவுரை" : "Full Unit Podcast"}
              </button>

              <button
                onClick={() => setActiveTab("lessons")}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black font-mono transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "lessons"
                    ? "bg-teal-500 text-white shadow-md border border-teal-400 scale-105"
                    : "bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white"
                }`}
              >
                📖 {language === "ta" ? "ஆசிரியர் பாடங்கள் (7-Steps)" : "Teacher Lessons"}
              </button>

              <button
                onClick={() => setActiveTab("revision")}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black font-mono transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "revision"
                    ? "bg-purple-600 text-white shadow-md border border-purple-400 scale-105"
                    : "bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white"
                }`}
              >
                🧠 {language === "ta" ? "விரைவு திருப்புதல்" : "Quick Revision"}
              </button>

              <button
                onClick={() => setActiveTab("exam")}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black font-mono transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "exam"
                    ? "bg-rose-500 text-white shadow-md border border-rose-400 scale-105"
                    : "bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white"
                }`}
              >
                📝 {language === "ta" ? "தேர்வு வினா-விடை" : "Exam Preparation"}
              </button>

              <button
                onClick={() => setActiveTab("ask")}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black font-mono transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "ask"
                    ? "bg-cyan-500 text-slate-950 shadow-md border border-cyan-300 scale-105"
                    : "bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white"
                }`}
              >
                ❓ {language === "ta" ? "ஆசிரியரிடம் கேள்" : "Ask AI Teacher"}
              </button>

              <button
                onClick={() => setActiveTab("quiz")}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black font-mono transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "quiz"
                    ? "bg-emerald-500 text-slate-950 shadow-md border border-emerald-300 scale-105"
                    : "bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white"
                }`}
              >
                🎯 {language === "ta" ? "அலகு வினாடி வினா" : "Start Unit Quiz"}
              </button>
            </div>
          </div>

          {/* Scrollable Main Content Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 text-xs font-mono space-y-4">
            {/* Tab 1: Full Unit Podcast */}
            {activeTab === "podcast" && (
              <div className="space-y-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-teal-500/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-amber-300 font-extrabold text-xs uppercase tracking-wider flex items-center gap-2">
                      <FiList size={16} /> Syllabus Roadmap ({topics.length} Topics)
                    </span>
                    {aiLoading && (
                      <span className="text-[10px] text-teal-400 animate-pulse font-bold">
                        ⚡ AI Teacher Processing Syllabus...
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300">
                    Click any topic to listen to its detailed 7-step classroom explanation aloud:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {topics.map((tName, idx) => {
                    const isDone = completedTopicIds.includes(tName);
                    const isActive = idx === activeTopicIndex;
                    const lesson = lessons[idx];

                    return (
                      <div
                        key={idx}
                        onClick={() => handleJumpToTopic(idx)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 group shadow-sm ${
                          isActive
                            ? "bg-slate-800 border-amber-400 ring-1 ring-amber-400/50"
                            : isDone
                            ? "bg-slate-800/80 border-emerald-500/40 hover:border-emerald-400"
                            : "bg-slate-800/60 border-slate-700 hover:border-teal-400"
                        }`}
                      >
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold text-xs ${
                            isActive
                              ? "bg-amber-400 text-slate-950"
                              : isDone
                              ? "bg-emerald-500 text-slate-950"
                              : "bg-teal-500/20 text-teal-300"
                          }`}
                        >
                          {isDone ? "✓" : idx + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-white text-xs truncate group-hover:text-amber-300 transition-colors">
                            {tName}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {lesson?.step2Concept ? lesson.step2Concept.slice(0, 75) + "..." : "Core syllabus topic"}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleJumpToTopic(idx);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all shadow-md shrink-0 flex items-center gap-1 active:scale-95"
                        >
                          <FiPlay size={12} /> Play
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 2: Teacher Lessons & 7-Step Breakdown */}
            {activeTab === "lessons" && (
              <div className="space-y-4">
                {lessons.map((item, idx) => (
                  <div
                    key={item.id}
                    className="rounded-2xl bg-slate-800/90 border border-teal-500/30 p-4 space-y-3 hover:border-amber-400/40 transition-all shadow-md"
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap border-b border-slate-700/60 pb-2.5">
                      <h4 className="text-xs font-black text-amber-300 flex items-center gap-2">
                        <span className="bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-md font-extrabold text-[10px]">
                          Topic {item.id} of {topics.length}
                        </span>
                        <span className="text-white font-bold text-sm">{item.title}</span>
                      </h4>
                      <button
                        onClick={() => {
                          handleJumpToTopic(idx);
                        }}
                        className="flex items-center gap-1.5 bg-amber-400 text-slate-950 hover:bg-amber-300 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-md active:scale-95"
                      >
                        <FiVolume2 size={13} /> Listen Lesson Aloud
                      </button>
                    </div>

                    {/* 7-Step Classroom Teacher Cards */}
                    <div className="space-y-3">
                      {/* Step 1 & 2 */}
                      <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                        <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
                          Step 1 &amp; 2: Introduction &amp; Core Concept
                        </span>
                        <p className="text-white text-xs leading-relaxed">{item.step1Intro}</p>
                        <p className="text-slate-300 text-xs leading-relaxed pt-1">{item.step2Concept}</p>
                      </div>

                      {/* Step 3: Example & Code/Diagram */}
                      <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                          Step 3: Practical Example &amp; Implementation
                        </span>
                        <p className="text-slate-200 text-xs">{item.step3Example}</p>

                        {item.codeOrDiagram && (
                          <div className="rounded-xl bg-slate-900 border border-slate-700 p-3 overflow-x-auto">
                            <pre className="text-[11px] text-emerald-300 font-mono leading-relaxed whitespace-pre-wrap">
                              {item.codeOrDiagram}
                            </pre>
                          </div>
                        )}
                      </div>

                      {/* Step 4 & 5 */}
                      <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                        <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider block">
                          Step 4 &amp; 5: Important Terms &amp; Step-by-Step Workflow
                        </span>
                        <ul className="list-disc list-inside space-y-1 text-slate-300 text-xs">
                          {item.step5HowItWorks.map((step, sIdx) => (
                            <li key={sIdx}>{step}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Step 6 & 7 */}
                      <div className="bg-slate-950/80 p-3.5 rounded-xl border border-amber-400/30 space-y-1.5">
                        <span className="text-[10px] font-bold text-rose-300 uppercase tracking-wider block">
                          Step 6 &amp; 7: Connections &amp; Exam Perspective
                        </span>
                        <p className="text-slate-300 text-xs">{item.step6Connect}</p>
                        <p className="text-amber-300 text-xs font-bold pt-1">{item.step7Exam}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 3: Quick Revision */}
            {activeTab === "revision" && (
              <div className="space-y-4">
                <div className="bg-purple-950/60 p-4 rounded-2xl border border-purple-500/40 text-white space-y-1">
                  <h4 className="font-extrabold text-purple-300 text-xs uppercase tracking-wider flex items-center gap-2">
                    <FiZap size={16} /> Quick Revision Mode ({spokenUnitTitle})
                  </h4>
                  <p className="text-xs text-slate-200">
                    High-yield definitions, key differences, memory tricks, and core diagrams for fast exam review.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Important Definitions */}
                  <div className="bg-slate-800 p-4 rounded-2xl border border-purple-500/30 space-y-3">
                    <h5 className="font-bold text-purple-300 text-xs uppercase tracking-wider">
                      📌 Important Definitions
                    </h5>
                    <div className="space-y-2">
                      {quickRevision.importantDefinitions.map((d, i) => (
                        <div key={i} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                          <span className="text-amber-300 font-bold block text-xs">{d.term}</span>
                          <span className="text-slate-300 text-[11px] leading-relaxed">{d.definition}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Key Differences & Memory Tricks */}
                  <div className="space-y-4">
                    <div className="bg-slate-800 p-4 rounded-2xl border border-teal-500/30 space-y-3">
                      <h5 className="font-bold text-teal-300 text-xs uppercase tracking-wider">
                        ⚔️ Key Differences &amp; Memory Tricks
                      </h5>
                      {quickRevision.keyDifferences.map((kd, i) => (
                        <div key={i} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1">
                          <span className="text-cyan-300 font-bold text-xs">
                            {kd.conceptA} vs {kd.conceptB}
                          </span>
                          <p className="text-slate-300 text-[11px] leading-relaxed">{kd.diff}</p>
                        </div>
                      ))}
                      {quickRevision.memoryTricks.map((mt, i) => (
                        <div key={i} className="bg-slate-950 p-2.5 rounded-xl border border-amber-400/30 text-amber-200 text-xs font-bold">
                          {mt}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Exam Preparation Q&A Bank */}
            {activeTab === "exam" && (
              <div className="space-y-4 font-mono text-xs">
                <div className="bg-slate-950 p-4 rounded-2xl border-2 border-rose-500/60 text-white shadow-md">
                  <span className="font-black text-amber-300 uppercase text-xs tracking-wider block">
                    🎯 University Exam Question Bank ({spokenUnitTitle})
                  </span>
                  <p className="text-xs text-slate-200 mt-1">
                    Model answers for 2-Mark, 5-Mark, and 10-Mark university exam questions derived from this unit.
                  </p>
                </div>

                {/* 2-Mark */}
                <div className="rounded-2xl bg-slate-800 p-4 border border-teal-400/40 space-y-3">
                  <span className="bg-teal-400 text-slate-950 font-black text-xs px-3 py-1 rounded-md uppercase tracking-wider">
                    2-Mark Short Answer Questions
                  </span>
                  <div className="space-y-3">
                    {examBank.short2Mark.map((item) => (
                      <div key={item.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-700 space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <span className="text-amber-300 font-bold text-xs">{item.q}</span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => speakText(`${item.q}. ${item.ans}`)}
                              className="px-2.5 py-1 bg-teal-500 hover:bg-teal-400 text-white rounded-lg font-bold text-[10px] cursor-pointer"
                            >
                              🔊 Listen
                            </button>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(`${item.q}\n${item.ans}`);
                                toast.success("Copied to clipboard!");
                              }}
                              className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg font-bold text-[10px] cursor-pointer"
                            >
                              📋 Copy
                            </button>
                          </div>
                        </div>
                        <p className="text-slate-300 text-[11px] leading-relaxed whitespace-pre-wrap">{item.ans}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5-Mark */}
                <div className="rounded-2xl bg-slate-800 p-4 border border-amber-400/40 space-y-3">
                  <span className="bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded-md uppercase tracking-wider">
                    5-Mark Medium / Code / Diagram Questions
                  </span>
                  <div className="space-y-3">
                    {examBank.medium5Mark.map((item) => (
                      <div key={item.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-700 space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <span className="text-amber-300 font-bold text-xs">{item.q}</span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => speakText(`${item.q}. ${item.ans}`)}
                              className="px-2.5 py-1 bg-teal-500 hover:bg-teal-400 text-white rounded-lg font-bold text-[10px] cursor-pointer"
                            >
                              🔊 Listen
                            </button>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(`${item.q}\n${item.ans}`);
                                toast.success("Copied to clipboard!");
                              }}
                              className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg font-bold text-[10px] cursor-pointer"
                            >
                              📋 Copy
                            </button>
                          </div>
                        </div>
                        <p className="text-slate-300 text-[11px] leading-relaxed whitespace-pre-wrap">{item.ans}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 10-Mark */}
                <div className="rounded-2xl bg-slate-800 p-4 border border-rose-400/40 space-y-3">
                  <span className="bg-rose-500 text-white font-black text-xs px-3 py-1 rounded-md uppercase tracking-wider">
                    10-Mark Comprehensive Essay Questions
                  </span>
                  <div className="space-y-3">
                    {examBank.long10Mark.map((item) => (
                      <div key={item.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-700 space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <span className="text-amber-300 font-bold text-xs">{item.q}</span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => speakText(`${item.q}. ${item.ans}`)}
                              className="px-2.5 py-1 bg-teal-500 hover:bg-teal-400 text-white rounded-lg font-bold text-[10px] cursor-pointer"
                            >
                              🔊 Listen
                            </button>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(`${item.q}\n${item.ans}`);
                                toast.success("Copied to clipboard!");
                              }}
                              className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg font-bold text-[10px] cursor-pointer"
                            >
                              📋 Copy
                            </button>
                          </div>
                        </div>
                        <p className="text-slate-300 text-[11px] leading-relaxed whitespace-pre-wrap">{item.ans}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 5: Ask AI Teacher */}
            {activeTab === "ask" && (
              <div className="space-y-4">
                <div className="bg-cyan-950/60 p-4 rounded-2xl border border-cyan-500/40 text-white space-y-1">
                  <h4 className="font-extrabold text-cyan-300 text-xs uppercase tracking-wider flex items-center gap-2">
                    <FiMessageSquare size={16} /> Ask AI Teacher ({spokenUnitTitle})
                  </h4>
                  <p className="text-xs text-slate-200">
                    Ask your personal teacher any question, request simple explanations, examples, or 10-mark essay formats!
                  </p>
                </div>

                {/* Suggested Prompt Chips */}
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    "Explain this again simply",
                    "Give me a real-world example",
                    "What is the difference between these concepts?",
                    "Explain this for a 10-mark answer",
                    "Give me an easy memory trick",
                    "Ask me questions from this topic",
                  ].map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handleAskTeacher(prompt)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 border border-cyan-500/30 text-[11px] font-bold transition-all cursor-pointer active:scale-95"
                    >
                      💡 {prompt}
                    </button>
                  ))}
                </div>

                {/* Chat Messages */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 min-h-[220px] max-h-[320px] overflow-y-auto space-y-3">

                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex flex-col ${
                        msg.sender === "student" ? "items-end" : "items-start"
                      }`}
                    >
                      <span className="text-[10px] text-slate-400 font-bold mb-1">
                        {msg.sender === "student" ? "👤 Student" : "🎓 AI Teacher"}
                      </span>
                      <div
                        className={`p-3.5 rounded-2xl max-w-[85%] text-xs font-mono leading-relaxed ${
                          msg.sender === "student"
                            ? "bg-teal-600 text-white rounded-br-none"
                            : "bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none"
                        }`}
                      >
                        {msg.sender === "student" ? msg.text : formatTeacherResponse(msg.text)}
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="text-cyan-400 text-xs font-bold animate-pulse">
                      🎓 AI Teacher is thinking...
                    </div>
                  )}
                </div>


                {/* Chat Input Bar */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAskTeacher();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={`Ask AI Teacher about ${spokenUnitTitle}...`}
                    className="flex-1 bg-slate-950 text-white px-4 py-3 rounded-xl border border-teal-500/40 outline-none focus:border-amber-400 text-xs font-mono"
                  />
                  <button
                    type="submit"
                    disabled={chatLoading}
                    className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-md active:scale-95"
                  >
                    <FiSend size={14} /> Ask
                  </button>
                </form>
              </div>
            )}

            {/* Tab 6: Unit Quiz */}
            {activeTab === "quiz" && (
              <div className="space-y-4">
                <div className="bg-emerald-950/60 p-4 rounded-2xl border border-emerald-500/40 text-white space-y-1">
                  <h4 className="font-extrabold text-emerald-300 text-xs uppercase tracking-wider flex items-center gap-2">
                    <FiTarget size={16} /> Unit Quiz ({spokenUnitTitle})
                  </h4>
                  <p className="text-xs text-slate-200">
                    Test your knowledge on this unit syllabus. Select options and click Submit Quiz!
                  </p>
                </div>

                <div className="space-y-4">
                  {quizQuestions.map((q, idx) => (
                    <div key={q.id} className="bg-slate-800 p-4 rounded-2xl border border-slate-700 space-y-3">
                      <p className="font-bold text-white text-xs">
                        Q{idx + 1}: {q.question}
                      </p>
                      <div className="space-y-2">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = userQuizAnswers[q.id] === oIdx;
                          const isCorrect = q.correctIndex === oIdx;
                          let btnStyle = "bg-slate-950 text-slate-200 border-slate-800 hover:border-teal-400";

                          if (quizSubmitted) {
                            if (isCorrect) btnStyle = "bg-emerald-600 text-white border-emerald-400";
                            else if (isSelected) btnStyle = "bg-rose-600 text-white border-rose-400";
                          } else if (isSelected) {
                            btnStyle = "bg-amber-400 text-slate-950 border-amber-300 font-bold";
                          }

                          return (
                            <button
                              key={oIdx}
                              disabled={quizSubmitted}
                              onClick={() =>
                                setUserQuizAnswers((prev) => ({ ...prev, [q.id]: oIdx }))
                              }
                              className={`w-full text-left p-3 rounded-xl border text-xs font-mono transition-all cursor-pointer ${btnStyle}`}
                            >
                              {String.fromCharCode(65 + oIdx)}. {opt}
                            </button>
                          );
                        })}
                      </div>

                      {quizSubmitted && (
                        <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 text-emerald-200 text-xs leading-relaxed">
                          💡 <strong className="text-amber-300">Explanation:</strong> {q.explanation}
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="flex items-center justify-between pt-2">
                    {!quizSubmitted ? (
                      <button
                        onClick={handleQuizSubmit}
                        className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-md cursor-pointer"
                      >
                        Submit Unit Quiz
                      </button>
                    ) : (
                      <div className="flex items-center gap-4">
                        <span className="font-black text-amber-300 text-sm">
                          Quiz Score: {quizScore} / {quizQuestions.length} ({Math.round((quizScore / quizQuestions.length) * 100)}%)
                        </span>
                        <button
                          onClick={() => {
                            setQuizSubmitted(false);
                            setUserQuizAnswers({});
                          }}
                          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <FiRefreshCw size={14} /> Retake Quiz
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sticky Bottom Main Audio Control Bar */}
          <div className="sticky bottom-0 bg-slate-950 px-4 sm:px-6 py-3 border-t-2 border-amber-400/40 shrink-0 z-30 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xl">
            {/* Speed Options Selector */}
            <div className="flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-2xl border border-white/20 font-mono text-xs shadow-inner">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider px-1.5 flex items-center gap-1">
                <FiSliders size={12} /> Speed:
              </span>
              {[0.75, 1.0, 1.25, 1.5, 2.0].map((rate) => (
                <button
                  key={rate}
                  onClick={() => changeSpeed(rate)}
                  className={`px-2.5 py-1 rounded-xl font-black transition-all cursor-pointer text-xs ${
                    playbackRate === rate
                      ? "bg-amber-400 text-slate-950 shadow-md scale-105"
                      : "text-slate-300 hover:text-white hover:bg-slate-800"
                  }`}
                  title={`Set playback speed to ${rate}x`}
                >
                  {rate}x
                </button>
              ))}
            </div>


            {/* Audio Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={handlePrevTopic}
                className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-white cursor-pointer transition-all shrink-0 border border-white/30"
                title="Previous Topic"
              >
                <FiRotateCcw size={18} />
              </button>

              <button
                onClick={handlePlayPause}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-amber-400 via-amber-300 to-teal-400 text-slate-950 font-black shadow-2xl hover:scale-105 transition-all cursor-pointer active:scale-95 shrink-0 border-2 border-white"
                title={isPlaying ? "Pause Lecture" : "Play Lecture"}
              >
                {isPlaying ? <FiPause size={24} /> : <FiPlay size={24} className="ml-1" />}
              </button>

              <button
                onClick={handleReplayTopic}
                className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-amber-300 cursor-pointer transition-all shrink-0 border border-white/30"
                title="Replay Current Topic"
              >
                <FiRepeat size={16} />
              </button>

              <button
                onClick={handleNextTopic}
                className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-white cursor-pointer transition-all shrink-0 border border-white/30"
                title="Next Topic"
              >
                <FiRotateCw size={18} />
              </button>
            </div>

            {/* Active Status Badge */}
            <div className="text-right shrink-0 hidden sm:block">
              <span
                className={`text-xs font-mono font-black px-3.5 py-2 rounded-xl border-2 shadow-lg inline-flex items-center gap-2 transition-all ${
                  isPlaying
                    ? "bg-emerald-600 text-white border-white ring-2 ring-emerald-400"
                    : "bg-amber-400 text-slate-950 border-amber-300"
                }`}
              >
                <span className={`h-2.5 w-2.5 rounded-full ${isPlaying ? "bg-white animate-ping" : "bg-slate-950"}`} />
                <span className="font-black">
                  {language === "ta" ? "🇮🇳 தமிழ் Tutor" : "🌐 English Teacher"} {isPlaying ? "(Teaching)" : "(Ready)"}
                </span>
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onActionSelect={handlePaletteAction}
      />
    </AnimatePresence>,
    document.body
  );
}

