// src/components/placements/PlacementFAQTab.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiHelpCircle, FiChevronDown, FiChevronUp, FiSearch } from "react-icons/fi";
import { PLACEMENT_FAQS } from "../../utils/placementMockData";

export default function PlacementFAQTab() {
  const [openIndex, setOpenIndex] = useState(0);
  const [search, setSearch] = useState("");

  const filteredFaqs = PLACEMENT_FAQS.filter(
    (faq) =>
      faq.q.toLowerCase().includes(search.toLowerCase()) ||
      faq.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FiHelpCircle className="text-[#0F4C81] dark:text-sky-400" /> Frequently Asked Placement Questions (FAQ)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Answers regarding placement policies, dream offer rules, attendance requirements, and eligibility guidelines.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions (e.g. CGPA, dream company, arrear rules)..."
            className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 pl-10 pr-4 py-2.5 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 border border-slate-200 dark:border-slate-700 focus:outline-none"
          />
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left text-sm font-bold text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0F4C81]/10 text-[#0F4C81] dark:bg-sky-950 dark:text-sky-300 text-xs">
                    ?
                  </span>
                  {faq.q}
                </span>
                {isOpen ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 p-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
