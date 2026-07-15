// src/components/chatbot/ChatBot.jsx
// Floating AI Chatbot upgraded with smart navigation assistant redirections and student year lock constraints.

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  FiX, FiSend, FiMaximize2, FiMinimize2, FiTrash2, 
  FiChevronDown, FiMessageCircle 
} from "react-icons/fi";
import { sendMessage, isAiConfigured } from "../../services/groqService";
import { useAuth } from "../../context/AuthContext";
import { CURRICULUM } from "../../utils/curriculum";
import CSAIAgentLogo from "./CSAIAgentLogo";

const STORAGE_KEY = "cs_portal_chat_history";
const MAX_STORED_MSGS = 100;

// Subject lookup mapping to resolve natural language and abbreviations to curriculum titles
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
  "maths ii": "MATHEMATICS PAPER - II",
  "java": "JAVA PROGRAMMING",
  "web technology": "WEB TECHNOLOGY",
  "wt": "WEB TECHNOLOGY",
  "stats 1": "STATISTICAL METHODS FOR COMPUTER SCIENCE - I",
  "stats i": "STATISTICAL METHODS FOR COMPUTER SCIENCE - I",
  "operating system": "OPERATING SYSTEM",
  "os": "OPERATING SYSTEM",
  "react": "REACT",
  "android": "ANDROID APP DEVELOPMENT",
  "software engineering": "SOFTWARE ENGINEERING",
  "se": "SOFTWARE ENGINEERING",
  "stats 2": "STATISTICAL METHODS FOR COMPUTER SCIENCE - II",
  "stats ii": "STATISTICAL METHODS FOR COMPUTER SCIENCE - II",
  "artificial intelligence": "ARTIFICIAL INTELLIGENCE AND EXPERT SYSTEM",
  "ai": "ARTIFICIAL INTELLIGENCE AND EXPERT SYSTEM",
  "data mining": "DATA MINING TECHNIQUES",
  "dm": "DATA MINING TECHNIQUES",
  "asp.net": "ASP.NET",
  "net": "ASP.NET",
  "dbms": "DATABASE MANAGEMENT SYSTEM",
  "database": "DATABASE MANAGEMENT SYSTEM",
  "php": "PROGRAMMING IN PHP",
  "cloud": "CLOUD COMPUTING",
  "cloud computing": "CLOUD COMPUTING",
  "networks": "COMPUTER NETWORKS",
  "computer networks": "COMPUTER NETWORKS",
  "cn": "COMPUTER NETWORKS",
  "data science": "INTRODUCTION TO DATA SCIENCE",
  "image processing": "DIGITAL IMAGE PROCESSING",
  "uml": "UNIFIED MODELING LANGUAGE"
};

// Permanent Quick Action buttons
const QUICK_SUGGESTIONS = [
  { label: "📚 Lecture Notes", query: "notes" },
  { label: "🎥 Lecture Videos", query: "videos" },
  { label: "📄 CIA Papers", query: "cia papers" },
  { label: "📁 Prev Papers", query: "previous year question papers" },
  { label: "💼 Placements", query: "placements" },
];

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const WELCOME_MSG = {
  role: "assistant",
  content: "Hello! I'm your CS Academic Portal AI Assistant. Ask me to open Notes, Videos, CIA Papers, or Placement opportunities and I'll redirect you!",
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
    // silently fail
  }
  return [WELCOME_MSG];
}

