// src/components/ui/StatCard.jsx
import { motion } from "framer-motion";
import GlassCard from "./GlassCard";

export default function StatCard({ icon: Icon, label, value, accent = "primary" }) {
  const accentMap = {
    primary: "from-maroon to-gold",
    accent: "from-gold to-accent",
    success: "from-success to-gold",
    warning: "from-warning to-danger",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <GlassCard className="flex items-center gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${accentMap[accent]} text-white shadow-glow`}
        >
          {Icon && <Icon size={22} />}
        </div>
        <div>
          <p className="text-2xl font-bold text-dark dark:text-white">{value}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        </div>
      </GlassCard>
    </motion.div>
  );
}
