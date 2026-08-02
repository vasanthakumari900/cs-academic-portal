// src/components/common/PdfFileCard.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  FiFileText,
  FiDownload,
  FiEye,
  FiCalendar,
  FiHardDrive,
  FiBookOpen,
} from "react-icons/fi";
import {
  downloadDriveFile,
  getDriveEmbedUrl,
  formatFileSize,
  ensurePdfExtension,
} from "../../utils/downloadUtils";
import { formatDate } from "../../utils/helpers";
import { getSubjectIcon } from "../../utils/subjectIcons";

export default function PdfFileCard({ file, onView }) {
  if (!file) return null;

  // Extract properties with fallbacks
  const title = file.title || file.name || "PDF Document";
  const fileName = ensurePdfExtension(file.fileName || file.title || "document.pdf");
  const targetUrl = file.fileUrl || file.driveUrl || file.fileId || file.link || file.url || "";
  const subject = file.subject || file.category || "Computer Science";
  const year = file.year ? (typeof file.year === "number" ? `${file.year}${file.year === 1 ? "st" : file.year === 2 ? "nd" : "rd"} Year` : file.year) : null;
  const semester = file.semester ? `Sem ${file.semester}` : null;
  const unit = file.unit ? (typeof file.unit === "number" ? `Unit ${file.unit}` : file.unit) : null;
  const uploadDate = file.uploadedDate || file.uploadDate || file.date || "2024-05-15";
  const fileSize = formatFileSize(file.size || file.fileSize || file.pages ? `${file.pages} pages` : null);

  function handleView() {
    if (onView) {
      onView({ ...file, embedUrl: getDriveEmbedUrl(targetUrl) });
    } else {
      window.open(getDriveEmbedUrl(targetUrl), "_blank");
    }
  }

  function handleDownload() {
    downloadDriveFile(targetUrl, fileName, {
      title,
      fileName,
      subject,
      year,
      semester,
      unit,
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.015, boxShadow: "0 14px 28px -6px rgba(2, 28, 79, 0.1)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-xl bg-white dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 shadow-sm transition-all duration-300 hover:border-[#0F4C81]/40 text-left p-5 gap-4"
    >
      <div className="space-y-3">
        {/* Header Icon + Title */}
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#FAF7F2] border border-[#E6DAB8] shadow-sm">
            {getSubjectIcon(subject, 22)}
          </div>

          <div className="min-w-0 flex-1">
            <h3
              className="font-sans text-sm font-bold text-[#0F4C81] dark:text-slate-100 group-hover:text-[#1E88E5] transition-colors truncate"
              title={title}
            >
              {title}
            </h3>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 truncate flex items-center gap-1.5">
              <FiBookOpen size={12} className="shrink-0" />
              {subject}
            </p>
          </div>
        </div>

        {/* Detailed Metadata Grid */}
        <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 p-3 text-[11px] space-y-1.5 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
            <span className="font-semibold text-slate-500">File Name:</span>
            <span className="font-mono text-slate-800 dark:text-slate-200 truncate max-w-[170px]" title={fileName}>
              {fileName}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-1 text-slate-600 dark:text-slate-300">
            <span className="font-semibold text-slate-500">Academic Info:</span>
            <span className="font-medium text-[#0F4C81] dark:text-sky-400">
              {[year, semester, unit].filter(Boolean).join(" · ") || "All Semesters"}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[10px]">
            <span className="flex items-center gap-1">
              <FiCalendar size={11} /> {formatDate(uploadDate)}
            </span>
            <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
              <FiHardDrive size={11} /> {fileSize}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons: View PDF & Download PDF */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={handleView}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#E5E7EB] dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 transition-all"
        >
          <FiEye size={14} /> View PDF
        </button>

        <button
          onClick={handleDownload}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#0F4C81] hover:bg-[#1E88E5] px-3 py-2 text-xs font-bold text-white shadow-sm transition-all active:scale-95"
        >
          <FiDownload size={14} /> Download PDF
        </button>
      </div>
    </motion.div>
  );
}
