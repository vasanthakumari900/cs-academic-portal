import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHome } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-6"
      >
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-white/10 shadow-glass">
          <span className="font-display text-5xl font-extrabold text-gradient-primary">4</span>
          <span className="font-display text-5xl font-extrabold text-gradient-accent">0</span>
          <span className="font-display text-5xl font-extrabold text-gradient-primary">4</span>
        </div>
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="font-display text-2xl font-bold text-white"
      >
        Page not found
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-2 max-w-sm text-sm text-white/60"
      >
        The page you're looking for doesn't exist or may have moved.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-700 px-6 py-3 text-sm font-bold text-white shadow-sm transition-all duration-300 hover:shadow-indigo-500/30 hover:from-indigo-500 hover:to-violet-600 active:scale-[0.97]"
        >
          <FiHome size={16} />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
