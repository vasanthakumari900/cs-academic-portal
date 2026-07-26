// src/components/placements/AlumniStoriesTab.jsx
import { motion } from "framer-motion";
import { FiAward, FiBriefcase, FiDollarSign, FiMessageSquare } from "react-icons/fi";
import { ALUMNI_STORIES } from "../../utils/placementMockData";

export default function AlumniStoriesTab() {
  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <FiAward className="text-[#C50337]" /> Alumni Success Stories & Junior Advice
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Learn how placed seniors cleared top tech drives at Amazon, Zoho, Infosys, and Google.
        </p>
      </div>

      {/* Alumni Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ALUMNI_STORIES.map((alum) => (
          <motion.div
            key={alum.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4 hover:shadow-xl transition-all"
          >
            <div className="space-y-3">
              {/* Profile Header */}
              <div className="flex items-center gap-4">
                <img
                  src={alum.photo}
                  alt={alum.name}
                  className="h-16 w-16 rounded-full object-cover border-2 border-[#0F4C81] shadow-md"
                />
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                    {alum.name}
                  </h3>
                  <p className="text-xs text-slate-500">{alum.dept} · {alum.batch}</p>
                </div>
              </div>

              {/* Company & Offer Badge */}
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <strong className="text-sm font-bold text-[#0F4C81] dark:text-sky-400">
                    {alum.company}
                  </strong>
                  <span className="rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 font-extrabold text-[11px]">
                    ₹{alum.package}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 font-medium">{alum.role}</p>
              </div>

              {/* Success Story */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  My Placement Journey
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                  "{alum.story}"
                </p>
              </div>
            </div>

            {/* Advice to Juniors Footer */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-900 dark:text-amber-200">
              <strong className="font-bold block text-amber-700 dark:text-amber-400">
                💬 Advice for Juniors:
              </strong>
              <p className="mt-0.5">{alum.advice}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
