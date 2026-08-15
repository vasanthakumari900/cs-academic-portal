// src/components/placements/ChennaiMncTab.jsx
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMapPin,
  FiBriefcase,
  FiExternalLink,
  FiSearch,
  FiStar,
  FiCheckCircle,
  FiAward,
  FiTrendingUp,
  FiDollarSign,
  FiFilter,
  FiLayers,
} from "react-icons/fi";
import {
  CHENNAI_TECH_ZONES,
  CHENNAI_CATEGORIES,
  CHENNAI_MNC_COMPANIES,
} from "../../utils/chennaiMncData";

export default function ChennaiMncTab() {
  const [search, setSearch] = useState("");
  const [selectedZone, setSelectedZone] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("All Types");

  const filteredCompanies = useMemo(() => {
    return CHENNAI_MNC_COMPANIES.filter((company) => {
      // Zone filter
      if (selectedZone !== "all" && company.zone !== selectedZone) {
        return false;
      }
      // Category filter
      if (selectedCategory !== "All Types" && company.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = company.name.toLowerCase().includes(q);
        const matchesRole = company.roles.some((r) => r.toLowerCase().includes(q));
        const matchesSkill = company.skills.some((s) => s.toLowerCase().includes(q));
        const matchesLoc = company.location.toLowerCase().includes(q);
        return matchesName || matchesRole || matchesSkill || matchesLoc;
      }
      return true;
    });
  }, [search, selectedZone, selectedCategory]);

  return (
    <div className="space-y-8 text-left">
      {/* Top Banner & Quick Overview */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#4A0014] via-[#7F011F] to-[#1E293B] p-6 sm:p-8 text-white shadow-xl border border-white/10">
        <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 h-48 w-48 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/20 px-3 py-1 text-xs font-extrabold text-amber-300 border border-amber-400/30">
              <FiMapPin size={14} className="text-amber-300" />
              Chennai Regional Employment Guide · Tech Hub Corridor
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              MNC &amp; Tech Hub Directory in Chennai
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              Explore premier Multinational Corporations, SaaS unicorns, and IT giants operating across Chennai&apos;s key tech parks (OMR IT Corridor, DLF Porur, Siruseri, Guindy &amp; MEPZ). Learn about roles, required skillsets, and package expectations.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 shrink-0 sm:w-auto">
            <div className="rounded-xl bg-white/10 backdrop-blur-md p-3 border border-white/15 text-center">
              <div className="flex items-center justify-center gap-1 text-amber-400 text-lg font-black">
                <FiBriefcase size={18} /> 16+
              </div>
              <p className="text-[10px] text-slate-300 font-bold uppercase mt-0.5">MNC Campuses</p>
            </div>

            <div className="rounded-xl bg-white/10 backdrop-blur-md p-3 border border-white/15 text-center">
              <div className="flex items-center justify-center gap-1 text-emerald-400 text-lg font-black">
                <FiTrendingUp size={18} /> ₹3.5 - ₹28L
              </div>
              <p className="text-[10px] text-slate-300 font-bold uppercase mt-0.5">CTC Range</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="space-y-4 rounded-2xl bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by company name, role (e.g. SDE), skill (e.g. Java), or area..."
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 pl-10 pr-4 py-2.5 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-[#0F4C81] focus:outline-none transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Dropdown/Pill selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <FiFilter className="text-slate-400 shrink-0 hidden sm:block" size={16} />
            <div className="flex items-center gap-1.5 shrink-0">
              {CHENNAI_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? "bg-[#7F011F] text-white shadow-sm"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chennai Tech Hub Zone Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 dark:border-slate-800 scrollbar-none">
          <FiMapPin className="text-[#7F011F] dark:text-sky-400 shrink-0" size={16} />
          <span className="text-xs font-bold text-slate-500 shrink-0">Chennai Tech Hubs:</span>
          {CHENNAI_TECH_ZONES.map((zone) => (
            <button
              key={zone.id}
              onClick={() => setSelectedZone(zone.id)}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold transition-all shrink-0 ${
                selectedZone === zone.id
                  ? "bg-[#0F4C81] text-white shadow-sm"
                  : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-[#0F4C81]"
              }`}
            >
              {zone.label}
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-black ${
                  selectedZone === zone.id
                    ? "bg-white/20 text-white"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                }`}
              >
                {zone.id === "all"
                  ? CHENNAI_MNC_COMPANIES.length
                  : CHENNAI_MNC_COMPANIES.filter((c) => c.zone === zone.id).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
          Showing <span className="text-[#7F011F] dark:text-sky-400 font-extrabold">{filteredCompanies.length}</span> MNC Companies in Chennai
        </p>
        {(search || selectedZone !== "all" || selectedCategory !== "All Types") && (
          <button
            onClick={() => {
              setSearch("");
              setSelectedZone("all");
              setSelectedCategory("All Types");
            }}
            className="text-xs font-bold text-[#0F4C81] dark:text-sky-400 hover:underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Companies Grid */}
      {filteredCompanies.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-12 text-center space-y-3">
          <FiLayers size={40} className="mx-auto text-slate-400" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">No companies found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No MNCs match your current search query or zone filter. Try clearing filters or searching for another tech skill.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setSelectedZone("all");
              setSelectedCategory("All Types");
            }}
            className="rounded-xl bg-[#0F4C81] px-4 py-2 text-xs font-bold text-white shadow-sm"
          >
            Show All Companies
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredCompanies.map((company) => (
              <motion.div
                key={company.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Top Badge Strip */}
                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 shadow-inner">
                        <img
                          src={company.logo}
                          alt={company.name}
                          className="h-8 w-8 object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://cdn-icons-png.flaticon.com/512/4300/4300058.png";
                          }}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 group-hover:text-[#7F011F] dark:group-hover:text-sky-400 transition-colors">
                            {company.name}
                          </h3>
                          {company.featured && (
                            <span title="Featured Campus Partner">
                              <FiStar size={14} className="text-amber-500 fill-amber-400 shrink-0" />
                            </span>
                          )}
                        </div>
                        <span className="inline-block rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-300 mt-0.5">
                          {company.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Location & Hub */}
                  <div className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium bg-slate-50 dark:bg-slate-800/60 rounded-xl p-2.5 border border-slate-100 dark:border-slate-800">
                    <FiMapPin size={15} className="text-[#7F011F] dark:text-sky-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{company.location}</span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {company.description}
                  </p>

                  {/* Key Stats (CTC & Min CGPA) */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 p-2.5 text-left">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">
                        <FiDollarSign size={12} /> Avg CTC Package
                      </div>
                      <p className="text-xs font-black text-emerald-800 dark:text-emerald-300 mt-0.5">
                        {company.packageRange}
                      </p>
                    </div>

                    <div className="rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200/60 dark:border-sky-800/40 p-2.5 text-left">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-sky-700 dark:text-sky-400 uppercase">
                        <FiAward size={12} /> Min CGPA
                      </div>
                      <p className="text-xs font-black text-sky-800 dark:text-sky-300 mt-0.5">
                        {company.minCgpa}+ CGPA
                      </p>
                    </div>
                  </div>

                  {/* Typical Roles */}
                  <div className="space-y-1 pt-1">
                    <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                      Hiring Roles:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {company.roles.map((role, idx) => (
                        <span
                          key={idx}
                          className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-bold text-slate-700 dark:text-slate-300"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tech Stack Pills */}
                  <div className="space-y-1">
                    <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                      Key Tech Stack:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {company.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="rounded-md bg-[#7F011F]/10 dark:bg-sky-400/10 px-2 py-0.5 text-[10px] font-extrabold text-[#7F011F] dark:text-sky-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action Bar */}
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 px-5 py-3 text-xs">
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    <FiCheckCircle size={13} className="text-emerald-500" />
                    <span>{company.hiringSeason.split(" ")[0]} Drive</span>
                  </div>

                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-lg bg-[#0F4C81] hover:bg-[#1E88E5] px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-all"
                  >
                    Careers Portal <FiExternalLink size={13} />
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
