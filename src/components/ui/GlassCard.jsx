// src/components/ui/GlassCard.jsx
// Premium Awwwards-inspired glassmorphism card.
import { motion } from "framer-motion";
import { classNames } from "../../utils/helpers";

const cardStyles = {
  glass: "rounded-2xl bg-white/70 backdrop-blur-glass border border-white/30 shadow-glass",
  "glass-strong": "rounded-2xl bg-white/80 backdrop-blur-glass-lg border border-white/40 shadow-glass-lg",
  elevated: "rounded-2xl bg-white shadow-card border border-gray-100",
  flat: "rounded-2xl border border-gray-100 bg-white",
  premium: "rounded-2xl bg-white/80 backdrop-blur-glass-lg border border-white/40 shadow-premium",
};

export default function GlassCard({ children, className = "", hover = true, variant = "glass" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={classNames(
        cardStyles[variant] || cardStyles.glass,
        hover && "transition-all duration-300 hover:shadow-glass-lg hover:bg-white/80 hover:-translate-y-0.5",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
