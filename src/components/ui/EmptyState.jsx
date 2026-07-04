// src/components/ui/EmptyState.jsx
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
      className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-maroon/10 px-6 py-16 text-center transition-colors hover:border-maroon/20 dark:border-gold/10 dark:hover:border-gold/20"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-maroon/10 to-gold/10 text-maroon dark:from-gold/10 dark:to-maroon/10 dark:text-gold"
      >
        <Icon size={28} />
      </motion.div>
      <h3 className="font-display text-lg font-semibold text-dark dark:text-white">
        {title}
      </h3>
      <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">
        {description}
      </p>
      {action && <div className="mt-2">{action}</div>}
    </motion.div>
  );
}
