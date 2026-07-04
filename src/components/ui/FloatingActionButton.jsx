// src/components/ui/FloatingActionButton.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const btnClass =
  "fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-maroon to-gold text-white shadow-glow";

export default function FloatingActionButton({ to, onClick, icon: Icon, label, className = "" }) {
  if (to) {
    return (
      <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }} className={className}>
        <Link to={to} aria-label={label} className={btnClass}>
          <Icon size={22} />
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      aria-label={label}
      className={`${btnClass} ${className}`}
    >
      <Icon size={22} />
    </motion.button>
  );
}