function saveHistory(messages) {
  try {
    const toStore = messages.slice(-MAX_STORED_MSGS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  } catch {
    // silently fail
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
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [lastSubject, setLastSubject] = useState(null);

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  const initialized = useRef(false);

  // Initialize history
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      setMessages(loadHistory());
    }
  }, []);

  // Save history on change
  useEffect(() => {
    if (initialized.current) {
      saveHistory(messages);
    }
  }, [messages]);

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
    
    // 1. Identify Subject in query
    let detectedSubject = null;
    let detectedYear = null;
    let detectedSem = null;
    
    for (const key of Object.keys(SUBJECT_MAP)) {
      if (cleanText.includes(key)) {
        detectedSubject = SUBJECT_MAP[key];
        break;
      }
    }
    
    // Retrieve subject memory context if applicable
    if (!detectedSubject && lastSubject) {
      detectedSubject = lastSubject;
    }
    
    // Find curriculum structure for the detected subject
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
    
    // 2. Year-wise filter restrictions for students
    const isStudent = user && user.role === "student";
    if (isStudent && detectedYear && detectedYear !== parseInt(user.year)) {
      const yrLabel = detectedYear === 1 ? "1st" : detectedYear === 2 ? "2nd" : "3rd";
      const studentLabel = user.year === 1 ? "1st" : user.year === 2 ? "2nd" : "3rd";
      return {
        shouldNavigate: false,
        message: `Oops! **${detectedSubject}** is a ${yrLabel}-year course. As a ${studentLabel}-year student, you are restricted to your current curriculum filters to keep things organized.`
      };
    }
    
    // 3. Update memory context
    if (detectedSubject) {
      setLastSubject(detectedSubject);
    }
    
    // 4. Match Categories
    let route = null;
    let categoryLabel = "";
    
    const isNotes = /notes\b|lecture notes\b|study material/i.test(cleanText);
    const isVideos = /videos\b|e-content\b|lecture videos\b|watch\b|play\b/i.test(cleanText);
    const isCia = /cia\b/i.test(cleanText);
    const isPyq = /previous year\b|semester papers\b|past papers\b|semester question\b/i.test(cleanText);
    const isPlacements = /placement\b|jobs\b|drives\b|careers\b/i.test(cleanText);
    const isProfile = /profile\b|my details\b/i.test(cleanText);
    const isFaculty = /faculty\b|teachers\b/i.test(cleanText);
    
    if (isNotes) {
      route = isStudent ? "/student/notes" : "/notes";
      categoryLabel = "Lecture Notes";
    } else if (isVideos) {
      route = isStudent ? "/student/videos" : "/e-content";
      categoryLabel = "Lecture Videos";
    } else if (isCia) {
      route = isStudent ? "/student/cia-question-papers" : "/cia-question-papers";
      categoryLabel = "CIA Question Papers";
    } else if (isPyq) {
      route = isStudent ? "/student/question-papers" : "/question-papers";
      categoryLabel = "Previous Year Question Papers";
    } else if (isPlacements) {
      route = isStudent ? "/student/placements" : "/placements";
      categoryLabel = "Placements";
    } else if (isProfile) {
      route = "/student/profile";
      categoryLabel = "Student Profile";
    } else if (isFaculty) {
      route = "/about";
      categoryLabel = "Faculty Members";
    }
    
    if (route) {
      // Redirection execution
      if (isFaculty) {
        navigate(route + "#faculty");
      } else {
        navigate(route, {
          state: {
            year: detectedYear || (isStudent ? parseInt(user.year) : null),
            semester: detectedSem,
            subject: detectedSubject
          }
        });
      }
      
      let msg = `Sure! I am navigating you directly to the **${categoryLabel}** page.`;
      if (detectedSubject) {
        msg += ` I've automatically configured filters for **${detectedSubject}** (Year ${detectedYear}, Semester ${detectedSem}) based on your request.`;
      } else if (isStudent) {
        msg += ` I've preselected your cohort (Year ${user.year}).`;
      }
      return { shouldNavigate: true, message: msg };
    }
    
    return null;
  };

  // Send message
  async function handleSend(e) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    setInput("");
    setIsLoading(true);

    const userMsg = { role: "user", content: text, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);

    // 1. Process navigation redirects
    const navResult = handleNavigationResolve(text);
    if (navResult) {
      const botMsg = { role: "assistant", content: navResult.message, timestamp: Date.now() };
      setMessages((prev) => [...prev, botMsg]);
      setIsLoading(false);
      return;
    }

    // 2. Chatbot fallback API
    try {
      const apiHistory = messages.map(({ role, content }) => ({ role, content }));
      const reply = await sendMessage(apiHistory, text);
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

  // Quick Action Button Trigger (Sends immediately)
  function handleSuggestion(query) {
    setInput("");
    setIsLoading(true);
    const userMsg = { role: "user", content: `Open ${query}`, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    
    const navResult = handleNavigationResolve(query);
    if (navResult) {
      const botMsg = { role: "assistant", content: navResult.message, timestamp: Date.now() };
      setMessages((prev) => [...prev, botMsg]);
      setIsLoading(false);
      return;
    }
    
    sendMessage(messages.map(({ role, content }) => ({ role, content })), query).then(reply => {
      const botMsg = { role: "assistant", content: reply, timestamp: Date.now() };
      setMessages((prev) => [...prev, botMsg]);
      setIsLoading(false);
    }).catch(() => {
      const errMsg = { role: "assistant", content: "Sorry, I encountered an error. Please try again.", timestamp: Date.now() };
      setMessages((prev) => [...prev, errMsg]);
      setIsLoading(false);
    });
  }

  function handleClear() {
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

  const chatWidth = isFullscreen ? "w-[95vw] sm:w-[90vw] md:w-[80vw] lg:w-[70vw]" : "w-[calc(100vw-2rem)] sm:w-[380px]";
  const chatHeight = isFullscreen ? "h-[90vh] sm:h-[85vh]" : "h-[520px] sm:h-[560px]";
  const chatMaxWidth = isFullscreen ? "max-w-5xl" : "max-w-[420px]";

  const isAuthPage = location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/forgot-password";
  if (isAuthPage) return null;

  return (
    <>
      {/* Floating Action wrapper (repositioned to bottom-right corner) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`${chatWidth} ${chatMaxWidth} ${chatHeight} relative flex flex-col overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-xl`}
            >
              {/* Header */}
              <div className="flex shrink-0 items-center justify-between border-b border-[#0A3356] bg-[#0F4C81] px-4 py-3 text-white">
                <div className="flex items-center gap-2.5">
                  <CSAIAgentLogo size={34} />
                  <div className="leading-tight">
                    <p className="text-sm font-bold text-white">CS AI Agent</p>
                    <p className="text-[10px] text-white/80">
                      {isAiConfigured() ? "● Smart Assistant" : "○ Local Assistant"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleClear}
                    className="rounded-lg p-1.5 text-white/70 transition-all hover:bg-white/10 hover:text-red-300"
                    title="Clear history"
                  >
                    <FiTrash2 size={14} />
                  </button>
                  <button
                    onClick={toggleFullscreen}
                    className="rounded-lg p-1.5 text-white/70 transition-all hover:bg-white/10 hover:text-white"
                    title={isFullscreen ? "Minimize" : "Maximize"}
                  >
                    {isFullscreen ? <FiMinimize2 size={14} /> : <FiMaximize2 size={14} />}
                  </button>
                  <button
                    onClick={toggleOpen}
                    className="rounded-lg p-1.5 text-white/70 transition-all hover:bg-white/10 hover:text-white"
                    title="Close"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              </div>

              {/* Messages Panel */}
              <div
                ref={chatContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto space-y-3 px-4 py-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent bg-[#F8FAFC]"
              >
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg px-3.5 py-2.5 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-[#0F4C81] text-white shadow-sm"
                          : "bg-white text-[#4B5563] border border-[#E5E7EB] shadow-sm"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      <p className={`mt-1 text-[10px] text-right ${msg.role === "user" ? "text-white/70" : "text-[#6B7280]"}`}>
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {isLoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                    <div className="rounded-lg bg-white px-4 py-3 border border-[#E5E7EB] shadow-sm">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-[#0F4C81]" style={{ animationDelay: "0ms" }} />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-[#0F4C81]" style={{ animationDelay: "150ms" }} />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-[#0F4C81]" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Floating scroll-down trigger */}
              <AnimatePresence>
                {showScrollButton && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onClick={() => scrollToBottom(true)}
                    className="absolute bottom-28 right-6 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-[#0F4C81] text-white shadow-sm transition-all hover:bg-[#1E88E5]"
                  >
                    <FiChevronDown size={14} />
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Persistent Quick Action Row */}
              <div className="flex gap-2 px-3 py-2 overflow-x-auto scrollbar-none border-t border-[#E5E7EB] bg-white/40 shrink-0">
                {QUICK_SUGGESTIONS.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => handleSuggestion(s.query)}
                    className="flex items-center gap-1.5 shrink-0 rounded-lg border border-[#E5E7EB] bg-white/90 px-2.5 py-1.5 text-[10px] font-bold text-[#0F4C81] hover:border-[#1E88E5]/30 hover:bg-slate-100 transition-all duration-200"
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Chat Input form */}
              <form
                onSubmit={handleSend}
                className="flex shrink-0 items-center gap-2 border-t border-[#E5E7EB] bg-white px-3 py-3"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything about the portal..."
                  disabled={isLoading}
                  className="flex-1 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-3.5 py-2.5 text-sm text-[#0F4C81] placeholder-slate-450 outline-none transition-all focus:border-[#0F4C81] focus:bg-white/90 focus:ring-1 focus:ring-[#0F4C81]/15 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0F4C81] text-white shadow-sm transition-all hover:bg-[#1E88E5] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <FiSend size={16} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Button */}
        <motion.button
          onClick={toggleOpen}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#1E88E5] text-white shadow-sm border-2 border-white transition-all hover:bg-[#2563EB]"
        >
          {isOpen ? (
            <FiX size={22} />
          ) : (
            <>
              <FiMessageCircle size={24} />
              {hasNewMessage && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[8px] font-bold text-white shadow-sm">
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
