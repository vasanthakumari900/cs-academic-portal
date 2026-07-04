// src/pages/faculty/UploadNotes.jsx
import UploadForm from "../../components/dashboard/UploadForm";
import { noteService } from "../../services/noteService";
import { STORAGE_PATHS } from "../../utils/constants";

export default function UploadNotes() {
  return (
    <div>
      <h2 className="mb-6 font-display text-2xl font-bold">Upload Lecture Notes</h2>
      <UploadForm
        service={noteService}
        storagePath={STORAGE_PATHS.NOTES}
        fileLabel="PDF File"
        fileAccept=".pdf,.ppt,.pptx,.doc,.docx"
      />
    </div>
  );
}
