import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiPlayCircle, FiFileText, FiBriefcase, FiSearch, FiBookOpen, FiArrowRight } from "react-icons/fi";
import { globalSearch } from "../services/searchService";
import SkeletonCard from "../components/ui/SkeletonCard";
import EmptyState from "../components/ui/EmptyState";

const sections = [
  { key: "videos", label: "Videos", icon: FiPlayCircle, link: "/e-content", color: "from-indigo-600 to-violet-600" },
  { key: "notes", label: "Lecture Notes", icon: FiFileText, link: "/notes", color: "from-emerald-500 to-teal-600" },
  { key: "questionPapers", label: "Question Papers", icon: FiBookOpen, link: "/question-papers", color: "from-amber-500 to-orange-600" },
  { key: "placements", label: "Placements", icon: FiBriefcase, link: "/placements", color: "from-rose-500 to-pink-600" },
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

  const total = results ? results.videos.length + results.notes.length + results.questionPapers.length + results.placements.length : 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-[0_8px_32px_rgba(79,70,229,0.2)]"><FiSearch size={36} /></div>
        <h1 className="mb-2 font-display text-4xl font-bold text-white">Global Search</h1>
        <p className="text-sm text-white/50">Search across videos, notes, question papers and placements</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <form onSubmit={handleSubmit} className="relative mx-auto max-w-2xl">
          <div className="relative overflow-hidden rounded-2xl glass-card transition-all duration-300 focus-within:shadow-xl focus-within:border-blue-200">
            <FiSearch className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Type to search across all content…"
              className="w-full bg-transparent py-4 pl-14 pr-4 text-base outline-none text-white placeholder:text-white/40"
            />
          </div>
          <p className="mt-3 text-center text-[11px] text-white/40">Search across {sections.map(s => s.label).join(", ")}</p>
        </form>
      </motion.div>

      {loading && (
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => <div key={i}><SkeletonCard /></div>)}
        </div>
      )}

      {!loading && q && results && total === 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-10">
          <EmptyState title={`No results for "${q}"`} description="Try different keywords or browse modules directly." />
        </motion.div>
      )}

      {!loading && results && total > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-10 space-y-12">
          <p className="text-sm text-white/50">
            <span className="font-semibold text-white">{total}</span> result{total !== 1 ? "s" : ""} for &ldquo;<span className="font-semibold text-white/70">{q}</span>&rdquo;
          </p>

          {sections.map(({ key, label, icon: Icon, link, color }) => {
            const items = results[key];
            if (!items?.length) return null;
            return (
              <motion.section key={key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-white shadow-sm`}><Icon size={16} /></div>
                    <h2 className="font-display text-lg font-bold text-white">{label}</h2>
                    <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold text-white/50">{items.length}</span>
                  </div>
                  <Link to={link} className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">View all <FiArrowRight size={12} /></Link>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {items.slice(0, 6).map((item) => (
                    <div key={item.id}
                      className="group relative overflow-hidden rounded-2xl glass-card p-4 transition-all duration-300 hover:shadow-xl"
                    >
                      <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                      <h3 className="font-display text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{item.title || item.companyName}</h3>
                      <p className="mt-1 text-xs text-white/50 line-clamp-2">{item.description || item.role}</p>
                      {item.subject && <span className={`mt-2 inline-flex items-center gap-1 rounded-full bg-gradient-to-r ${color} px-2.5 py-0.5 text-[10px] font-bold text-white`}>{item.subject}</span>}
                    </div>
                  ))}
                </div>
              </motion.section>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
