import { motion } from "framer-motion";
import { classNames } from "../../utils/helpers";

const variants = {
  primary: "bg-[#0D9488] text-white shadow-neu-raised hover:bg-[#0F766E] border border-white/20",
  secondary: "bg-[#2DD4BF] text-[#134E4A] hover:bg-[#5EEAD4] shadow-neu-raised border border-white/30 font-bold",
  amber: "bg-[#D97706] text-white hover:bg-[#B45309] shadow-neu-raised border border-white/20",
  upload: "bg-[#D97706] text-white hover:bg-[#B45309] shadow-neu-raised border border-white/20",
  ghost: "bg-white/40 dark:bg-teal-950/40 text-[#134E4A] dark:text-[#CCFBF1] hover:bg-[#E8F1F4] dark:hover:bg-teal-900/60 hover:text-[#0D9488] shadow-neu-raised",
  outline: "border-2 border-[#5EEAD4] bg-white dark:bg-teal-950 text-[#134E4A] dark:text-[#CCFBF1] hover:bg-[#CCFBF1]/30 hover:border-[#0D9488] hover:text-[#0D9488] shadow-neu-raised",
  danger: "bg-[#DC2626] text-white hover:bg-red-700 shadow-neu-raised border border-white/20",
  emerald: "bg-[#16A34A] text-white hover:bg-[#15803D] shadow-neu-raised border border-white/20",
  "premium-blue": "bg-[#0D9488] text-white hover:bg-[#0F766E] shadow-neu-raised border border-white/20",
};

const sizeClasses = {
  sm: "px-3.5 py-2 text-xs min-h-[38px]",
  md: "px-5 py-2.5 text-sm min-h-[44px]",
  lg: "px-6 py-3 text-base min-h-[48px]",
  xl: "px-8 py-4 text-lg min-h-[52px]",
};

export default function Button({ children, variant = "primary", className = "", size = "md", as: Component = "button", ...props }) {
  const baseClasses = classNames(
    "inline-flex items-center justify-center gap-2 rounded-xl font-mono font-bold transition-all duration-200 disabled:opacity-50 cursor-pointer active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#0D9488]/50 focus-visible:ring-offset-2 btn-neu",
    sizeClasses[size] || sizeClasses.md,
    variants[variant] || variants.primary,
    className
  );

  if (Component === "button") {
    return (
      <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className={baseClasses} {...props}>
        {children}
      </motion.button>
    );
  }

  return (
    <Component className={baseClasses} {...props}>
      {children}
    </Component>
  );
}

