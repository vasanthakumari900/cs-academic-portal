// src/components/chatbot/ChatBot.jsx
// Creative, State-of-the-Art AI Study Assistant Chatbot with Document AI (RAG Page-Grounded QA), Voice Recording, Web Search Engine & Navigation.

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  FiX, FiSend, FiMaximize2, FiMinimize2, FiTrash2, 
  FiChevronDown, FiMessageCircle, FiMic, FiMicOff, 
  FiPlus, FiFileText, FiGlobe, FiPaperclip, FiCpu, FiCheck, FiZap, FiDownload, FiBook, FiExternalLink, FiRotateCcw
} from "react-icons/fi";
import { sendMessage, isAiConfigured, performWebSearch } from "../../services/groqService";
import { uploadFile } from "../../services/storageService";
import { parseUploadedDocument } from "../../utils/documentParser";
import { 
  addDocumentToRAG, 
  answerQuestionFromDocuments, 
  getActiveDocuments, 
  clearActiveDocuments 
} from "../../services/ragService";
import { useAuth } from "../../context/AuthContext";
import { CURRICULUM, CURRICULUM_PG } from "../../utils/curriculum";
import CSAIAgentLogo from "./CSAIAgentLogo";
import FormattedMessage from "./FormattedMessage";
import toast from "react-hot-toast";

const STORAGE_KEY = "cs_portal_chat_history";
const MAX_STORED_MSGS = 100;

// Subject lookup mapping
const SUBJECT_MAP = {
  "python": "FUNDAMENTALS OF PYTHON PROGRAMMING",
  "digital electronics": "FUNDAMENTALS OF DIGITAL ELECTRONICS",
  "maths 1": "MATHEMATICS PAPER - I",
  "maths i": "MATHEMATICS PAPER - I",
  "tamil": "TAMIL",
  "english": "ENGLISH",
  "data structures": "DATA STRUCTURES",
  "ds": "DATA STRUCTURES",
  "c++": "OBJECT ORIENTED PROGRAMMING USING C++",
  "oop": "OBJECT ORIENTED PROGRAMMING USING C++",
  "maths 2": "MATHEMATICS PAPER - II",
  "java": "JAVA PROGRAMMING",
  "web technology": "WEB TECHNOLOGY",
  "operating system": "OPERATING SYSTEM",
  "os": "OPERATING SYSTEM",
  "android": "ANDROID APP DEVELOPMENT",
  "software engineering": "SOFTWARE ENGINEERING",
  "ai": "ARTIFICIAL INTELLIGENCE AND EXPERT SYSTEM",
  "data mining": "DATA MINING TECHNIQUES",
  "asp.net": "ASP.NET",
  "dbms": "DATABASE MANAGEMENT SYSTEM",
  "php": "PROGRAMMING IN PHP",
  "cloud": "CLOUD COMPUTING",
  "networks": "COMPUTER NETWORKS",
  "data science": "INTRODUCTION TO DATA SCIENCE",
  "image processing": "DIGITAL IMAGE PROCESSING",
  "uml": "UNIFIED MODELING LANGUAGE"
};

const QUICK_SUGGESTIONS = [
  { label: "📚 Notes", query: "notes", color: "from-blue-500/10 to-indigo-500/10 text-indigo-700 border-indigo-200" },
  { label: "🎥 Videos", query: "videos", color: "from-rose-500/10 to-pink-500/10 text-rose-700 border-rose-200" },
  { label: "📝 Assignments", query: "assignments", color: "from-amber-500/10 to-orange-500/10 text-amber-700 border-amber-200" },
  { label: "💼 Placements", query: "placements", color: "from-emerald-500/10 to-teal-500/10 text-emerald-700 border-emerald-200" },
];

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const WELCOME_MSG = {
  role: "assistant",
  content: "✨ Hello! I'm your CS AI Assistant. Click 📄 `+` to Upload PDF Notes (RAG), 🌐 for Real-time Web Search, or 🎙️ for Voice Chat!",
  timestamp: Date.now(),
};

