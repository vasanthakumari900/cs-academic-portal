// src/pages/faculty/ManageUploads.jsx
// Lets faculty see and delete their own videos, notes and question papers.
import { useState } from "react";
import toast from "react-hot-toast";
import { FiTrash2, FiFileText, FiPlayCircle } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useFirestoreList } from "../../hooks/useFirestoreList";
import { videoService } from "../../services/videoService";
import { noteService } from "../../services/noteService";
import { questionPaperService } from "../../services/questionPaperService";
import { deleteFile } from "../../services/storageService";
import GlassCard from "../../components/ui/GlassCard";
import EmptyState from "../../components/ui/EmptyState";

const tabs = [
  { key: "videos", label: "Videos", service: videoService, icon: FiPlayCircle },
  { key: "notes", label: "Notes", service: noteService, icon: FiFileText },
  { key: "papers", label: "Question Papers", service: questionPaperService, icon: FiFileText },
];

export default function ManageUploads() {
  const [active, setActive] = useState("videos");
  const { profile } = useAuth();
  const tab = tabs.find((t) => t.key === active);
  const { items, loading, refetch } = useFirestoreList(tab.service);
  const mine = items.filter((i) => i.facultyId === profile?.uid);

  async function handleDelete(item) {
    if (!confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
    await deleteFile(item.fileUrl);
    await tab.service.remove(item.id);
    toast.success("Deleted");
    refetch();
  }

  return (
    <div>
      <h2 className="mb-6 font-display text-2xl font-bold">Manage Uploads</h2>

      <div className="mb-6 flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
              active === t.key
                ? "bg-gradient-to-r from-maroon to-gold text-white"
                : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-white/5 dark:text-slate-300"
            }`}
          >
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      {!loading && mine.length === 0 ? (
        <EmptyState title="Nothing uploaded here yet" description={`Your uploaded ${tab.label.toLowerCase()} will appear here.`} />
      ) : (
        <div className="space-y-3">
          {mine.map((item) => (
            <GlassCard key={item.id} hover={false} className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="truncate font-medium">{item.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{item.subject} · Sem {item.semester}</p>
              </div>
              <button
                onClick={() => handleDelete(item)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-danger hover:bg-danger/10"
                aria-label="Delete"
              >
                <FiTrash2 size={16} />
              </button>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
