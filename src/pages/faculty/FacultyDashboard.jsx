// src/pages/faculty/FacultyDashboard.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FiPlayCircle, FiGrid, FiFileText, FiChevronRight,
  FiUser, FiAward, FiEdit3, FiBookOpen, FiCheckCircle, FiExternalLink
} from "react-icons/fi";
import ProjectFeedbackModal from "../../components/feedback/ProjectFeedbackModal";

const cards = [
  {
    label: "Upload Notes",
    icon: FiFileText,
    to: "/faculty/notes",
    bg: "bg-[#021C4F]",
    badge: "PDF Notes",
    desc: "Upload unit-wise lecture notes & study materials by subject."
  },
  {
    label: "Video Lectures",
    icon: FiPlayCircle,
    to: "/faculty/videos",
    bg: "bg-[#C50337]",
    badge: "E-Content",
    desc: "Upload YouTube video lectures & tutorial playlists by subject."
  },
  {
    label: "Semester Question Papers",
    icon: FiGrid,
    to: "/faculty/question-papers",
    bg: "bg-[#021C4F]",
    badge: "University Exams",
    desc: "Upload previous semester university question papers."
  },
  {
    label: "CIA Question Papers",
    icon: FiAward,
    to: "/faculty/cia-papers",
    bg: "bg-[#C50337]",
    badge: "Internal Assessment",
    desc: "Upload CIA 1 & CIA 2 assessment papers for 1st, 2nd & 3rd Year."
  },
  {
    label: "Manage Assignments",
    icon: FiBookOpen,
    to: "/faculty/assignments",
    bg: "bg-[#021C4F]",
    badge: "Coursework & Grading",
    desc: "Post assignments with 3-year CS subject names, review & grade student submissions."
  },
  {
    label: "Vaishnav LMS Portal",
    icon: FiExternalLink,
    href: "https://dgvc.in/lms/login.php",
    isExternal: true,
    bg: "bg-amber-600",
    badge: "Official LMS",
    desc: "Access the official Vaishnav Learning Management System portal for faculty."
  }
];

export default function FacultyDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  return (
    <div className="mx-auto min-h-[80vh] max-w-5xl px-4 py-8 sm:px-6 lg:px-8 bg-[#F8FAFC]">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-[#021C4F] via-[#0A369D] to-[#C50337] p-6 sm:p-8 text-white shadow-xl border border-white/20 text-left"
        >
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-amber-300 border border-white/20 mb-3">
                <FiCheckCircle size={14} className="text-emerald-400" />
                DDGDVC Faculty Management Portal
              </span>
              <h1 className="font-sans text-2xl sm:text-3xl font-black text-white tracking-tight">
                Welcome back, {user?.name || "Faculty Member"}!
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-slate-100 max-w-xl leading-relaxed font-medium">
                Upload &amp; manage academic notes, video lectures, CIA papers, semester question papers, and assignments for Computer Science students.
              </p>
            </div>

            <div className="hidden md:flex flex-col items-center justify-center h-24 w-28 rounded-2xl bg-white/10 backdrop-blur-md text-white border border-white/20 shadow-md shrink-0">
              <FiUser size={32} className="text-amber-300 mb-1" />
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-white">Faculty</span>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-left">
          <div>
            <h2 className="font-sans text-xl font-bold text-[#021C4F]">Faculty Content Management</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Select a section below to upload or manage academic course materials
            </p>
          </div>
        </div>

        {/* Quick Action Cards Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, i) => (
            <motion.button
              key={card.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => (card.isExternal ? window.open(card.href, "_blank") : navigate(card.to))}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-slate-200 p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-[#C50337] text-left"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.bg} text-white shadow-sm transition-transform duration-200 group-hover:scale-105`}>
                    <card.icon size={22} />
                  </div>
                  <span className="rounded-full px-2.5 py-1 text-[10px] font-bold bg-slate-100 text-[#021C4F] border border-slate-200">
                    {card.badge}
                  </span>
                </div>

                <h3 className="font-sans text-base font-bold text-[#021C4F] group-hover:text-[#C50337] transition-colors leading-snug">
                  {card.label}
                </h3>
                <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                  {card.desc}
                </p>
              </div>

              <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-[#021C4F] group-hover:text-[#C50337] transition-colors pt-3 border-t border-slate-100">
                <span>Open Management</span>
                <FiChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
              </div>
            </motion.button>
          ))}
        </div>

        {/* ── Faculty Feedback Form Card (At the Bottom of Faculty Dashboard) ── */}
        <div className="mt-12 rounded-3xl bg-white p-6 sm:p-8 border border-slate-200 shadow-md text-left space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-[#C50337] border border-rose-100">
                <FiEdit3 size={13} /> Faculty Feedback System
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#021C4F] mt-1">
                Faculty Feedback Form
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Share your feedback on teaching tools, assignment workflows, and portal features directly with Admin (24E3006).
              </p>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C50337] text-white shadow-md shrink-0 font-bold">
                <FiBookOpen size={24} />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#021C4F]">Faculty Feedback Questionnaire</h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Evaluate content management ease, student tracking, and request new teaching tools.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsFeedbackOpen(true)}
              className="shrink-0 flex items-center gap-2 rounded-2xl bg-[#021C4F] text-white hover:bg-[#C50337] px-6 py-3 text-xs font-black shadow-md transition-all transform hover:scale-105"
            >
              <FiEdit3 size={16} />
              <span>Open Faculty Feedback Form</span>
            </button>
          </div>
        </div>

        {/* Faculty Feedback Modal */}
        <ProjectFeedbackModal
          isOpen={isFeedbackOpen}
          onClose={() => setIsFeedbackOpen(false)}
          defaultType="faculty"
          user={user}
        />

        {/* Footer Info */}
        <div className="mt-12 rounded-xl bg-white p-4 text-center border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-[#021C4F]">
            Dwaraka Doss Goverdhan Doss Vaishnav College (Autonomous)
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Department of Computer Science · Faculty Management Portal
          </p>
        </div>

      </motion.div>
    </div>
  );
}
