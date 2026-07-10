import { motion } from "framer-motion";
import { classNames } from "../../utils/helpers";

const variants = {
  primary: "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg hover:shadow-indigo-500/30 hover:from-indigo-500 hover:to-violet-500",
  secondary: "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg hover:shadow-cyan-500/20",
  ghost: "bg-transparent text-white/70 hover:bg-white/10 hover:text-white",
  outline: "border border-white/20 text-white/80 hover:bg-white/10 hover:border-white/30 hover:text-white",
  danger: "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg hover:shadow-red-500/20",
  amber: "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg hover:shadow-lg",
  emerald: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg hover:shadow-lg",
  "premium-blue": "bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-700 text-white shadow-lg hover:shadow-xl hover:shadow-indigo-500/25",
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
