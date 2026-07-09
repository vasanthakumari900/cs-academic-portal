// src/components/ui/LoadingScreen.jsx
// Premium Awwwards-inspired loading screen.
import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-[#FAFBFC]">
      {/* Mesh bg */}
      <div className="fixed inset-0 pointer-events-none bg-mesh" />
      
      {/* Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="orb h-48 w-48 bg-blue-300/10" style={{top:'20%',left:'10%','--duration':'8s','--delay':'0s'}} />
        <div className="orb h-56 w-56 bg-indigo-300/8" style={{bottom:'20%',right:'10%','--duration':'10s','--delay':'2s'}} />
      </div>

      {/* Animated logo mark */}
      <motion.div
        className="relative"
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      >
        <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-blue-400/10 via-indigo-400/10 to-purple-400/10 blur-2xl" />
        <motion.div
          className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-2xl font-extrabold text-white shadow-premium-lg"
          animate={{ rotate: [0, 4, -4, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        >
          DV
        </motion.div>
        <motion.div
          className="absolute -inset-3 rounded-3xl border border-blue-200/20"
          animate={{ rotate: 360, scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
        />
      </motion.div>

      {/* Loading bar */}
      <div className="relative w-56">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-blue-100/50">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Loading text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="font-display text-sm font-semibold tracking-wide text-gray-500"
        >
          Loading CS Academic Portal…
        </motion.p>
        <p className="mt-1.5 text-[10px] text-gray-400">DDGD Vaishnav College · Dept of Computer Science</p>
      </motion.div>
    </div>
  );
}
