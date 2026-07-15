// src/pages/student/CIAQuestionPapers.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiChevronRight, FiChevronLeft, FiFileText, FiDownload,
  FiExternalLink, FiCalendar, FiBookOpen, FiFolder,
  FiAward, FiX,
} from "react-icons/fi";
import { CIA_DATA, getDriveDownloadUrl, getDriveEmbedUrl } from "../../utils/ciaData";
import { formatDate } from "../../utils/helpers";
import EmptyState from "../../components/ui/EmptyState";

// ─── Breadcrumb ───
function Breadcrumb({ crumbs, onNavigate }) {
  return (
    <nav className="flex flex-wrap items-center gap-1.5 text-xs font-semibold mb-6">
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <FiChevronRight size={12} className="text-slate-400" />}
          {i < crumbs.length - 1 ? (
            <button
              onClick={() => onNavigate(i)}
              className="text-[#1E88E5] hover:text-[#0F4C81] transition-colors"
            >
              {crumb}
            </button>
          ) : (
            <span className="text-[#6B7280]">{crumb}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

// ─── Selection Grid (Years or Semesters or CIAs) ───
function SelectionGrid({ items, onSelect }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => (
        <motion.button
          key={item.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(item.key)}
          className="group relative overflow-hidden rounded-xl bg-white border border-[#E5E7EB] shadow-sm transition-all duration-300 hover:shadow-sm hover:border-[#1E88E5]/40 text-left"
        >
          <div className="relative flex items-center gap-4 p-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-[#0F4C81] text-white shadow-sm transition-all">
              {item.icon ? (
                <span className="text-lg font-bold">{item.icon}</span>
              ) : (
                <FiFolder size={22} />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-sans text-base font-bold text-[#0F4C81] group-hover:text-[#1E88E5] transition-colors">
                {item.label}
              </h3>
              {item.sub && (
                <p className="mt-0.5 text-xs text-[#6B7280]">{item.sub}</p>
              )}
            </div>
            <FiChevronRight
              size={16}
              className="text-slate-400 group-hover:text-[#1E88E5] transition-all shrink-0"
            />
          </div>
        </motion.button>
      ))}
    </div>
  );
}

// ─── Paper Card ───
function PaperCard({ paper, onPreview }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="group relative flex flex-col gap-3 overflow-hidden rounded-lg bg-white border border-[#E5E7EB] shadow-sm transition-all duration-300 hover:shadow-sm hover:-translate-y-0.5 text-left">
        <div className="relative p-5 flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#0F4C81]/10 text-[#0F4C81] transition-transform">
              <FiFileText size={22} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-sans text-sm font-semibold text-[#0F4C81] group-hover:text-[#1E88E5] transition-colors">
                {paper.title}
              </h3>
              <p className="mt-0.5 text-xs text-[#6B7280] flex items-center gap-1.5">
                <FiBookOpen size={11} />
                {paper.subject}
              </p>
            </div>
          </div>

          {paper.description && (
            <p className="text-xs leading-relaxed text-[#6B7280] line-clamp-2">
              {paper.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2">
            {paper.uploadedDate && (
              <span className="inline-flex items-center gap-1 rounded bg-[#1E88E5]/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0F4C81]">
                <FiCalendar size={10} />
                {formatDate(paper.uploadedDate)}
              </span>
            )}
            <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700">
              <FiAward size={10} />
              Question Paper
            </span>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={() => onPreview(paper)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] py-2.5 text-xs font-semibold text-[#4B5563] transition-all hover:bg-slate-100 hover:text-slate-900"
            >
              <FiExternalLink size={14} /> View
            </button>
            <a
              href={getDriveDownloadUrl(paper.driveUrl)}
              download
              target="_blank"
              rel="noreferrer"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#0F4C81] hover:bg-[#1E88E5] py-2.5 text-xs font-bold text-white shadow-sm transition-all"
            >
              <FiDownload size={14} /> Download
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Preview Modal (Google Drive embed) ───
function PreviewModal({ paper, onClose }) {
  if (!paper) return null;

  const embedUrl = getDriveEmbedUrl(paper.driveUrl);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="flex w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white border border-[#E5E7EB] shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-[#E5E7EB] bg-[#0F4C81] px-5 py-4 text-white">
            <div className="min-w-0 flex-1 text-left">
              <h3 className="truncate font-sans text-sm font-semibold text-white">
                {paper.title}
              </h3>
              <p className="text-xs text-white/80 truncate">{paper.subject}</p>
            </div>
            <button
              onClick={onClose}
              className="ml-4 rounded-full p-1.5 text-white/70 hover:bg-white/10 hover:text-white transition-all shrink-0"
            >
              <FiX size={18} />
            </button>
          </div>
          <div className="flex-1 bg-slate-900">
            <iframe
              src={embedUrl}
              className="h-[70vh] w-full"
              title={paper.title}
              allow="autoplay"
            />
          </div>
          <div className="flex items-center justify-between border-t border-[#E5E7EB] px-5 py-3 bg-[#F8FAFC]">
            <span className="text-xs text-[#6B7280]">Google Drive preview</span>
            <a
              href={paper.driveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#0F4C81] hover:bg-[#1E88E5] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all"
            >
              <FiExternalLink size={13} /> Open in Drive
            </a>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Main Component ───
export default function CIAQuestionPapers() {
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSem, setSelectedSem] = useState(null);
  const [selectedCia, setSelectedCia] = useState(null);
  const [previewPaper, setPreviewPaper] = useState(null);

  const years = Object.entries(CIA_DATA).map(([key, val]) => ({
    key: Number(key),
    label: val.label,
    icon: val.icon,
    sub: `${Object.keys(val.semesters).length} semesters`,
  }));

  const sems =
    selectedYear != null
      ? Object.entries(CIA_DATA[selectedYear]?.semesters || {}).map(([key, val]) => ({
          key: Number(key),
          label: val.label,
          icon: null,
          sub: `${Object.keys(val.cia).length} assessments`,
        }))
      : [];

  const cias =
    selectedYear != null && selectedSem != null
      ? Object.entries(
          CIA_DATA[selectedYear]?.semesters[selectedSem]?.cia || {}
        ).map(([key, val]) => ({
          key: Number(key),
          label: val.label,
          icon: null,
          sub: `${val.papers.length} paper${val.papers.length !== 1 ? "s" : ""}`,
        }))
      : [];

  const currentPapers =
    selectedYear != null && selectedSem != null && selectedCia != null
      ? CIA_DATA[selectedYear]?.semesters[selectedSem]?.cia[selectedCia]?.papers || []
      : [];

  const yearLabel = selectedYear != null ? CIA_DATA[selectedYear]?.label : "";
  const semLabel =
    selectedSem != null
      ? CIA_DATA[selectedYear]?.semesters[selectedSem]?.label
      : "";
  const ciaLabel =
    selectedCia != null
      ? CIA_DATA[selectedYear]?.semesters[selectedSem]?.cia[selectedCia]?.label
      : "";

  const breadcrumbs = [
    "CIA Question Papers",
    ...(yearLabel ? [yearLabel] : []),
    ...(semLabel ? [semLabel] : []),
    ...(ciaLabel ? [ciaLabel] : []),
  ];

  function handleNavigate(breadcrumbIndex) {
    if (breadcrumbIndex === 0) {
      setSelectedYear(null);
      setSelectedSem(null);
      setSelectedCia(null);
    } else if (breadcrumbIndex === 1) {
      setSelectedSem(null);
      setSelectedCia(null);
    } else if (breadcrumbIndex === 2) {
      setSelectedCia(null);
    }
  }

  function handleSelectYear(key) {
    setSelectedYear(key);
    setSelectedSem(null);
    setSelectedCia(null);
  }

  function handleSelectSem(key) {
    setSelectedSem(key);
    setSelectedCia(null);
  }

  function handleSelectCia(key) {
    setSelectedCia(key);
  }

  function goBack() {
    if (selectedCia != null) {
      setSelectedCia(null);
    } else if (selectedSem != null) {
      setSelectedSem(null);
    } else if (selectedYear != null) {
      setSelectedYear(null);
    }
  }

  return (
    <div className="mx-auto min-h-[70vh] max-w-5xl px-4 py-8 sm:px-6 bg-[#F8FAFC]">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-[#0F4C81] text-white shadow-sm">
              <FiAward size={26} />
            </div>
            <div className="text-left">
              <h1 className="font-sans text-2xl font-bold text-[#0F4C81]">
                CIA Question Papers
              </h1>
              <p className="mt-1 text-sm text-[#6B7280]">
                Practice with Continuous Internal Assessment question papers
              </p>
            </div>
          </div>
        </motion.div>

        {/* Breadcrumbs */}
        <Breadcrumb crumbs={breadcrumbs} onNavigate={handleNavigate} />

        {/* Back button (mobile-friendly) */}
        {(selectedYear != null || selectedSem != null || selectedCia != null) && (
          <div className="text-left">
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={goBack}
              className="mb-4 inline-flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-3.5 py-2 text-xs font-semibold text-[#4B5563] transition-all hover:bg-[#F8FAFC] hover:text-slate-900"
            >
              <FiChevronLeft size={14} /> Back
            </motion.button>
          </div>
        )}

        {/* Content */}
        {selectedYear == null && (
          <div className="text-left">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-[#0F4C81]/10 text-[#0F4C81] text-xs font-bold border border-[#0F4C81]/25">
                <FiFolder size={14} />
              </div>
              <div>
                <h2 className="font-sans text-base font-bold text-[#0F4C81]">
                  Select Year
                </h2>
                <p className="text-[11px] text-[#6B7280]">Choose your academic year</p>
              </div>
            </div>
            <SelectionGrid items={years} onSelect={handleSelectYear} prefix="year" />
          </div>
        )}

        {selectedYear != null && selectedSem == null && (
          <div className="text-left">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-[#2E7D32]/10 text-[#2E7D32] text-xs font-bold border border-[#2E7D32]/25">
                <FiFolder size={14} />
              </div>
              <div>
                <h2 className="font-sans text-base font-bold text-[#0F4C81]">
                  {yearLabel} — Semesters
                </h2>
                <p className="text-[11px] text-[#6B7280]">Choose a semester</p>
              </div>
            </div>
            <SelectionGrid items={sems} onSelect={handleSelectSem} prefix="sem" />
          </div>
        )}

        {selectedYear != null && selectedSem != null && selectedCia == null && (
          <div className="text-left">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-[#1E88E5]/10 text-[#0F4C81] text-xs font-bold border border-[#1E88E5]/25">
                <FiAward size={14} />
              </div>
              <div>
                <h2 className="font-sans text-base font-bold text-[#0F4C81]">
                  {yearLabel} — {semLabel}
                </h2>
                <p className="text-[11px] text-[#6B7280]">Choose a CIA assessment</p>
              </div>
            </div>
            <SelectionGrid items={cias} onSelect={handleSelectCia} prefix="cia" />
          </div>
        )}

        {selectedYear != null && selectedSem != null && selectedCia != null && (
          <div className="text-left">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-[#0F4C81]/10 text-[#0F4C81] text-xs font-bold border border-[#0F4C81]/25">
                <FiFileText size={14} />
              </div>
              <div>
                <h2 className="font-sans text-base font-bold text-[#0F4C81]">
                  {yearLabel} — {semLabel} — {ciaLabel}
                </h2>
                <p className="text-[11px] text-[#6B7280]">
                  {currentPapers.length} question paper
                  {currentPapers.length !== 1 ? "s" : ""} available
                </p>
              </div>
            </div>

            {currentPapers.length === 0 ? (
              <EmptyState
                title="No CIA Question Papers Available Yet"
                description="Papers will appear here once they are uploaded. Stay tuned!"
                icon={FiFileText}
              />
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {currentPapers.map((paper) => (
                  <PaperCard
                      key={paper.id}
                      paper={paper}
                      onPreview={setPreviewPaper}
                    />
                ))}
              </div>
            )}
          </div>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-10 text-center text-[11px] text-[#6B7280]"
        >
          DDGD Vaishnav College · Department of Computer Science
        </motion.p>
      </motion.div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewPaper && (
          <PreviewModal paper={previewPaper} onClose={() => setPreviewPaper(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
