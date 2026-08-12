// src/components/common/CommandPalette.jsx
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiX,
  FiBookOpen,
  FiHeadphones,
  FiZap,
  FiHelpCircle,
  FiTarget,
  FiDownload,
  FiVideo,
  FiFileText,
  FiUserCheck,
  FiGlobe,
  FiSliders,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function CommandPalette({ isOpen, onClose, onActionSelect }) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  // Listen for Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open signal
          if (onClose) onClose(true);
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const ALL_COMMANDS = [
    {
      id: "pod-play",
      category: "🎙️ AI Personal Teacher Podcast",
      title: "Start Unit Podcast (Audio Lecture)",
      desc: "Sequential classroom lecture covering 100% syllabus topics",
      icon: FiHeadphones,
      action: () => onActionSelect && onActionSelect("podcast"),
    },
    {
      id: "pod-lessons",
      category: "🎙️ AI Personal Teacher Podcast",
      title: "Open Teacher Lessons & 7-Step Explanations",
      desc: "Detailed 7-step classroom breakdown with code snippets & diagrams",
      icon: FiBookOpen,
      action: () => onActionSelect && onActionSelect("lessons"),
    },

    {
      id: "pod-revision",
      category: "🎙️ AI Personal Teacher Podcast",
      title: "Quick Revision Mode",
      desc: "High-yield definitions, key differences & memory tricks",
      icon: FiZap,
      action: () => onActionSelect && onActionSelect("revision"),
    },
    {
      id: "pod-exam",
      category: "🎙️ AI Personal Teacher Podcast",
      title: "University Exam Q&A Bank (2M / 5M / 10M)",
      desc: "Model answers & exam points",
      icon: FiFileText,
      action: () => onActionSelect && onActionSelect("exam"),
    },
    {
      id: "pod-ask",
      category: "🎙️ AI Personal Teacher Podcast",
      title: "Ask AI Teacher (Interactive Doubt Solver)",
      desc: "Ask any question grounded in selected unit syllabus",
      icon: FiHelpCircle,
      action: () => onActionSelect && onActionSelect("ask"),
    },
    {
      id: "pod-quiz",
      category: "🎙️ AI Personal Teacher Podcast",
      title: "Start Unit Quiz (MCQs & Explanations)",
      desc: "Test knowledge and review wrong answers",
      icon: FiTarget,
      action: () => onActionSelect && onActionSelect("quiz"),
    },
    {
      id: "nav-notes",
      category: "📚 Portal Navigation",
      title: "Lecture Notes & Syllabus",
      desc: "Browse subjects by Year, Semester & Unit",
      icon: FiBookOpen,
      action: () => {
        navigate("/notes");
        onClose();
      },
    },
    {
      id: "nav-econtent",
      category: "📚 Portal Navigation",
      title: "E-Content Video Lectures",
      desc: "Watch university faculty YouTube playlists",
      icon: FiVideo,
      action: () => {
        navigate("/e-content");
        onClose();
      },
    },
    {
      id: "nav-qp",
      category: "📚 Portal Navigation",
      title: "Question Papers & CIA Papers",
      desc: "Download previous semester university question papers",
      icon: FiFileText,
      action: () => {
        navigate("/question-papers");
        onClose();
      },
    },
    {
      id: "nav-placements",
      category: "📚 Portal Navigation",
      title: "Placements & Live Mock Tests",
      desc: "Practice coding & aptitude placement tests",
      icon: FiUserCheck,
      action: () => {
        navigate("/placements");
        onClose();
      },
    },
  ];

  const filtered = ALL_COMMANDS.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.desc.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (cmd) => {
    cmd.action();
    toast.success(`Executed: ${cmd.title}`);
  };

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999999] flex items-start justify-center bg-slate-950/80 backdrop-blur-md pt-20 pb-10 px-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: -20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: -20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl overflow-hidden rounded-3xl bg-slate-900 border-2 border-teal-500/40 shadow-2xl text-white font-mono"
        >
          {/* Input Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800 bg-slate-950/90">
            <FiSearch className="text-amber-400" size={20} />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command or search (e.g. 'Podcast', 'Quiz', 'Notes', 'Quiz')..."
              className="w-full bg-transparent text-white placeholder-slate-400 outline-none text-sm font-mono"
            />
            <span className="text-[10px] bg-slate-800 text-slate-400 font-bold px-2 py-1 rounded-md border border-slate-700">
              ESC
            </span>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Command List */}
          <div className="max-h-[380px] overflow-y-auto p-3 space-y-1">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No matching commands found for "{query}".
              </div>
            ) : (
              filtered.map((cmd, idx) => {
                const Icon = cmd.icon;
                return (
                  <div
                    key={cmd.id}
                    onClick={() => handleSelect(cmd)}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/60 hover:bg-teal-600 hover:text-white transition-all cursor-pointer group border border-slate-800 hover:border-amber-400 shadow-sm"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-amber-400 group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
                      <Icon size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-teal-400 group-hover:text-amber-300 font-bold uppercase">
                          {cmd.category}
                        </span>
                      </div>
                      <p className="font-bold text-xs text-white group-hover:text-white truncate mt-0.5">
                        {cmd.title}
                      </p>
                      <p className="text-[10px] text-slate-400 group-hover:text-slate-200 truncate">
                        {cmd.desc}
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-400 group-hover:text-white font-bold shrink-0">
                      Press ↵
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Shortcuts Info */}
          <div className="flex items-center justify-between px-5 py-2.5 bg-slate-950 border-t border-slate-800 text-[10px] text-slate-400">
            <span>
              Tip: Press <kbd className="bg-slate-800 text-amber-300 px-1.5 py-0.5 rounded border border-slate-700 font-mono">Ctrl + K</kbd> anywhere in the portal to launch Command Palette
            </span>
            <span className="font-bold text-teal-400">CS Academic Portal 2.0</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
