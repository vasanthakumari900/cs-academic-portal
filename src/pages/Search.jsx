import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiPlayCircle, 
  FiFileText, 
  FiBriefcase, 
  FiSearch, 
  FiBookOpen, 
  FiArrowRight, 
  FiX, 
  FiExternalLink, 
  FiDownload,
  FiAward,
  FiZap
} from "react-icons/fi";
import { globalSearch } from "../services/searchService";
import SkeletonCard from "../components/ui/SkeletonCard";
import EmptyState from "../components/ui/EmptyState";
import PdfPreviewModal from "../components/dashboard/PdfPreviewModal";

function GlobalSearchBadgeLogo() {
  return (
    <div className="relative mb-6 group cursor-default">
      {/* Outer Glowing Radial Ring */}
      <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-[#0D9488] via-[#2DD4BF] to-[#D97706] opacity-70 blur-lg group-hover:opacity-100 transition-all duration-500 animate-pulse" />
      
      {/* 3D Search Orb Container */}
      <div className="relative flex h-24 sm:h-28 w-24 sm:w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-[#0D9488] via-[#0F766E] to-[#115E59] shadow-neu-raised-lg border-2 border-[#D97706] p-2 overflow-hidden text-white">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#2DD4BF_1px,transparent_1px)] [background-size:12px_12px] opacity-20" />
        
        {/* Central Search Emblem */}
        <div className="relative flex items-center justify-center">
          <FiSearch size={44} className="text-[#CCFBF1] drop-shadow-md group-hover:scale-110 transition-transform duration-300" />
          <FiZap size={18} className="absolute -top-1 -right-1 text-[#F59E0B] animate-bounce" />
        </div>

        {/* Bottom Floating Badge Tag */}
        <span className="absolute bottom-1 bg-[#D97706] text-white text-[9px] font-mono font-extrabold px-2 py-0.5 rounded-full shadow-md uppercase tracking-wider border border-white/30">
          INDEX SEARCH
        </span>
      </div>
    </div>
  );
}

const sections = [
  { key: "notes", label: "Lecture Notes", icon: FiFileText, link: "/notes", color: "from-teal-600 to-teal-800" },
  { key: "videos", label: "E-Content Videos", icon: FiPlayCircle, link: "/e-content", color: "from-emerald-600 to-teal-700" },
  { key: "questionPapers", label: "Question Papers", icon: FiBookOpen, link: "/question-papers", color: "from-amber-600 to-amber-800" },
  { key: "placements", label: "Placements", icon: FiBriefcase, link: "/placements", color: "from-teal-700 to-slate-800" },
];

export default function Search() {
  const [params, setParams] = useSearchParams();
  const initialQuery = params.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState("all");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewing, setPreviewing] = useState(null);
  const navigate = useNavigate();

  // Update input state if URL parameter changes
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  // Execute Search automatically on typing (debounced) or on submission
  useEffect(() => {
    const searchTerm = query.trim();
    if (!searchTerm) {
      setResults(null);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      globalSearch(searchTerm)
        .then(setResults)
        .finally(() => setLoading(false));
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  function handleSubmit(e) {
    e.preventDefault();
    if (query.trim()) {
      setParams({ q: query.trim() });
    } else {
      setParams({});
    }
  }

  function handleClear() {
    setQuery("");
    setParams({});
    setResults(null);
  }

  const totalResults = results
    ? (results.notes?.length || 0) +
      (results.videos?.length || 0) +
      (results.questionPapers?.length || 0) +
      (results.placements?.length || 0)
    : 0;

  return (
    <div className="min-h-screen bg-[#F0FDFA] dark:bg-[#042F2E] text-[#134E4A] dark:text-[#CCFBF1] transition-colors py-12 px-3 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        
        {/* GLOBAL SEARCH HEADER & PROMINENT LOGO */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center flex flex-col items-center"
        >
          {/* Distinct Custom 3D Global Search Emblem */}
          <GlobalSearchBadgeLogo />

          {/* Title & Subtitle */}
          <h1 className="mb-2 font-mono text-3xl sm:text-4xl font-extrabold text-[#134E4A] dark:text-[#CCFBF1] tracking-tight">
            Global Search
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-[#64748B] dark:text-[#5EEAD4]/80 max-w-md font-sans">
            Search across lecture notes, syllabus, e-content videos, question papers, and placement drives
          </p>
        </motion.div>

        {/* SEARCH INPUT BAR */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <form onSubmit={handleSubmit} className="relative mx-auto max-w-2xl">
            <div className="relative overflow-hidden rounded-2xl border-2 border-[#0D9488] bg-white dark:bg-teal-950 shadow-neu-raised transition-all focus-within:ring-4 focus-within:ring-[#5EEAD4]/30 flex items-center">
              <FiSearch className="absolute left-5 text-[#0D9488] dark:text-[#2DD4BF]" size={20} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Python, DBMS, OS, English, Question Papers, TCS..."
                className="w-full bg-transparent py-4 pl-14 pr-12 text-sm sm:text-base outline-none text-[#134E4A] dark:text-[#CCFBF1] placeholder:text-[#64748B]/70 font-sans"
                autoFocus
              />
              {query && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-4 p-1.5 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-teal-900 hover:text-slate-600 transition-all"
                  title="Clear search"
                >
                  <FiX size={18} />
                </button>
              )}
            </div>

            {/* Quick Keyword Suggestion Pills */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">Try searching:</span>
              {["Python", "DBMS", "Operating Systems", "English", "Question Papers", "Infosys", "Placements"].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setQuery(tag)}
                  className="rounded-full bg-white dark:bg-teal-900 px-3 py-1 text-[11px] font-mono font-bold text-[#0D9488] dark:text-[#2DD4BF] border border-[#5EEAD4]/50 hover:bg-[#0D9488] hover:text-white transition-all cursor-pointer shadow-2xs"
                >
                  {tag}
                </button>
              ))}
            </div>
          </form>
        </motion.div>

        {/* CATEGORY TABS & RESULTS COUNT */}
        {results && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[#5EEAD4]/30 pb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setActiveTab("all")}
                className={`rounded-xl px-4 py-2 text-xs font-mono font-bold transition-all cursor-pointer ${
                  activeTab === "all"
                    ? "bg-[#0D9488] text-white shadow-sm"
                    : "bg-white dark:bg-teal-950 text-[#134E4A] dark:text-[#CCFBF1] hover:bg-[#CCFBF1]/40 border border-[#5EEAD4]/40"
                }`}
              >
                All Results ({totalResults})
              </button>
              {sections.map(({ key, label, icon: Icon }) => {
                const count = results[key]?.length || 0;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-mono font-bold transition-all cursor-pointer ${
                      activeTab === key
                        ? "bg-[#0D9488] text-white shadow-sm"
                        : "bg-white dark:bg-teal-950 text-[#134E4A] dark:text-[#CCFBF1] hover:bg-[#CCFBF1]/40 border border-[#5EEAD4]/40"
                    }`}
                  >
                    <Icon size={14} />
                    <span>{label}</span>
                    <span className="rounded-full bg-black/10 dark:bg-white/10 px-1.5 py-0.2 text-[10px]">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
            
            <p className="text-xs font-mono text-[#64748B] dark:text-[#5EEAD4]/80">
              Found <strong className="text-[#0D9488] dark:text-[#2DD4BF]">{totalResults}</strong> result(s) for &ldquo;<span className="text-[#D97706]">{query}</span>&rdquo;
            </p>
          </div>
        )}

        {/* LOADING SKELETON STATE */}
        {loading && (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && query && results && totalResults === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-10">
            <EmptyState
              title={`No results found for "${query}"`}
              description="Check your spelling or try searching for broad terms like 'Python', 'DBMS', 'OS', 'Question Paper', or 'Placements'."
            />
          </motion.div>
        )}

        {/* SEARCH RESULTS DISPLAY */}
        {!loading && results && totalResults > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 space-y-10">
            {sections.map(({ key, label, icon: Icon, link, color }) => {
              if (activeTab !== "all" && activeTab !== key) return null;
              const items = results[key] || [];
              if (!items.length) return null;

              return (
                <section key={key} className="text-left space-y-4">
                  {/* Section Title Header */}
                  <div className="flex items-center justify-between border-b border-[#5EEAD4]/40 pb-2">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r ${color} text-white shadow-sm`}>
                        <Icon size={18} />
                      </div>
                      <h2 className="font-mono text-lg font-bold text-[#134E4A] dark:text-[#CCFBF1]">
                        {label}
                      </h2>
                      <span className="rounded-full bg-[#CCFBF1]/50 dark:bg-teal-900 px-2.5 py-0.5 text-xs font-mono font-bold text-[#0D9488] dark:text-[#2DD4BF] border border-[#5EEAD4]/50">
                        {items.length}
                      </span>
                    </div>
                    <Link
                      to={link}
                      className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#0D9488] dark:text-[#2DD4BF] hover:text-[#D97706] transition-colors"
                    >
                      Browse Module <FiArrowRight size={14} />
                    </Link>
                  </div>

                  {/* Results Grid */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border-2 border-[#5EEAD4]/50 dark:border-teal-800 bg-white dark:bg-teal-950 p-5 shadow-neu-raised hover:border-[#D97706] transition-all duration-300 text-left"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-mono text-sm font-bold text-[#134E4A] dark:text-[#CCFBF1] group-hover:text-[#0D9488] dark:group-hover:text-[#2DD4BF] transition-colors line-clamp-2">
                              {item.title || item.companyName}
                            </h3>
                            {item.unit && (
                              <span className="rounded-md bg-amber-100 dark:bg-amber-950/60 text-[#D97706] text-[10px] font-mono font-bold px-2 py-0.5 border border-amber-300 shrink-0">
                                {item.unit}
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-[#64748B] dark:text-[#5EEAD4]/80 line-clamp-2 font-sans mb-3">
                            {item.description || item.role || item.subject}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-[#5EEAD4]/20 text-xs">
                          {item.subject && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-[#CCFBF1]/40 dark:bg-teal-900/50 px-2 py-0.5 text-[10px] font-mono font-bold text-[#0D9488] dark:text-[#2DD4BF] truncate max-w-[180px]">
                              {item.subject}
                            </span>
                          )}

                          {/* Dynamic Direct Action Button */}
                          {item.fileUrl ? (
                            <button
                              onClick={() => setPreviewing({ name: item.title, title: item.title, fileUrl: item.fileUrl })}
                              className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#D97706] hover:underline cursor-pointer ml-auto"
                            >
                              <FiDownload size={14} /> Open Document
                            </button>
                          ) : item.youtubeUrl ? (
                            <a
                              href={item.youtubeUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#0D9488] dark:text-[#2DD4BF] hover:underline ml-auto"
                            >
                              <FiPlayCircle size={14} /> Watch Lecture
                            </a>
                          ) : (
                            <Link
                              to={link}
                              className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#0D9488] dark:text-[#2DD4BF] hover:underline ml-auto"
                            >
                              <FiExternalLink size={14} /> View Details
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* PDF Document Preview Modal */}
      {previewing && (
        <PdfPreviewModal file={previewing} onClose={() => setPreviewing(null)} />
      )}
    </div>
  );
}

