import { motion } from "framer-motion";
import { classNames } from "../../utils/helpers";

export default function StatCard({ icon: Icon, label, value, accent = "primary", className = "" }) {
  const accentMap = {
    primary: "bg-[#0D9488] text-white shadow-sm",
    accent: "bg-[#D97706] text-white shadow-sm",
    secondary: "bg-[#2DD4BF] text-[#134E4A] shadow-sm",
    success: "bg-[#16A34A] text-white shadow-sm",
    warning: "bg-[#D97706] text-white shadow-sm",
    danger: "bg-[#DC2626] text-white shadow-sm",
    violet: "bg-[#0D9488] text-white shadow-sm",
  };

  const accentBarColors = {
    primary: "bg-[#0D9488]",
    accent: "bg-[#D97706]",
    secondary: "bg-[#2DD4BF]",
    success: "bg-[#16A34A]",
    warning: "bg-[#D97706]",
    danger: "bg-[#DC2626]",
    violet: "bg-[#0D9488]",
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className={className}>
      <div style={{ padding:'var(--fluid-pad-card)' }} className="group relative overflow-hidden rounded-2xl bg-white dark:bg-teal-950/80 border border-[#5EEAD4]/40 dark:border-teal-800 shadow-neu-raised transition-all duration-200 hover:shadow-neu-raised-lg hover:border-[#0D9488] dark:hover:border-[#2DD4BF] hover:-translate-y-0.5">
        {/* Left accent bar */}
        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${accentBarColors[accent] || accentBarColors.primary} rounded-l-2xl`} />
        <div className="relative flex items-center gap-4 pl-1">
          <div style={{ height:'clamp(2rem,5vw,3rem)', width:'clamp(2rem,5vw,3rem)' }} className={`flex shrink-0 items-center justify-center rounded-xl ${accentMap[accent] || accentMap.primary}`}>
            {Icon && <Icon size={22} />}
          </div>
          <div>
            <p style={{ fontSize:'clamp(1.25rem,3vw,1.75rem)', fontWeight:700 }} className="font-mono text-[#134E4A] dark:text-[#CCFBF1] tracking-tight">{value}</p>
            <p style={{ fontSize:'clamp(0.7rem,1.5vw,0.875rem)' }} className="font-semibold text-[#64748B] dark:text-[#5EEAD4]/80 uppercase tracking-wider">{label}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

