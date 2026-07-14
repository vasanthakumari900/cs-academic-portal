// src/pages/admin/AdminManageContent.jsx
import { useState } from "react";
import toast from "react-hot-toast";
import { FiTrash2, FiSearch, FiEdit2, FiSave, FiX, FiCamera } from "react-icons/fi";
import { useFirestoreList } from "../../hooks/useFirestoreList";
import { deleteFile } from "../../services/storageService";
import { SEMESTERS, ALL_SUBJECTS, YEARS, VIDEO_TYPES } from "../../utils/constants";
import EmptyState from "../../components/ui/EmptyState";
import SkeletonCard from "../../components/ui/SkeletonCard";

function getYearSuffix(n) {
  if (n === 1) return "st";
  if (n === 2) return "nd";
  if (n === 3) return "rd";
  return "th";
}

export default function AdminManageContent({ title, service }) {
  const { items, loading, refetch } = useFirestoreList(service);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const filtered = items.filter((i) =>
    i.title?.toLowerCase().includes(search.toLowerCase()) ||
    i.subject?.toLowerCase().includes(search.toLowerCase()) ||
    i.facultyName?.toLowerCase().includes(search.toLowerCase())
  );

  async function handleDelete(item) {
    if (!confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
    if (item.fileUrl) await deleteFile(item.fileUrl);
    await service.remove(item.id);
    toast.success("Deleted");
    refetch();
  }

  function startEdit(item) {
    setEditingId(item.id);
    setEditForm({
      title: item.title || "",
      description: item.description || "",
      subject: item.subject || "",
      semester: item.semester || "",
      year: item.year || "",
      videoType: item.videoType || "",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm({});
  }

  async function saveEdit(item) {
    try {
      await service.update(item.id, {
        title: editForm.title,
        description: editForm.description,
        subject: editForm.subject,
        semester: Number(editForm.semester),
        year: editForm.year ? Number(editForm.year) : null,
        videoType: editForm.videoType || null,
      });
      toast.success("Updated");
      setEditingId(null);
      setEditForm({});
      refetch();
    } catch (err) {
      toast.error(err.message || "Update failed");
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 text-left bg-[#F8FAFC]">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-sans text-2xl font-bold text-[#1F2937]">{title}</h2>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title, subject, faculty…"
            className="rounded-lg border border-[#E5E7EB] bg-white py-2 pl-9 pr-3 text-sm text-[#1F2937] placeholder:text-[#6B7280]/60 outline-none focus:border-[#0F4C81] focus:ring-1 focus:ring-[#0F4C81]/15 transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="Nothing found" description="No items match your search." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-xs uppercase text-[#6B7280] font-semibold">
              <tr>
                <th className="px-4 py-3.5">Title</th>
                <th className="px-4 py-3.5">Subject</th>
                <th className="px-4 py-3.5">Semester</th>
                <th className="px-4 py-3.5">Year</th>
                <th className="px-4 py-3.5">Type</th>
                <th className="px-4 py-3.5">Faculty</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filtered.map((item) => (
                <tr key={item.id} className="bg-white hover:bg-slate-50 transition-colors">
                  {editingId === item.id ? (
                    <>
                      <td className="px-4 py-2">
                        <input
                          value={editForm.title}
                          onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                          className="w-full rounded-lg border border-[#E5E7EB] bg-white px-2 py-1 text-sm text-[#1F2937] outline-none focus:border-[#0F4C81]"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <select
                          value={editForm.subject}
                          onChange={(e) => setEditForm((f) => ({ ...f, subject: e.target.value }))}
                          className="rounded-lg border border-[#E5E7EB] bg-white px-2 py-1 text-xs text-[#1F2937] outline-none focus:border-[#0F4C81]"
                        >
                          {ALL_SUBJECTS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <select
                          value={editForm.semester}
                          onChange={(e) => setEditForm((f) => ({ ...f, semester: e.target.value }))}
                          className="rounded-lg border border-[#E5E7EB] bg-white px-2 py-1 text-xs text-[#1F2937] outline-none focus:border-[#0F4C81]"
                        >
                          {SEMESTERS.map((s) => (
                            <option key={s} value={s}>Sem {s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <select
                          value={editForm.year}
                          onChange={(e) => setEditForm((f) => ({ ...f, year: e.target.value }))}
                          className="rounded-lg border border-[#E5E7EB] bg-white px-2 py-1 text-xs text-[#1F2937] outline-none focus:border-[#0F4C81]"
                        >
                          <option value="">—</option>
                          {YEARS.map((y) => (
                            <option key={y.value} value={y.value}>{y.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <select
                          value={editForm.videoType}
                          onChange={(e) => setEditForm((f) => ({ ...f, videoType: e.target.value }))}
                          className="rounded-lg border border-[#E5E7EB] bg-white px-2 py-1 text-xs text-[#1F2937] outline-none focus:border-[#0F4C81]"
                        >
                          <option value="">—</option>
                          {VIDEO_TYPES.map((t) => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-2 text-[#6B7280]">{item.facultyName}</td>
                      <td className="px-4 py-2 text-right">
                        <button onClick={() => saveEdit(item)} className="rounded-lg p-2 text-[#2E7D32] hover:bg-[#2E7D32]/10" title="Save">
                          <FiSave size={15} />
                        </button>
                        <button onClick={cancelEdit} className="rounded-lg p-2 text-[#6B7280] hover:bg-slate-100" title="Cancel">
                          <FiX size={15} />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="max-w-xs truncate px-4 py-3.5 font-medium text-[#1F2937]">{item.title}</td>
                      <td className="px-4 py-3.5 text-[#6B7280]">{item.subject}</td>
                      <td className="px-4 py-3.5 text-[#6B7280]">{item.semester}</td>
                      <td className="px-4 py-3.5 text-[#6B7280]">{item.year ? `${item.year}${getYearSuffix(item.year)}` : "—"}</td>
                      <td className="px-4 py-3.5">
                        {item.videoType === "class_recording" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800">
                            <FiCamera size={11} /> Recording
                          </span>
                        ) : item.videoType === "lecture" ? (
                          <span className="text-[#6B7280]">Lecture</span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-[#6B7280]">{item.facultyName}</td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => startEdit(item)} className="rounded-lg p-2 text-[#1E88E5] hover:bg-[#1E88E5]/10"
                          title="Edit"
                        >
                          <FiEdit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="rounded-lg p-2 text-red-650 hover:bg-red-50 hover:text-red-800"
                          aria-label="Delete"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
