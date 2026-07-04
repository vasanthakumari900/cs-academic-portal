// src/pages/student/Bookmarks.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { videoService } from "../../services/videoService";
import { noteService } from "../../services/noteService";
import { questionPaperService } from "../../services/questionPaperService";
import DocumentCard from "../../components/dashboard/DocumentCard";
import VideoCard from "../../components/dashboard/VideoCard";
import PdfPreviewModal from "../../components/dashboard/PdfPreviewModal";
import VideoPlayerModal from "../../components/dashboard/VideoPlayerModal";
import EmptyState from "../../components/ui/EmptyState";
import SkeletonCard from "../../components/ui/SkeletonCard";
import { removeBookmark } from "../../services/bookmarkService";
import toast from "react-hot-toast";

// Bookmarks can point to any of the three content types, so we look each
// id up across all three services and merge the results.
export default function Bookmarks() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState({ videos: [], notes: [], papers: [] });
  const [previewing, setPreviewing] = useState(null);
  const [playing, setPlaying] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const ids = profile?.bookmarks || [];
      const [videos, notes, papers] = await Promise.all([
        Promise.all(ids.map((id) => videoService.getById(id))),
        Promise.all(ids.map((id) => noteService.getById(id))),
        Promise.all(ids.map((id) => questionPaperService.getById(id))),
      ]);
      setItems({
        videos: videos.filter(Boolean),
        notes: notes.filter(Boolean),
        papers: papers.filter(Boolean),
      });
      setLoading(false);
    }
    load();
  }, [profile?.bookmarks]);

  async function unbookmark(id) {
    await removeBookmark(user.uid, id);
    toast.success("Removed from bookmarks");
  }

  const isEmpty = !loading && items.videos.length + items.notes.length + items.papers.length === 0;

  return (
    <div className="space-y-8">
      <h2 className="font-display text-2xl font-bold">Bookmarks</h2>

      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : isEmpty ? (
        <EmptyState title="No bookmarks yet" description="Bookmark videos, notes or question papers to find them here quickly." />
      ) : (
        <>
          {items.videos.length > 0 && (
            <section>
              <h3 className="mb-3 text-sm font-semibold text-slate-500">Videos</h3>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.videos.map((v) => (
                  <VideoCard key={v.id} video={v} onPlay={setPlaying} onBookmark={unbookmark} bookmarked />
                ))}
              </div>
            </section>
          )}
          {items.notes.length > 0 && (
            <section>
              <h3 className="mb-3 text-sm font-semibold text-slate-500">Notes</h3>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.notes.map((n) => (
                  <DocumentCard key={n.id} doc={n} onPreview={setPreviewing} onBookmark={unbookmark} bookmarked />
                ))}
              </div>
            </section>
          )}
          {items.papers.length > 0 && (
            <section>
              <h3 className="mb-3 text-sm font-semibold text-slate-500">Question Papers</h3>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.papers.map((p) => (
                  <DocumentCard key={p.id} doc={p} onPreview={setPreviewing} onBookmark={unbookmark} bookmarked />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <PdfPreviewModal file={previewing} onClose={() => setPreviewing(null)} />
      <VideoPlayerModal video={playing} onClose={() => setPlaying(null)} />
    </div>
  );
}
