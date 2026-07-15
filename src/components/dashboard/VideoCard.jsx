// src/components/dashboard/VideoCard.jsx
import { FiPlay, FiBookmark, FiHeart, FiEye, FiCamera } from "react-icons/fi";
import { motion } from "framer-motion";
import { truncate } from "../../utils/helpers";

export default function VideoCard({ video, onPlay, onBookmark, bookmarked }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className="group flex flex-col overflow-hidden rounded-xl bg-white border border-[#E5E7EB] shadow-sm transition-all duration-300 hover:shadow-sm text-left">
        {/* Video thumbnail area */}
        <div className="relative">
          <button
            onClick={() => onPlay(video)}
            className="relative aspect-video w-full overflow-hidden bg-slate-900"
          >
            {video.thumbnailUrl ? (
              <img src={video.thumbnailUrl} alt={video.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            ) : (
              <div className="flex h-full items-center justify-center bg-[#F8FAFC]">
                <FiPlay size={36} className="text-[#0F4C81]" />
              </div>
            )}
            {video.videoType === "class_recording" && (
              <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-[10px] font-semibold text-amber-800 border border-amber-200">
                <FiCamera size={10} /> Class Recording
              </span>
            )}
            {/* Hover overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-all duration-300 group-hover:opacity-100">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-300 group-hover:scale-105">
                <FiPlay size={22} className="text-[#0F4C81] ml-0.5" />
              </div>
            </div>
          </button>
        </div>

        {/* Info section */}
        <div className="flex flex-1 flex-col gap-2.5 p-4">
          <h3 className="font-sans text-sm font-semibold text-[#0F4C81] leading-snug group-hover:text-[#1E88E5] transition-colors">{video.title}</h3>
          <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-2">{truncate(video.description, 80)}</p>
          
          <div className="flex items-center justify-between text-xs mt-1">
            <span className="text-[#6B7280] font-medium">
              {video.subject}
              {video.semester ? ` · Sem ${video.semester}` : ""}
            </span>
            <button
              onClick={() => onBookmark(video.id)}
              className={`rounded-lg p-1.5 transition-all ${
                bookmarked ? "text-[#0F4C81] bg-[#0F4C81]/10" : "text-[#6B7280] hover:text-[#0F4C81] hover:bg-[#0F4C81]/10"
              }`}
            >
              <FiBookmark size={15} fill={bookmarked ? "currentColor" : "none"} />
            </button>
          </div>
          
          <div className="flex items-center justify-between text-[11px] text-[#6B7280] pt-2 border-t border-[#E5E7EB]/50">
            <span>
              {video.facultyName || "Faculty"}{video.duration ? ` · ${video.duration}` : ""}
            </span>
            <div className="flex items-center gap-2.5">
              <span className="flex items-center gap-1"><FiEye size={12} /> {video.views ?? 0}</span>
              <span className="flex items-center gap-1"><FiHeart size={12} /> {video.likes ?? 0}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
