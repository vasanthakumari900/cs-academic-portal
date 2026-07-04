// src/pages/Search.jsx
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiPlayCircle, FiFileText, FiBriefcase, FiSearch } from "react-icons/fi";
import { globalSearch } from "../services/searchService";
import SkeletonCard from "../components/ui/SkeletonCard";
import EmptyState from "../components/ui/EmptyState";
import GlassCard from "../components/ui/GlassCard";

const sections = [
  { key: "videos", label: "Videos", icon: FiPlayCircle, link: "/e-content", color: "text-maroon dark:text-gold" },
  { key: "notes", label: "Lecture Notes", icon: FiFileText, link: "/notes", color: "text-accent" },
  { key: "questionPapers", label: "Question Papers", icon: FiFileText, link: "/question-papers", color: "text-secondary" },
  { key: "placements", label: "Placements", icon: FiBriefcase, link: "/placements", color: "text-success" },
];

export default function Search() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const [query, setQuery] = useState(q);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q) { setResults(null); return; }
    setLoading(true);
    globalSearch(q).then(setResults).finally(() => setLoading(false));
  }, [q]);

  function handleSubmit(e) {
    e.preventDefault();
    setParams(query.trim() ? { q: query.trim() } : {});
  }

  const total = results
    ? results.videos.length + results.notes.length + results.questionPapers.length + results.placements.length
    : 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold">Global Search</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Search across videos, notes, question papers and placements.
        </p>

        <form onSubmit={handleSubmit} className="relative mt-6">
          <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search…"
            className="w-full rounded-2xl border border-slate-200/80 bg-white/90 py-4 pl-12 pr-4 text-base outline-none ring-primary/30 focus:ring-2 focus:bg-white dark:border-slate-700/80 dark:bg-dark-card/60 dark:focus:bg-dark-card"
          />
        </form>
      </motion.div>

      {loading && (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {!loading && q && results && total === 0 && (
        <div className="mt-8">
          <EmptyState title={`No results for "${q}"`} description="Try different keywords or browse modules directly." />
        </div>
      )}

      {!loading && results && total > 0 && (
        <div className="mt-8 space-y-10">
          <p className="text-sm text-slate-500">{total} result{total !== 1 ? "s" : ""} for &ldquo;{q}&rdquo;</p>
          {sections.map(({ key, label, icon: Icon, link, color }) => {
            const items = results[key];
            if (!items?.length) return null;
            return (
              <section key={key}>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
                    <Icon className={color} /> {label}
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-white/10">{items.length}</span>
                  </h2>
                  <Link to={link} className="text-sm text-maroon dark:text-gold hover:underline">View all</Link>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {items.slice(0, 6).map((item) => (
                    <GlassCard key={item.id} hover>
                      <h3 className="font-semibold">{item.title || item.companyName}</h3>
                      <p className="mt-1 text-sm text-slate-500 line-clamp-2">{item.description || item.role || item.driveDetails}</p>
                      {item.subject && <span className="mt-2 inline-block rounded-full bg-maroon/10 px-2 py-0.5 text-xs text-maroon dark:bg-gold/10 dark:text-gold">{item.subject}</span>}
                    </GlassCard>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
