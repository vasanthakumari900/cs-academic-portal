import { motion } from "framer-motion";
import { classNames } from "../../utils/helpers";

export default function StatCard({ icon: Icon, label, value, accent = "primary", className = "" }) {
  const accentMap = {
    primary: "bg-[#0F4C81] text-white shadow-sm",
    accent: "bg-[#1E88E5] text-white shadow-sm",
    success: "bg-[#2E7D32] text-white shadow-sm",
    warning: "bg-amber-600 text-white shadow-sm",
    danger: "bg-red-650 text-white shadow-sm",
    violet: "bg-[#1E88E5] text-white shadow-sm",
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className={className}>
      <div className="group relative overflow-hidden rounded-xl bg-white border border-[#E5E7EB] shadow-sm transition-all duration-300 hover:shadow-sm hover:-translate-y-0.5 p-5">
        <div className="relative flex items-center gap-4">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${accentMap[accent]}`}>
            {Icon && <Icon size={22} />}
          </div>
          <div>
            <p className="font-sans text-2xl font-bold text-[#0F4C81]">{value}</p>
            <p className="text-sm font-medium text-[#6B7280]">{label}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
