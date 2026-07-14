import { motion } from "framer-motion";
import { classNames } from "../../utils/helpers";

const cardStyles = {
  glass: "rounded-xl bg-white border border-[#E5E7EB] shadow-sm",
  "glass-strong": "rounded-xl bg-white border border-[#E5E7EB] shadow-md",
  elevated: "rounded-xl bg-white border border-[#E5E7EB] shadow-md",
  flat: "rounded-xl bg-white border border-[#E5E7EB]",
  premium: "rounded-xl bg-white border border-[#E5E7EB] shadow-md",
  "premium-dark": "rounded-xl bg-white border border-[#E5E7EB] shadow-md",
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
        hover && "transition-all duration-300 hover:shadow-md hover:border-[#1E88E5]/30 hover:-translate-y-0.5",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
