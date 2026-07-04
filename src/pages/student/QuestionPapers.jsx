// src/pages/student/QuestionPapers.jsx
import { useState } from "react";
import toast from "react-hot-toast";
import ModuleBrowser from "../../components/dashboard/ModuleBrowser";
import DocumentCard from "../../components/dashboard/DocumentCard";
import PdfPreviewModal from "../../components/dashboard/PdfPreviewModal";
import { questionPaperService } from "../../services/questionPaperService";
import { addBookmark, removeBookmark } from "../../services/bookmarkService";
import { useAuth } from "../../context/AuthContext";

export default function QuestionPapers() {
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
      <h2 className="mb-6 font-display text-2xl font-bold">Question Papers</h2>
      <ModuleBrowser
        service={questionPaperService}
        renderCard={(qp) => (
          <DocumentCard
            key={qp.id}
            doc={qp}
            onPreview={setPreviewing}
            onBookmark={handleBookmark}
            bookmarked={bookmarks.includes(qp.id)}
            metaExtra={qp.year ? `${qp.year} · ${qp.regulation ?? ""}` : undefined}
          />
        )}
      />
      <PdfPreviewModal file={previewing} onClose={() => setPreviewing(null)} />
    </div>
  );
}
