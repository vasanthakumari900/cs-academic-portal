// src/components/dashboard/VideoCard.jsx
import { FiPlay, FiBookmark, FiHeart, FiEye, FiCamera } from "react-icons/fi";
import { motion } from "framer-motion";
import { truncate } from "../../utils/helpers";

export default function VideoCard({ video, onPlay, onBookmark, bookmarked }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className="group flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-teal-950/80 border border-[#5EEAD4]/40 dark:border-teal-800 shadow-neu-raised transition-all duration-200 hover:shadow-neu-raised-lg hover:border-[#0D9488] dark:hover:border-[#2DD4BF] text-left">
        {/* Video thumbnail area */}
        <div className="relative">
          <button
            onClick={() => onPlay(video)}
            className="relative aspect-video w-full overflow-hidden bg-[#042F2E] cursor-pointer"
          >
            {video.thumbnailUrl ? (
              <img src={video.thumbnailUrl} alt={video.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            ) : (
              <div className="flex h-full items-center justify-center bg-[#F0FDFA] dark:bg-teal-950">
                <FiPlay size={36} className="text-[#0D9488]" />
              </div>
            )}
            {video.videoType === "class_recording" && (
              <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-[#D97706] px-3 py-1 text-[10px] font-bold text-white shadow-sm border border-amber-400/40 font-mono uppercase tracking-wider">
                <FiCamera size={10} /> Class Recording
              </span>
            )}
            {/* Hover overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-all duration-200 group-hover:opacity-100">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-md transition-transform duration-200 group-hover:scale-105">
                <FiPlay size={22} className="text-[#0D9488] ml-0.5" />
              </div>
            </div>
          </button>
        </div>

        {/* Info section */}
        <div style={{ padding:'var(--fluid-pad-card)' }} className="flex flex-1 flex-col gap-2.5">
          <h3 style={{ fontSize: 'clamp(0.8rem, 1.5vw + 0.3rem, 1rem)' }} className="font-mono font-bold text-[#134E4A] dark:text-[#CCFBF1] leading-snug group-hover:text-[#D97706] transition-colors">{video.title}</h3>
          <p className="text-xs text-[#64748B] dark:text-[#5EEAD4]/80 leading-relaxed line-clamp-2">{truncate(video.description, 80)}</p>
          
          <div className="flex items-center justify-between text-xs mt-1">
            <span className="text-[#134E4A] dark:text-[#CCFBF1] font-semibold">
              {video.subject}
              {video.semester ? ` · Sem ${video.semester}` : ""}
            </span>
            <button
              onClick={() => onBookmark(video.id)}
              className={`rounded-xl p-2 transition-all cursor-pointer ${
                bookmarked ? "text-[#0D9488] bg-[#0D9488]/15 dark:bg-teal-900/60" : "text-[#64748B] hover:text-[#0D9488] hover:bg-[#0D9488]/10"
              }`}
            >
              <FiBookmark size={16} fill={bookmarked ? "currentColor" : "none"} />
            </button>
          </div>
          
          <div className="flex items-center justify-between text-[11px] text-[#64748B] dark:text-[#5EEAD4]/70 pt-2 border-t border-[#5EEAD4]/30 dark:border-teal-800">
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

