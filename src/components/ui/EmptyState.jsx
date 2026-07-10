import { motion } from "framer-motion";
import { FiInbox } from "react-icons/fi";

export default function EmptyState({ title = "Nothing here yet", description = "Once content is added, it will show up here.", icon: Icon = FiInbox, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-white/10 bg-white/5 px-6 py-16 text-center transition-all hover:border-cyan-400/30 hover:bg-cyan-500/5"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 text-cyan-400 shadow-sm"
      >
        <Icon size={28} />
      </motion.div>
      <h3 className="font-display text-lg font-semibold text-white/80">{title}</h3>
      <p className="max-w-sm text-sm text-white/50">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </motion.div>
  );
}
