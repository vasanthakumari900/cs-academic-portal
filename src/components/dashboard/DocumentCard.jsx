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
      <div className="group relative flex flex-col gap-3 overflow-hidden rounded-xl bg-white border border-[#E5E7EB] shadow-sm transition-all duration-300 hover:shadow-md text-left p-5">
        <div className="flex items-start gap-3">
          {/* PDF icon */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#0F4C81]/10 text-[#0F4C81]">
            <FiFileText size={22} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-sans text-sm font-semibold text-[#0F4C81] group-hover:text-[#1E88E5] transition-colors" title={title}>
              {title}
            </h3>
            <p className="mt-0.5 text-xs text-[#6B7280]">
              {subject}
              {semStr ? ` · ${semStr}` : ""}
              {metaExtra ? ` · ${metaExtra}` : ""}
            </p>
          </div>
          {onBookmark && (
            <button
              onClick={() => onBookmark(doc.id)}
              className={`shrink-0 rounded-lg p-1.5 transition-all ${
                bookmarked
                  ? "text-[#0F4C81] bg-[#0F4C81]/10"
                  : "text-[#6B7280] hover:text-[#0F4C81] hover:bg-[#0F4C81]/10"
              }`}
              title={bookmarked ? "Remove bookmark" : "Bookmark"}
            >
              <FiBookmark size={15} fill={bookmarked ? "currentColor" : "none"} />
            </button>
          )}
        </div>

        {doc.description && (
          <p className="text-xs leading-relaxed text-[#6B7280] line-clamp-2">
            {truncate(doc.description, 100)}
          </p>
        )}

        {/* Detailed Metadata Grid */}
        <div className="rounded-lg bg-slate-50 p-2.5 text-[11px] space-y-1 border border-slate-100">
          <div className="flex items-center justify-between text-slate-600">
            <span className="font-semibold text-slate-500">File Name:</span>
            <span className="font-mono text-slate-800 truncate max-w-[170px]" title={fileName}>
              {fileName}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-600">
            <span className="font-semibold text-slate-500">Academic Info:</span>
            <span className="font-medium text-[#0F4C81]">
              {[yearStr, semStr, unitStr].filter(Boolean).join(" · ") || "Department File"}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-500 text-[10px] pt-0.5">
            <span className="flex items-center gap-1">
              <FiCalendar size={10} /> {formatDate(dateStr)}
            </span>
            <span className="flex items-center gap-1 font-semibold text-slate-700">
              <FiHardDrive size={10} /> {sizeStr}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={handleView}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all"
          >
            <FiEye size={14} /> View PDF
          </button>

          <button
            onClick={handleDownload}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#0F4C81] hover:bg-[#1E88E5] py-2 text-xs font-bold text-white shadow-sm transition-all active:scale-95"
          >
            <FiDownload size={14} /> Download PDF
          </button>
        </div>
      </div>
    </motion.div>
  );
}
