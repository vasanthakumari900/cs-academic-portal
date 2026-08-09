// src/components/notes/NotesTopAiHeader.jsx
// Dedicated Notes AI Assistant with Large 3D Notebook Logo, Ultra High Contrast Chat Text, & Zero Window Scroll.

import { useState, useRef, useEffect } from "react";
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
  FiBookOpen,
  FiCpu,
  FiX,
  FiCopy,
  FiRefreshCw,
  FiTrash2,
  FiPaperclip,
  FiCheck,
  FiMaximize2,
  FiMinimize2,
  FiPlus,
  FiInfo
} from "react-icons/fi";
import { sendMessage } from "../../services/groqService";
import { parseUploadedDocument } from "../../utils/documentParser";
import FormattedMessage from "../chatbot/FormattedMessage";
import toast from "react-hot-toast";

// Official 3D Notebook & Pencil Logo for Notes AI Assistant
function NotesAIBrainLogo({ size = 42 }) {
  return (
    <img
      src="/notes-ai-logo.jpg"
      alt="Notes AI Assistant Logo"
      style={{ width: size, height: size }}
      className="rounded-2xl object-cover drop-shadow-md shrink-0 bg-white p-1 border-2 border-[#D97706] shadow-sm"
    />
  );
}

// Academic Subject & Non-Academic Query Checker
const CS_ACADEMIC_KEYWORDS = [
  "programming", "python", "java", "c++", "c", "dbms", "database", "sql", "operating system", "os",
  "data mining", "artificial intelligence", "ai", "asp.net", ".net", "web technology", "react", "node", "angular",
  "android", "mobile app", "software engineering", "computer networks", "networks", "data structures", "algorithms",
  "mathematics", "matrices", "calculus", "statistics", "uml", "cloud computing", "digital image processing",
  "data science", "syllabus", "unit", "lecture", "notes", "exam", "question", "definition", "code", "function",
  "array", "class", "object", "inheritance", "polymorphism", "recursion", "deadlock", "normalization", "sdlc",
  "agile", "query", "table", "pdf", "file", "explain", "summary", "formula", "derivative", "complexity", "time complexity",
  "space complexity", "dgvc", "sem", "semester", "cia", "test", "mark", "answer", "lab", "record", "hi", "hello", "hey"
];

const UNRELATED_TOPICS = [
  "movie", "cinema", "actor", "actress", "politics", "election", "politician", "party",
  "entertainment", "song", "music", "celebrity", "gossip", "joke", "dating", "relationship",
  "gaming", "game cheat", "sports match", "ipl", "cricket score", "football", "weather", "recipe"
];

function isAcademicQuery(query, hasUploadedPdf) {
  if (hasUploadedPdf) return true;
  const q = query.toLowerCase().trim();

  for (const topic of UNRELATED_TOPICS) {
    if (q.includes(topic)) return false;
  }

  const words = q.split(/\s+/);
  if (words.length <= 3) return true;

  for (const keyword of CS_ACADEMIC_KEYWORDS) {
    if (q.includes(keyword)) return true;
  }

  return true;
}

