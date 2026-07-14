import { motion } from "framer-motion";
import { classNames } from "../../utils/helpers";

const variants = {
  primary: "bg-[#0F4C81] text-white shadow-sm hover:bg-[#1E88E5]",
  secondary: "bg-white text-[#0F4C81] border border-[#0F4C81] hover:bg-[#F0F4F8]",
  ghost: "bg-transparent text-[#4B5563] hover:bg-slate-150 hover:text-[#1F2937]",
  outline: "border border-[#E5E7EB] bg-white text-[#4B5563] hover:bg-[#F8FAFC] hover:text-[#1F2937]",
  danger: "bg-red-650 text-white hover:bg-red-750 shadow-sm",
  amber: "bg-amber-600 text-white hover:bg-amber-700 shadow-sm",
  emerald: "bg-[#2E7D32] text-white hover:bg-[#225F26] shadow-sm",
  "premium-blue": "bg-[#0F4C81] text-white hover:bg-[#1E88E5] shadow-sm",
};

const sizeClasses = {
  sm: "px-3.5 py-2 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
  xl: "px-8 py-4 text-lg",
};

export default function Button({ children, variant = "primary", className = "", size = "md", as: Component = "button", ...props }) {
  const baseClasses = classNames(
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 active:scale-[0.97]",
    sizeClasses[size] || sizeClasses.md,
    variants[variant],
    className
  );

  if (Component === "button") {
    return (
      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className={baseClasses} {...props}>
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
