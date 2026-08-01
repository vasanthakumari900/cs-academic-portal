// src/components/admin/AdminFeedbackModal.jsx
import { motion } from "framer-motion";
import { FiX } from "react-icons/fi";
import AdminFeedbackViewer from "./AdminFeedbackViewer";

export default function AdminFeedbackModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200 my-8"
      >
        <div className="flex items-center justify-between bg-[#021C4F] px-6 py-4 text-white">
          <h2 className="text-lg font-extrabold flex items-center gap-2">
            🛡️ Admin Feedback Management (Roll No: 24E3006)
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-all"
          >
            <FiX size={18} />
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <AdminFeedbackViewer />
        </div>
      </motion.div>
    </div>
  );
}
