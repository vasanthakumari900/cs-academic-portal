// src/components/dashboard/VideoPlayerModal.jsx
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";

export default function VideoPlayerModal({ video, onClose }) {
  if (!video) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-3xl overflow-hidden rounded-2xl bg-black"
        >
          <div className="flex items-center justify-between bg-dark px-4 py-3">
            <h3 className="truncate text-sm font-semibold text-white">{video.title}</h3>
            <button onClick={onClose} className="rounded-full p-1.5 text-white hover:bg-white/10">
              <FiX size={18} />
            </button>
          </div>
          <video src={video.fileUrl} controls autoPlay className="aspect-video w-full bg-black" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
