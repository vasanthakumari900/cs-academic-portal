// src/components/notes/NotesSummarizer.jsx
// Complete & Fixed "Notes Summarizer" AI Assistant for CS Subjects with Multi-PDF Parsing, Voice Recording, Fixed Bottom Bar, and ChatGPT Experience.

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMic,
  FiMicOff,
  FiSend,
  FiUploadCloud,
  FiFileText,
  FiVolume2,
  FiVolumeX,
  FiZap,
  FiCpu,
  FiX,
  FiPaperclip,
  FiTrash2,
  FiMaximize2,
  FiMinimize2,
  FiBookOpen,
  FiPlus,
  FiCheck,
  FiAward
} from "react-icons/fi";
import { sendMessage } from "../../services/groqService";
import { parseUploadedDocument } from "../../utils/documentParser";
import FormattedMessage from "../chatbot/FormattedMessage";
import toast from "react-hot-toast";

// Circular Logo Emblem for Notes Summarizer AI
function NotesSummarizerLogo({ size = 44 }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="relative flex items-center justify-center rounded-full bg-gradient-to-br from-amber-400 via-rose-500 to-[#C50337] p-0.5 shadow-xl shadow-rose-900/30 shrink-0"
    >
      <div className="flex h-full w-full items-center justify-center rounded-full bg-[#021C4F] text-amber-300">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-3/5 w-3/5 text-amber-400 animate-pulse"
        >
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          <path d="M12 7v14" />
          <circle cx="12" cy="5" r="1.5" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}

const WELCOME_MSG = {
  role: "assistant",
  content:
    "✨ Welcome to **Notes Summarizer**!\n\nI am your ChatGPT-style CS Subject Tutor. I explain concepts simply with step-by-step breakdowns, code examples, ASCII diagrams, 2-mark, 5-mark, and 10-mark exam answers!\n\n**Supported CS Subjects**:\nPython · C++ · Java · DBMS · Operating Systems · Data Structures · Web Technology · Software Engineering · Android · ASP.NET · Data Mining · Artificial Intelligence · Computer Networks · Mathematics\n\n📌 **Tools at Bottom**:\n- 📄 **Upload PDF**: Click `+` or `Upload PDF` to attach lecture notes for exact page Q&A.\n- 🎙️ **Voice Input**: Click the mic to speak your doubts.\n- 💬 **Type Doubts**: Type any question below and press `Enter` to send!",
  timestamp: Date.now(),
};

