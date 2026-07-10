// src/components/dashboard/PdfPreviewModal.jsx
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";

// react-pdf needs its worker configured once, pointed at a CDN build
// matching the installed pdfjs-dist version.
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

export default function PdfPreviewModal({ file, onClose }) {
  const [numPages, setNumPages] = useState(null);
  const [page, setPage] = useState(1);

  if (!file) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={(e) => e.stopPropagation()}
          className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-[#0F172A]/95 backdrop-blur-xl border border-white/10 shadow-glass-xl"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <h3 className="truncate font-display text-sm font-semibold text-white">{file.title}</h3>
            <button onClick={onClose} className="rounded-full p-1.5 text-white/50 hover:bg-white/10 hover:text-white transition-all">
              <FiX size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-auto bg-[#0B1121] p-4">
            <Document
              file={file.fileUrl}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              loading={<p className="text-center text-sm text-white/40">Loading PDF…</p>}
              error={<p className="text-center text-sm text-red-400">Could not load this PDF.</p>}
            >
              <Page pageNumber={page} width={520} />
            </Document>
          </div>

          {numPages && (
            <div className="flex items-center justify-center gap-4 border-t border-white/10 py-3">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="text-white/40 hover:text-white disabled:opacity-30 transition-all">
                <FiChevronLeft size={20} />
              </button>
              <span className="text-xs text-white/50">Page {page} of {numPages}</span>
              <button disabled={page >= numPages} onClick={() => setPage((p) => p + 1)} className="text-white/40 hover:text-white disabled:opacity-30 transition-all">
                <FiChevronRight size={20} />
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
