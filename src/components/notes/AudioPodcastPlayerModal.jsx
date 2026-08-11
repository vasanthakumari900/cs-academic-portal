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
} from "react-icons/fi";
import toast from "react-hot-toast";
import { generateSyllabusPodcastLesson, isAiConfigured } from "../../services/groqService";

/**
 * Normalizes Roman numerals and abbreviations for natural Speech Synthesis.
 */
export function cleanTextForSpeech(text) {
  if (!text) return "";
  return String(text)
    .replace(/\bUnit\s+V\b/gi, "Unit 5")
    .replace(/\bUnit\s+IV\b/gi, "Unit 4")
    .replace(/\bUnit\s+III\b/gi, "Unit 3")
    .replace(/\bUnit\s+II\b/gi, "Unit 2")
    .replace(/\bUnit\s+I\b/gi, "Unit 1")
    .replace(/\bSem\s+I\b/gi, "Semester 1")
    .replace(/\bSem\s+II\b/gi, "Semester 2")
    .replace(/\bSem\s+III\b/gi, "Semester 3")
    .replace(/\bSem\s+IV\b/gi, "Semester 4")
    .replace(/\bSem\s+V\b/gi, "Semester 5")
    .replace(/\bSem\s+VI\b/gi, "Semester 6");
}

/**
 * Extracts distinct syllabus topics from raw syllabus text.
 */
export function extractSyllabusTopics(syllabusText) {
  if (!syllabusText || typeof syllabusText !== "string") return [];
  const raw = syllabusText
    .split(/[:;\-,|.\n]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 2 && !/^(unit|sl|no|hrs|co\d*|module|chapter|syllabus)$/i.test(t));
  return [...new Set(raw)];
}

/**
 * Determines if a subject is programming-focused (e.g. Python, Java, C++, SQL, PHP, React, ASP.NET).
 */
function isProgrammingSubject(subjectName) {
  if (!subjectName) return false;
  return /python|c\+\+|java|javascript|react|sql|php|asp\.net|web|programming|data structures/i.test(subjectName);
}

/**
 * Generates detailed topic-by-topic code example or system diagram description.
 */
function getTopicCodeOrDiagram(topicName, subjectName) {
  const isProg = isProgrammingSubject(subjectName);
  const tLower = topicName.toLowerCase();

  if (isProg) {
    if (tLower.includes("variable") || tLower.includes("constant")) {
      return `# Python Example - Variables & Constants:\nx = 10         # Integer Variable\nuser_name = "Alice"  # String Variable\nPI = 3.14159   # Constant\nprint(f"User {user_name} has x = {x}, PI = {PI}")`;
    }
    if (tLower.includes("data type") || tLower.includes("type")) {
      return `# Python Example - Primitive & Sequence Data Types:\nage = 21            # int\ngpa = 3.85          # float\nskills = ["Python", "SQL"]  # list\nperson = ("Bob", 22) # tuple\nis_enrolled = True   # bool\nprint(type(age), type(skills))`;
    }
    if (tLower.includes("list")) {
      return `# Python Example - List Operations:\nfruits = ["apple", "banana"]\nfruits.append("orange")   # Add element\nfruits.insert(1, "mango")  # Insert at index 1\nprint("Element 0:", fruits[0])\nprint("Total Items:", len(fruits))`;
    }
    if (tLower.includes("tuple")) {
      return `# Python Example - Tuple Operations (Immutable):\npoint = (12.97, 77.59)\nlat, lon = point  # Tuple Unpacking\nprint(f"Latitude: {lat}, Longitude: {lon}")\n# point[0] = 15.0  <- Raises TypeError (Tuples cannot be mutated)`;
    }
    if (tLower.includes("operator") || tLower.includes("expression")) {
      return `# Python Example - Operators & Expressions:\na, b = 15, 4\nsum_val = a + b       # Arithmetic (+)\nis_greater = (a > b)  # Comparison (>)\nis_valid = (a > 10) and (b < 5) # Logical (and)\nprint(f"Sum: {sum_val}, Comparison: {is_greater}, Logical: {is_valid}")`;
    }
    if (tLower.includes("comment")) {
      return `# Single-line comment in Python\n\n"""\nMulti-line docstring comment.\nUsed to document modules, classes, and functions.\n"""\ndef calculate_score():\n    pass`;
    }
    return `# Practical Code Example for ${topicName}:\ndef execute_${topicName.toLowerCase().replace(/\s+/g, "_")}() :\n    print("Executing topic: ${topicName}")\n    return True\n\nexecute_${topicName.toLowerCase().replace(/\s+/g, "_")}()`;
  }

  // Theoretical subject diagram / principle
  if (tLower.includes("system call")) {
    return `┌────────────────────────────────────────────────────────┐\n│               User Application Program                 │\n└───────────────────────────┬────────────────────────────┘\n                            │ System Call Interface (read, write, fork)\n┌───────────────────────────▼────────────────────────────┐\n│               Operating System Kernel Mode              │\n└────────────────────────────────────────────────────────┘`;
  }
  if (tLower.includes("schedule") || tLower.includes("cpu")) {
    return `[Ready Queue] ──► [CPU Execution] ──► [I/O Wait Queue] ──► [Terminated]\nAlgorithms:\n1. FCFS (First Come First Served)\n2. SJF (Shortest Job First)\n3. Round Robin (Time Quantum)\n4. Priority Scheduling`;
  }
  if (tLower.includes("synchronization") || tLower.includes("semaphore")) {
    return `Semaphore S;\nwait(S) { while(S <= 0); S--; }   // P Operation (Lock)\nsignal(S) { S++; }                // V Operation (Unlock)`;
  }

  return `[System Architecture & Workflow for ${topicName}]\n┌──────────────────┐     ┌───────────────────────┐     ┌──────────────────┐\n│  Input Request   ├────►│ ${topicName} Engine │────►│ Output Result    │\n└──────────────────┘     └───────────────────────┘     └──────────────────┘`;
}

