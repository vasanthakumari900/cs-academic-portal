// src/components/ui/SkeletonCard.jsx
export default function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-maroon/5 bg-white/80 shadow-sm dark:border-gold/5 dark:bg-dark-card/80">
      <div className="h-36 w-full bg-gradient-to-r from-maroon/[0.04] via-white/60 to-maroon/[0.04] bg-[length:1400px_100%] animate-shimmer dark:from-white/[0.02] dark:via-dark-card/50 dark:to-white/[0.02]" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 rounded-full bg-maroon/[0.06] dark:bg-gold/[0.06]" />
        <div className="h-3 w-1/2 rounded-full bg-maroon/[0.04] dark:bg-gold/[0.04]" />
        <div className="h-3 w-1/3 rounded-full bg-maroon/[0.03] dark:bg-gold/[0.03]" />
      </div>
    </div>
  );
}
