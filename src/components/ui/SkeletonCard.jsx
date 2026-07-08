// src/components/ui/SkeletonCard.jsx
import { motion } from "framer-motion";

export default function SkeletonCard({ lines = 3 }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-soft"
    >
      {/* Image placeholder */}
      <div className="relative h-36 w-full overflow-hidden bg-gray-100">
        <div className="absolute inset-0 animate-shimmer-fast" />
      </div>
      {/* Content lines */}
      <div className="space-y-3 p-4">
        <div className="relative h-4 w-3/4 overflow-hidden rounded-full bg-gray-100">
          <div className="absolute inset-0 animate-skeleton bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full" />
        </div>
        {Array.from({ length: lines - 1 }).map((_, i) => (
          <div
            key={i}
            className="relative h-3 overflow-hidden rounded-full bg-gray-100"
            style={{ width: `${[50, 35, 65][i] || 45}%` }}
          >
            <div
              className="absolute inset-0 animate-skeleton bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full"
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
    <div className={`relative overflow-hidden rounded-full bg-gray-100 ${height} ${className}`} style={{ width }}>
      <div className="absolute inset-0 animate-skeleton bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full" />
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
