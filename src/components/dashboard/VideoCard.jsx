// src/components/dashboard/VideoCard.jsx
// Premium video card with glassmorphism overlay.
import { FiPlay, FiBookmark, FiHeart, FiEye, FiCamera } from "react-icons/fi";
import { motion } from "framer-motion";
import { truncate } from "../../utils/helpers";

export default function VideoCard({ video, onPlay, onBookmark, bookmarked }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className="group flex flex-col overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-glass transition-all duration-300 hover:shadow-glass-lg hover:-translate-y-0.5">
        {/* Video thumbnail area */}
        <div className="relative">
          <button
            onClick={() => onPlay(video)}
            className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900"
          >
            {video.thumbnailUrl ? (
              <img src={video.thumbnailUrl} alt={video.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-indigo-500/10 to-violet-500/10">
                <FiPlay size={36} className="text-indigo-300" />
              </div>
            )}
            {video.videoType === "class_recording" && (
              <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-amber-500/90 px-3 py-1 text-[10px] font-semibold text-white backdrop-blur-sm border border-white/10">
                <FiCamera size={10} /> Class Recording
              </span>
            )}
            {/* Hover overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 transition-all duration-300 group-hover:opacity-100">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-premium transition-transform duration-300 group-hover:scale-110">
                <FiPlay size={22} className="text-indigo-400 ml-0.5" />
              </div>
            </div>
            {/* Bottom gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />
          </button>
        </div>

        {/* Info section */}
        <div className="flex flex-1 flex-col gap-2.5 p-4">
          <h3 className="font-display text-sm font-semibold text-white leading-snug">{video.title}</h3>
          <p className="text-xs text-white/50 leading-relaxed line-clamp-2">{truncate(video.description, 80)}</p>
          
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/50 font-medium">
              {video.subject}
              {video.semester ? ` · Sem ${video.semester}` : ""}
            </span>
            <button
              onClick={() => onBookmark(video.id)}
              className={`rounded-lg p-1.5 transition-all ${
                bookmarked ? "text-cyan-400 bg-cyan-500/20" : "text-white/40 hover:text-cyan-300 hover:bg-cyan-500/20"
              }`}
            >
              <FiBookmark size={15} fill={bookmarked ? "currentColor" : "none"} />
            </button>
          </div>
          
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-white/40">
              {video.facultyName || "Faculty"}{video.duration ? ` · ${video.duration}` : ""}
            </span>
            <div className="flex items-center gap-2.5 text-white/40">
              <span className="flex items-center gap-1"><FiEye size={12} /> {video.views ?? 0}</span>
              <span className="flex items-center gap-1"><FiHeart size={12} /> {video.likes ?? 0}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
