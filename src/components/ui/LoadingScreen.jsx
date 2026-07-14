import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-[#F8FAFC]">
      <motion.div className="relative" animate={{ scale: [1, 1.04, 1] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}>
        <motion.div
          className="relative flex h-20 w-20 items-center justify-center rounded-xl bg-[#0F4C81] text-2xl font-extrabold text-white shadow-sm"
          animate={{ rotate: [0, 2, -2, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        >
          DV
        </motion.div>
      </motion.div>

      <div className="relative w-56">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E5E7EB]">
          <motion.div
            className="h-full rounded-full bg-[#0F4C81]"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          />
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-center">
        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="font-sans text-sm font-semibold tracking-wide text-[#1F2937]"
        >
          Loading CS Academic Portal…
        </motion.p>
        <p className="mt-1.5 text-[10px] text-[#6B7280]">DDGD Vaishnav College · Dept of Computer Science</p>
      </motion.div>
    </div>
  );
}
