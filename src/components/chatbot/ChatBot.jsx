// src/components/chatbot/ChatBot.jsx
// Creative, State-of-the-Art AI Study Assistant Chatbot with Document AI (RAG Page-Grounded QA), Voice Recording, AI Image Generator, Web Search & Navigation.

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  FiX, FiSend, FiMaximize2, FiMinimize2, FiTrash2, 
  FiChevronDown, FiMessageCircle, FiMic, FiMicOff, 
  FiPlus, FiFileText, FiImage, FiGlobe, FiPaperclip, FiCpu, FiCheck, FiZap, FiDownload, FiBook
} from "react-icons/fi";
import { sendMessage, isAiConfigured, generateAiImageUrl } from "../../services/groqService";
import { uploadFile } from "../../services/storageService";
import { parseUploadedDocument } from "../../utils/documentParser";
import { 
  addDocumentToRAG, 
  answerQuestionFromDocuments, 
  getActiveDocuments, 
  clearActiveDocuments 
} from "../../services/ragService";
import { useAuth } from "../../context/AuthContext";
import { CURRICULUM } from "../../utils/curriculum";
import CSAIAgentLogo from "./CSAIAgentLogo";
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
  content: "✨ Hello! I'm your CS AI Study Assistant. Click 📄 `+` to Upload PDF/DOCX Notes for Page-Grounded AI Q&A (RAG), click 🎙️ to talk with Voice, or Generate AI Images & Web Search!",
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

  // Advanced features & RAG state
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
      alert("Speech recognition is not supported in your browser. Please type your message.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
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
      for (const yKey of Object.keys(CURRICULUM)) {
        const yr = CURRICULUM[yKey];
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
      // 1. Upload file to Firebase Storage in background
      uploadFile(file, `documentAI_uploads/${user?.uid || "guest"}/${Date.now()}_${file.name}`).catch(() => {});

      // 2. Extract page-by-page text content
      const docData = await parseUploadedDocument(file, (current, total) => {
        setParseProgress({
          current,
          total,
          percent: Math.round((current / total) * 100),
          fileName: file.name,
        });
      });

      // 3. Add to RAG Session Index
      await addDocumentToRAG(docData, user?.uid || "guest");
      setActiveDocs([...getActiveDocuments()]);

      // 4. Create User Message
      const userMsg = {
        role: "user",
        content: `📄 Uploaded Academic Document: "${file.name}"`,
        timestamp: Date.now(),
      };

      // 5. Create Document Summary Card in Chat
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

  // Process Image Generation option from + menu
  const handleCreateImagePrompt = () => {
    const prompt = prompt("Enter a description for the AI Visual Image you want to generate:");
    setShowPlusMenu(false);
    if (!prompt) return;

    const imageUrl = generateAiImageUrl(prompt);
    const userMsg = { role: "user", content: `🎨 Generate AI Image: "${prompt}"`, timestamp: Date.now() };
    const botMsg = {
      role: "assistant",
      content: `Here is the generated visual render for **"${prompt}"**:`,
      imageUrl: imageUrl,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg, botMsg]);
  };

  // Send message handler
  async function handleSend(e) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    setInput("");
    setShowPlusMenu(false);
    setIsLoading(true);

    let formattedText = text;
    if (webSearchMode) {
      formattedText = `🌐 [Web Search Query]: ${text}`;
    }

    const userMsg = { role: "user", content: text, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);

    // 1. Check if RAG Document AI has active documents attached
    if (activeDocs.length > 0 && !webSearchMode) {
      try {
        const apiHistory = messages.map(({ role, content }) => ({ role, content }));
        const reply = await answerQuestionFromDocuments(formattedText, apiHistory);
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

    // 2. Navigation redirect if not RAG & not web search
    if (!webSearchMode) {
      const navResult = handleNavigationResolve(text);
      if (navResult) {
        const botMsg = { role: "assistant", content: navResult.message, timestamp: Date.now() };
        setMessages((prev) => [...prev, botMsg]);
        setIsLoading(false);
        return;
      }
    }

    // 3. General AI Service Call
    try {
      const apiHistory = messages.map(({ role, content }) => ({ role, content }));
      const reply = await sendMessage(apiHistory, formattedText, "");
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
  }

  function handleClear() {
    clearActiveDocuments();
    setActiveDocs([]);
    const fresh = [WELCOME_MSG];
    setMessages(fresh);
    saveHistory(fresh);
  }

  function toggleFullscreen() {
    setIsFullscreen((prev) => !prev);
  }

  function toggleOpen() {
    setIsOpen((prev) => {
      if (!prev) {
        setTimeout(() => inputRef.current?.focus(), 400);
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

  const chatWidth = isFullscreen ? "w-[95vw] sm:w-[90vw] md:w-[80vw] lg:w-[70vw]" : "w-[calc(100vw-2rem)] sm:w-[420px]";
  const chatHeight = isFullscreen ? "h-[90vh] sm:h-[85vh]" : "h-[560px] sm:h-[600px]";
  const chatMaxWidth = isFullscreen ? "max-w-5xl" : "max-w-[460px]";

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

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
              transition={{ type: "spring", damping: 22, stiffness: 280 }}
              className={`${chatWidth} ${chatMaxWidth} ${chatHeight} relative flex flex-col overflow-hidden rounded-3xl border border-white/40 bg-white/95 shadow-2xl backdrop-blur-xl`}
            >
              {/* Creative Glassmorphic Gradient Header */}
              <div className="relative flex shrink-0 items-center justify-between border-b border-white/20 bg-gradient-to-r from-[#021C4F] via-[#0B3C91] to-[#C50337] px-4 py-3.5 text-white shadow-md">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <CSAIAgentLogo size={36} />
                    <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-emerald-400 ring-2 ring-white">
                      <span className="h-1.5 w-1.5 animate-ping rounded-full bg-white opacity-75" />
                    </span>
                  </div>
                  <div className="leading-tight text-left">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-extrabold text-white tracking-wide">CS AI Document Assistant</p>
                      {activeDocs.length > 0 && (
                        <span className="flex items-center gap-1 rounded-full bg-emerald-400/20 px-2 py-0.5 text-[9px] font-bold text-emerald-200 border border-emerald-300/30">
                          <FiBook size={10} /> Document AI Active ({activeDocs.length})
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-white/80 flex items-center gap-1 mt-0.5 font-medium">
                      <FiZap className="text-amber-300 animate-pulse" size={11} />
                      {activeDocs.length > 0 ? `RAG Page-Grounded QA (${activeDocs[0].totalPages} Pages)` : "Groq Llama 3.3 Engine Active"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={handleClear}
                    className="rounded-xl p-1.5 text-white/70 transition-all hover:bg-white/15 hover:text-rose-200"
                    title="Clear chat and document context"
                  >
                    <FiTrash2 size={14} />
                  </button>
                  <button
                    onClick={toggleFullscreen}
                    className="rounded-xl p-1.5 text-white/70 transition-all hover:bg-white/15 hover:text-white"
                    title={isFullscreen ? "Minimize" : "Maximize"}
                  >
                    {isFullscreen ? <FiMinimize2 size={14} /> : <FiMaximize2 size={14} />}
                  </button>
                  <button
                    onClick={toggleOpen}
                    className="rounded-xl p-1.5 text-white/70 transition-all hover:bg-white/15 hover:text-white"
                    title="Close"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              </div>

              {/* Messages Feed */}
              <div
                ref={chatContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto space-y-3.5 px-4 py-4 bg-gradient-to-b from-slate-50 to-slate-100/70"
              >
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.25 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-sm transition-all ${
                        msg.role === "user"
                          ? "bg-gradient-to-br from-[#021C4F] to-[#0A369D] text-white shadow-blue-900/10 rounded-br-xs"
                          : "bg-white text-slate-800 border border-slate-200/80 border-l-4 border-l-[#C50337] rounded-bl-xs"
                      }`}
                    >
                      <p className="whitespace-pre-wrap font-sans">{msg.content}</p>

                      {/* Render generated image if present */}
                      {msg.imageUrl && (
                        <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-900 group relative">
                          <img
                            src={msg.imageUrl}
                            alt="AI Concept"
                            className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                          <a
                            href={msg.imageUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="absolute bottom-2 right-2 flex items-center gap-1 rounded-lg bg-black/60 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-white hover:bg-black/80 transition-all"
                          >
                            <FiDownload size={12} /> View Full
                          </a>
                        </div>
                      )}

                      <p className={`mt-1 text-[9px] text-right font-medium ${msg.role === "user" ? "text-white/60" : "text-slate-400"}`}>
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {/* Parsing Progress Bar Card */}
                {parseProgress && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-3.5 border border-blue-200 shadow-md space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-[#021C4F]">
                        <span className="truncate flex items-center gap-1.5">
                          <FiFileText className="animate-bounce text-blue-600" />
                          Processing {parseProgress.fileName}
                        </span>
                        <span className="text-blue-700">{parseProgress.percent}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-200 rounded-full"
                          style={{ width: `${parseProgress.percent}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium text-right">
                        Extracting Page {parseProgress.current} of {parseProgress.total}...
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Animated Voice Equalizer Wave when Recording */}
                {isRecording && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center py-2">
                    <div className="flex items-center gap-1.5 rounded-full bg-rose-50 px-4 py-2 border border-rose-200 text-rose-700 shadow-sm text-xs font-bold">
                      <FiMic className="animate-pulse text-rose-600" size={14} />
                      Listening to your voice...
                    </div>
                  </motion.div>
                )}

                {/* AI Thinking Animation */}
                {isLoading && !parseProgress && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                    <div className="rounded-2xl bg-white px-4 py-3 border border-slate-200 border-l-4 border-l-[#C50337] shadow-sm">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#021C4F]">
                        <FiCpu className="animate-spin text-[#C50337]" size={15} />
                        {activeDocs.length > 0 ? "Searching document pages & citing citations..." : "Synthesizing response..."}
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Active Document Chips Bar */}
              {activeDocs.length > 0 && (
                <div className="flex items-center justify-between bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 px-3.5 py-2 text-xs text-emerald-900 border-t border-emerald-100">
                  <div className="flex items-center gap-1.5 overflow-x-auto truncate">
                    <FiPaperclip size={13} className="text-emerald-600 shrink-0" />
                    <span className="font-bold shrink-0">Attached Documents:</span>
                    {activeDocs.map((doc, idx) => (
                      <span key={idx} className="bg-white border border-emerald-200 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-extrabold shrink-0">
                        📄 {doc.fileName} ({doc.totalPages} Pgs)
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      clearActiveDocuments();
                      setActiveDocs([]);
                      toast.success("Cleared document context");
                    }}
                    className="text-emerald-700 hover:text-rose-600 p-1 font-bold shrink-0 ml-2"
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
                    className="absolute bottom-28 right-6 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#021C4F] text-white shadow-lg transition-all hover:bg-[#C50337]"
                  >
                    <FiChevronDown size={16} />
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Quick Action Suggestion Bar */}
              <div className="flex gap-2 px-3 py-2 overflow-x-auto no-scrollbar border-t border-slate-200/80 bg-white shrink-0">
                {QUICK_SUGGESTIONS.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => handleSuggestion(s.query)}
                    className={`flex items-center gap-1.5 shrink-0 rounded-xl border bg-gradient-to-r ${s.color} px-3 py-1 text-[11px] font-bold shadow-xs hover:scale-105 transition-all`}
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
                    className="absolute bottom-16 left-4 z-30 w-64 rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-xl p-2.5 shadow-2xl space-y-1"
                  >
                    <p className="px-3 py-1 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                      Document AI &amp; Creative Tools
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-all text-left"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-600 shrink-0">
                        <FiFileText size={15} />
                      </div>
                      <div>
                        <p className="leading-tight">Upload Document (RAG AI)</p>
                        <p className="text-[10px] font-normal text-slate-400">PDF, DOCX, PPT, TXT page Q&amp;A</p>
                      </div>
                    </button>
                    <button
                      onClick={handleCreateImagePrompt}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition-all text-left"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100 text-purple-600 shrink-0">
                        <FiImage size={15} />
                      </div>
                      <div>
                        <p className="leading-tight">Generate AI Image</p>
                        <p className="text-[10px] font-normal text-slate-400">Create visual renders</p>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setWebSearchMode(!webSearchMode);
                        setShowPlusMenu(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-all text-left"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 shrink-0">
                        <FiGlobe size={15} />
                      </div>
                      <div className="flex-1">
                        <p className="leading-tight flex items-center justify-between">
                          Web Search Engine {webSearchMode && <FiCheck size={14} className="text-emerald-600" />}
                        </p>
                        <p className="text-[10px] font-normal text-slate-400">Online real-time queries</p>
                      </div>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Chat Input Form */}
              <form
                onSubmit={handleSend}
                className="flex shrink-0 items-center gap-2 border-t border-slate-200/80 bg-white px-3 py-3"
              >
                {/* Creative + Toggle Button */}
                <button
                  type="button"
                  onClick={() => setShowPlusMenu(!showPlusMenu)}
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 shadow-xs ${
                    showPlusMenu
                      ? "bg-[#021C4F] text-white rotate-45"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                  title="Document AI (+ Upload PDF/DOCX, AI Image, Web Search)"
                >
                  <FiPlus size={18} />
                </button>

                {/* Mic Voice Button */}
                <button
                  type="button"
                  onClick={toggleVoiceRecording}
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition-all shadow-xs ${
                    isRecording
                      ? "bg-rose-600 text-white animate-pulse ring-4 ring-rose-300"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                  title={isRecording ? "Stop Recording" : "Voice Recording"}
                >
                  {isRecording ? <FiMicOff size={18} /> : <FiMic size={18} />}
                </button>

                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    isRecording
                      ? "Listening to voice..."
                      : activeDocs.length > 0
                      ? `Ask anything about ${activeDocs[0].fileName}...`
                      : webSearchMode
                      ? "Search web intelligence..."
                      : "Talk to AI or ask anything..."
                  }
                  disabled={isLoading}
                  className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs sm:text-sm text-[#021C4F] placeholder-slate-400 outline-none transition-all focus:border-[#021C4F] focus:bg-white focus:ring-2 focus:ring-[#021C4F]/10 disabled:opacity-50 font-medium"
                />

                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#021C4F] text-white shadow-md transition-all hover:bg-[#C50337] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <FiSend size={16} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Creative Chat Toggle Launcher */}
        <motion.button
          onClick={toggleOpen}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[#021C4F] via-[#0B3C91] to-[#C50337] text-white shadow-2xl border-2 border-white transition-all duration-300 hover:shadow-rose-900/30"
        >
          {isOpen ? (
            <FiX size={22} />
          ) : (
            <>
              <FiMessageCircle size={24} />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 border border-white text-[8px] font-bold text-white shadow-xs">
                <FiZap size={9} />
              </span>
              {hasNewMessage && (
                <span className="absolute -left-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-400 text-[8px] font-bold text-slate-900 shadow-sm animate-pulse">
                  ●
                </span>
              )}
            </>
          )}
        </motion.button>
      </div>
    </>
  );
}
