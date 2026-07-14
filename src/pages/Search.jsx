import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiPlayCircle, FiFileText, FiBriefcase, FiSearch, FiBookOpen, FiArrowRight } from "react-icons/fi";
import { globalSearch } from "../services/searchService";
import SkeletonCard from "../components/ui/SkeletonCard";
import EmptyState from "../components/ui/EmptyState";

const sections = [
  { key: "videos", label: "Videos", icon: FiPlayCircle, link: "/e-content", bgIcon: "bg-[#0F4C81]" },
  { key: "notes", label: "Lecture Notes", icon: FiFileText, link: "/notes", bgIcon: "bg-[#2E7D32]" },
  { key: "questionPapers", label: "Question Papers", icon: FiBookOpen, link: "/question-papers", bgIcon: "bg-[#1E88E5]" },
  { key: "placements", label: "Placements", icon: FiBriefcase, link: "/placements", bgIcon: "bg-[#0F4C81]" },
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
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 bg-[#F8FAFC]">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-xl bg-[#0F4C81] text-white shadow-sm"><FiSearch size={36} /></div>
        <h1 className="mb-2 font-sans text-4xl font-bold text-[#1F2937]">Global Search</h1>
        <p className="text-sm text-[#6B7280]">Search across videos, notes, question papers and placements</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <form onSubmit={handleSubmit} className="relative mx-auto max-w-2xl">
          <div className="relative overflow-hidden rounded-xl border border-[#E5E7EB] bg-white transition-all duration-300 focus-within:shadow-md focus-within:border-[#1E88E5]/40">
            <FiSearch className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Type to search across all content…"
              className="w-full bg-transparent py-4 pl-14 pr-4 text-base outline-none text-[#1F2937] placeholder:text-slate-400"
            />
          </div>
          <p className="mt-3 text-center text-[11px] text-[#6B7280]">Search across {sections.map(s => s.label).join(", ")}</p>
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
          <p className="text-sm text-[#6B7280]">
            <span className="font-semibold text-[#1F2937]">{total}</span> result{total !== 1 ? "s" : ""} for &ldquo;<span className="font-semibold text-[#4B5563]">{q}</span>&rdquo;
          </p>

          {sections.map(({ key, label, icon: Icon, link, bgIcon }) => {
            const items = results[key];
            if (!items?.length) return null;
            return (
              <motion.section key={key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-left">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${bgIcon} text-white shadow-sm`}><Icon size={16} /></div>
                    <h2 className="font-sans text-lg font-bold text-[#1F2937]">{label}</h2>
                    <span className="rounded-full bg-slate-100 border border-[#E5E7EB] px-2.5 py-0.5 text-[10px] font-bold text-[#4B5563]">{items.length}</span>
                  </div>
                  <Link to={link} className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E88E5] hover:text-[#0F4C81] transition-colors">View all <FiArrowRight size={12} /></Link>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {items.slice(0, 6).map((item) => (
                    <div key={item.id}
                      className="group relative overflow-hidden rounded-xl border border-[#E5E7EB] bg-white p-4 transition-all duration-300 hover:shadow-md hover:border-[#1E88E5]/30 text-left"
                    >
                      <h3 className="font-sans text-sm font-bold text-[#1F2937] group-hover:text-[#1E88E5] transition-colors">{item.title || item.companyName}</h3>
                      <p className="mt-1 text-xs text-[#6B7280] line-clamp-2">{item.description || item.role}</p>
                      {item.subject && <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#0F4C81]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#0F4C81]">{item.subject}</span>}
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
