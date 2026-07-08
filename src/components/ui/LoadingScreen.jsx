// src/components/ui/LoadingScreen.jsx
import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-animated-gradient">
      {/* Animated logo mark */}
      <motion.div
        className="relative"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
      >
        <motion.div
          className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-2xl font-extrabold text-white shadow-premium"
          animate={{ rotate: [0, 6, -6, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          DV
        </motion.div>
        {/* Orbiting ring */}
        <motion.div
          className="absolute -inset-4 rounded-3xl border-2 border-dashed border-blue-300/40"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
        />
        {/* Inner ring */}
        <motion.div
          className="absolute -inset-2 rounded-2xl border border-blue-200/20"
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
        />
      </motion.div>

      {/* Loading bar */}
      <div className="relative w-56">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-blue-100">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          />
        </div>
        {/* Glow under the bar */}
        <motion.div
          className="absolute -top-2 left-0 right-0 h-6 rounded-full bg-blue-400/10 blur-md"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        />
      </div>

      {/* Loading text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="font-display text-sm font-semibold tracking-wide text-gray-500"
        >
          Loading CS Academic Portal…
        </motion.p>
        <p className="mt-1 text-[10px] text-gray-400">DDGD Vaishnav College · Dept of Computer Science</p>
      </motion.div>

      {/* Decorative particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="particle h-16 w-16 bg-blue-200/20 blur-xl" style={{top:'10%',left:'5%',width:'80px',height:'80px','--duration':'12s','--delay':'0s'}} />
        <div className="particle h-12 w-12 bg-indigo-200/20 blur-xl" style={{top:'20%',right:'10%',width:'60px',height:'60px','--duration':'10s','--delay':'2s'}} />
        <div className="particle h-20 w-20 bg-purple-200/15 blur-xl" style={{bottom:'30%',left:'15%',width:'100px',height:'100px','--duration':'14s','--delay':'1s'}} />
        <div className="particle h-10 w-10 bg-cyan-200/15 blur-xl" style={{top:'60%',right:'5%',width:'50px',height:'50px','--duration':'9s','--delay':'3s'}} />
      </div>
    </div>
  );
}
