// src/components/placements/TrainingMaterialsTab.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiFolder,
  FiFileText,
  FiPlayCircle,
  FiUploadCloud,
  FiSearch,
  FiExternalLink,
  FiCode,
  FiBookOpen,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { TRAINING_MATERIALS } from "../../utils/placementMockData";

export default function TrainingMaterialsTab() {
  const [materials, setMaterials] = useState(TRAINING_MATERIALS);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [showUploadModal, setShowUploadModal] = useState(false);

  const [uploadForm, setUploadForm] = useState({
    title: "",
    type: "PDF",
    category: "Aptitude",
    link: "",
  });

  function handleAddMaterial(e) {
    e.preventDefault();
    if (!uploadForm.title.trim() || !uploadForm.link.trim()) {
      toast.error("Please provide title and link/URL");
      return;
    }

    const newItem = {
      id: `mat-${Date.now()}`,
      title: uploadForm.title,
      type: uploadForm.type,
      category: uploadForm.category,
      size: "Uploaded File",
      uploadedBy: "Faculty / Admin",
      date: new Date().toISOString().split("T")[0],
      link: uploadForm.link,
    };

    setMaterials([newItem, ...materials]);
    toast.success("Training material uploaded successfully!");
    setShowUploadModal(false);
    setUploadForm({ title: "", type: "PDF", category: "Aptitude", link: "" });
  }

  const filteredMaterials = materials.filter((item) => {
    const matchCat = categoryFilter === "All" || item.category === categoryFilter;
    const matchType = typeFilter === "All" || item.type === typeFilter;
    return matchCat && matchType;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FiFolder className="text-[#0F4C81] dark:text-sky-400" /> Placement Training Materials Repository
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Access curated PDFs, PPT decks, video lectures, coding sheets, and company-specific interview notes.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#0F4C81] hover:bg-[#1E88E5] px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all active:scale-95 shrink-0"
        >
          <FiUploadCloud size={16} /> Upload New Material
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-xs font-bold text-slate-700 dark:text-slate-300">
        <span>Category:</span>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg bg-slate-50 dark:bg-slate-800 border px-3 py-1.5 focus:outline-none"
        >
          <option value="All">All Categories</option>
          <option value="Aptitude">Aptitude</option>
          <option value="DSA & Coding">DSA & Coding</option>
          <option value="System Design">System Design</option>
          <option value="Placement Training">Placement Training</option>
        </select>

        <span className="ml-2">Type:</span>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg bg-slate-50 dark:bg-slate-800 border px-3 py-1.5 focus:outline-none"
        >
          <option value="All">All Formats</option>
          <option value="PDF">PDF</option>
          <option value="PPT">PPT</option>
          <option value="Video">Video</option>
          <option value="Coding Sheet">Coding Sheet</option>
        </select>
      </div>

      {/* Materials List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredMaterials.map((mat) => (
          <div
            key={mat.id}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3 flex items-center justify-between hover:border-[#0F4C81]/40 transition-all"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-md px-2 py-0.5 text-[10px] font-extrabold ${
                    mat.type === "PDF"
                      ? "bg-rose-500/10 text-rose-600"
                      : mat.type === "Video"
                      ? "bg-sky-500/10 text-sky-600"
                      : "bg-emerald-500/10 text-emerald-600"
                  }`}
                >
                  {mat.type}
                </span>
                <span className="text-[10px] text-slate-400">{mat.category}</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{mat.title}</h4>
              <p className="text-[11px] text-slate-500">
                Uploaded by {mat.uploadedBy} · {mat.date} ({mat.size})
              </p>
            </div>

            <a
              href={mat.link}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-[#0F4C81] hover:bg-[#1E88E5] p-3 text-white shadow-sm transition-all shrink-0"
            >
              <FiExternalLink size={18} />
            </a>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 text-left">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Upload Placement Material
            </h3>
            <form onSubmit={handleAddMaterial} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Title / Subject
                </label>
                <input
                  type="text"
                  required
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  placeholder="e.g. Striver 180 DSA Coding Sheet"
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border p-2.5 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Format Type
                  </label>
                  <select
                    value={uploadForm.type}
                    onChange={(e) => setUploadForm({ ...uploadForm, type: e.target.value })}
                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border p-2.5 text-slate-800 dark:text-slate-100"
                  >
                    <option value="PDF">PDF</option>
                    <option value="PPT">PPT</option>
                    <option value="Video">Video</option>
                    <option value="Coding Sheet">Coding Sheet</option>
                    <option value="Interview Notes">Interview Notes</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Category
                  </label>
                  <select
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border p-2.5 text-slate-800 dark:text-slate-100"
                  >
                    <option value="Aptitude">Aptitude</option>
                    <option value="DSA & Coding">DSA & Coding</option>
                    <option value="System Design">System Design</option>
                    <option value="Placement Training">Placement Training</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Resource URL / Link
                </label>
                <input
                  type="url"
                  required
                  value={uploadForm.link}
                  onChange={(e) => setUploadForm({ ...uploadForm, link: e.target.value })}
                  placeholder="https://..."
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border p-2.5 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="rounded-xl border px-4 py-2 font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#0F4C81] px-5 py-2 font-bold text-white shadow-sm"
                >
                  Upload Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
