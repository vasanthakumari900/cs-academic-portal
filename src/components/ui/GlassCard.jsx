import { motion } from "framer-motion";
import { classNames } from "../../utils/helpers";

const cardStyles = {
  glass: "rounded-2xl bg-white dark:bg-[#22101A] border border-[#EDC8D0] dark:border-white/10 shadow-sm text-[#2A0D13] dark:text-[#F0E2E6]",
  "glass-strong": "rounded-2xl bg-white dark:bg-[#22101A] border border-[#EDC8D0] dark:border-white/15 shadow-md text-[#2A0D13] dark:text-[#F0E2E6]",
  elevated: "rounded-2xl bg-white dark:bg-[#22101A] border border-[#EDC8D0] dark:border-white/10 shadow-md text-[#2A0D13] dark:text-[#F0E2E6]",
  flat: "rounded-2xl bg-white dark:bg-[#22101A] border border-[#EDC8D0] dark:border-white/10 text-[#2A0D13] dark:text-[#F0E2E6]",
  premium: "rounded-2xl bg-white dark:bg-[#22101A] border border-[#EDC8D0] dark:border-white/10 shadow-sm text-[#2A0D13] dark:text-[#F0E2E6]",
  "premium-dark": "rounded-2xl bg-[#190B13] border border-white/15 shadow-md text-[#F0E2E6]",
};

export default function GlassCard({ children, className = "", hover = true, variant = "glass" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={classNames(
        cardStyles[variant] || cardStyles.glass,
        hover && "transition-all duration-200 hover:shadow-md hover:border-[#7F011F]/40 dark:hover:border-[#D97706]/40 hover:-translate-y-0.5",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