export default function NotesSummarizer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // --- Multi-PDF Attachment State ---
  const [attachedDocs, setAttachedDocs] = useState([]); // array of parsed doc objects
  const [parseProgress, setParseProgress] = useState(null); // { current, total, percent, fileName }

  // --- Messages & Input ---
  const [messages, setMessages] = useState([WELCOME_MSG]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const textareaRef = useRef(null);

  // Voice Speech Recognition Setup
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

  const toggleMic = () => {
    if (!recognitionRef.current) {
      toast.error("Speech recognition is not supported in your browser.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        toast.success("Listening... Speak your question!");
      } catch (err) {
        console.error("Mic error:", err);
      }
    }
  };

  // Text to Speech
  const speakText = (text) => {
    if (!window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const cleanText = text.replace(/[*_#`~]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // Auto-scroll to bottom of messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, scrollToBottom]);

  // Upload & Parse PDF with Progress Indicator
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    for (const file of files) {
      setParseProgress({ current: 1, total: 1, percent: 10, fileName: file.name });

      try {
        const parsed = await parseUploadedDocument(file, (current, total) => {
          setParseProgress({
            current,
            total,
            percent: Math.round((current / total) * 100),
            fileName: file.name,
          });
        });

        setAttachedDocs((prev) => [...prev, parsed]);
        toast.success(`PDF "${file.name}" loaded (${parsed.totalPages} Pages)! 📄`);

        // Generate quick summary for chat
        const summaryPrompt = `Analyze the uploaded PDF "${file.name}" (${parsed.totalPages} Pages) and generate a simple, easy-to-understand 5-bullet summary with key formulas & exam points:\n\n${parsed.fullText.slice(0, 3500)}`;
        const summaryResult = await sendMessage([], summaryPrompt, "");

        const docMsg = {
          role: "assistant",
          content: `📄 **Uploaded PDF**: "${file.name}" (${parsed.totalPages} Pages, ${parsed.wordCount} Words)\n\n### 📝 Quick Summary & Takeaways:\n${summaryResult}\n\n💬 **Notes Summarizer Active**: Ask any doubt about this document. I will prioritize answering from your uploaded PDF!`,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, docMsg]);
        setIsOpen(true);
      } catch (err) {
        console.error("PDF Parsing error:", err);
        toast.error(`Could not read "${file.name}". Ensure it is a valid PDF or text file.`);
      } finally {
        setParseProgress(null);
      }
    }
  };

  // Remove attached PDF
  const removeDoc = (index) => {
    setAttachedDocs((prev) => prev.filter((_, i) => i !== index));
    toast.success("Removed PDF attachment.");
  };

  // Send Message with CS Subject Tutor & PDF Context Prompt
  const handleSend = async (e) => {
    e?.preventDefault();
    const query = input.trim();
    if (!query || isLoading) return;

    setInput("");
    setIsLoading(true);

    const userMsg = { role: "user", content: query, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));

      // Comprehensive CS Tutor System Guidelines
      let sysContext = `You are 'Notes Summarizer', an expert CS Subject AI Tutor specializing in: Python, C++, Java, DBMS, Operating Systems, Data Structures, Web Technology, Software Engineering, Android, ASP.NET, Data Mining, Artificial Intelligence, Computer Networks, and Mathematics.

EXPLANATION STYLE GUIDELINES:
1. Use very simple, clear English.
2. Explain step-by-step with bullet points.
3. Provide code/real-world examples where relevant.
4. Include clean ASCII diagrams or flowcharts when helpful.
5. Highlight key points, short notes, and exam tips.
6. Provide 2-mark (definition + point), 5-mark (detailed explanation + points), or 10-mark (comprehensive breakdown + diagram + code) style answers when requested.
7. Format clearly without raw unparsed markdown syntax.`;

      if (attachedDocs.length > 0) {
        const docTextCombined = attachedDocs
          .map((d) => `[DOCUMENT: "${d.fileName}"]\n${d.fullText.slice(0, 3000)}`)
          .join("\n\n");
        sysContext += `\n\n[ATTACHED PDF DOCUMENTS]:\n${docTextCombined}\n\nIMPORTANT: Prioritize answering the user's question directly and accurately from these uploaded PDF documents!`;
      }

      const rawReply = await sendMessage(history, query, sysContext);
      const botMsg = { role: "assistant", content: rawReply, timestamp: Date.now() };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("AI Send Error:", err);
      toast.error("Failed to generate response. Please try again.");
    } finally {
      setIsLoading(false);
      setTimeout(scrollToBottom, 100);
    }
  };

  // Handle Enter to send, Shift+Enter for newline
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  // Generate 5-Min Revision Quiz
  const handleGenerateQuiz = async () => {
    setIsLoading(true);

    const docText = attachedDocs.length > 0
      ? attachedDocs.map((d) => d.fullText).join(" ").slice(0, 3000)
      : "General CS Core Subjects (Python, Data Structures, Operating Systems, DBMS)";

    try {
      const prompt = `Generate a 3-question MCQ Revision Quiz.
Format clearly like this:
1. Question Text?
A) Option A
B) Option B
C) Option C
D) Option D

Answer & Explanation: ...`;

      const quizReply = await sendMessage([], prompt, docText);
      const botMsg = {
        role: "assistant",
        content: `🎯 **5-Minute Revision Quiz**:\n\n${quizReply}`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
      setTimeout(scrollToBottom, 100);
    }
  };

  const handleClear = () => {
    setAttachedDocs([]);
    setMessages([WELCOME_MSG]);
    toast.success("Cleared conversation & attachments.");
  };

  const modalWidth = isFullscreen
    ? "w-[95vw] md:w-[88vw] max-w-5xl h-[92vh]"
    : "w-[clamp(280px,90vw,375px)] h-[min(470px,calc(100vh-160px))]";

  return (
    <>
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".pdf,.txt,.doc,.docx"
        multiple
        className="hidden"
      />

      {/* CIRCULAR LAUNCHER BUTTON ON TOP RIGHT SIDE */}
      <div className="fixed top-20 right-4 sm:top-24 sm:right-8 z-50 flex flex-col items-end">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 15 }}
              transition={{ type: "spring", damping: 22, stiffness: 280 }}
              className={`${modalWidth} relative flex flex-col overflow-hidden rounded-3xl border border-white/40 bg-white/98 text-slate-900 shadow-2xl backdrop-blur-xl mb-2`}
            >
              {/* ChatGPT Header */}
              <div className="relative flex shrink-0 items-center justify-between border-b border-white/20 bg-gradient-to-r from-[#021C4F] via-[#0B3C91] to-[#C50337] px-4 py-3 text-white shadow-md">
                <div className="flex items-center gap-3">
                  <NotesSummarizerLogo size={42} />
                  <div className="leading-tight text-left">
                    <div className="flex items-center gap-2">
                      <p className="text-base font-extrabold text-white tracking-wide">Notes Summarizer</p>
                      {attachedDocs.length > 0 && (
                        <span className="flex items-center gap-1 rounded-full bg-emerald-400/20 px-2 py-0.5 text-[9px] font-bold text-emerald-200 border border-emerald-300/30">
                          <FiBookOpen size={10} /> {attachedDocs.length} PDF{attachedDocs.length > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-rose-100/90 flex items-center gap-1 mt-0.5 font-medium">
                      <FiZap className="text-amber-300 animate-pulse" size={11} />
                      ChatGPT CS Subject Tutor
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={handleClear}
                    className="rounded-xl p-1.5 text-white/70 transition-all hover:bg-white/15 hover:text-rose-200"
                    title="Clear history & documents"
                  >
                    <FiTrash2 size={14} />
                  </button>
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="rounded-xl p-1.5 text-white/70 transition-all hover:bg-white/15 hover:text-white"
                    title={isFullscreen ? "Minimize" : "Maximize"}
                  >
                    {isFullscreen ? <FiMinimize2 size={14} /> : <FiMaximize2 size={14} />}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="rounded-xl p-1.5 text-white/70 transition-all hover:bg-white/15 hover:text-white"
                    title="Close"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              </div>

              {/* Attached PDFs Chips Bar */}
              {attachedDocs.length > 0 && (
                <div className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 px-3.5 py-2 text-xs border-b border-emerald-100 overflow-x-auto shrink-0">
                  <FiPaperclip size={13} className="text-emerald-600 shrink-0" />
                  <span className="font-bold text-emerald-900 text-[10px] shrink-0">Attached:</span>
                  {attachedDocs.map((doc, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 bg-white border border-emerald-200 text-emerald-800 px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 shadow-xs"
                    >
                      📄 {doc.fileName}
                      <button
                        onClick={() => removeDoc(idx)}
                        className="text-emerald-600 hover:text-rose-600 ml-1 font-bold"
                      >
                        <FiX size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Messages Feed */}
              <div className="flex-1 overflow-y-auto space-y-3.5 px-4 py-4 bg-gradient-to-b from-slate-50 to-slate-100/70">
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-xs transition-all ${
                        msg.role === "user"
                          ? "bg-gradient-to-br from-[#021C4F] to-[#0A369D] text-white shadow-blue-900/10 rounded-br-xs font-sans"
                          : "bg-white text-slate-800 border border-slate-200 border-l-4 border-l-[#C50337] rounded-bl-xs"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      ) : (
                        <FormattedMessage content={msg.content} />
                      )}

                      {msg.role === "assistant" && (
                        <div className="mt-2 flex items-center justify-end">
                          <button
                            onClick={() => speakText(msg.content)}
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 hover:bg-amber-100 transition-all"
                          >
                            {isSpeaking ? <FiVolumeX size={12} /> : <FiVolume2 size={12} />}
                            {isSpeaking ? "Stop" : "Audio Reader"}
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* PDF Reading Progress Indicator Card */}
                {parseProgress && (
                  <div className="flex justify-start">
                    <div className="w-full max-w-xs rounded-2xl bg-white p-3 border border-blue-200 shadow-md space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-[#021C4F]">
                        <span className="truncate flex items-center gap-1">
                          <FiFileText className="animate-bounce text-blue-600" />
                          Reading {parseProgress.fileName}
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
                  </div>
                )}

                {/* AI Thinking Animation */}
                {isLoading && !parseProgress && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl bg-white px-4 py-3 border border-slate-200 border-l-4 border-l-[#C50337] text-xs font-bold text-[#021C4F] flex items-center gap-2">
                      <FiCpu className="animate-spin text-[#C50337]" size={16} />
                      {attachedDocs.length > 0 ? "Searching PDF pages & analyzing accurately..." : "Synthesizing response..."}
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* QUICK ACTION CHIPS (ALWAYS VISIBLE AT BOTTOM AREA) */}
              <div className="flex gap-2 px-3 py-2 overflow-x-auto no-scrollbar border-t border-slate-200/80 bg-slate-50 shrink-0">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 shrink-0 rounded-xl border border-amber-400 bg-amber-100 px-3 py-1.5 text-[11px] font-extrabold text-amber-950 hover:bg-amber-200 transition-all shadow-xs"
                >
                  <FiUploadCloud size={14} /> Upload PDF
                </button>
                <button
                  onClick={handleGenerateQuiz}
                  className="flex items-center gap-1.5 shrink-0 rounded-xl border border-rose-300 bg-rose-100 px-3 py-1.5 text-[11px] font-extrabold text-rose-950 hover:bg-rose-200 transition-all shadow-xs"
                >
                  🎯 5-Min Quiz
                </button>
                <button
                  onClick={() => setInput("Give 2-mark, 5-mark, and 10-mark exam notes for Python Data Structures")}
                  className="shrink-0 rounded-xl border border-blue-200 bg-white px-3 py-1.5 text-[11px] font-bold text-blue-900 hover:bg-blue-50 transition-all shadow-xs"
                >
                  📝 Exam Notes Style
                </button>
                <button
                  onClick={() => setInput("Explain Operating System Deadlocks with an ASCII diagram")}
                  className="shrink-0 rounded-xl border border-indigo-200 bg-white px-3 py-1.5 text-[11px] font-bold text-indigo-900 hover:bg-indigo-50 transition-all shadow-xs"
                >
                  📊 OS Diagram
                </button>
              </div>

              {/* FIXED STICKY BOTTOM INPUT BAR (NEVER DISAPPEARS / NEVER HIDDEN BEHIND FOOTER) */}
              <form
                onSubmit={handleSend}
                className="sticky bottom-0 z-20 flex shrink-0 items-center gap-1.5 border-t border-slate-200 bg-white p-2 sm:p-2.5 shadow-md"
              >
                {/* Upload PDF (+) Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-900 hover:bg-amber-200 transition-all shadow-xs"
                  title="Upload PDF / File"
                >
                  <FiPlus size={18} />
                </button>

                {/* Voice Record Mic Button */}
                <button
                  type="button"
                  onClick={toggleMic}
                  className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl transition-all shadow-xs ${
                    isRecording
                      ? "bg-rose-600 text-white animate-pulse ring-4 ring-rose-300"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                  title={isRecording ? "Stop Recording" : "Voice Input"}
                >
                  {isRecording ? <FiMicOff size={16} /> : <FiMic size={16} />}
                </button>

                {/* Multi-line Auto-expanding Textarea Input */}
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  placeholder={
                    attachedDocs.length > 0
                      ? `Ask doubt about "${attachedDocs[attachedDocs.length - 1].fileName.slice(0, 12)}..."`
                      : "Ask subject doubt (Python, Java, DBMS, OS)..."
                  }
                  className="flex-1 max-h-24 min-h-[38px] resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#021C4F] no-scrollbar"
                />

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-[#021C4F] text-white shadow-md hover:bg-[#0A369D] disabled:opacity-50 transition-all"
                  title="Send message (Enter)"
                >
                  <FiSend size={16} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* BIGGER CIRCULAR LAUNCHER BUTTON (TOP RIGHT SIDE) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#021C4F] via-[#0B3C91] to-[#C50337] text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white/80 cursor-pointer group ring-4 ring-amber-400/40"
          title="Notes Summarizer (Upload PDF, Voice Record, Type Doubts)"
        >
          <NotesSummarizerLogo size={48} />
          {attachedDocs.length > 0 && (
            <span className="absolute top-0 right-0 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-emerald-400 ring-2 ring-white">
              <span className="h-2.5 w-2.5 animate-ping rounded-full bg-white opacity-75" />
            </span>
          )}
        </button>
      </div>
    </>
  );
}
