// src/components/dashboard/DocumentCard.jsx
// Premium document card with glassmorphism and PDF counter.
import { FiFileText, FiDownload, FiEye, FiBookmark, FiClock, FiHardDrive, FiChevronRight } from "react-icons/fi";
import { motion } from "framer-motion";
import { truncate } from "../../utils/helpers";

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
      <div className="group relative flex flex-col gap-3 overflow-hidden rounded-2xl bg-white/80 backdrop-blur-glass border border-white/30 shadow-glass transition-all duration-300 hover:shadow-glass-lg hover:bg-white/90 hover:-translate-y-0.5">
        {/* Glass shine */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-tr from-transparent via-white/30 to-transparent pointer-events-none" />
        
        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative p-5 flex flex-col gap-3">
          <div className="flex items-start gap-3">
            {/* PDF icon */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 transition-transform group-hover:scale-105">
              <FiFileText size={22} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-display text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                {doc.title}
              </h3>
              <p className="mt-0.5 text-xs text-gray-500">
                {doc.subject}
                {doc.semester ? ` · Sem ${doc.semester}` : ""}
                {metaExtra ? ` · ${metaExtra}` : ""}
              </p>
            </div>
            <button
              onClick={() => onBookmark(doc.id)}
              className={`shrink-0 rounded-lg p-1.5 transition-all ${
                bookmarked
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-400 hover:text-blue-600 hover:bg-blue-50"
              }`}
              title={bookmarked ? "Remove bookmark" : "Bookmark"}
            >
              <FiBookmark size={15} fill={bookmarked ? "currentColor" : "none"} />
            </button>
          </div>

          <p className="text-xs leading-relaxed text-gray-500 line-clamp-2">
            {truncate(doc.description, 100)}
          </p>

          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-2">
            {doc.pages && (
              <span className="badge-primary">
                <FiHardDrive size={10} /> {doc.pages} pages
              </span>
            )}
            {doc.downloads && (
              <span className="badge-success">
                <FiDownload size={10} /> {formatDownloads(doc.downloads)} downloads
              </span>
            )}
            {doc.year && doc.regulation && (
              <span className="badge-cyan">
                <FiClock size={10} /> {doc.year} · {doc.regulation}
              </span>
            )}
            {doc.facultyName && (
              <span className="text-[11px] text-gray-400">{doc.facultyName}</span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={() => onPreview(doc)}
              className="group/preview flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white/80 py-2.5 text-xs font-semibold text-gray-700 transition-all hover:bg-blue-600 hover:text-white hover:border-blue-600 active:scale-[0.98]"
            >
              <FiEye size={14} /> Preview
            </button>
            <a
              href={doc.fileUrl}
              download
              target="_blank"
              rel="noreferrer"
              className="group/download flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 py-2.5 text-xs font-semibold text-white shadow-soft transition-all hover:shadow-premium active:scale-[0.98]"
            >
              <FiDownload size={14} /> Download
              <FiChevronRight size={12} className="opacity-0 -translate-x-1 group-hover/download:opacity-100 group-hover/download:translate-x-0 transition-all" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