/**
 * Structured Syllabus-Driven Teacher Lesson Analyzer (Offline + Online AI Engine)
 */
export function analyzeSyllabusForUnit(unitTitle, unitSubtitle, syllabusText, subjectName, year = 1, semester = 1) {
  const cleanTitle = cleanTextForSpeech(unitTitle || "Unit 1");
  const cleanSub = unitSubtitle || "Core Concepts";
  const extractedTopics = extractSyllabusTopics(syllabusText);

  const isProg = isProgrammingSubject(subjectName);

  const topicsToUse = extractedTopics.length > 0 ? extractedTopics : [
    `${subjectName} Introduction`,
    `${cleanSub} Core Concepts`,
    `Working Principles & Workflow`,
    `Implementation & Execution`,
    `Exam Revision & Takeaways`
  ];

  // 1. Build Detailed Topic Lessons (Topic-by-Topic Teacher Explanation with Code Examples)
  const detailedTopicTheoryList = topicsToUse.map((topicName, idx) => {
    const codeOrDiagram = getTopicCodeOrDiagram(topicName, subjectName);

    let theoryText = "";
    if (isProg) {
      theoryText = `Professor Explanation: "${topicName}" is a fundamental syllabus topic in ${subjectName} (${cleanTitle}). 1) What it is: Defines memory allocation, syntax rules, and data structures. 2) Why we use it: Enables clean code organization and dynamic data manipulation. 3) Execution Logic: Evaluated line-by-line during runtime by the interpreter or compiler.`;
    } else {
      theoryText = `Professor Explanation: "${topicName}" is a core syllabus topic under ${cleanTitle} of ${subjectName}. 1) Definition & Role: Governs system architecture, hardware interfaces, and resource management. 2) Working Protocol: Executes through structured kernel interface calls and system state transitions.`;
    }

    const examImportance = `University Exam Focus: High probability of 2-mark definition & 5/10-mark code/diagram questions in ${cleanTitle}.`;

    const speechEn = cleanTextForSpeech(
      `Topic ${idx + 1}: ${topicName}. In ${subjectName}, ${topicName} is essential. Understand its definition, working mechanism, code syntax, and real-world application.`
    );

    const speechTa = cleanTextForSpeech(
      `தலைப்பு ${idx + 1}: ${topicName}. ${subjectName}-ல் ${topicName} என்பது மிக முக்கிய பாடத் தலைப்பாகும். இதன் வரையறை, செயல்படும் முறை மற்றும் நிரல் அமைப்பை தெளிவாகப் படியுங்கள்.`
    );

    return {
      id: idx + 1,
      name: topicName,
      title: topicName,
      theory: theoryText,
      codeOrDiagram,
      importance: `Crucial for understanding ${cleanSub}`,
      commonMistakes: `Forgetting syntax rules or boundary test cases during university exams`,
      examImportance,
      speechEn,
      speechTa,
    };
  });

  // 2. Build 2-Mark, 5-Mark, and 10-Mark Questions for EVERY Topic in Syllabus
  const short2Mark = topicsToUse.map((tName, idx) => ({
    q: `${idx + 1}. What is ${tName}? State its primary function in ${subjectName}.`,
    ans: `Ans: ${tName} is a core syllabus topic under ${cleanTitle} of ${subjectName}. Definition: Specifies key data structures, memory allocation rules, or operational policies. Primary Role: Enables reliable execution and systematic data processing in software applications.`
  }));

  const medium5Mark = topicsToUse.map((tName, idx) => ({
    q: `${idx + 1}. Explain ${tName} in detail with clean syntax, code examples, or block diagrams.`,
    ans: `Ans: ${tName} Detailed 5-Mark Breakdown:\n1. Core Principle: Operates as a key structural component in ${cleanTitle}.\n2. Implementation / Syntax / Architecture:\n${getTopicCodeOrDiagram(tName, subjectName)}\n3. Practical Example: Used to optimize resource management and streamline workflow processing.`
  }));

  const long10Mark = [];
  for (let i = 0; i < topicsToUse.length; i += 2) {
    const tA = topicsToUse[i];
    const tB = topicsToUse[i + 1] || topicsToUse[0];
    const qNum = Math.floor(i / 2) + 1;
    long10Mark.push({
      q: `${qNum}. Comprehensive Essay Question: Analyze the architecture, operational workflow, code implementation, and practical use cases of ${tA} and ${tB} in ${subjectName}.`,
      ans: `Ans: Detailed 10-Mark Professor Breakdown:\n1. Theoretical Principles of ${tA} and ${tB}.\n2. Architectural Workflow / Syntax:\n${getTopicCodeOrDiagram(tA, subjectName)}\n3. Real-World Applications: Enterprise computing, system performance optimization, and robust error handling.\n4. Summary: Critical for university exam preparation and practical software development.`
    });
  }

  // 3. Build Spoken Lesson Scripts (Announces Topic Roadmap First, then Teaches Each Topic)
  const englishLessonScript = [
    cleanTextForSpeech(
      `Welcome to today's Computer Science lecture for ${subjectName}, ${cleanTitle}: ${cleanSub}. In this unit, we will cover ${topicsToUse.length} syllabus topics: ${topicsToUse.map((t, i) => `Topic ${i + 1}: ${t}`).join('. ')}. Let us begin Topic 1.`
    ),
    ...topicsToUse.map((t, i) =>
      cleanTextForSpeech(
        `Topic ${i + 1}: ${t}. Let us examine its definition, how it operates in memory, code syntax, and university exam key points.`
      )
    ),
    cleanTextForSpeech(
      `That concludes our lecture for ${cleanTitle} of ${subjectName}. We have covered all ${topicsToUse.length} syllabus topics. Practice the code syntax, review block diagrams, and memorize key definitions for top exam marks!`
    )
  ];

  const tamilLessonScript = [
    cleanTextForSpeech(
      `வணக்கம் மாணவர்களே! ${subjectName} பாடத்தின் ${cleanTitle}: ${cleanSub} விரிவுரைக்கு உங்களை வரவேற்கிறேன். இந்த அலகில் உள்ள ${topicsToUse.length} பாடத் தலைப்புகள்: ${topicsToUse.map((t, i) => `தலைப்பு ${i + 1}: ${t}`).join('. ')}. முதலில் தலைப்பு 1 பற்றிப் பார்ப்போம்.`
    ),
    ...topicsToUse.map((t, i) =>
      cleanTextForSpeech(
        `தலைப்பு ${i + 1}: ${t}. இதன் வரையறை, நிரல் அமைப்பு மற்றும் தேர்வுக்குத் தேவையான முக்கியமான வினாக்களைப் பற்றிப் பார்ப்போம்.`
      )
    ),
    cleanTextForSpeech(
      `அனைத்து ${topicsToUse.length} தலைப்புகளையும் படித்து முடித்துள்ளோம். வரைபடங்களையும் நிரல்களையும் நன்கு பயிற்சி செய்து தேர்வில் முழு மதிப்பெண்களைப் பெறுங்கள்!`
    )
  ];

  return {
    isProjectMode: false,
    modeTitle: "🎓 Virtual Professor Syllabus Mode",
    topics: topicsToUse,
    detailedTopicTheoryList,
    short2Mark,
    medium5Mark,
    long10Mark,
    englishLessonScript,
    tamilLessonScript,
  };
}

