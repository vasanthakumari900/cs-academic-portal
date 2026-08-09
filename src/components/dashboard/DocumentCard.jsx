// src/components/dashboard/DocumentCard.jsx
import {
  FiFileText,
  FiDownload,
  FiEye,
  FiBookmark,
  FiHardDrive,
  FiCalendar,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { truncate, formatDate } from "../../utils/helpers";
import {
  downloadDriveFile,
  formatFileSize,
  ensurePdfExtension,
  getDriveEmbedUrl,
} from "../../utils/downloadUtils";

export default function DocumentCard({ doc, onPreview, onBookmark, bookmarked, metaExtra }) {
  if (!doc) return null;

  const targetUrl = doc.fileUrl || doc.driveUrl || doc.fileId || doc.id || "";

  const title = doc.title || "PDF Document";
  const fileName = ensurePdfExtension(doc.fileName || doc.title || "document.pdf");
  const subject = doc.subject || "Computer Science";
  const yearStr = doc.year ? (typeof doc.year === "number" ? `${doc.year}${doc.year === 1 ? "st" : doc.year === 2 ? "nd" : "rd"} Year` : doc.year) : null;
  const semStr = doc.semester ? `Sem ${doc.semester}` : null;
  const unitStr = doc.unit ? (typeof doc.unit === "number" ? `Unit ${doc.unit}` : doc.unit) : null;
  const dateStr = doc.uploadedDate || doc.uploadDate || doc.createdAt || "2024-05-15";
  const sizeStr = formatFileSize(doc.size || doc.fileSize || (doc.pages ? `${doc.pages} pages` : null));

  function handleView() {
    if (onPreview) {
      onPreview({ ...doc, embedUrl: getDriveEmbedUrl(targetUrl) });
    } else {
      window.open(getDriveEmbedUrl(targetUrl), "_blank");
    }
  }

  function handleDownload() {
    downloadDriveFile(targetUrl, fileName, { title, fileName, subject });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div style={{ padding:'var(--fluid-pad-card)' }} className="group relative flex flex-col gap-3 overflow-hidden rounded-2xl bg-white dark:bg-teal-950/80 border border-[#5EEAD4]/40 dark:border-teal-800 shadow-neu-raised transition-all duration-200 hover:shadow-neu-raised-lg hover:border-[#0D9488] dark:hover:border-[#2DD4BF] text-left">
        <div className="flex items-start gap-3">
          {/* PDF icon */}
          <div style={{ height:'var(--fluid-icon-lg)', width:'var(--fluid-icon-lg)' }} className="flex shrink-0 items-center justify-center rounded-xl bg-[#0D9488]/10 text-[#0D9488] dark:bg-teal-900/40 dark:text-teal-200">
            <FiFileText size={22} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 style={{ fontSize: 'clamp(0.8rem, 1.5vw + 0.3rem, 1rem)' }} className="truncate font-mono font-bold text-[#134E4A] dark:text-[#CCFBF1] group-hover:text-[#0D9488] transition-colors" title={title}>
              {title}
            </h3>
            <p className="mt-0.5 text-xs text-[#64748B] dark:text-[#5EEAD4]/80">
              {subject}
              {semStr ? ` · ${semStr}` : ""}
              {metaExtra ? ` · ${metaExtra}` : ""}
            </p>
          </div>
          {onBookmark && (
            <button
              onClick={() => onBookmark(doc.id)}
              className={`shrink-0 rounded-xl p-2 transition-all cursor-pointer ${
                bookmarked
                  ? "text-[#0D9488] bg-[#0D9488]/15 dark:bg-teal-900/60"
                  : "text-[#64748B] hover:text-[#0D9488] hover:bg-[#0D9488]/10"
              }`}
              title={bookmarked ? "Remove bookmark" : "Bookmark"}
            >
              <FiBookmark size={16} fill={bookmarked ? "currentColor" : "none"} />
            </button>
          )}
        </div>

        {doc.description && (
          <p className="text-xs leading-relaxed text-[#134E4A]/80 dark:text-[#99F6E4]/80 line-clamp-2">
            {truncate(doc.description, 100)}
          </p>
        )}

        {/* Detailed Metadata Grid */}
        <div className="rounded-xl bg-[#F0FDFA] dark:bg-teal-900/30 p-3 text-[11px] space-y-1 border border-[#5EEAD4]/30 dark:border-teal-800">
          <div className="flex items-center justify-between text-[#134E4A] dark:text-[#CCFBF1]">
            <span className="font-semibold text-[#64748B] dark:text-[#5EEAD4]/70">File Name:</span>
            <span className="font-mono text-[#134E4A] dark:text-[#CCFBF1] truncate max-w-[170px]" title={fileName}>
              {fileName}
            </span>
          </div>

          <div className="flex items-center justify-between text-[#134E4A] dark:text-[#CCFBF1]">
            <span className="font-semibold text-[#64748B] dark:text-[#5EEAD4]/70">Academic Info:</span>
            <span className="font-semibold text-[#0D9488] dark:text-[#2DD4BF]">
              {[yearStr, semStr, unitStr].filter(Boolean).join(" · ") || "Department File"}
            </span>
          </div>

          <div className="flex items-center justify-between text-[#64748B] dark:text-[#5EEAD4]/70 text-[10px] pt-1 border-t border-[#5EEAD4]/20">
            <span className="flex items-center gap-1">
              <FiCalendar size={11} /> {formatDate(dateStr)}
            </span>
            <span className="flex items-center gap-1 font-bold text-[#134E4A] dark:text-[#CCFBF1]">
              <FiHardDrive size={11} /> {sizeStr}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={handleView}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#5EEAD4] bg-white dark:bg-teal-950/90 py-2.5 text-xs font-semibold text-[#134E4A] dark:text-[#CCFBF1] hover:bg-[#CCFBF1]/30 hover:text-[#0D9488] transition-all cursor-pointer"
          >
            <FiEye size={14} /> View PDF
          </button>

          <button
            onClick={handleDownload}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] py-2.5 text-xs font-bold text-white shadow-neu-raised transition-all cursor-pointer active:scale-[0.98]"
          >
            <FiDownload size={14} /> Download PDF
          </button>
        </div>
      </div>
    </motion.div>
  );
}

