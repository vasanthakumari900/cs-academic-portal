// src/components/ui/StatCard.jsx
// Premium stat card with gradient accent.
import { motion } from "framer-motion";
import { classNames } from "../../utils/helpers";

export default function StatCard({ icon: Icon, label, value, accent = "primary", className = "" }) {
  const accentMap = {
    primary: "from-blue-600 to-indigo-700 shadow-neon-primary",
    accent: "from-cyan-500 to-blue-600 shadow-neon-accent",
    success: "from-emerald-500 to-teal-600 shadow-neon-emerald",
    warning: "from-amber-500 to-orange-600 shadow-neon-amber",
    danger: "from-rose-500 to-pink-600 shadow-neon-rose",
    violet: "from-violet-500 to-purple-600 shadow-neon-violet",
  };

  const bgMap = {
    primary: "from-blue-50 to-indigo-50",
    accent: "from-cyan-50 to-blue-50",
    success: "from-emerald-50 to-teal-50",
    warning: "from-amber-50 to-orange-50",
    danger: "from-rose-50 to-pink-50",
    violet: "from-violet-50 to-purple-50",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={className}
    >
      <div className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-glass border border-white/30 shadow-glass transition-all duration-300 hover:shadow-glass-lg hover:bg-white/90 hover:-translate-y-0.5">
        {/* Glass shine */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />
        <div className="relative flex items-center gap-4 p-5">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${accentMap[accent]} text-white shadow-soft`}
          >
            {Icon && <Icon size={22} />}
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
        </div>
        {/* Bottom accent bar */}
        <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${accentMap[accent]} scale-x-0 group-hover:scale-x-100 transition-transform origin-left`} />
      </div>
    </motion.div>
  );
}