// Animated Waveform Equalizer
function AudioEqualizer({ isPlaying }) {
  return (
    <div className="flex items-center justify-center gap-1.5 h-10 px-4 py-2 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-teal-500/30">
      {[0.4, 0.9, 0.6, 1.0, 0.5, 0.8, 0.3, 0.7, 0.9, 0.4].map((heightScale, i) => (
        <motion.div
          key={i}
          animate={{
            height: isPlaying ? [`${heightScale * 8}px`, `${heightScale * 28}px`, `${heightScale * 10}px`] : "6px",
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

  const rawUnitTitle = unitData.title || "Unit Overview";
  const spokenUnitTitle = cleanTextForSpeech(rawUnitTitle);
  const unitSubtitle = unitData.subtitle || "Quick Revision Podcast";
  const syllabusText = unitData.syllabus || "Core Computer Science concepts, key definitions, and exam takeaways.";
  const year = unitData.year || 1;
  const semester = unitData.semester || 1;

  // Base Offline Syllabus Analysis
  const [analysis, setAnalysis] = useState(() =>
    analyzeSyllabusForUnit(rawUnitTitle, unitSubtitle, syllabusText, subjectName, year, semester)
  );

  const [aiLoading, setAiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("checklist"); // "checklist" | "lessons" | "audio" | "questions"
  const [language, setLanguage] = useState("en"); // Default "en" (English Professor) or "ta" (Tamil Tutor)

  // Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(0.9);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

  const synthRef = useRef(window.speechSynthesis || null);

  // Background Dynamic Groq AI Fetching (if configured)
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
          const formattedTopics = aiRes.topics.map((t, idx) => ({
            id: idx + 1,
            name: t.name || `Topic ${idx + 1}`,
            title: t.name || `Topic ${idx + 1}`,
            theory: t.explanation || t.definition || "Core concept explanation.",
            codeOrDiagram: t.codeOrDiagram || getTopicCodeOrDiagram(t.name, subjectName),
            importance: t.importance || "Key exam takeaway",
            commonMistakes: t.commonMistakes || "Forgetting syntax / boundary cases",
            examImportance: `University Exam Focus: High probability of 2-mark & 5/10-mark questions.`,
            speechEn: cleanTextForSpeech(t.speechEn || `${t.name}: ${t.definition}`),
            speechTa: cleanTextForSpeech(t.speechTa || `${t.name}: ${t.definition}`),
          }));

          const fallbackAnalysis = analyzeSyllabusForUnit(rawUnitTitle, unitSubtitle, syllabusText, subjectName, year, semester);

          const short2Mark = (aiRes.short2Mark && aiRes.short2Mark.length >= formattedTopics.length)
            ? aiRes.short2Mark.map((q, i) => typeof q === "string" ? { q, ans: "Model Answer provided by AI Professor." } : q)
            : fallbackAnalysis.short2Mark;

          const medium5Mark = (aiRes.medium5Mark && aiRes.medium5Mark.length >= formattedTopics.length)
            ? aiRes.medium5Mark.map((q, i) => typeof q === "string" ? { q, ans: "Model Answer & Code/Diagram provided by AI Professor." } : q)
            : fallbackAnalysis.medium5Mark;

          const long10Mark = (aiRes.long10Mark && aiRes.long10Mark.length > 0)
            ? aiRes.long10Mark.map((q, i) => typeof q === "string" ? { q, ans: "Detailed 10-Mark Essay Answer provided by AI Professor." } : q)
            : fallbackAnalysis.long10Mark;

          setAnalysis({
            isProjectMode: false,
            modeTitle: "🤖 Groq AI Professor Mode",
            topics: aiRes.topics.map((t) => t.name),
            detailedTopicTheoryList: formattedTopics,
            short2Mark,
            medium5Mark,
            long10Mark,
            englishLessonScript: aiRes.englishScript || [],
            tamilLessonScript: aiRes.tamilScript || [],
          });
          setAiLoading(false);
        })
        .catch(() => setAiLoading(false));
    }
    return () => {
      isMounted = false;
    };
  }, [rawUnitTitle, unitSubtitle, syllabusText, subjectName, year, semester]);

  // Select Active Script based on Language Selection
  const currentScript = language === "ta" ? analysis.tamilLessonScript : analysis.englishLessonScript;

  // Load Speech Voices (Automatically Finds Tamil ta-IN & Clear English Voices)
  useEffect(() => {
    if (!synthRef.current) return;

    const updateVoices = () => {
      const available = synthRef.current.getVoices();
      setVoices(available);

      if (language === "ta") {
        const tamilVoice =
          available.find((v) => v.lang.startsWith("ta") || v.name.includes("Tamil") || v.name.includes("தமிழ்")) ||
          available.find((v) => v.lang.includes("IN") && (v.name.includes("Google") || v.name.includes("Natural"))) ||
          available.find((v) => v.lang.startsWith("en"));
        setSelectedVoice(tamilVoice);
      } else {
        const englishVoices = available.filter((v) => v.lang.startsWith("en"));
        const preferred =
          englishVoices.find((v) => v.name.includes("Google") || v.name.includes("Natural")) ||
          englishVoices.find((v) => v.name.includes("Zira") || v.name.includes("Jenny") || v.name.includes("Aria") || v.name.includes("David") || v.name.includes("Samantha")) ||
          englishVoices[0] ||
          available[0];
        setSelectedVoice(preferred);
      }
    };

    updateVoices();
    if (synthRef.current.onvoiceschanged !== undefined) {
      synthRef.current.onvoiceschanged = updateVoices;
    }
  }, [language]);

  // Speak single text chunk (For Play button on Syllabus Roadmap & Exam Questions)
  const speakText = (text) => {
    if (!synthRef.current) {
      toast.error("Speech Synthesis is not supported in this browser.");
      return;
    }

    synthRef.current.cancel();

    if (!text) return;
    const cleanStr = cleanTextForSpeech(text);
    const utterance = new SpeechSynthesisUtterance(cleanStr);

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang || (language === "ta" ? "ta-IN" : "en-US");
    } else {
      utterance.lang = language === "ta" ? "ta-IN" : "en-US";
    }

    utterance.rate = playbackRate;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      setIsPlaying(true);
    };

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = (err) => {
      console.warn("Speech Synthesis notice:", err);
      setIsPlaying(false);
    };

    synthRef.current.speak(utterance);

    if (synthRef.current.paused) {
      synthRef.current.resume();
    }
  };

  // Speak multi-step sequence (For Spoken Lecture Script)
  const speakSequence = (scriptArray, startIndex = 0) => {
    if (!synthRef.current || !scriptArray || scriptArray.length === 0) return;

    const index = Math.max(0, Math.min(startIndex, scriptArray.length - 1));
    const sentence = scriptArray[index];

    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(cleanTextForSpeech(sentence));

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang || (language === "ta" ? "ta-IN" : "en-US");
    } else {
      utterance.lang = language === "ta" ? "ta-IN" : "en-US";
    }

    utterance.rate = playbackRate;

    utterance.onstart = () => {
      setIsPlaying(true);
      setCurrentParagraph(index);
    };

    utterance.onend = () => {
      if (index + 1 < scriptArray.length) {
        speakSequence(scriptArray, index + 1);
      } else {
        setIsPlaying(false);
        toast.success("Lecture completed!");
      }
    };

    utterance.onerror = () => {
      if (index + 1 < scriptArray.length) {
        speakSequence(scriptArray, index + 1);
      } else {
        setIsPlaying(false);
      }
    };

    synthRef.current.speak(utterance);
    if (synthRef.current.paused) {
      synthRef.current.resume();
    }
  };

  // Handle Play/Pause
  const handlePlayPause = () => {
    if (!synthRef.current) {
      toast.error("Speech Synthesis is not supported in this browser");
      return;
    }

    if (isPlaying) {
      synthRef.current.cancel();
      setIsPlaying(false);
    } else {
      speakSequence(currentScript, currentParagraph);
    }
  };

  // Speed Toggle
  const toggleSpeed = () => {
    const rates = [0.75, 0.9, 1.0, 1.25, 1.5];
    const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
    const newRate = rates[nextIdx];
    setPlaybackRate(newRate);
    toast.success(`Speech speed set to ${newRate}x`);

    if (isPlaying) {
      speakSequence(currentScript, currentParagraph);
    }
  };

  // Close & Clean Up Speech
  const handleClose = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsPlaying(false);
    onClose();
  };

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[999999] flex items-start justify-center bg-slate-950/90 backdrop-blur-xl pt-16 sm:pt-20 pb-8 px-3 sm:px-6 text-left overflow-y-auto"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.92, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.92, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="flex w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-slate-900 border-2 border-teal-500/40 shadow-2xl text-white my-auto max-h-[calc(100vh-6rem)]"
        >
          {/* Header Bar with Language Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-gradient-to-r from-[#0D9488] via-[#0F766E] to-[#115E59] px-5 sm:px-6 py-4 border-b border-teal-500/30 shrink-0 gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-400 text-slate-950 font-black text-xl shadow-lg">
                🎙️
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase font-mono shadow-sm bg-amber-400 text-slate-950">
                    {analysis.modeTitle}
                  </span>
                  <span className="text-xs text-teal-200 font-bold truncate">{subjectName}</span>
                </div>
                <h3 className="text-sm sm:text-base font-extrabold text-white truncate mt-0.5 font-mono">
                  {spokenUnitTitle}: {unitSubtitle}
                </h3>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-teal-400/20">
              <div className="flex items-center bg-slate-950/90 rounded-xl p-1 border border-amber-400/50 font-mono text-xs shadow-md">
                <button
                  onClick={() => {
                    setLanguage("en");
                    toast.success("English Professor Mode Enabled");
                    if (isPlaying) synthRef.current?.cancel();
                  }}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    language === "en"
                      ? "bg-teal-500 text-white shadow-md scale-105"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  🌐 English
                </button>
                <button
                  onClick={() => {
                    setLanguage("ta");
                    toast.success("தமிழ் / Tanglish Tutor Enabled");
                    if (isPlaying) synthRef.current?.cancel();
                  }}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    language === "ta"
                      ? "bg-amber-400 text-slate-950 shadow-md scale-105"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  🇮🇳 தமிழ்
                </button>
              </div>

              <button
                onClick={handleClose}
                className="rounded-full bg-slate-950/60 p-2 text-white/80 hover:bg-rose-600 hover:text-white transition-all shrink-0 cursor-pointer border border-white/20"
                title="Close AI Podcast"
              >
                <FiX size={18} />
              </button>
            </div>
          </div>

          {/* Equalizer Waveform & Visual Player Card */}
          <div className="p-4 sm:p-5 bg-gradient-to-b from-slate-900 via-teal-950/30 to-slate-900 flex flex-col shrink-0 gap-3 border-b border-teal-500/20">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl bg-slate-800/80 border border-teal-500/30 p-3.5 shadow-inner">
              <div className="space-y-1 text-center sm:text-left">
                <p className="text-xs font-bold text-teal-300 font-mono flex items-center gap-1.5 justify-center sm:justify-start">
                  <FiZap className="text-amber-400" size={14} /> Virtual CS Professor ({spokenUnitTitle})
                </p>
                <p className="text-xs text-slate-300 leading-relaxed max-w-md">
                  {language === "ta"
                    ? `அலகு பாடத்திட்டத்தில் உள்ள அனைத்து ${analysis.topics.length} தலைப்புகளையும் விரிவாகக் கற்றுத் தருகிறது.`
                    : `Teaching all ${analysis.topics.length} exact syllabus topics under ${spokenUnitTitle} step-by-step.`}
                </p>
                {voices.length > 0 && (
                  <div className="flex items-center gap-2 pt-1 justify-center sm:justify-start">
                    <FiVolume2 size={13} className="text-amber-400" />
                    <select
                      value={selectedVoice?.name || ""}
                      onChange={(e) => {
                        const chosen = voices.find((v) => v.name === e.target.value);
                        if (chosen) {
                          setSelectedVoice(chosen);
                          toast.success(`Voice set to ${chosen.name.split(" ")[0]}`);
                        }
                      }}
                      className="bg-slate-950 text-amber-300 text-[11px] font-mono font-bold px-2 py-1 rounded-lg border border-teal-500/40 outline-none focus:border-amber-400 max-w-[170px] truncate cursor-pointer"
                    >
                      {voices.map((v) => (
                        <option key={v.name} value={v.name}>
                          {v.name.replace(/Microsoft|Google|English|Desktop/g, "").trim()} ({v.lang})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <AudioEqualizer isPlaying={isPlaying} />
            </div>

            {/* Interactive Tabs Header (3 Clear Tabs) */}
            <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1">
              <button
                onClick={() => setActiveTab("checklist")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black font-mono transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "checklist"
                    ? "bg-amber-400 text-slate-950 shadow-md border border-amber-300 scale-105"
                    : "bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white"
                }`}
              >
                <FiList size={14} /> {language === "ta" ? "பாடத் தலைப்புகள் பட்டியல்" : "Syllabus Roadmap"}
              </button>

              <button
                onClick={() => setActiveTab("lessons")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black font-mono transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "lessons"
                    ? "bg-teal-500 text-white shadow-md border border-teal-400 scale-105"
                    : "bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white"
                }`}
              >
                <FiBook size={14} /> {language === "ta" ? "ஆசிரியர் விளக்கங்கள் & உதா" : "Teacher Lessons & Examples"}
              </button>

              <button
                onClick={() => setActiveTab("questions")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black font-mono transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "questions"
                    ? "bg-rose-500 text-white shadow-md border border-rose-400 scale-105"
                    : "bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white"
                }`}
              >
                <FiHelpCircle size={14} /> {language === "ta" ? "தேர்வு வினா-விடைகள்" : "Exam Questions Q&A"}
              </button>
            </div>
          </div>

          {/* Scrollable Tab Body Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 text-xs font-mono space-y-4">
            {/* Tab 1: Syllabus Roadmap */}
            {activeTab === "checklist" && (
              <div className="space-y-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-teal-500/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-amber-300 font-extrabold text-xs uppercase tracking-wider flex items-center gap-2">
                      <FiCheckCircle size={16} /> Syllabus Roadmap for {spokenUnitTitle} ({analysis.topics.length} Topics)
                    </span>
                    {aiLoading && (
                      <span className="text-[10px] text-teal-400 animate-pulse font-bold">
                        ⚡ AI Professor Analyzing Syllabus...
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300">
                    Click the <strong className="text-amber-400">▶ Play</strong> option next to any topic to listen to its detailed theoretical explanation aloud:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {analysis.topics.map((tName, idx) => {
                    const topicTheory = analysis.detailedTopicTheoryList[idx];
                    const speechText = language === "ta"
                      ? (topicTheory?.speechTa || `தலைப்பு ${idx + 1}: ${tName}. ${topicTheory?.theory || ""}`)
                      : (topicTheory?.speechEn || `Topic ${idx + 1}: ${tName}. ${topicTheory?.theory || ""}`);

                    return (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 hover:border-amber-400 transition-all flex items-center gap-3 group shadow-sm"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-500/20 text-teal-300 font-bold text-xs group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
                          {idx + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-white text-xs truncate group-hover:text-amber-300 transition-colors">
                            {tName}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">{topicTheory?.theory || "Core syllabus topic"}</p>
                        </div>
                        <button
                          onClick={() => {
                            speakText(speechText);
                            toast.success(`Playing theory for Topic ${idx + 1}: ${tName}`);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all shadow-md shrink-0 flex items-center gap-1 cursor-pointer active:scale-95"
                          title={`Play theory explanation for ${tName}`}
                        >
                          <FiPlay size={12} /> Play
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 2: Topic-by-Topic Teacher Lessons & Examples */}
            {activeTab === "lessons" && (
              <div className="space-y-4">
                {analysis.detailedTopicTheoryList.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl bg-slate-800/90 border border-teal-500/30 p-4 space-y-3 hover:border-amber-400/40 transition-all shadow-md"
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap border-b border-slate-700/60 pb-2.5">
                      <h4 className="text-xs font-black text-amber-300 flex items-center gap-2">
                        <span className="bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-md font-extrabold text-[10px]">
                          Topic {item.id}
                        </span>
                        <span className="text-white font-bold text-sm">{item.title}</span>
                      </h4>
                      <button
                        onClick={() => {
                          const speechText = language === "ta"
                            ? `${item.speechTa}. எடுத்துக்காட்டு: ${item.codeOrDiagram}`
                            : `${item.speechEn}. Code Example: ${item.codeOrDiagram}`;
                          speakText(speechText);
                          toast.success(`Playing Topic ${item.id} theory & example`);
                        }}
                        className="flex items-center gap-1.5 bg-amber-400 text-slate-950 hover:bg-amber-300 px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer shadow-md active:scale-95"
                      >
                        <FiVolume2 size={13} /> Listen Topic &amp; Example
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      <div>
                        <span className="text-[10px] font-bold text-teal-300 uppercase tracking-wider block mb-1">
                          📖 Theoretical Breakdown
                        </span>
                        <p className="text-white text-xs leading-relaxed font-medium bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                          {item.theory}
                        </p>
                      </div>

                      {/* Code / Practical Example Block */}
                      {item.codeOrDiagram && (
                        <div className="rounded-xl bg-slate-950 border border-slate-700 p-3.5 overflow-x-auto space-y-1.5">
                          <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1 border-b border-slate-800 pb-1">
                            <FiCode size={13} /> Code / Practical Example for {item.title}:
                          </span>
                          <pre className="text-[11px] text-emerald-300 font-mono leading-relaxed whitespace-pre-wrap pt-1">
                            {item.codeOrDiagram}
                          </pre>
                        </div>
                      )}
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-amber-400/30 text-[11px] text-amber-200 font-bold flex items-center gap-2">
                      <FiAward className="text-amber-400 shrink-0" size={14} />
                      <span>{item.examImportance}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 3: Exam Questions Q&A with Full Model Answers & Audio */}
            {activeTab === "questions" && (
              <div className="space-y-4 font-mono text-xs">
                <div className="bg-slate-950 p-4 rounded-2xl border-2 border-teal-400/60 text-white shadow-md">
                  <span className="font-black text-amber-300 uppercase text-xs tracking-wider block">
                    🎯 University Exam Question Bank ({spokenUnitTitle})
                  </span>
                  <p className="text-xs text-white font-bold mt-1">
                    Targeted 2-Mark, 5-Mark, and 10-Mark university exam questions with complete Model Answers derived from this unit's syllabus. Click <strong className="text-amber-400">🔊 Listen Answer</strong> to hear Q&amp;A aloud!
                  </p>
                </div>

                {/* 2-Mark Questions */}
                <div className="rounded-2xl bg-slate-800/90 p-4 border border-teal-400/40 space-y-3 shadow-md">
                  <div className="flex items-center justify-between border-b border-teal-400/30 pb-2">
                    <span className="bg-teal-400 text-slate-950 font-black text-xs px-3 py-1 rounded-md uppercase tracking-wider">
                      2-Mark Short Answer Questions
                    </span>
                    <span className="text-xs text-teal-300 font-extrabold">Short Definitions</span>
                  </div>
                  <div className="space-y-3 pt-1">
                    {analysis.short2Mark.map((item, idx) => {
                      const qText = typeof item === "string" ? item : item.q;
                      const ansText = typeof item === "string" ? "See teacher breakdown for definition." : item.ans;
                      return (
                        <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-700 space-y-2.5 hover:border-teal-400 transition-all font-bold text-xs text-white">
                          <div className="flex items-start justify-between gap-3">
                            <span className="text-amber-300 font-bold text-sm">{qText}</span>
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => {
                                  speakText(`Question: ${qText}. ${ansText}`);
                                  toast.success("Playing question and answer audio");
                                }}
                                className="flex items-center gap-1 text-xs bg-teal-500 hover:bg-teal-400 text-white px-2.5 py-1 rounded-lg font-black transition-all cursor-pointer shadow-md"
                              >
                                <FiVolume2 size={12} /> Listen
                              </button>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(`${qText}\n${ansText}`);
                                  toast.success("Question & Answer copied!");
                                }}
                                className="flex items-center gap-1 text-xs bg-amber-400 hover:bg-amber-300 text-slate-950 px-2.5 py-1 rounded-lg font-black transition-all cursor-pointer shadow-md"
                              >
                                <FiCopy size={12} /> Copy
                              </button>
                            </div>
                          </div>
                          <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-emerald-300 font-normal leading-relaxed text-xs">
                            <span className="text-teal-400 font-bold block mb-1">Model Answer:</span>
                            {ansText}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 5-Mark Questions */}
                <div className="rounded-2xl bg-slate-800/90 p-4 border border-amber-400/40 space-y-3 shadow-md">
                  <div className="flex items-center justify-between border-b border-amber-400/30 pb-2">
                    <span className="bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded-md uppercase tracking-wider">
                      5-Mark Medium / Code / Diagram Questions
                    </span>
                    <span className="text-xs text-amber-300 font-extrabold">Code &amp; Diagrams</span>
                  </div>
                  <div className="space-y-3 pt-1">
                    {analysis.medium5Mark.map((item, idx) => {
                      const qText = typeof item === "string" ? item : item.q;
                      const ansText = typeof item === "string" ? "See teacher breakdown for code & diagram." : item.ans;
                      return (
                        <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-700 space-y-2.5 hover:border-amber-400 transition-all font-bold text-xs text-white">
                          <div className="flex items-start justify-between gap-3">
                            <span className="text-amber-300 font-bold text-sm">{qText}</span>
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => {
                                  speakText(`Question: ${qText}. ${ansText}`);
                                  toast.success("Playing question and answer audio");
                                }}
                                className="flex items-center gap-1 text-xs bg-teal-500 hover:bg-teal-400 text-white px-2.5 py-1 rounded-lg font-black transition-all cursor-pointer shadow-md"
                              >
                                <FiVolume2 size={12} /> Listen
                              </button>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(`${qText}\n${ansText}`);
                                  toast.success("Question & Answer copied!");
                                }}
                                className="flex items-center gap-1 text-xs bg-amber-400 hover:bg-amber-300 text-slate-950 px-2.5 py-1 rounded-lg font-black transition-all cursor-pointer shadow-md"
                              >
                                <FiCopy size={12} /> Copy
                              </button>
                            </div>
                          </div>
                          <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-emerald-300 font-normal leading-relaxed text-xs whitespace-pre-wrap">
                            <span className="text-amber-300 font-bold block mb-1">Model Answer &amp; Code Example:</span>
                            {ansText}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 10-Mark Questions */}
                <div className="rounded-2xl bg-slate-800/90 p-4 border border-rose-400/40 space-y-3 shadow-md">
                  <div className="flex items-center justify-between border-b border-rose-400/30 pb-2">
                    <span className="bg-rose-500 text-white font-black text-xs px-3 py-1 rounded-md uppercase tracking-wider">
                      10-Mark Long Essay Questions
                    </span>
                    <span className="text-xs text-rose-300 font-extrabold">Full System Essay</span>
                  </div>
                  <div className="space-y-3 pt-1">
                    {analysis.long10Mark.map((item, idx) => {
                      const qText = typeof item === "string" ? item : item.q;
                      const ansText = typeof item === "string" ? "Comprehensive 10-Mark answer provided above." : item.ans;
                      return (
                        <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-700 space-y-2.5 hover:border-rose-400 transition-all font-bold text-xs text-white">
                          <div className="flex items-start justify-between gap-3">
                            <span className="text-amber-300 font-bold text-sm">{qText}</span>
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => {
                                  speakText(`Question: ${qText}. ${ansText}`);
                                  toast.success("Playing question and answer audio");
                                }}
                                className="flex items-center gap-1 text-xs bg-teal-500 hover:bg-teal-400 text-white px-2.5 py-1 rounded-lg font-black transition-all cursor-pointer shadow-md"
                              >
                                <FiVolume2 size={12} /> Listen
                              </button>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(`${qText}\n${ansText}`);
                                  toast.success("Question & Answer copied!");
                                }}
                                className="flex items-center gap-1 text-xs bg-amber-400 hover:bg-amber-300 text-slate-950 px-2.5 py-1 rounded-lg font-black transition-all cursor-pointer shadow-md"
                              >
                                <FiCopy size={12} /> Copy
                              </button>
                            </div>
                          </div>
                          <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-emerald-300 font-normal leading-relaxed text-xs whitespace-pre-wrap">
                            <span className="text-rose-400 font-bold block mb-1">Model Essay Answer:</span>
                            {ansText}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sticky Bottom Main Audio Control Bar */}
          <div className="sticky bottom-0 bg-slate-950 px-5 sm:px-6 py-4 border-t-2 border-amber-400/40 shrink-0 z-30 flex items-center justify-between gap-3 shadow-2xl">
            <button
              onClick={toggleSpeed}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono font-black text-xs border border-white/40 cursor-pointer transition-all active:scale-95 shrink-0 shadow-md"
              title="Change Playback Speed"
            >
              <FiSliders size={14} className="text-amber-400" />
              <span className="text-white font-black">{playbackRate}x Speed</span>
            </button>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => speakSequence(currentScript, Math.max(0, currentParagraph - 1))}
                className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-white cursor-pointer transition-all shrink-0 border border-white/30"
                title="Rewind Previous Lesson Section"
              >
                <FiRotateCcw size={18} />
              </button>

              <button
                onClick={handlePlayPause}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-amber-400 via-amber-300 to-teal-400 text-slate-950 font-black shadow-2xl hover:scale-105 transition-all cursor-pointer active:scale-95 shrink-0 border-2 border-white"
                title={isPlaying ? "Pause Lesson" : "Play Lesson"}
              >
                {isPlaying ? <FiPause size={24} /> : <FiPlay size={24} className="ml-1" />}
              </button>

              <button
                onClick={() => speakSequence(currentScript, Math.min(currentScript.length - 1, currentParagraph + 1))}
                className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-white cursor-pointer transition-all shrink-0 border border-white/30"
                title="Skip Next Lesson Section"
              >
                <FiRotateCw size={18} />
              </button>
            </div>

            <div className="text-right shrink-0">
              <button
                onClick={() => speakSequence(currentScript, currentParagraph)}
                className={`text-xs font-mono font-black px-3.5 py-2 rounded-xl border-2 shadow-lg flex items-center gap-2 transition-all cursor-pointer ${
                  isPlaying
                    ? "bg-emerald-600 text-white border-white ring-2 ring-emerald-400"
                    : "bg-amber-400 text-slate-950 border-amber-300 hover:scale-105"
                }`}
              >
                <span className={`h-2.5 w-2.5 rounded-full ${isPlaying ? "bg-white animate-ping" : "bg-slate-950"}`} />
                <span className="font-black">
                  {language === "ta" ? "🇮🇳 தமிழ் Tutor" : "🌐 English Tutor"} {isPlaying ? "(Speaking)" : "(Click to Listen)"}
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
