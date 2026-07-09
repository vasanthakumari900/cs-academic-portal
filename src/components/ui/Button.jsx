// src/components/ui/Button.jsx
// Premium Awwwards-inspired buttons.
import { motion } from "framer-motion";
import { classNames } from "../../utils/helpers";

const variants = {
  primary: "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-soft hover:shadow-premium hover:from-blue-500 hover:to-indigo-600",
  secondary: "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-soft hover:shadow-premium",
  ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
  outline: "border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300",
  danger: "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-soft",
  amber: "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-soft hover:shadow-premium",
  emerald: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-soft hover:shadow-premium",
};

const MotionButton = motion.button;

export default function Button({
  children,
  variant = "primary",
  className = "",
  size = "md",
  as: Component = "button",
  ...props
}) {
  const sizeClasses = {
    sm: "px-3.5 py-2 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const baseClasses = classNames(
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 active:scale-[0.97]",
    sizeClasses[size] || sizeClasses.md,
    variants[variant],
    className
  );

  if (Component === "button") {
    return (
      <MotionButton
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className={baseClasses}
        {...props}
      >
        {children}
      </MotionButton>
    );
  }

  return (
    <Component className={baseClasses} {...props}>
      {children}
    </Component>
  );
}
