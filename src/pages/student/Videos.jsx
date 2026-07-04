// src/pages/student/Videos.jsx
import { useState } from "react";
import toast from "react-hot-toast";
import ModuleBrowser from "../../components/dashboard/ModuleBrowser";
import VideoCard from "../../components/dashboard/VideoCard";
import VideoPlayerModal from "../../components/dashboard/VideoPlayerModal";
import { videoService } from "../../services/videoService";
import { addBookmark, removeBookmark } from "../../services/bookmarkService";
import { addRecentlyViewed } from "../../utils/recentlyViewed";
import { useAuth } from "../../context/AuthContext";

export default function Videos() {
  const [playing, setPlaying] = useState(null);
  const { user, profile } = useAuth();
  const bookmarks = profile?.bookmarks || [];

  function handlePlay(video) {
    videoService.incrementField(video.id, "views");
    addRecentlyViewed({ id: video.id, type: "video", title: video.title, subject: video.subject });
    setPlaying(video);
  }

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
      <h2 className="mb-6 font-display text-2xl font-bold">Watch Videos</h2>
      <ModuleBrowser
        service={videoService}
        renderCard={(video) => (
          <VideoCard
            key={video.id}
            video={video}
            onPlay={handlePlay}
            onBookmark={handleBookmark}
            bookmarked={bookmarks.includes(video.id)}
          />
        )}
      />
      <VideoPlayerModal video={playing} onClose={() => setPlaying(null)} />
    </div>
  );
}
