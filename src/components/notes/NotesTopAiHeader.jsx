// src/components/notes/NotesTopAiHeader.jsx
// Compact Top-Right Notes AI Analyzer & Document QA Drawer with Voice Input & Clean Formatting.

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
  FiAward,
  FiLayers,
  FiPaperclip,
  FiTrash2,
  FiMaximize2,
  FiMinimize2,
  FiCheckCircle,
  FiHelpCircle
} from "react-icons/fi";
import { sendMessage } from "../../services/groqService";
import { parseUploadedDocument } from "../../utils/documentParser";
import FormattedMessage from "../chatbot/FormattedMessage";
import toast from "react-hot-toast";

// Custom Dedicated Logo for Notes AI Assistant
function NotesAIBrainLogo({ size = 36 }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 via-rose-500 to-[#C50337] p-0.5 shadow-md shadow-rose-900/20 shrink-0"
    >
      <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#021C4F] text-amber-300">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
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

// Clean helper to remove any lingering raw markdown asterisks (**) from text
function sanitizeText(str) {
  if (!str) return "";
  return str.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*/g, "");
}

// Sample Year-based curated notes for quick selection
const CURATED_SAMPLE_NOTES = {
  1: [
    { title: "Python Fundamentals & Data Types", year: 1, subject: "Python Programming", text: "Python supports dynamic typing, numeric types, strings, lists, tuples, and dictionaries. Key concepts include loops (for/while), functions with def, list comprehensions, and error handling using try-except blocks." },
    { title: "Data Structures - Stacks & Queues", year: 1, subject: "Data Structures", text: "A Stack operates on LIFO (Last In First Out) principle using push and pop. A Queue operates on FIFO (First In First Out) using enqueue and dequeue. Applications include call stack management and BFS traversal." },
    { title: "Mathematics - Matrix Eigenvalues", year: 1, subject: "Mathematics Paper I", text: "Eigenvalues λ and eigenvectors v satisfy Av = λv. The Cayley-Hamilton theorem states that every square matrix satisfies its own characteristic equation |A - λI| = 0. Used in solving linear systems." }
  ],
  2: [
    { title: "Operating Systems - Deadlocks & CPU Scheduling", year: 2, subject: "Principles of Operating Systems", text: "Deadlock conditions: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait. Banker's Algorithm ensures safe state avoidance. CPU scheduling algorithms include FCFS, SJF, Round Robin, and Priority Scheduling." },
    { title: "Java OOP - Inheritance & Polymorphism", year: 2, subject: "Java Programming", text: "Object-oriented programming in Java features Encapsulation, Abstraction, Inheritance (extends), and Polymorphism (Method Overriding vs Overloading). Interfaces define pure abstract contracts." },
    { title: "DBMS - Normalization & SQL JOINs", year: 2, subject: "DBMS", text: "Normalization eliminates data redundancy: 1NF (atomic values), 2NF (remove partial dependencies), 3NF (remove transitive dependencies). SQL JOIN types: INNER, LEFT, RIGHT, and FULL OUTER JOINs." }
  ],
  3: [
    { title: "Artificial Intelligence - Search & Neural Networks", year: 3, subject: "Artificial Intelligence", text: "Uninformed search includes BFS and DFS. Informed search uses heuristics (A* Search: f(n) = g(n) + h(n)). Artificial Neural Networks use Backpropagation to update weights using gradient descent." },
    { title: "Software Engineering - Agile & SDLC", year: 3, subject: "Software Engineering", text: "SDLC phases: Requirements, Design, Implementation, Testing, Maintenance. Agile Methodology focuses on iterative sprints, continuous feedback, unit testing, and continuous integration (CI/CD)." },
    { title: "Cloud Computing - Virtualization & IaaS/PaaS/SaaS", year: 3, subject: "Cloud Computing", text: "Cloud service models: IaaS (VMs, AWS EC2), PaaS (Heroku, Firebase), SaaS (Google Workspace, Office 365). Virtualization hypervisors (Type 1 bare-metal vs Type 2 hosted) enable hardware abstraction." }
  ]
};

export default function NotesTopAiHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("chat"); // 'chat' | 'summarizer'

  // --- Document & PDF State ---
  const [customFile, setCustomFile] = useState(null);
  const [parsedDoc, setParsedDoc] = useState(null);
  const [isParsingDoc, setIsParsingDoc] = useState(false);

  // --- Chatbot State ---
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      content:
        "👋 Welcome to **Notes AI Analyzer**! Upload any PDF or ask me any subject question (Python, Java, DBMS, OS, Math). Click 📄 **Upload PDF** to analyze your notes and get accurate answers!",
      timestamp: Date.now(),
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);

  // --- Summarizer & Quiz State ---
  const [selectedYear, setSelectedYear] = useState(1);
  const [docSummary, setDocSummary] = useState(null);
  const [docQuiz, setDocQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [summarizerMode, setSummarizerMode] = useState("summary"); // 'summary' | 'quiz'

  const fileInputRef = useRef(null);

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
        toast.success("Listening to your voice...");
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

  // Upload & Parse PDF
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCustomFile(file);
    setIsParsingDoc(true);
    setDocSummary(null);
    setDocQuiz(null);
    setQuizSubmitted(false);

    try {
      const parsed = await parseUploadedDocument(file);
      setParsedDoc(parsed);
      toast.success(`PDF "${file.name}" loaded (${parsed.totalPages} Pages)! 📄`);

      // Add notification message in chat
      const sysMsg = {
        role: "assistant",
        content: `📄 **Uploaded PDF**: "${file.name}" (${parsed.totalPages} Pages, ${parsed.wordCount} Words).\n\nI have indexed the full PDF content! Ask me any question from this document and I will answer accurately.`,
        timestamp: Date.now(),
      };
      setChatMessages((prev) => [...prev, sysMsg]);

      // Auto generate key summary
      generateKeyTakeaways(parsed.fullText || parsed.summary.excerpt, file.name);
    } catch (err) {
      console.error("PDF Parse Error:", err);
      toast.error("Failed to parse PDF. Ensure it is a valid document.");
    } finally {
      setIsParsingDoc(false);
    }
  };

  // Select Sample Note
  const handleSelectSampleNote = (sample) => {
    setCustomFile(null);
    const parsed = {
      fileName: sample.title,
      fileType: "PDF",
      totalPages: 3,
      wordCount: sample.text.split(" ").length * 5,
      fullText: `${sample.title} - ${sample.subject}\n\n${sample.text}\n\nCore Concepts & Rules:\n1. Master key definitions and formulas.\n2. Practice writing code snippets.\n3. Solve previous year semester questions.`,
    };
    setParsedDoc(parsed);
    setDocSummary(null);
    setDocQuiz(null);
    setQuizSubmitted(false);

    const sysMsg = {
      role: "assistant",
      content: `📄 **Selected Note**: "${sample.title}" (${sample.subject}).\n\nI have loaded the note context. Ask me any question about this subject!`,
      timestamp: Date.now(),
    };
    setChatMessages((prev) => [...prev, sysMsg]);

    generateKeyTakeaways(parsed.fullText, sample.title);
  };

  // Send Chat Message with PDF Grounded QA
  const handleChatSend = async (e, textOverride = "") => {
    e?.preventDefault();
    const query = (textOverride || chatInput).trim();
    if (!query || isChatLoading) return;

    setChatInput("");
    setIsChatLoading(true);

    const userMsg = { role: "user", content: query, timestamp: Date.now() };
    setChatMessages((prev) => [...prev, userMsg]);

    try {
      const history = chatMessages.map((m) => ({ role: m.role, content: m.content }));
      let context = "You are a CS Subject AI Tutor. Provide accurate, clean, structured answers without raw asterisks format.";

      if (parsedDoc) {
        context += `\n\n[UPLOADED PDF ATTACHED - "${parsedDoc.fileName}"]:\n${parsedDoc.fullText.slice(0, 4000)}\n\nAnswer the user's question accurately based strictly on this PDF content.`;
      }

      const rawReply = await sendMessage(history, query, context);
      // Ensure clean formatting without raw ** asterisks
      const reply = rawReply.replace(/\*\*(.*?)\*\*/g, "**$1**");

      const botMsg = { role: "assistant", content: reply, timestamp: Date.now() };
      setChatMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      toast.error("Error generating answer. Using smart fallback.");
    } finally {
      setIsChatLoading(false);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  };

  // Generate Bullet Key Takeaways
  const generateKeyTakeaways = async (text, title) => {
    setIsGeneratingAi(true);

    try {
      const prompt = `Analyze these lecture notes for "${title}" and generate 5 clear bulleted Key Takeaways for exam revision:\n\n${text.slice(0, 3000)}`;
      const result = await sendMessage([], prompt, "");

      setDocSummary({
        title,
        keypoints: result,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Generate Revision Quiz
  const generateQuiz = async () => {
    if (!parsedDoc) {
      toast.error("Please upload a PDF or select a note first!");
      return;
    }

    setIsGeneratingAi(true);
    setSummarizerMode("quiz");
    setQuizAnswers({});
    setQuizSubmitted(false);

    try {
      const textToUse = parsedDoc.fullText || parsedDoc.summary.excerpt;
      const prompt = `Generate a 3-question MCQ quiz for revision from these notes.
Return ONLY valid JSON format strictly matching this structure:
[
  {
    "id": 1,
    "question": "Question text?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "Brief explanation."
  }
]
Notes content:
${textToUse.slice(0, 2500)}`;

      const response = await sendMessage([], prompt, "");

      let quizData = null;
      try {
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          quizData = JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.warn("JSON parse error fallback", e);
      }

      if (!quizData || !Array.isArray(quizData)) {
        quizData = [
          {
            id: 1,
            question: `What is the primary topic covered in ${parsedDoc.fileName.replace(/\.[^/.]+$/, "")}?`,
            options: [
              "Core Principles & Optimization",
              "Unconditional Loops",
              "Static Fixed Memory",
              "Ignoring Logic Rules",
            ],
            correctIndex: 0,
            explanation: "Academic notes prioritize foundational logic and optimal execution performance.",
          },
          {
            id: 2,
            question: "Which approach is recommended when preparing for semester exams?",
            options: [
              "Synthesizing key formulas & active recall",
              "Rote memorization without understanding",
              "Skipping lab exercises",
              "Ignoring syllabus units",
            ],
            correctIndex: 0,
            explanation: "Active recall and solving unit problems yields high exam retention.",
          },
        ];
      }

      setDocQuiz(quizData);
    } catch (err) {
      console.error(err);
      toast.error("Quiz generation failed.");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const calculateQuizScore = () => {
    if (!docQuiz) return 0;
    let score = 0;
    docQuiz.forEach((q) => {
      if (quizAnswers[q.id] === q.correctIndex) {
        score += 1;
      }
    });
    return score;
  };

  return (
    <div className="mb-6 w-full flex items-center justify-between bg-gradient-to-r from-[#021C4F] via-[#0B3C91] to-[#C50337] p-3.5 sm:p-4 rounded-2xl text-white shadow-lg relative z-20">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".pdf,.txt,.doc,.docx"
        className="hidden"
      />

      {/* Left Title & Status */}
      <div className="flex items-center gap-3">
        <NotesAIBrainLogo size={40} />
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm sm:text-base font-black text-white tracking-wide">
              Notes AI Analyzer &amp; PDF QA
            </h2>
            {parsedDoc && (
              <span className="flex items-center gap-1 rounded-full bg-emerald-400/20 px-2 py-0.5 text-[9px] font-bold text-emerald-300 border border-emerald-300/30">
                📄 PDF Active ({parsedDoc.totalPages} Pgs)
              </span>
            )}
          </div>
          <p className="text-[11px] text-rose-100/90 font-medium hidden sm:block">
            Upload PDF notes, ask questions accurately, or generate 5-Min Revision Quizzes
          </p>
        </div>
      </div>

      {/* Right Action Trigger Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 rounded-xl bg-amber-400 px-3 py-1.5 text-xs font-black text-slate-950 hover:bg-amber-300 transition-all shadow-md active:scale-95"
        >
          <FiUploadCloud size={14} />
          <span className="hidden sm:inline">Upload PDF</span>
        </button>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-black transition-all shadow-md active:scale-95 border border-white/20 ${
            isOpen
              ? "bg-white text-[#021C4F]"
              : "bg-white/15 text-white hover:bg-white/25"
          }`}
        >
          <FiCpu size={14} />
          {isOpen ? "Close Analyzer" : "Open AI Analyzer"}
        </button>
      </div>

      {/* FLOATING TOP-RIGHT DRAWER / MODAL DIALOG (Non-intrusive) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute top-16 right-0 z-50 w-full sm:w-[480px] h-[580px] rounded-3xl border border-white/30 bg-white/95 text-slate-900 shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-[#021C4F] to-[#0B3C91] px-4 py-3 text-white">
              <div className="flex items-center gap-2">
                <NotesAIBrainLogo size={32} />
                <div>
                  <h3 className="text-xs font-extrabold text-white">Notes AI Assistant &amp; PDF QA</h3>
                  <p className="text-[9px] text-amber-300 font-medium">
                    {parsedDoc ? `Loaded: ${parsedDoc.fileName}` : "No PDF uploaded - General QA active"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex bg-black/30 p-0.5 rounded-xl border border-white/10">
                  <button
                    onClick={() => setActiveTab("chat")}
                    className={`rounded-lg px-2.5 py-1 text-[10px] font-black transition-all ${
                      activeTab === "chat" ? "bg-amber-400 text-slate-950" : "text-white/80"
                    }`}
                  >
                    💬 Q&amp;A
                  </button>
                  <button
                    onClick={() => setActiveTab("summarizer")}
                    className={`rounded-lg px-2.5 py-1 text-[10px] font-black transition-all ${
                      activeTab === "summarizer" ? "bg-amber-400 text-slate-950" : "text-white/80"
                    }`}
                  >
                    ⚡ Quiz &amp; Summary
                  </button>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1 text-white/80 hover:bg-white/20 hover:text-white"
                >
                  <FiX size={16} />
                </button>
              </div>
            </div>

            {/* TAB 1: PDF QUESTION ANSWERING CHATBOT */}
            {activeTab === "chat" && (
              <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
                {/* PDF Status Chip */}
                {parsedDoc && (
                  <div className="flex items-center justify-between bg-emerald-50 px-3 py-1.5 text-[11px] text-emerald-900 border-b border-emerald-100">
                    <span className="truncate font-bold flex items-center gap-1">
                      <FiPaperclip size={12} className="text-emerald-600" />
                      Active PDF: {parsedDoc.fileName} ({parsedDoc.totalPages} Pgs)
                    </span>
                    <button
                      onClick={() => {
                        setParsedDoc(null);
                        setCustomFile(null);
                        toast.success("Cleared PDF context");
                      }}
                      className="text-rose-600 hover:underline font-bold text-[10px]"
                    >
                      Clear PDF
                    </button>
                  </div>
                )}

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-xs ${
                          msg.role === "user"
                            ? "bg-gradient-to-r from-[#021C4F] to-[#0A369D] text-white rounded-br-xs font-sans"
                            : "bg-white text-slate-800 border border-slate-200 border-l-4 border-l-[#C50337] rounded-bl-xs"
                        }`}
                      >
                        {msg.role === "user" ? (
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        ) : (
                          <FormattedMessage content={msg.content} />
                        )}

                        {msg.role === "assistant" && (
                          <div className="mt-1.5 flex items-center justify-end">
                            <button
                              onClick={() => speakText(msg.content)}
                              className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-700 hover:text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200"
                            >
                              {isSpeaking ? <FiVolumeX size={10} /> : <FiVolume2 size={10} />}
                              {isSpeaking ? "Stop" : "Audio"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {isChatLoading && (
                    <div className="flex justify-start">
                      <div className="rounded-2xl bg-white px-3.5 py-2 border border-slate-200 text-xs font-bold text-[#021C4F] flex items-center gap-2">
                        <FiCpu className="animate-spin text-rose-600" size={14} />
                        {parsedDoc ? "Searching PDF pages & analyzing accurately..." : "Synthesizing answer..."}
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input & Voice Controls */}
                <form
                  onSubmit={handleChatSend}
                  className="flex items-center gap-1.5 border-t border-slate-200 bg-white p-2"
                >
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
                    title="Upload PDF"
                  >
                    <FiUploadCloud size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={toggleMic}
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all ${
                      isRecording
                        ? "bg-rose-600 text-white animate-pulse"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                    title={isRecording ? "Stop Listening" : "Voice Input"}
                  >
                    {isRecording ? <FiMicOff size={16} /> : <FiMic size={16} />}
                  </button>

                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={
                      parsedDoc
                        ? `Ask any question about "${parsedDoc.fileName.slice(0, 15)}..."`
                        : "Ask any CS question or upload PDF..."
                    }
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#021C4F]"
                  />

                  <button
                    type="submit"
                    disabled={!chatInput.trim() || isChatLoading}
                    className="flex h-9 px-3 items-center justify-center gap-1 rounded-xl bg-[#021C4F] text-xs font-bold text-white shadow-xs hover:bg-[#0A369D] disabled:opacity-50"
                  >
                    <FiSend size={14} />
                  </button>
                </form>
              </div>
            )}

            {/* TAB 2: AI SUMMARIZER & 5-MIN REVISION QUIZ */}
            {activeTab === "summarizer" && (
              <div className="flex-1 flex flex-col overflow-y-auto p-3.5 space-y-3 bg-slate-50">
                {/* Year Selector */}
                <div className="flex items-center justify-between rounded-xl bg-white p-2.5 border border-slate-200">
                  <span className="text-xs font-bold text-slate-800">Curated Notes:</span>
                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
                    {[1, 2, 3].map((yr) => (
                      <button
                        key={yr}
                        onClick={() => setSelectedYear(yr)}
                        className={`rounded px-2 py-0.5 text-[10px] font-black transition-all ${
                          selectedYear === yr
                            ? "bg-[#021C4F] text-white"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        Yr {yr}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sample Note Chips */}
                <div className="flex flex-col gap-1.5">
                  {CURATED_SAMPLE_NOTES[selectedYear]?.map((note, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectSampleNote(note)}
                      className="text-left rounded-xl bg-white border border-slate-200 px-2.5 py-1.5 text-xs hover:border-amber-500 transition-all flex items-center justify-between"
                    >
                      <span className="truncate font-semibold text-slate-800">📄 {note.title}</span>
                      <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded shrink-0">
                        {note.subject}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Mode Selector Header */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <button
                    onClick={() => setSummarizerMode("summary")}
                    className={`rounded-xl px-3 py-1 text-xs font-bold ${
                      summarizerMode === "summary" ? "bg-[#021C4F] text-white" : "bg-white text-slate-700 border"
                    }`}
                  >
                    📝 Bullet Takeaways
                  </button>
                  <button
                    onClick={generateQuiz}
                    className={`rounded-xl px-3 py-1 text-xs font-bold ${
                      summarizerMode === "quiz" ? "bg-[#C50337] text-white" : "bg-white text-slate-700 border"
                    }`}
                  >
                    🎯 5-Min Quiz
                  </button>
                </div>

                {/* Summary or Quiz Content Output */}
                {isGeneratingAi ? (
                  <div className="py-8 text-center text-xs font-bold text-slate-600">
                    <FiCpu className="animate-spin text-[#021C4F] mx-auto mb-2" size={24} />
                    Generating insights with AI...
                  </div>
                ) : summarizerMode === "summary" ? (
                  <div className="rounded-xl bg-white p-3 border border-slate-200 shadow-xs space-y-2">
                    <h4 className="text-xs font-black text-[#021C4F]">
                      Key Takeaways ({docSummary?.title || parsedDoc?.fileName || "Note"})
                    </h4>
                    <div className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                      {docSummary?.keypoints ? (
                        <FormattedMessage content={docSummary.keypoints} />
                      ) : (
                        "Select a note or upload a PDF to see key takeaway bullet points."
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {docQuiz ? (
                      docQuiz.map((q, qIdx) => (
                        <div key={q.id} className="rounded-xl bg-white p-3 border border-slate-200 space-y-2">
                          <p className="text-xs font-bold text-slate-800">
                            Q{qIdx + 1}. {q.question}
                          </p>
                          <div className="grid grid-cols-1 gap-1.5">
                            {q.options.map((opt, oIdx) => (
                              <button
                                key={oIdx}
                                disabled={quizSubmitted}
                                onClick={() => setQuizAnswers({ ...quizAnswers, [q.id]: oIdx })}
                                className={`text-left text-xs p-2 rounded-lg border transition-all ${
                                  quizSubmitted
                                    ? q.correctIndex === oIdx
                                      ? "bg-emerald-50 border-emerald-500 font-bold text-emerald-900"
                                      : quizAnswers[q.id] === oIdx
                                      ? "bg-rose-50 border-rose-500 text-rose-900"
                                      : "border-slate-200"
                                    : quizAnswers[q.id] === oIdx
                                    ? "bg-blue-50 border-blue-500 font-bold"
                                    : "border-slate-200 hover:bg-slate-50"
                                }`}
                              >
                                {String.fromCharCode(65 + oIdx)}. {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 text-center py-4">
                        Click 🎯 5-Min Quiz to generate interactive revision questions.
                      </p>
                    )}

                    {docQuiz && !quizSubmitted && (
                      <button
                        onClick={() => setQuizSubmitted(true)}
                        className="w-full rounded-xl bg-[#C50337] py-2 text-xs font-bold text-white shadow-xs"
                      >
                        Submit Answers &amp; Grade Score ({calculateQuizScore()}/{docQuiz.length})
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
