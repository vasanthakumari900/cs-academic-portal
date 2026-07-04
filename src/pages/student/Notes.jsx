// src/pages/student/Notes.jsx
import { useState } from "react";
import toast from "react-hot-toast";
import ModuleBrowser from "../../components/dashboard/ModuleBrowser";
import DocumentCard from "../../components/dashboard/DocumentCard";
import PdfPreviewModal from "../../components/dashboard/PdfPreviewModal";
import { noteService } from "../../services/noteService";
import { addBookmark, removeBookmark } from "../../services/bookmarkService";
import { useAuth } from "../../context/AuthContext";

export default function Notes() {
  const [previewing, setPreviewing] = useState(null);
  const { user, profile } = useAuth();
  const bookmarks = profile?.bookmarks || [];

  async function handleBookmark(id) {
    if (bookmarks.includes(id)) {
      await removeBookmark(user.uid, id);
      toast.success("Removed from bookmarks");
    } else {
      await addBookmark(user.uid, id);
      toast.success("Bookmarked");
    }
  }

  return (
    <div>
      <h2 className="mb-6 font-display text-2xl font-bold">Lecture Notes</h2>
      <ModuleBrowser
        service={noteService}
        renderCard={(note) => (
          <DocumentCard
            key={note.id}
            doc={note}
            onPreview={setPreviewing}
            onBookmark={handleBookmark}
            bookmarked={bookmarks.includes(note.id)}
          />
        )}
      />
      <PdfPreviewModal file={previewing} onClose={() => setPreviewing(null)} />
    </div>
  );
}
