// src/components/ui/EmptyState.jsx
// Premium empty state.
import { motion } from "framer-motion";
import { FiInbox } from "react-icons/fi";

export default function EmptyState({
  title = "Nothing here yet",
  description = "Once content is added, it will show up here.",
  icon: Icon = FiInbox,
  action,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-gray-200 bg-white/50 px-6 py-16 text-center transition-all hover:border-blue-200/60 hover:bg-blue-50/30"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-400"
      >
        <Icon size={28} />
      </motion.div>
      <h3 className="font-display text-lg font-semibold text-gray-800">
        {title}
      </h3>
      <p className="max-w-sm text-sm text-gray-500">
        {description}
      </p>
      {action && <div className="mt-2">{action}</div>}
    </motion.div>
  );
}
