// src/pages/faculty/UploadVideo.jsx
import UploadForm from "../../components/dashboard/UploadForm";
import { videoService } from "../../services/videoService";
import { STORAGE_PATHS } from "../../utils/constants";

export default function UploadVideo() {
  return (
    <div>
      <h2 className="mb-6 font-display text-2xl font-bold">Upload Video</h2>
      <UploadForm
        service={videoService}
        storagePath={STORAGE_PATHS.VIDEOS}
        thumbnailPath={STORAGE_PATHS.VIDEOS}
        showThumbnail
        showYear
        showVideoType
        fileLabel="Video File"
        fileAccept="video/*"
      />
    </div>
  );
}
