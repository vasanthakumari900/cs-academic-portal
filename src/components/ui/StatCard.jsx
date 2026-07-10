import { motion } from "framer-motion";
import { classNames } from "../../utils/helpers";

export default function StatCard({ icon: Icon, label, value, accent = "primary", className = "" }) {
  const accentMap = {
    primary: "from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/20",
    accent: "from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20",
    success: "from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20",
    warning: "from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20",
    danger: "from-rose-500 to-pink-600 shadow-lg shadow-rose-500/20",
    violet: "from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20",
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className={className}>
      <div className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-glass transition-all duration-300 hover:shadow-glass-lg hover:bg-white/10 hover:-translate-y-0.5 p-5">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
        <div className="relative flex items-center gap-4">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${accentMap[accent]} text-white`}>
            {Icon && <Icon size={22} />}
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-white">{value}</p>
            <p className="text-sm text-white/60">{label}</p>
          </div>
        </div>
        <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${accentMap[accent].split(' ')[0]} scale-x-0 group-hover:scale-x-100 transition-transform origin-left`} />
      </div>
    </motion.div>
  );
}
