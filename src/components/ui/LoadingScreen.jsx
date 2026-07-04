// src/components/ui/LoadingScreen.jsx
import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-cream dark:bg-dark">
      {/* Animated logo mark */}
      <motion.div
        className="relative"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <motion.div
          className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-maroon to-gold text-xl font-extrabold text-white shadow-glow"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          CS
        </motion.div>
        {/* Orbiting ring */}
        <motion.div
          className="absolute -inset-3 rounded-3xl border-2 border-dashed border-maroon/30 dark:border-gold/30"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
        />
      </motion.div>

      {/* Loading bar */}
      <div className="h-1 w-48 overflow-hidden rounded-full bg-maroon/10 dark:bg-gold/10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-maroon to-gold"
          animate={{ x: ["-100%", "200%"] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        />
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="font-display text-sm font-semibold tracking-wide text-slate-500 dark:text-slate-400"
      >
        Loading CS Academic Portal…
      </motion.p>
    </div>
  );
}