function loadHistory() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fail silently
  }
  return [WELCOME_MSG];
}

function saveHistory(messages) {
  try {
    const toStore = messages.slice(-MAX_STORED_MSGS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  } catch {
    // fail silently
  }
}

export default function ChatBot() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [parseProgress, setParseProgress] = useState(null);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [lastSubject, setLastSubject] = useState(null);

  // Advanced features state
  const [isRecording, setIsRecording] = useState(false);
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [webSearchMode, setWebSearchMode] = useState(false);
  const [activeDocs, setActiveDocs] = useState([]);

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const initialized = useRef(false);

  // Initialize history & active RAG docs
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      setMessages(loadHistory());
      setActiveDocs(getActiveDocuments());
    }
  }, []);

  // Save history on change
  useEffect(() => {
    if (initialized.current) {
      saveHistory(messages);
    }
  }, [messages]);

  // Voice Recognition setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = "en-US";

      rec.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((res) => res[0].transcript)
          .join("");
        setInput(transcript);
      };

      rec.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const toggleVoiceRecording = () => {
    if (!recognitionRef.current) {
      toast.error("Speech recognition is not supported in your browser. Please type your message.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      toast("Voice recording stopped");
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        toast("🎙️ Voice input active... Speak now!");
      } catch (err) {
        console.error("Mic start error:", err);
      }
    }
  };

  const scrollToBottom = useCallback((smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: smooth ? "smooth" : "auto",
        block: "end",
      });
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => scrollToBottom(true), 300);
      return () => clearTimeout(t);
    }
  }, [isOpen, scrollToBottom]);

  useEffect(() => {
    if (isOpen) scrollToBottom(true);
  }, [messages, isOpen, scrollToBottom]);

  const handleScroll = useCallback(() => {
    const el = chatContainerRef.current;
    if (!el) return;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    setShowScrollButton(!isNearBottom);
  }, []);

  // Smart Navigation Resolver
  const handleNavigationResolve = (text) => {
    const cleanText = text.toLowerCase();
    
    let detectedSubject = null;
    let detectedYear = null;
    let detectedSem = null;
    
    for (const key of Object.keys(SUBJECT_MAP)) {
      if (cleanText.includes(key)) {
        detectedSubject = SUBJECT_MAP[key];
        break;
      }
    }
    
    if (!detectedSubject && lastSubject) {
      detectedSubject = lastSubject;
    }
    
    if (detectedSubject) {
      const curriculums = [CURRICULUM, CURRICULUM_PG];
      for (const curr of curriculums) {
        for (const yKey of Object.keys(curr)) {
          const yr = curr[yKey];
          for (const sKey of Object.keys(yr.semesters)) {
            const sem = yr.semesters[sKey];
            if (sem.subjects.includes(detectedSubject)) {
              detectedYear = parseInt(yKey);
              detectedSem = parseInt(sKey);
              break;
            }
          }
          if (detectedYear) break;
        }
        if (detectedYear) break;
      }
    }
    
    const isStudent = user && user.role === "student";
    if (isStudent && detectedYear && detectedYear !== parseInt(user.year)) {
      const yrLabel = detectedYear === 1 ? "1st" : detectedYear === 2 ? "2nd" : "3rd";
      const studentLabel = user.year === 1 ? "1st" : user.year === 2 ? "2nd" : "3rd";
      return {
        shouldNavigate: false,
        message: `Oops! **${detectedSubject}** is a ${yrLabel}-year course. As a ${studentLabel}-year student, you are restricted to your current curriculum filters.`
      };
    }
    
    if (detectedSubject) {
      setLastSubject(detectedSubject);
    }
    
    let route = null;
    let categoryLabel = "";
    
    const isNotes = /notes\b|study material/i.test(cleanText);
    const isVideos = /videos\b|e-content\b|lecture videos/i.test(cleanText);
    const isAssignments = /assignments?\b|homework/i.test(cleanText);
    const isPlacements = /placement\b|jobs\b|drives|interviews?/i.test(cleanText);

    if (isNotes) {
      route = isStudent ? "/student/notes" : "/notes";
      categoryLabel = "Lecture Notes";
    } else if (isVideos) {
      route = isStudent ? "/student/videos" : "/e-content";
      categoryLabel = "Lecture Videos";
    } else if (isAssignments) {
      route = isStudent ? "/student/assignments" : "/faculty/assignments";
      categoryLabel = "Assignments";
    } else if (isPlacements) {
      route = isStudent ? "/student/placements" : "/placements";
      categoryLabel = "Placement Details & Experiences";
    }
    
    if (route) {
      navigate(route, {
        state: {
          year: detectedYear || (isStudent ? parseInt(user.year) : null),
          semester: detectedSem,
          subject: detectedSubject
        }
      });
      
      let msg = `Sure! Directing you to **${categoryLabel}** page!`;
      if (detectedSubject) {
        msg += ` Preselected filters for **${detectedSubject}** (Year ${detectedYear}, Sem ${detectedSem}).`;
      }
      return { shouldNavigate: true, message: msg };
    }
    
    return null;
  };

  // Document AI File Upload & Parsing Handler
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setShowPlusMenu(false);
    setIsLoading(true);
    setParseProgress({ current: 1, total: 1, percent: 10, fileName: file.name });

    try {
      uploadFile(file, `documentAI_uploads/${user?.uid || "guest"}/${Date.now()}_${file.name}`).catch(() => {});

      const docData = await parseUploadedDocument(file, (current, total) => {
        setParseProgress({
          current,
          total,
          percent: Math.round((current / total) * 100),
          fileName: file.name,
        });
      });

      await addDocumentToRAG(docData, user?.uid || "guest");
      setActiveDocs([...getActiveDocuments()]);

      const userMsg = {
        role: "user",
        content: `📄 Uploaded Academic Document: "${file.name}"`,
        timestamp: Date.now(),
      };

      const summaryMsg = {
        role: "assistant",
        content: `✅ **Document Processed & Indexed Successfully!**\n\n📄 **Document**: ${docData.fileName}\n📊 **Stats**: ${docData.totalPages} Page${docData.totalPages > 1 ? "s" : ""} · ${docData.wordCount.toLocaleString()} Words\n\n💡 **Document Summary Excerpt**:\n${docData.summary.excerpt}\n\n💬 **Document AI is Active!** Ask any question about **${docData.fileName}** (e.g. *"What is deadlock?"*, *"Explain paging."*). I will search across all ${docData.totalPages} pages and cite exact page numbers!`,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMsg, summaryMsg]);
      toast.success(`"${file.name}" parsed & indexed successfully (${docData.totalPages} pages)! 📄`);
    } catch (err) {
      console.error("Document AI Upload error:", err);
      toast.error("Could not parse document. Ensure the file is a valid PDF, DOCX, or TXT file.");
    } finally {
      setIsLoading(false);
      setParseProgress(null);
    }
  };

  // Send message handler with Real Web Search & RAG AI Integration
  async function handleSend(e) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    setInput("");
    setShowPlusMenu(false);
    setIsLoading(true);

    const userMsg = { role: "user", content: text, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);

    // ── 1. Web Search Engine Handler ──
    if (webSearchMode) {
      try {
        toast("🌐 Searching the web in real-time...", { icon: "🔎" });
        const searchRes = await performWebSearch(text);
        const apiHistory = messages.map(({ role, content }) => ({ role, content }));

        let extraContext = "";
        if (searchRes.snippets) {
          extraContext = `[REAL-TIME ONLINE WEB SEARCH RESULTS]:\n${searchRes.snippets}`;
        }

        let aiAnswer = await sendMessage(apiHistory, text, extraContext);

        if (searchRes.sources && searchRes.sources.length > 0) {
          aiAnswer += `\n\n🌐 **Web Sources & Citations**:\n` + searchRes.sources.map((s) => `• ${s}`).join("\n");
        }

        const botMsg = { role: "assistant", content: aiAnswer, timestamp: Date.now() };
        setMessages((prev) => [...prev, botMsg]);
        toast.success("🌐 Real-time web search response synthesized!");
      } catch (err) {
        console.error("Web Search error:", err);
        const errMsg = {
          role: "assistant",
          content: "Sorry, web search engine encountered an issue. Reverting to standard AI response.",
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errMsg]);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // ── 2. RAG Document AI Handler ──
    if (activeDocs.length > 0) {
      try {
        const apiHistory = messages.map(({ role, content }) => ({ role, content }));
        const reply = await answerQuestionFromDocuments(text, apiHistory);
        const botMsg = { role: "assistant", content: reply, timestamp: Date.now() };
        setMessages((prev) => [...prev, botMsg]);
      } catch (err) {
        console.error("Document QA error:", err);
        const errMsg = {
          role: "assistant",
          content: "The uploaded document does not contain information related to your question.",
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errMsg]);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // ── 3. Navigation Redirect Handler ──
    const navResult = handleNavigationResolve(text);
    if (navResult) {
      const botMsg = { role: "assistant", content: navResult.message, timestamp: Date.now() };
      setMessages((prev) => [...prev, botMsg]);
      setIsLoading(false);
      return;
    }

    // ── 4. General Groq AI Response ──
    try {
      const apiHistory = messages.map(({ role, content }) => ({ role, content }));
      const reply = await sendMessage(apiHistory, text, "");
      const botMsg = { role: "assistant", content: reply, timestamp: Date.now() };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errMsg = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSuggestion(query) {
    setInput(query);
    if (inputRef.current) inputRef.current.focus();
  }

  function handleClear(e) {
    e?.stopPropagation();
    e?.preventDefault();
    clearActiveDocuments();
    setActiveDocs([]);
    const fresh = [WELCOME_MSG];
    setMessages(fresh);
    saveHistory(fresh);
    toast.success("Chat history & document context cleared!");
  }

  function toggleFullscreen(e) {
    e?.stopPropagation();
    e?.preventDefault();
    setIsFullscreen((prev) => !prev);
    toast(isFullscreen ? "Minimized window mode" : "Fullscreen mode activated", { icon: "🖥️" });
  }

  function toggleOpen(e) {
    e?.stopPropagation();
    e?.preventDefault();
    setIsOpen((prev) => {
      if (!prev) {
        setTimeout(() => inputRef.current?.focus(), 300);
        setHasNewMessage(false);
      }
      return !prev;
    });
  }

  useEffect(() => {
    if (!isOpen && messages.length > 1) {
      const last = messages[messages.length - 1];
      if (last.role === "assistant") {
        setHasNewMessage(true);
      }
    }
  }, [messages, isOpen]);

  const isAuthPage = location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/forgot-password";
  if (isAuthPage) return null;

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".pdf,.txt,.doc,.docx,.ppt,.pptx,.json,.md"
        className="hidden"
      />

      {/* ── CHATBOT WINDOW (100% Viewport Height Safe Container) ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 24, stiffness: 280 }}
            className={`font-sans flex flex-col overflow-hidden rounded-3xl border-2 border-white/50 bg-white shadow-[0_25px_60px_rgba(0,0,0,0.5)] chatbot-window ${
              isFullscreen
                ? "fixed inset-3 sm:inset-6 z-[100] max-w-6xl max-h-[calc(100vh-3rem)] m-auto"
                : "fixed bottom-20 sm:bottom-24 right-3 sm:right-6 z-[100] w-[min(480px,94vw)] h-[min(540px,calc(100vh-7.5rem))] max-h-[calc(100vh-7.5rem)]"
            }`}
          >
            {/* Creative Glassmorphic Gradient Header */}
            <div className="relative flex shrink-0 items-center justify-between border-b border-white/20 bg-gradient-to-r from-[#3A101A] via-[#61182A] to-[#7F011F] px-4 py-3 text-white shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="relative shrink-0">
                  <CSAIAgentLogo size={42} />
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-400 ring-2 ring-white">
                    <span className="h-2 w-2 animate-ping rounded-full bg-white opacity-75" />
                  </span>
                </div>
                <div className="leading-tight text-left">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs sm:text-sm font-extrabold text-white tracking-wide font-heading">CS AI Assistant</p>
                    {activeDocs.length > 0 && (
                      <span className="flex items-center gap-1 rounded-full bg-emerald-400/20 px-2 py-0.5 text-[9px] font-bold text-emerald-200 border border-emerald-300/30">
                        <FiBook size={10} /> RAG ({activeDocs.length})
                      </span>
                    )}
                    {webSearchMode && (
                      <span className="flex items-center gap-1 rounded-full bg-blue-400/20 px-2 py-0.5 text-[9px] font-bold text-blue-200 border border-blue-300/30">
                        <FiGlobe size={10} /> Web Mode
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-white/80 flex items-center gap-1 mt-0.5 font-medium">
                    <FiZap className="text-amber-300 animate-pulse" size={11} />
                    {webSearchMode
                      ? "Real-time Web Search Active"
                      : activeDocs.length > 0
                      ? `Document QA (${activeDocs[0].totalPages} Pages)`
                      : "Groq Llama 3.3 Engine"}
                  </p>
                </div>
              </div>

              {/* Header Controls (Delete Chat, Screen In/Out, Close) */}
              <div className="flex items-center gap-1.5 shrink-0 z-30">
                {/* Delete Chat History Button */}
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex h-7 sm:h-8 items-center gap-1 rounded-xl bg-white/15 px-2.5 text-xs font-bold text-white transition-all hover:bg-rose-600 hover:text-white border border-white/20 active:scale-95 cursor-pointer shadow-xs"
                  title="Clear Chat History & Document Context"
                >
                  <FiTrash2 size={13} />
                  <span className="hidden sm:inline text-[10px]">Clear</span>
                </button>

                {/* Screen In/Out Fullscreen Button */}
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="flex h-7 sm:h-8 items-center gap-1 rounded-xl bg-white/15 px-2.5 text-xs font-bold text-white transition-all hover:bg-amber-500 hover:text-slate-950 border border-white/20 active:scale-95 cursor-pointer shadow-xs"
                  title={isFullscreen ? "Shrink Window" : "Expand Fullscreen"}
                >
                  {isFullscreen ? <FiMinimize2 size={13} /> : <FiMaximize2 size={13} />}
                  <span className="hidden sm:inline text-[10px]">{isFullscreen ? "Shrink" : "Expand"}</span>
                </button>

                {/* Close Window Button */}
                <button
                  type="button"
                  onClick={toggleOpen}
                  className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-white/15 text-white transition-all hover:bg-rose-500 hover:text-white border border-white/20 active:scale-95 cursor-pointer shadow-xs"
                  title="Close Chatbot Window"
                >
                  <FiX size={16} />
                </button>
              </div>
            </div>

            {/* Messages Feed */}
            <div
              ref={chatContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto space-y-3 px-3.5 py-3.5 bg-slate-50 chat-feed"
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed shadow-xs transition-all ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-[#61182A] to-[#4A1620] text-white shadow-[0_4px_14px_rgba(74,22,32,0.25)] rounded-br-xs chat-user-bubble"
                        : "bg-white text-slate-900 border border-slate-200/80 border-l-4 border-l-[#D97706] rounded-bl-xs chat-ai-bubble"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <p className="whitespace-pre-wrap font-sans text-white font-bold !text-white">{msg.content}</p>
                    ) : (
                      <FormattedMessage content={msg.content} />
                    )}

                    <p className={`mt-1 text-[9px] text-right font-medium ${msg.role === "user" ? "text-white/80 !text-white/80" : "text-slate-500 !text-slate-500"}`}>
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Parsing Progress Bar Card */}
              {parseProgress && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="w-full max-w-sm rounded-2xl bg-white p-3 border border-[#EDC8D0] shadow-md space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-[#4A1620]">
                      <span className="truncate flex items-center gap-1.5">
                        <FiFileText className="animate-bounce text-[#D97706]" />
                        Processing {parseProgress.fileName}
                      </span>
                      <span className="text-[#B45309]">{parseProgress.percent}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#D97706] to-[#7F011F] transition-all duration-200 rounded-full"
                        style={{ width: `${parseProgress.percent}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium text-right">
                      Extracting Page {parseProgress.current} of {parseProgress.total}...
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Voice Equalizer Alert */}
              {isRecording && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center py-1.5">
                  <div className="flex items-center gap-1.5 rounded-full bg-rose-50 px-3.5 py-1.5 border border-rose-200 text-rose-700 shadow-xs text-xs font-bold">
                    <FiMic className="animate-pulse text-rose-600" size={13} />
                    Listening to your voice... Speak now!
                  </div>
                </motion.div>
              )}

              {/* AI Thinking Animation */}
              {isLoading && !parseProgress && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="rounded-2xl bg-white px-3.5 py-2.5 border border-slate-200 border-l-4 border-l-[#D97706] shadow-xs">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#4A1620]">
                      <FiCpu className="animate-spin text-[#D97706]" size={14} />
                      {webSearchMode
                        ? "Searching live web intelligence & synthesizing sources..."
                        : activeDocs.length > 0
                        ? "Searching document pages & citing citations..."
                        : "Synthesizing response..."}
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Active Document Chips Bar */}
            {activeDocs.length > 0 && (
              <div className="flex items-center justify-between bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 px-3 py-1.5 text-xs text-emerald-900 border-t border-emerald-100 shrink-0">
                <div className="flex items-center gap-1.5 overflow-x-auto truncate">
                  <FiPaperclip size={12} className="text-emerald-600 shrink-0" />
                  <span className="font-bold shrink-0">Attached:</span>
                  {activeDocs.map((doc, idx) => (
                    <span key={idx} className="bg-white border border-emerald-200 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-extrabold shrink-0">
                      📄 {doc.fileName} ({doc.totalPages} Pgs)
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    clearActiveDocuments();
                    setActiveDocs([]);
                    toast.success("Cleared document context");
                  }}
                  className="text-emerald-700 hover:text-rose-600 p-0.5 font-bold shrink-0 ml-2 cursor-pointer"
                  title="Clear documents"
                >
                  <FiX size={14} />
                </button>
              </div>
            )}

            {/* Scroll Down Trigger */}
            <AnimatePresence>
              {showScrollButton && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  onClick={() => scrollToBottom(true)}
                  className="absolute bottom-24 right-5 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-[#4A1620] text-white shadow-lg transition-all hover:bg-[#D97706]"
                >
                  <FiChevronDown size={15} />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Quick Action Suggestion Bar */}
            <div className="flex gap-1.5 px-3 py-1.5 overflow-x-auto no-scrollbar border-t border-slate-200/80 bg-white shrink-0">
              {QUICK_SUGGESTIONS.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => handleSuggestion(s.query)}
                  className={`flex items-center gap-1 shrink-0 rounded-xl border bg-gradient-to-r ${s.color} px-2.5 py-0.5 text-[10px] font-bold shadow-xs hover:scale-105 transition-all cursor-pointer`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Creative + Option Popover Menu */}
            <AnimatePresence>
              {showPlusMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.92 }}
                  className="absolute bottom-14 left-4 z-30 w-60 rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-xl p-2 shadow-2xl space-y-1"
                >
                  <p className="px-2.5 py-0.5 text-[9px] font-extrabold uppercase text-slate-400 tracking-wider">
                    AI Tools &amp; Engines
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all text-left cursor-pointer"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-100 text-blue-600 shrink-0">
                      <FiFileText size={14} />
                    </div>
                    <div>
                      <p className="leading-tight">Upload Document (RAG AI)</p>
                      <p className="text-[9px] font-normal text-slate-400">PDF, DOCX, PPT, TXT page Q&amp;A</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const newMode = !webSearchMode;
                      setWebSearchMode(newMode);
                      setShowPlusMenu(false);
                      toast(newMode ? "🌐 Web Search Engine Activated!" : "Standard AI Mode Active");
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-all text-left cursor-pointer"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 shrink-0">
                      <FiGlobe size={14} />
                    </div>
                    <div className="flex-1">
                      <p className="leading-tight flex items-center justify-between">
                        Web Search Engine {webSearchMode && <FiCheck size={13} className="text-emerald-600" />}
                      </p>
                      <p className="text-[9px] font-normal text-slate-400">Online real-time queries</p>
                    </div>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chat Input Form */}
            <form
              onSubmit={handleSend}
              className="flex shrink-0 items-center gap-1.5 border-t border-slate-200/80 bg-white px-2.5 py-2.5"
            >
              {/* Creative + Toggle Button */}
              <button
                type="button"
                onClick={() => setShowPlusMenu(!showPlusMenu)}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 shadow-xs cursor-pointer ${
                  showPlusMenu
                    ? "bg-[#4A1620] text-white rotate-45"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
                title="Document AI (+ Upload PDF/DOCX, Web Search)"
              >
                <FiPlus size={16} />
              </button>

              {/* Mic Voice Button */}
              <button
                type="button"
                onClick={toggleVoiceRecording}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl transition-all shadow-xs cursor-pointer ${
                  isRecording
                    ? "bg-rose-600 text-white animate-pulse ring-4 ring-rose-300"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
                title={isRecording ? "Stop Recording" : "Voice Recording"}
              >
                {isRecording ? <FiMicOff size={16} /> : <FiMic size={16} />}
              </button>

              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  isRecording
                    ? "Listening to voice..."
                    : webSearchMode
                    ? "Search web intelligence in real time..."
                    : activeDocs.length > 0
                    ? `Ask anything about ${activeDocs[0].fileName}...`
                    : "Talk to AI or ask anything..."
                }
                disabled={isLoading}
                className={`flex-1 rounded-2xl border px-3 py-2 text-xs text-[#4A1620] !text-[#4A1620] placeholder-slate-400 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#4A1620]/10 disabled:opacity-50 font-bold chat-input-field ${
                  webSearchMode
                    ? "border-blue-400 bg-blue-50/20 focus:border-blue-600"
                    : "border-slate-300 bg-white focus:border-[#4A1620]"
                }`}
              />

              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                aria-label="Send message to AI assistant"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-b from-[#61182A] to-[#4A1620] text-white shadow-md transition-all hover:from-[#7E2238] hover:to-[#61182A] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer focus-visible:ring-2 focus-visible:ring-[#F4C266]"
              >
                <FiSend size={15} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FLOATING LAUNCHER BUTTON (Fixed Bottom Right Corner) ── */}
      <motion.button
        type="button"
        onClick={toggleOpen}
        aria-label={isOpen ? "Close AI Chatbot" : "Open CS AI Assistant Chatbot"}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[90] flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-gradient-to-b from-[#61182A] to-[#3A101A] text-white shadow-2xl border-3 border-[#F4C266] transition-all duration-300 hover:shadow-[0_0_40px_rgba(217,119,6,0.5)] p-0.5 cursor-pointer"
      >
        {isOpen ? (
          <FiX size={26} />
        ) : (
          <div className="relative flex items-center justify-center w-full h-full">
            <CSAIAgentLogo size={68} />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#D97706] border-2 border-white text-[9px] font-bold text-white shadow-sm">
              <FiZap size={10} />
            </span>
            {hasNewMessage && (
              <span className="absolute -left-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#D97706] text-[9px] font-bold text-white shadow-sm animate-pulse">
                ●
              </span>
            )}
          </div>
        )}
      </motion.button>
    </>
  );
}
