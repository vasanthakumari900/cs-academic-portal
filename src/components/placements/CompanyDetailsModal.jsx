import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiExternalLink,
  FiBriefcase,
  FiDollarSign,
  FiMapPin,
  FiCalendar,
  FiCheckCircle,
  FiAward,
  FiBookOpen,
  FiUsers,
  FiTarget,
} from "react-icons/fi";
import { formatDate } from "../../utils/helpers";

export default function CompanyDetailsModal({ company, onClose, onApply }) {
  if (!company) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden text-slate-800 dark:text-slate-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Banner */}
          <div className="relative bg-gradient-to-r from-[#021C4F] via-[#0F4C81] to-[#C50337] p-6 text-white shrink-0">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 rounded-full bg-white/10 hover:bg-white/20 p-2 text-white/80 hover:text-white transition-all"
            >
              <FiX size={20} />
            </button>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white p-2 shadow-lg shrink-0">
                {company.logoUrl ? (
                  <img
                    src={company.logoUrl}
                    alt={company.companyName}
                    className="h-10 w-10 object-contain"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <span className="hidden text-xl font-bold text-[#021C4F]">
                  {company.companyName?.[0]}
                </span>
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl font-bold text-white">{company.companyName}</h2>
                  <span className="rounded-full bg-white/20 px-3 py-0.5 text-xs font-semibold text-white backdrop-blur-md">
                    {company.status || "Upcoming"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-white/90 font-medium flex items-center gap-1.5">
                  <FiBriefcase size={14} /> {company.role}
                </p>
                <div className="mt-3 flex flex-wrap gap-4 text-xs text-white/80">
                  <span className="flex items-center gap-1">
                    <FiDollarSign size={14} className="text-emerald-300" /> Package:{" "}
                    <strong className="text-white">₹{company.package} LPA</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <FiMapPin size={14} className="text-sky-300" /> Location:{" "}
                    <strong className="text-white">{company.location || "Pan India"}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <FiCalendar size={14} className="text-amber-300" /> Last Date:{" "}
                    <strong className="text-white">{formatDate(company.deadline)}</strong>
                  </span>
                </div>
              </div>

              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 px-3.5 py-2 text-xs font-semibold text-white border border-white/20 transition-all shrink-0"
                >
                  Official Site <FiExternalLink size={12} />
                </a>
              )}
            </div>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-left">
            {/* About & Role Description */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <section>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F4C81] dark:text-sky-400 mb-2 flex items-center gap-2">
                    <FiTarget size={16} /> About {company.companyName}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {company.about ||
                      `${company.companyName} is a global tech enterprise recruiting talented software engineers for core R&D and digital innovation projects.`}
                  </p>
                </section>

                <section>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F4C81] dark:text-sky-400 mb-2 flex items-center gap-2">
                    <FiBookOpen size={16} /> Job Description
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {company.description ||
                      "Build production-grade applications, optimize algorithms, write clean testable code, and collaborate in agile engineering sprints."}
                  </p>
                </section>
              </div>

              {/* Eligibility Box */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b pb-2 flex items-center gap-1.5">
                  <FiAward size={14} className="text-[#C50337]" /> Eligibility Criteria
                </h4>
                <div className="text-xs space-y-2 text-slate-600 dark:text-slate-300">
                  <p>
                    <strong className="text-slate-800 dark:text-slate-100">Cutoff CGPA:</strong>{" "}
                    {company.eligibility || "CGPA 6.0+"}
                  </p>
                  <p>
                    <strong className="text-slate-800 dark:text-slate-100">Departments:</strong>{" "}
                    {company.allowedDepts?.join(", ") || "B.Sc CS, BCA, M.Sc CS"}
                  </p>
                  <p>
                    <strong className="text-slate-800 dark:text-slate-100">Standing Arrears:</strong>{" "}
                    {company.allowedArrears !== undefined
                      ? `${company.allowedArrears} Max Allowed`
                      : "0 Active Arrears"}
                  </p>
                  <p>
                    <strong className="text-slate-800 dark:text-slate-100">Drive Date:</strong>{" "}
                    {formatDate(company.driveDate || company.deadline)}
                  </p>
                </div>

                <div className="pt-2">
                  <h5 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Required Skills
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.isArray(company.skills)
                      ? company.skills.map((s, idx) => (
                          <span
                            key={idx}
                            className="rounded-md bg-[#0F4C81]/10 text-[#0F4C81] dark:bg-sky-950 dark:text-sky-300 px-2 py-0.5 text-[11px] font-semibold"
                          >
                            {s}
                          </span>
                        ))
                      : String(company.skills || "")
                          .split(",")
                          .map((s, idx) => (
                            <span
                              key={idx}
                              className="rounded-md bg-[#0F4C81]/10 text-[#0F4C81] dark:bg-sky-950 dark:text-sky-300 px-2 py-0.5 text-[11px] font-semibold"
                            >
                              {s.trim()}
                            </span>
                          ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Selection Process Rounds */}
            {company.rounds && company.rounds.length > 0 && (
              <section className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F4C81] dark:text-sky-400 mb-3 flex items-center gap-2">
                  <FiUsers size={16} /> Selection Rounds & Hiring Process
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {company.rounds.map((round, rIdx) => (
                    <div
                      key={rIdx}
                      className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-3.5 shadow-sm space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#0F4C81] dark:text-sky-400">
                          {round.name}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                          {round.duration}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">{round.details}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Past Experiences & Tips */}
            {(company.experience || company.tips) && (
              <section className="pt-2 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
                {company.experience && (
                  <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                    <strong className="font-bold block text-sm text-amber-700 dark:text-amber-400">
                      💡 Past Student Interview Experience
                    </strong>
                    <p className="leading-relaxed">{company.experience}</p>
                  </div>
                )}
                {company.tips && (
                  <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs text-emerald-900 dark:text-emerald-200 space-y-1.5">
                    <strong className="font-bold block text-sm text-emerald-700 dark:text-emerald-400">
                      🎯 Preparation Tips
                    </strong>
                    <ul className="list-disc list-inside space-y-1">
                      {Array.isArray(company.tips) ? (
                        company.tips.map((t, i) => <li key={i}>{t}</li>)
                      ) : (
                        <li>{company.tips}</li>
                      )}
                    </ul>
                  </div>
                )}
              </section>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-6 py-4 shrink-0">
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                if (onApply) onApply(company);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#C50337] hover:bg-[#a0022b] px-6 py-2.5 text-xs font-bold text-white shadow-md transition-all active:scale-95"
            >
              <FiCheckCircle size={14} /> Apply for Drive
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
