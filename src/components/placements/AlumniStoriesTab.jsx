// src/components/placements/AlumniStoriesTab.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiAward as AwardIcon, FiPlus as PlusIcon, FiX as XIcon, FiCheckCircle as CheckIcon, FiExternalLink as LinkIcon, FiGlobe } from "react-icons/fi";
import toast from "react-hot-toast";
import { ALUMNI_STORIES } from "../../utils/placementMockData";

export default function AlumniStoriesTab() {
  const [stories, setStories] = useState(() => {
    try {
      const saved = localStorage.getItem("ddgdvc_alumni_stories");
      return saved ? JSON.parse(saved) : ALUMNI_STORIES;
    } catch {
      return ALUMNI_STORIES;
    }
  });

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    batch: "Class of 2026",
    dept: "B.Sc Computer Science (Sec B)",
    company: "Zoho Corporation",
    role: "Member Technical Staff (MTS)",
    package: "8.4 LPA",
    story: "",
    advice: "",
    linkedin: "",
  });

  const companyRolesMap = {
    "Zoho Corporation": ["Member Technical Staff (MTS)", "Software Development Engineer (SDE)"],
    "TCS Digital": ["Systems Engineer - Digital (7.5 LPA)", "Ninja Developer (3.6 LPA)"],
    "Cognizant (CTS)": ["GenC Next Specialist (6.75 LPA)", "GenC Software Engineer (4.0 LPA)"],
    "Kaar Technologies": ["SAP Technical Consultant (6.5 LPA)", "Associate Software Engineer"],
    "Accenture India": ["Advanced Application Associate (6.5 LPA)", "Associate Software Engineer (4.5 LPA)"],
    "Pickyourtrail": ["Frontend Software Engineer (6.5 LPA)", "Full Stack Developer"],
    "Amazon": ["Software Development Engineer (SDE-1) (16.0 LPA)"],
    "Wipro": ["Wipro Turbo Engineer (6.5 LPA)", "Wipro Elite Engineer (3.5 LPA)"],
  };

  const companyPackagesMap = {
    "Zoho Corporation": "8.4 LPA - 12.0 LPA",
    "TCS Digital": "7.5 LPA",
    "Cognizant (CTS)": "6.75 LPA",
    "Kaar Technologies": "6.5 LPA",
    "Accenture India": "6.5 LPA",
    "Pickyourtrail": "6.5 LPA",
    "Amazon": "16.0 LPA",
    "Wipro": "6.5 LPA",
  };

  function handleCompanyChange(compName) {
    const defaultRoles = companyRolesMap[compName] || ["Software Engineer"];
    const defaultPkg = companyPackagesMap[compName] || "6.0 LPA";
    setForm((prev) => ({
      ...prev,
      company: compName,
      role: defaultRoles[0],
      package: defaultPkg,
    }));
  }

  function handleSubmitStory(e) {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!form.story.trim() || form.story.length < 20) {
      toast.error("Please share a detailed placement story (at least 20 characters)");
      return;
    }
    if (!form.advice.trim()) {
      toast.error("Please provide a helpful tip or advice for junior students");
      return;
    }

    const newStory = {
      id: `alum-${Date.now()}`,
      name: form.name.trim(),
      batch: form.batch,
      dept: form.dept,
      company: form.company,
      role: form.role,
      package: form.package,
      photo: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300`,
      story: form.story.trim(),
      advice: form.advice.trim(),
      linkedin: form.linkedin.trim() || undefined,
    };

    const updated = [newStory, ...stories];
    setStories(updated);
    try {
      localStorage.setItem("ddgdvc_alumni_stories", JSON.stringify(updated));
    } catch { /* ignore */ }

    toast.success("Thank you! Your Alumni Success Story has been published! 🎉");
    setShowModal(false);
    setForm({
      name: "",
      batch: "Class of 2026",
      dept: "B.Sc Computer Science (Sec B)",
      company: "Zoho Corporation",
      role: "Member Technical Staff (MTS)",
      package: "8.4 LPA",
      story: "",
      advice: "",
      linkedin: "",
    });
  }

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner & Submit Button */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <AwardIcon className="text-[#C50337]" /> Alumni Success Stories &amp; Placement Reviews
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real success stories with authentic company details, exact packages, and junior advice from placed DDGDVC Computer Science graduates.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#C50337] hover:bg-[#900226] px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all active:scale-95 shrink-0"
        >
          <PlusIcon size={16} /> Share Your Success Story
        </button>
      </div>

      {/* Alumni Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((alum) => (
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
                  src={alum.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300"}
                  alt={alum.name}
                  className="h-14 w-14 rounded-full object-cover border-2 border-[#0F4C81] shadow-md shrink-0"
                />
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                    {alum.name}
                  </h3>
                  <p className="text-xs text-slate-500">{alum.dept} · {alum.batch}</p>
                </div>
              </div>

              {/* Company & Offer Badge */}
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 text-xs space-y-1 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between gap-2">
                  <strong className="text-sm font-bold text-[#0F4C81] dark:text-sky-400 truncate">
                    {alum.company}
                  </strong>
                  <span className="rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 font-extrabold text-[11px] shrink-0 border border-emerald-500/20">
                    ₹{alum.package}
                  </span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 font-semibold">{alum.role}</p>
              </div>

              {/* Placement Journey Story */}
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Placement Journey
                </h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic bg-slate-50/50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  "{alum.story}"
                </p>
              </div>
            </div>

            {/* Advice to Juniors Footer */}
            <div className="space-y-2 pt-2">
              <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-900 dark:text-amber-200">
                <strong className="font-bold block text-amber-700 dark:text-amber-400">
                  💡 Advice for Juniors:
                </strong>
                <p className="mt-0.5 leading-relaxed">{alum.advice}</p>
              </div>

              {alum.companyWebsite && (
                <a
                  href={alum.companyWebsite}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0F4C81] dark:text-sky-400 hover:underline pt-1"
                >
                  <FiGlobe size={13} /> Official Recruiter Portal
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Share Alumni Success Story Feedback Form Modal */}
      <AnimatePresence>
        {showModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-left"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-[#021C4F] px-6 py-4 text-white shrink-0">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <AwardIcon size={18} className="text-amber-400" /> Share Alumni Success Story
                  </h3>
                  <p className="text-xs text-white/80 mt-0.5">
                    Help junior CS students by submitting your authentic campus offer details &amp; tips.
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="rounded-full bg-white/10 p-2 text-white/70 hover:bg-white/20 hover:text-white transition-all"
                >
                  <XIcon size={16} />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmitStory} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
                {/* Name & Batch */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block font-bold text-slate-700 dark:text-slate-300">
                      Alumni / Student Name *
                    </label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Arjun V"
                      className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block font-bold text-slate-700 dark:text-slate-300">
                      Batch / Graduation Year *
                    </label>
                    <select
                      value={form.batch}
                      onChange={(e) => setForm({ ...form, batch: e.target.value })}
                      className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 text-slate-800 dark:text-slate-100"
                    >
                      <option value="Class of 2026">Class of 2026</option>
                      <option value="Class of 2025">Class of 2025</option>
                      <option value="Class of 2024">Class of 2024</option>
                      <option value="Class of 2023">Class of 2023</option>
                    </select>
                  </div>
                </div>

                {/* Department & Company Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block font-bold text-slate-700 dark:text-slate-300">
                      Department / Section *
                    </label>
                    <select
                      value={form.dept}
                      onChange={(e) => setForm({ ...form, dept: e.target.value })}
                      className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 text-slate-800 dark:text-slate-100"
                    >
                      <option value="B.Sc Computer Science (Sec A)">B.Sc Computer Science (Sec A)</option>
                      <option value="B.Sc Computer Science (Sec B)">B.Sc Computer Science (Sec B)</option>
                      <option value="BCA">BCA</option>
                      <option value="M.Sc Computer Science">M.Sc Computer Science</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block font-bold text-slate-700 dark:text-slate-300">
                      Recruiter Company *
                    </label>
                    <select
                      value={form.company}
                      onChange={(e) => handleCompanyChange(e.target.value)}
                      className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 text-slate-800 dark:text-slate-100"
                    >
                      <option value="Zoho Corporation">Zoho Corporation</option>
                      <option value="TCS Digital">TCS Digital</option>
                      <option value="Cognizant (CTS)">Cognizant (CTS)</option>
                      <option value="Kaar Technologies">Kaar Technologies</option>
                      <option value="Accenture India">Accenture India</option>
                      <option value="Pickyourtrail">Pickyourtrail</option>
                      <option value="Amazon">Amazon</option>
                      <option value="Wipro">Wipro</option>
                    </select>
                  </div>
                </div>

                {/* Offered Role & Package CTC */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block font-bold text-slate-700 dark:text-slate-300">
                      Offered Job Role *
                    </label>
                    <input
                      required
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                      placeholder="e.g. Member Technical Staff (MTS)"
                      className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block font-bold text-slate-700 dark:text-slate-300">
                      Offered Package CTC *
                    </label>
                    <input
                      required
                      value={form.package}
                      onChange={(e) => setForm({ ...form, package: e.target.value })}
                      placeholder="e.g. 8.4 LPA"
                      className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 text-slate-800 dark:text-slate-100 font-bold text-[#0F4C81]"
                    />
                  </div>
                </div>

                {/* Story Journey */}
                <div>
                  <label className="mb-1 block font-bold text-slate-700 dark:text-slate-300">
                    Your Placement Journey &amp; Preparation Experience *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={form.story}
                    onChange={(e) => setForm({ ...form, story: e.target.value })}
                    placeholder="Describe how you prepared for rounds, key algorithms practiced, or coding challenges cleared..."
                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 text-slate-800 dark:text-slate-100"
                  />
                </div>

                {/* Advice for Juniors */}
                <div>
                  <label className="mb-1 block font-bold text-slate-700 dark:text-slate-300">
                    Key Advice / Tips for Junior Students *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={form.advice}
                    onChange={(e) => setForm({ ...form, advice: e.target.value })}
                    placeholder="What specific topics or skills should juniors focus on?"
                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 text-slate-800 dark:text-slate-100"
                  />
                </div>

                {/* Submit Action Bar */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-[#C50337] hover:bg-[#900226] px-6 py-2 text-xs font-bold text-white shadow-md transition-all"
                  >
                    Publish Success Story
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
