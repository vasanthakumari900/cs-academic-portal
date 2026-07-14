// src/components/chatbot/ChatBot.jsx
// Floating AI Chatbot — glassmorphism design, Gemini API, local chat history.

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { FiMessageSquare, FiX, FiSend, FiMaximize2, FiMinimize2, FiTrash2, FiChevronDown, FiMessageCircle } from "react-icons/fi";
import { sendMessage, isAiConfigured } from "../../services/groqService";
import CSAIAgentLogo from "./CSAIAgentLogo";

const STORAGE_KEY = "cs_portal_chat_history";
const MAX_STORED_MSGS = 100;

// ─── Quick suggestions ───
const QUICK_SUGGESTIONS = [
  { label: "📚 Notes", query: "Where can I find lecture notes?" },
  { label: "🎥 Videos", query: "How do I access video lectures?" },
  { label: "📄 CIA Papers", query: "Where are the CIA question papers?" },
  { label: "💼 Placements", query: "Tell me about placement opportunities" },
  { label: "❓ Help", query: "What can you help me with?" },
];

// ─── Format timestamp ───
function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ─── Welcome message shown on first open ───
const WELCOME_MSG = {
  role: "assistant",
  content: "Hello! I'm your CS Academic Portal AI Assistant. How can I help you today?",
  timestamp: Date.now(),
};

// ─── Load chat history from localStorage ───
function loadHistory() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // corrupted data — reset
  }
  return [WELCOME_MSG];
}

// ─── Save chat history to localStorage ───
function saveHistory(messages) {
  try {
    const toStore = messages.slice(-MAX_STORED_MSGS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  } catch {
    // localStorage full — silently fail
  }
}

export default function ChatBot() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  const initialized = useRef(false);

  // ─── Initialize chat history ───
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      const history = loadHistory();
      setMessages(history);
    }
  }, []);

  // ─── Save history on every change ───
  useEffect(() => {
    if (initialized.current) {
      saveHistory(messages);
    }
  }, [messages]);

  // ─── Auto-scroll to bottom ───
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
      // Small delay to let the chat window animate in
      const t = setTimeout(() => scrollToBottom(true), 300);
      return () => clearTimeout(t);
    }
  }, [isOpen, scrollToBottom]);

  useEffect(() => {
    if (isOpen) scrollToBottom(true);
  }, [messages, isOpen, scrollToBottom]);

  // ─── Detect scroll position for scroll-to-bottom button ───
  const handleScroll = useCallback(() => {
    const el = chatContainerRef.current;
    if (!el) return;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    setShowScrollButton(!isNearBottom);
  }, []);

  // ─── Send message ───
  async function handleSend(e) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    setInput("");
    setIsLoading(true);

    const userMsg = { role: "user", content: text, timestamp: Date.now() };
    const updated = [...messages, userMsg];
    setMessages(updated);

    try {
      // Build history for API (without timestamps — just role + content)
      // Use `messages` (without the new one) since buildPrompt adds `text` as the latest user message
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

  // ─── Quick suggestion click ───
  function handleSuggestion(query) {
    setInput(query);
    // Focus the input after setting
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  // ─── Clear history ───
  function handleClear() {
    const fresh = [WELCOME_MSG];
    setMessages(fresh);
    saveHistory(fresh);
  }

  // ─── Toggle fullscreen ───
  function toggleFullscreen() {
    setIsFullscreen((prev) => !prev);
  }

  // ─── Open/close ───
  function toggleOpen() {
    setIsOpen((prev) => {
      if (!prev) {
        // Opening — focus input after animation
        setTimeout(() => inputRef.current?.focus(), 400);
        setHasNewMessage(false);
      }
      return !prev;
    });
  }

  // ─── Animate background dot on new message when closed ───
  useEffect(() => {
    if (!isOpen && messages.length > 1) {
      const last = messages[messages.length - 1];
      if (last.role === "assistant") {
        setHasNewMessage(true);
      }
    }
  }, [messages, isOpen]);

  // ─── Chat window dimensions ───
  const chatWidth = isFullscreen ? "w-[95vw] sm:w-[90vw] md:w-[80vw] lg:w-[70vw]" : "w-[calc(100vw-2rem)] sm:w-[380px]";
  const chatHeight = isFullscreen ? "h-[90vh] sm:h-[85vh]" : "h-[520px] sm:h-[560px]";
  const chatMaxWidth = isFullscreen ? "max-w-5xl" : "max-w-[420px]";

  // Don't show chatbot on auth pages
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/forgot-password";
  if (isAuthPage) return null;

  return (
    <>
      {/* ─── Floating action button (center-right) ─── */}
      <div className="fixed top-1/2 -translate-y-1/2 right-6 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`${chatWidth} ${chatMaxWidth} ${chatHeight} relative flex flex-col overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-xl`}
            >
              {/* ── Header ── */}
              <div className="flex shrink-0 items-center justify-between border-b border-[#0A3356] bg-[#0F4C81] px-4 py-3 text-white">
                <div className="flex items-center gap-2.5">
                  <CSAIAgentLogo size={34} />
                  <div className="leading-tight">
                    <p className="text-sm font-bold text-white">CS AI Agent</p>
                    <p className="text-[10px] text-white/80">
                      {isAiConfigured() ? "● Online" : "○ API key needed"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleClear}
                    className="rounded-lg p-1.5 text-white/70 transition-all hover:bg-white/10 hover:text-red-300"
                    title="Clear chat"
                  >
                    <FiTrash2 size={14} />
                  </button>
                  <button
                    onClick={toggleFullscreen}
                    className="rounded-lg p-1.5 text-white/70 transition-all hover:bg-white/10 hover:text-white"
                    title={isFullscreen ? "Minimise" : "Maximise"}
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

              {/* ── Messages ── */}
              <div
                ref={chatContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto space-y-3 px-4 py-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent bg-[#F8FAFC]"
              >
                {messages.length === 1 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {QUICK_SUGGESTIONS.map((s) => (
                      <button
                        key={s.label}
                        onClick={() => handleSuggestion(s.query)}
                        className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#4B5563] transition-all hover:border-[#1E88E5]/40 hover:bg-[#F0F4F8] hover:text-[#0F4C81] active:scale-95"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                )}

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
                      <p
                        className={`mt-1 text-[10px] text-right ${
                          msg.role === "user" ? "text-white/70" : "text-[#6B7280]"
                        }`}
                      >
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
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

              {/* ── Scroll to bottom button ── */}
              <AnimatePresence>
                {showScrollButton && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onClick={() => scrollToBottom(true)}
                    className="absolute bottom-16 right-6 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-[#0F4C81] text-white shadow-md transition-all hover:bg-[#1E88E5]"
                  >
                    <FiChevronDown size={14} />
                  </motion.button>
                )}
              </AnimatePresence>

              {/* ── Input ── */}
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
                  className="flex-1 rounded-lg border border-[#E5E7EB] bg-slate-50 px-3.5 py-2.5 text-sm text-[#1F2937] placeholder-slate-400 outline-none transition-all focus:border-[#0F4C81] focus:bg-white focus:ring-1 focus:ring-[#0F4C81]/15 disabled:opacity-50"
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

        {/* ── FAB ── */}
        <motion.button
          onClick={toggleOpen}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#DC2626] text-white shadow-lg border-2 border-white transition-all hover:bg-[#B91C1C]"
        >
          {isOpen ? (
            <FiX size={22} />
          ) : (
            <>
              <FiMessageCircle size={24} />
              {hasNewMessage && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[8px] font-bold text-white shadow-md">
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
