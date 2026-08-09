// src/components/ui/SkeletonCard.jsx
// Premium skeleton loading placeholders.
import { motion } from "framer-motion";

export default function SkeletonCard({ lines = 3 }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="overflow-hidden rounded-xl border border-[#99F6E4] bg-white/80 shadow-soft"
    >
      {/* Image placeholder */}
      <div className="relative h-36 w-full overflow-hidden bg-gradient-to-br from-[#F0FDFA] to-[#CCFBF1]">
        <div className="absolute inset-0 shimmer" />
      </div>
      {/* Content lines */}
      <div className="space-y-3 p-4">
        <div className="relative h-4 w-3/4 overflow-hidden rounded-full bg-[#E8F1F4]">
          <div className="absolute inset-0 animate-skeleton bg-gradient-to-r from-[#99F6E4]/30 via-white/15 to-white/5 rounded-full" />
        </div>
        {Array.from({ length: lines - 1 }).map((_, i) => (
          <div
            key={i}
            className="relative h-3 overflow-hidden rounded-full bg-[#E8F1F4]"
            style={{ width: `${[50, 35, 65][i] || 45}%` }}
          >
            <div
              className="absolute inset-0 animate-skeleton bg-gradient-to-r from-[#99F6E4]/30 via-white/15 to-white/5 rounded-full"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function SkeletonLine({ width = "100%", height = "h-4", className = "" }) {
  return (
    <div className={`relative overflow-hidden rounded-full bg-[#E8F1F4] ${height} ${className}`} style={{ width }}>
      <div className="absolute inset-0 animate-skeleton bg-gradient-to-r from-[#99F6E4]/30 via-white/15 to-white/5 rounded-full" />
    </div>
  );
}

export function SkeletonCardGrid({ count = 6, lines = 3 }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} lines={lines} />
      ))}
    </div>
  );
}
