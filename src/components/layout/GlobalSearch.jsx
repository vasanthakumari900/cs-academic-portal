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
          className="flex h-9 w-9 items-center justify-center rounded-full text-white/50 hover:bg-white/10 hover:text-white transition-all"
        >
          <FiSearch size={18} />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-24 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            >
              <motion.form
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onSubmit={handleSubmit}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-xl rounded-2xl border border-white/10 bg-[#0F172A]/95 backdrop-blur-xl p-4 shadow-glass-xl"
              >
                <div className="flex items-center gap-2">
                  <FiSearch className="text-white/40" />
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search videos, notes, papers, placements…"
                    className="flex-1 bg-transparent py-2 text-sm outline-none text-white placeholder:text-white/40"
                  />
                  <button type="button" onClick={() => setOpen(false)} className="text-white/40 hover:text-white transition-all">
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
      <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Global search…"
        className="w-48 rounded-full border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm outline-none text-white placeholder:text-white/40 focus:w-64 focus:ring-2 focus:ring-cyan-400/20 transition-all lg:w-56"
      />
    </form>
  );
}
