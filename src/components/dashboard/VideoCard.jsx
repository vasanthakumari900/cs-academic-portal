// src/components/dashboard/VideoCard.jsx
import { FiPlay, FiBookmark, FiHeart, FiEye, FiCamera } from "react-icons/fi";
import { motion } from "framer-motion";
import GlassCard from "../ui/GlassCard";
import { truncate } from "../../utils/helpers";

export default function VideoCard({ video, onPlay, onBookmark, bookmarked }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <GlassCard className="flex flex-col p-0 overflow-hidden">
        <button
          onClick={() => onPlay(video)}
          className="group relative aspect-video w-full overflow-hidden bg-slate-200 dark:bg-slate-800"
        >
          {video.thumbnailUrl ? (
            <img src={video.thumbnailUrl} alt={video.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
              <FiPlay size={32} className="text-maroon dark:text-gold" />
            </div>
          )}
          {video.videoType === "class_recording" && (
            <span className="absolute left-2 top-2 z-10 inline-flex items-center gap-1 rounded-full bg-amber-500/90 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
              <FiCamera size={11} /> Class Recording
            </span>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/30 group-hover:opacity-100">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-maroon dark:text-gold">
              <FiPlay size={20} />
            </div>
          </div>
        </button>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <h3 className="font-display text-sm font-semibold text-dark dark:text-white">{video.title}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">{truncate(video.description, 80)}</p>
          <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
            <span>
              {video.subject}
              {video.semester ? ` · Sem ${video.semester}` : ""}
              {video.year ? ` · Year ${video.year}` : ""}
            </span>
            <button onClick={() => onBookmark(video.id)} className={bookmarked ? "text-maroon dark:text-gold" : "hover:text-maroon dark:hover:text-gold"}>
              <FiBookmark size={15} fill={bookmarked ? "currentColor" : "none"} />
            </button>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-500">
            {video.facultyName || "Faculty"}{video.duration ? ` · ${video.duration}` : ""}
          </p>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1"><FiEye size={13} /> {video.views ?? 0}</span>
            <span className="flex items-center gap-1"><FiHeart size={13} /> {video.likes ?? 0}</span>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
