import { motion } from "framer-motion";
import { FiInbox } from "react-icons/fi";

export default function EmptyState({ title = "Nothing here yet", description = "Once content is added, it will show up here.", icon: Icon = FiInbox, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-[#99F6E4] bg-[#F0FDFA]/50 px-6 py-16 text-center transition-all hover:border-[#0D9488]/30 hover:bg-[#CCFBF1]/20"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0D9488]/20 to-[#2DD4BF]/20 text-[#0D9488] shadow-sm"
      >
        <Icon size={28} />
      </motion.div>
      <h3 className="font-mono text-lg font-semibold text-[#134E4A]/80">{title}</h3>
      <p className="max-w-sm text-sm text-[#64748B]">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </motion.div>
  );
}
