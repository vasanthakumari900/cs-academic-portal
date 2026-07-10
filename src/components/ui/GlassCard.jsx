import { motion } from "framer-motion";
import { classNames } from "../../utils/helpers";

const cardStyles = {
  glass: "rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-glass",
  "glass-strong": "rounded-2xl bg-white/8 backdrop-blur-xl border border-white/15 shadow-glass-lg",
  elevated: "rounded-2xl bg-white/5 shadow-lg border border-white/10",
  flat: "rounded-2xl border border-white/10 bg-white/5",
  premium: "rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
  "premium-dark": "rounded-2xl bg-gradient-to-br from-indigo-600/20 via-violet-600/20 to-purple-800/20 border border-white/10 shadow-[0_8px_32px_rgba(79,70,229,0.15)]",
};

export default function GlassCard({ children, className = "", hover = true, variant = "glass" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={classNames(
        cardStyles[variant] || cardStyles.glass,
        hover && "transition-all duration-300 hover:shadow-glass-lg hover:bg-white/10 hover:-translate-y-1",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
