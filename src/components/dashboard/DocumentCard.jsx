// src/components/dashboard/DocumentCard.jsx
import { FiFileText, FiDownload, FiEye, FiBookmark, FiClock, FiHardDrive, FiChevronRight } from "react-icons/fi";
import { motion } from "framer-motion";
import { truncate } from "../../utils/helpers";
import { downloadDriveFile } from "../../utils/downloadUtils";

function formatDownloads(n) {
  if (!n) return null;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n;
}

export default function DocumentCard({ doc, onPreview, onBookmark, bookmarked, metaExtra }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="group relative flex flex-col gap-3 overflow-hidden rounded-xl bg-white border border-[#E5E7EB] shadow-sm transition-all duration-300 hover:shadow-sm text-left">
        <div className="relative p-5 flex flex-col gap-3">
          <div className="flex items-start gap-3">
            {/* PDF icon */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#0F4C81]/10 text-[#0F4C81] transition-transform">
              <FiFileText size={22} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-sans text-sm font-semibold text-[#0F4C81] group-hover:text-[#1E88E5] transition-colors">
                {doc.title}
              </h3>
              <p className="mt-0.5 text-xs text-[#6B7280]">
                {doc.subject}
                {doc.semester ? ` · Sem ${doc.semester}` : ""}
                {metaExtra ? ` · ${metaExtra}` : ""}
              </p>
            </div>
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
          </div>

          <p className="text-xs leading-relaxed text-[#6B7280] line-clamp-2">
            {truncate(doc.description, 100)}
          </p>

          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-2">
            {doc.pages && (
              <span className="inline-flex items-center gap-1 rounded bg-[#0F4C81]/10 px-2 py-0.5 text-[10px] font-semibold text-[#0F4C81]">
                <FiHardDrive size={10} /> {doc.pages} pages
              </span>
            )}
            {doc.downloads && (
              <span className="inline-flex items-center gap-1 rounded bg-[#2E7D32]/10 px-2 py-0.5 text-[10px] font-semibold text-[#2E7D32]">
                <FiDownload size={10} /> {formatDownloads(doc.downloads)} downloads
              </span>
            )}
            {doc.year && doc.regulation && (
              <span className="inline-flex items-center gap-1 rounded bg-[#1E88E5]/10 px-2 py-0.5 text-[10px] font-semibold text-[#0F4C81]">
                <FiClock size={10} /> {doc.year} · {doc.regulation}
              </span>
            )}
            {doc.facultyName && (
              <span className="text-[11px] text-[#6B7280] ml-auto">{doc.facultyName}</span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => onPreview(doc)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] py-2.5 text-xs font-semibold text-[#4B5563] transition-all hover:bg-slate-100 hover:text-slate-900"
            >
              <FiEye size={14} /> Preview
            </button>
            <button
              onClick={() => downloadDriveFile(doc.fileUrl || doc.driveUrl || doc.fileId || doc.id, doc.title)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#0F4C81] hover:bg-[#1E88E5] py-2.5 text-xs font-bold text-white shadow-sm transition-all active:scale-95"
            >
              <FiDownload size={14} /> Download
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
