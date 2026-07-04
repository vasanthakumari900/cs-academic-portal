// src/components/layout/GlobalSearch.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function GlobalSearch({ compact = false }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setOpen(false);
    setQuery("");
  }

  if (compact) {
    return (
      <>
        <button
          onClick={() => setOpen(true)}
          aria-label="Search"
          className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
        >
          <FiSearch size={18} />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-24 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            >
              <motion.form
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onSubmit={handleSubmit}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-700 dark:bg-dark"
              >
                <div className="flex items-center gap-2">
                  <FiSearch className="text-slate-400" />
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search videos, notes, papers, placements…"
                    className="flex-1 bg-transparent py-2 text-sm outline-none dark:text-white"
                  />
                  <button type="button" onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <FiX size={18} />
                  </button>
                </div>
              </motion.form>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative hidden md:block">
      <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Global search…"
        className="w-48 rounded-full border border-slate-200 bg-bg py-2 pl-9 pr-3 text-sm outline-none ring-primary focus:w-64 focus:ring-2 transition-all dark:border-slate-700 dark:bg-white/5 lg:w-56"
      />
    </form>
  );
}
