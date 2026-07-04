// src/components/dashboard/DocumentCard.jsx
// Shared card for Notes and Question Papers (both are PDFs).
import { FiFileText, FiDownload, FiEye, FiBookmark, FiClock, FiHardDrive } from "react-icons/fi";
import { motion } from "framer-motion";
import GlassCard from "../ui/GlassCard";
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
      <GlassCard className="group relative flex flex-col gap-3 overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5">
        {/* Top accent stripe */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-maroon to-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="flex items-start gap-3">
          {/* PDF icon with gradient background */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-maroon/20 to-gold/20 text-maroon dark:text-gold ring-1 ring-maroon/10 dark:ring-gold/10 transition-transform group-hover:scale-105">
            <FiFileText size={22} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-display text-sm font-semibold text-dark group-hover:text-maroon dark:text-white dark:group-hover:text-gold transition-colors">
              {doc.title}
            </h3>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {doc.subject}
              {doc.semester ? ` · Sem ${doc.semester}` : ""}
              {metaExtra ? ` · ${metaExtra}` : ""}
            </p>
          </div>
          <button
            onClick={() => onBookmark(doc.id)}
            className={`shrink-0 rounded-lg p-1.5 transition-all ${
              bookmarked
                ? "text-maroon dark:text-gold bg-maroon/10 dark:bg-gold/10"
                : "text-slate-400 hover:text-maroon dark:hover:text-gold hover:bg-maroon/5 dark:hover:bg-gold/5"
            }`}
            title={bookmarked ? "Remove bookmark" : "Bookmark"}
          >
            <FiBookmark size={15} fill={bookmarked ? "currentColor" : "none"} />
          </button>
        </div>

        <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2">
          {truncate(doc.description, 100)}
        </p>

        {/* Metadata badges */}
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          {doc.pages && (
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-slate-500 dark:bg-white/5 dark:text-slate-400">
              <FiHardDrive size={11} /> {doc.pages} pages
            </span>
          )}
          {doc.downloads && (
            <span className="inline-flex items-center gap-1 rounded-md bg-maroon/5 px-2 py-0.5 text-maroon dark:bg-gold/5 dark:text-gold">
              <FiDownload size={11} /> {formatDownloads(doc.downloads)} downloads
            </span>
          )}
          {doc.year && doc.regulation && (
            <span className="inline-flex items-center gap-1 rounded-md bg-accent/5 px-2 py-0.5 text-accent">
              <FiClock size={11} /> {doc.year} · {doc.regulation}
            </span>
          )}
          {doc.facultyName && (
            <span className="text-slate-400 dark:text-slate-500">{doc.facultyName}</span>
          )}
        </div>

        {/* Action buttons */}
        <div className="mt-auto flex gap-2 pt-1">
          <button
            onClick={() => onPreview(doc)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-maroon/20 bg-white/80 py-2.5 text-xs font-semibold text-maroon transition-all hover:bg-maroon hover:text-white hover:shadow-md active:scale-[0.98] dark:border-gold/20 dark:bg-dark-card/60 dark:text-gold dark:hover:bg-gold dark:hover:text-dark"
          >
            <FiEye size={14} /> Preview
          </button>
          <a
            href={doc.fileUrl}
            download
            target="_blank"
            rel="noreferrer"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-maroon to-gold py-2.5 text-xs font-semibold text-white shadow-md transition-all hover:brightness-110 hover:shadow-lg active:scale-[0.98]"
          >
            <FiDownload size={14} /> Download
          </a>
        </div>
      </GlassCard>
    </motion.div>
  );
}
