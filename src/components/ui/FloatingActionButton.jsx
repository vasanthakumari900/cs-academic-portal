// src/components/ui/FloatingActionButton.jsx
// Premium floating action button with glass effect.
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const btnClass =
  "fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-premium-lg backdrop-blur-sm";

export default function FloatingActionButton({ to, onClick, icon: Icon, label, className = "" }) {
  const shared = "flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-premium-lg transition-all duration-300 hover:shadow-neon-primary hover:scale-110 active:scale-95";

  if (to) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className={className}
      >
        <Link to={to} aria-label={label} className={shared}>
          <Icon size={22} />
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      aria-label={label}
      className={`${shared} ${className}`}
    >
      <Icon size={22} />
    </motion.button>
  );
}