export default function NotesTopAiHeader() {
  const [isOpen, setIsOpen] = useState(false);

  // Multiple PDF Upload Knowledge Base State
  const [uploadedPdfs, setUploadedPdfs] = useState([]);
  const [isParsingPdf, setIsParsingPdf] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Chat State
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      content:
        "👋 Welcome! I am your dedicated **Notes AI Assistant**.\n\nI can help you understand Computer Science subjects, explain complex syllabus concepts, and answer questions from your uploaded PDF notes.\n\nClick **+ Upload** at the top to index your notes or ask any subject question below!",
      timestamp: Date.now(),
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedMsgIndex, setCopiedMsgIndex] = useState(null);

  const recognitionRef = useRef(null);
  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);

  // Scroll inner chat container to bottom ONLY
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, isChatLoading, isOpen]);

  // Setup Voice Speech Recognition
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
        setChatInput(transcript);
      };

      rec.onerror = () => setIsRecording(false);
      rec.onend = () => setIsRecording(false);
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
        toast.success("Listening... Speak your academic question.");
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

  // Upload & Index PDF
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsParsingPdf(true);
    setUploadProgress(20);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        setUploadProgress(40 + Math.floor((i / files.length) * 50));
        const parsed = await parseUploadedDocument(file);
        
        const pdfEntry = {
          id: `pdf_${Date.now()}_${i}`,
          fileName: file.name,
          fileSize: `${(file.size / 1024).toFixed(1)} KB`,
          totalPages: parsed.totalPages || 1,
          wordCount: parsed.wordCount || 0,
          fullText: parsed.fullText || parsed.summary?.excerpt || "",
        };

        setUploadedPdfs((prev) => [...prev.filter((p) => p.fileName !== file.name), pdfEntry]);
        toast.success(`PDF "${file.name}" indexed successfully! 📄`);

        const sysMsg = {
          role: "assistant",
          content: `📄 **Indexed PDF Knowledge**: "${file.name}" (${pdfEntry.totalPages} Pages, ${pdfEntry.wordCount} Words).\n\nI can now answer questions directly using this uploaded PDF as the primary source!`,
          timestamp: Date.now(),
        };
        setChatMessages((prev) => [...prev, sysMsg]);
      } catch (err) {
        console.error("PDF Parse Error:", err);
        toast.error(`Failed to parse "${file.name}". Make sure it is a valid document.`);
      }
    }

    setUploadProgress(100);
    setTimeout(() => {
      setIsParsingPdf(false);
      setUploadProgress(0);
    }, 500);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemovePdf = (id) => {
    setUploadedPdfs((prev) => prev.filter((p) => p.id !== id));
    toast.success("Removed PDF from knowledge base.");
  };

  // Send Chat Message
  const handleChatSend = async (e, queryOverride = "") => {
    e?.preventDefault();
    const query = (queryOverride || chatInput).trim();
    if (!query || isChatLoading) return;

    // Academic Restriction Check
    if (!isAcademicQuery(query, uploadedPdfs.length > 0)) {
      setChatInput("");
      const restrictedMsg = {
        role: "assistant",
        content: "I am the Notes AI Assistant. I can answer only subject-related questions and uploaded PDF content.",
        timestamp: Date.now(),
      };
      setChatMessages((prev) => [...prev, { role: "user", content: query, timestamp: Date.now() }, restrictedMsg]);
      return;
    }

    setChatInput("");
    setIsChatLoading(true);

    const userMsg = { role: "user", content: query, timestamp: Date.now() };
    setChatMessages((prev) => [...prev, userMsg]);

    try {
      const history = chatMessages.slice(-6).map((m) => ({ role: m.role, content: m.content }));
      
      let systemContext = `You are the Notes AI Assistant, an expert Computer Science academic tutor for university students.
Your job is to explain syllabus concepts in simple, clear, student-friendly language.
Provide short summaries first, then detailed explanations with examples where helpful.
Highlight key exam points and revision takeaways.
If asked non-academic questions, reply ONLY: "I am the Notes AI Assistant. I can answer only subject-related questions and uploaded PDF content."`;

      if (uploadedPdfs.length > 0) {
        systemContext += `\n\n[PRIMARY SOURCE - UPLOADED KNOWLEDGE BASE (${uploadedPdfs.length} PDFs)]:\n`;
        uploadedPdfs.forEach((pdf, idx) => {
          systemContext += `\n--- PDF #${idx + 1}: ${pdf.fileName} ---\n${pdf.fullText.slice(0, 3000)}\n`;
        });
        systemContext += `\nInstructions:
1. First search and answer using the uploaded PDF content above. Mention which PDF the answer came from (e.g., "[Source PDF: ${uploadedPdfs[0].fileName}]").
2. Quote relevant sections.
3. If the answer is not in the uploaded PDF, use general CS syllabus knowledge while remaining clear and helpful.`;
      }

      const rawReply = await sendMessage(history, query, systemContext);
      const botMsg = { role: "assistant", content: rawReply, timestamp: Date.now() };
      setChatMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      toast.error("Error generating response. Please try again.");
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleCopyMessage = (content, index) => {
    navigator.clipboard.writeText(content);
    setCopiedMsgIndex(index);
    toast.success("Answer copied to clipboard!");
    setTimeout(() => setCopiedMsgIndex(null), 2000);
  };

  const handleClearChat = () => {
    setChatMessages([
      {
        role: "assistant",
        content: "Chat cleared. Ask me any subject question or upload PDF notes!",
        timestamp: Date.now(),
      },
    ]);
    toast.success("Chat cleared.");
  };

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

      {/* Floating Top-Right AI Trigger Button */}
      <div className="w-full lg:w-auto flex justify-end mb-4 lg:mb-0">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#0D9488] via-[#0F766E] to-[#115E59] px-4 py-3 text-xs font-black text-white shadow-neu-raised-lg border-2 border-[#D97706] hover:scale-105 transition-all cursor-pointer active:scale-95 z-30 font-mono"
          title="Open Notes AI Assistant"
        >
          <NotesAIBrainLogo size={42} />
          <div className="text-left leading-tight">
            <p className="text-sm font-extrabold text-white flex items-center gap-1.5 font-mono">
              Notes AI Assistant
              {uploadedPdfs.length > 0 && (
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
              )}
            </p>
            <p className="text-xs text-[#2DD4BF] font-semibold">
              {uploadedPdfs.length > 0 ? `${uploadedPdfs.length} PDF(s) Indexed` : "CS Subjects & Syllabus Tutor"}
            </p>
          </div>
          {isOpen ? <FiMinimize2 size={18} className="ml-1 text-white/80" /> : <FiMaximize2 size={18} className="ml-1 text-white/80" />}
        </button>
      </div>

      {/* FLOATING TOP-RIGHT PANEL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 320 }}
            className="w-[calc(100vw-1.5rem)] sm:w-[420px] lg:w-[440px] fixed bottom-24 right-3 sm:bottom-28 sm:right-6 lg:top-20 lg:right-32 lg:bottom-auto z-40 h-[490px] sm:h-[520px] max-h-[calc(100vh-140px)] rounded-3xl border-2 border-[#0D9488] bg-white dark:bg-teal-950 text-[#134E4A] dark:text-[#CCFBF1] shadow-2xl flex flex-col overflow-hidden text-left"
          >
            {/* Academic Header Bar with Upload Option at Top (Perfectly Aligned) */}
            <div className="flex items-center justify-between bg-gradient-to-r from-[#0D9488] via-[#0F766E] to-[#115E59] px-4 py-3 text-white border-b-2 border-[#D97706] shrink-0 gap-2">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <NotesAIBrainLogo size={40} />
                <div className="min-w-0 flex-1 leading-tight">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="text-xs sm:text-sm font-black text-white truncate font-mono">
                      Notes AI Assistant
                    </h3>
                    <span className="bg-[#D97706] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider font-mono shrink-0 shadow-xs">
                      Academic
                    </span>
                  </div>
                  <p className="text-[11px] text-[#CCFBF1] font-semibold mt-0.5 truncate font-mono">
                    {uploadedPdfs.length > 0 ? `${uploadedPdfs.length} PDF Knowledge Base Active` : "CS Subjects & Syllabus Tutor"}
                  </p>
                </div>
              </div>

              {/* Upload Option & Control Buttons Aligned at Top */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white px-3 py-1.5 text-xs font-bold transition-all shadow-neu-raised cursor-pointer font-mono shrink-0 border border-amber-400/40"
                  title="Upload PDF Notes"
                >
                  <FiPlus size={14} />
                  <span>Upload</span>
                </button>
                <button
                  onClick={handleClearChat}
                  className="p-1.5 rounded-xl text-white/80 hover:bg-white/20 hover:text-white transition-all cursor-pointer"
                  title="Clear Chat"
                >
                  <FiTrash2 size={16} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-xl text-white/80 hover:bg-white/20 hover:text-white transition-all cursor-pointer"
                  title="Close Assistant"
                >
                  <FiX size={18} />
                </button>
              </div>
            </div>

            {/* Uploaded PDFs Manager Banner */}
            {uploadedPdfs.length > 0 && (
              <div className="bg-[#CCFBF1]/40 dark:bg-teal-900/40 border-b border-[#5EEAD4]/40 px-3.5 py-2 text-xs text-[#134E4A] dark:text-[#CCFBF1] flex flex-col gap-1 shrink-0">
                <div className="flex items-center justify-between font-extrabold font-mono">
                  <span className="flex items-center gap-1 text-[#0D9488] dark:text-[#2DD4BF]">
                    <FiPaperclip size={13} />
                    Indexed PDFs ({uploadedPdfs.length})
                  </span>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[11px] text-[#D97706] hover:underline font-black cursor-pointer"
                  >
                    + Add More
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto pt-0.5">
                  {uploadedPdfs.map((pdf) => (
                    <div
                      key={pdf.id}
                      className="flex items-center gap-1.5 bg-white dark:bg-teal-950 border border-[#5EEAD4]/50 px-2.5 py-1 rounded-lg text-[11px] shadow-2xs font-mono"
                    >
                      <span className="truncate max-w-[140px] font-bold text-[#0D9488] dark:text-[#2DD4BF]" title={pdf.fileName}>
                        {pdf.fileName}
                      </span>
                      <span className="text-[#64748B] dark:text-[#5EEAD4]/70 font-medium">({pdf.totalPages}p)</span>
                      <button
                        onClick={() => handleRemovePdf(pdf.id)}
                        className="text-[#DC2626] hover:text-rose-800 ml-0.5 cursor-pointer"
                        title="Remove PDF"
                      >
                        <FiX size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Progress Bar */}
            {isParsingPdf && (
              <div className="bg-amber-50 dark:bg-amber-950/60 px-3.5 py-2 border-b border-amber-300 text-xs text-[#D97706] dark:text-amber-200 flex items-center justify-between shrink-0 font-bold font-mono">
                <span className="flex items-center gap-2 text-[11px]">
                  <FiCpu className="animate-spin text-[#D97706]" size={15} /> Extracting PDF Knowledge Base...
                </span>
                <span className="font-mono text-xs">{uploadProgress}%</span>
              </div>
            )}

            {/* Chat Messages Container */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#F0FDFA] dark:bg-[#042F2E]">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[92%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-neu-raised ${
                      msg.role === "user"
                        ? "bg-[#0D9488] text-white font-semibold rounded-br-xs border border-[#0F766E]"
                        : "bg-white dark:bg-teal-950 text-[#134E4A] dark:text-[#CCFBF1] border border-[#5EEAD4]/50 dark:border-teal-800 border-l-4 border-l-[#D97706] rounded-bl-xs font-medium"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <p className="whitespace-pre-wrap font-semibold text-white">{msg.content}</p>
                    ) : (
                      <div className="text-[#134E4A] dark:text-[#CCFBF1]">
                        <FormattedMessage content={msg.content} />
                      </div>
                    )}

                    {/* Bot Action Buttons */}
                    {msg.role === "assistant" && (
                      <div className="mt-3 pt-2 border-t border-[#5EEAD4]/30 dark:border-teal-800 flex items-center justify-between text-[11px] text-[#64748B] dark:text-[#5EEAD4]/70">
                        <span className="font-mono text-xs font-semibold text-[#64748B] dark:text-[#5EEAD4]/70">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopyMessage(msg.content, idx)}
                            className="inline-flex items-center gap-1 font-bold text-[#0D9488] dark:text-[#2DD4BF] bg-[#CCFBF1]/40 dark:bg-teal-900/50 hover:bg-[#0D9488] hover:text-white px-2.5 py-1 rounded-lg border border-[#5EEAD4]/40 cursor-pointer transition-all shadow-2xs font-mono"
                            title="Copy Answer"
                          >
                            {copiedMsgIndex === idx ? <FiCheck size={12} className="text-emerald-600" /> : <FiCopy size={12} />}
                            {copiedMsgIndex === idx ? "Copied" : "Copy"}
                          </button>
                          <button
                            onClick={() => speakText(msg.content)}
                            className="inline-flex items-center gap-1 font-bold text-[#D97706] bg-amber-50 dark:bg-amber-950/50 hover:bg-[#D97706] hover:text-white px-2.5 py-1 rounded-lg border border-amber-300/50 cursor-pointer transition-all shadow-2xs font-mono"
                            title="Read Aloud"
                          >
                            {isSpeaking ? <FiVolumeX size={12} /> : <FiVolume2 size={12} />}
                            {isSpeaking ? "Stop" : "Audio"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-white dark:bg-teal-950 px-4 py-3 border border-[#5EEAD4] text-xs font-bold text-[#0D9488] dark:text-[#2DD4BF] flex items-center gap-2.5 shadow-neu-raised font-mono">
                    <FiCpu className="animate-spin text-[#0D9488]" size={16} />
                    {uploadedPdfs.length > 0
                      ? "Searching PDF knowledge base & synthesizing answer..."
                      : "Thinking & synthesizing academic answer..."}
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input Bar */}
            <form
              onSubmit={handleChatSend}
              className="flex items-center gap-2 border-t border-[#5EEAD4]/40 bg-white dark:bg-teal-950 p-3 shrink-0"
            >
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D97706] text-white hover:bg-[#B45309] border border-amber-400/40 cursor-pointer shadow-neu-raised font-bold"
                title="Upload PDF Notes (+)"
              >
                <FiPlus size={18} />
              </button>

              <button
                type="button"
                onClick={toggleMic}
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all cursor-pointer border ${
                  isRecording
                    ? "bg-[#DC2626] text-white animate-pulse border-red-700"
                    : "bg-[#F0FDFA] dark:bg-teal-900/40 text-[#134E4A] dark:text-[#CCFBF1] hover:bg-[#CCFBF1]/50 border-[#5EEAD4]"
                }`}
                title={isRecording ? "Stop Listening" : "Voice Input"}
              >
                {isRecording ? <FiMicOff size={18} /> : <FiMic size={18} />}
              </button>

              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={
                  uploadedPdfs.length > 0
                    ? `Ask about ${uploadedPdfs[0].fileName.slice(0, 14)}...`
                    : "Ask CS subject question or upload PDF..."
                }
                className="flex-1 rounded-xl border border-[#5EEAD4] bg-white dark:bg-teal-900/30 px-3.5 py-2 text-xs sm:text-sm text-[#134E4A] dark:text-[#CCFBF1] font-medium placeholder:text-[#64748B] focus:border-[#0D9488] focus:outline-none focus:ring-2 focus:ring-[#0D9488]/20"
              />

              <button
                type="submit"
                disabled={!chatInput.trim() || isChatLoading}
                className="flex h-10 px-4 items-center justify-center gap-1 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-xs sm:text-sm font-bold text-white shadow-neu-raised disabled:opacity-50 cursor-pointer transition-all font-mono"
              >
                <FiSend size={15} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

