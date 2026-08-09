import { motion } from "framer-motion";
import { classNames } from "../../utils/helpers";

const cardStyles = {
  glass: "rounded-2xl bg-white dark:bg-teal-950/80 border border-[#5EEAD4]/40 dark:border-teal-800/80 shadow-neu-raised text-[#134E4A] dark:text-[#CCFBF1]",
  "glass-strong": "rounded-2xl bg-white dark:bg-teal-950/90 border border-[#5EEAD4]/60 dark:border-teal-700/80 shadow-neu-raised-lg text-[#134E4A] dark:text-[#CCFBF1]",
  elevated: "rounded-2xl bg-white dark:bg-teal-950/80 border border-[#5EEAD4]/50 dark:border-teal-800 shadow-neu-raised-lg text-[#134E4A] dark:text-[#CCFBF1]",
  flat: "rounded-2xl bg-white dark:bg-teal-950/80 border border-[#5EEAD4]/40 dark:border-teal-800/80 text-[#134E4A] dark:text-[#CCFBF1]",
  premium: "rounded-2xl bg-white dark:bg-teal-950/80 border border-[#5EEAD4]/50 dark:border-teal-800 shadow-neu-raised text-[#134E4A] dark:text-[#CCFBF1]",
  "premium-dark": "rounded-2xl bg-[#042F2E] border border-teal-800 shadow-neu-raised text-[#CCFBF1]",
};

export default function GlassCard({ children, className = "", hover = true, variant = "glass" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={classNames(
        cardStyles[variant] || cardStyles.glass,
        hover && "transition-all duration-200 hover:shadow-neu-raised-lg hover:border-[#0D9488] dark:hover:border-[#2DD4BF] hover:-translate-y-0.5",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

